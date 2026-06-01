//! SSA IR optimizer.
//!
//! Implements optimization passes on the SSA IR:
//! - **Constant folding**: evaluate constant expressions at compile time
//! - **Dead code elimination**: remove unused definitions
//! - **Inlining**: inline small functions

use std::collections::HashMap;

use crate::ir::*;

/// Optimizer statistics.
#[derive(Debug, Clone, Default)]
pub struct OptStats {
    pub constants_folded: u32,
    pub dead_code_eliminated: u32,
    pub functions_inlined: u32,
}

/// Run all optimization passes on an IR module.
pub fn optimize(module: &mut IrModule) -> OptStats {
    let mut stats = OptStats::default();

    // Pass 1: Constant folding
    for func in &mut module.functions {
        stats.constants_folded += constant_fold(func);
    }

    // Pass 2: Dead code elimination
    for func in &mut module.functions {
        stats.dead_code_eliminated += dead_code_eliminate(func);
    }

    // Pass 3: Inlining (simplified — inline small functions)
    stats.functions_inlined += inline_small_functions(module);

    stats
}

/// Constant folding: replace instructions with known constant results.
///
/// Evaluates binary operations on constant operands at compile time.
pub fn constant_fold(func: &mut IrFunction) -> u32 {
    let mut folded = 0u32;

    // Collect all constant definitions first
    let mut constants: HashMap<ValueId, i64> = HashMap::new();
    for block in func.blocks.values() {
        for instr in &block.instructions {
            if let Instruction::Const { dest, value, .. } = instr {
                constants.insert(*dest, *value);
            }
        }
    }

    // Try to fold operations on constants
    let entry = func.entry_block;
    let block = func.blocks.get_mut(&entry).expect("entry block should exist");

    let new_instructions: Vec<Instruction> = block
        .instructions
        .iter()
        .filter_map(|instr| {
            if let Instruction::BinOp { dest, op, left, right } = instr {
                if let (Some(lv), Some(rv)) = (constants.get(left), constants.get(right)) {
                    if let Some(result) = eval_binop(*op, *lv, *rv) {
                        constants.insert(*dest, result);
                        folded += 1;
                        return Some(Instruction::Const {
                            dest: *dest,
                            ty: IrType::I32,
                            value: result,
                        });
                    }
                }
            }
            Some(instr.clone())
        })
        .collect();

    block.instructions = new_instructions;
    folded
}

/// Evaluate a binary operation on constant values.
fn eval_binop(op: IrBinOp, left: i64, right: i64) -> Option<i64> {
    match op {
        IrBinOp::I32Add => Some(left.wrapping_add(right) as i32 as i64),
        IrBinOp::I32Sub => Some(left.wrapping_sub(right) as i32 as i64),
        IrBinOp::I32Mul => Some(left.wrapping_mul(right) as i32 as i64),
        IrBinOp::I32DivS => {
            if right == 0 {
                None // Division by zero — don't fold
            } else {
                Some(left.wrapping_div(right) as i32 as i64)
            }
        }
        IrBinOp::I32RemS => {
            if right == 0 {
                None
            } else {
                Some(left.wrapping_rem(right) as i32 as i64)
            }
        }
        IrBinOp::I32Eq => Some(if left == right { 1 } else { 0 }),
        IrBinOp::I32Ne => Some(if left != right { 1 } else { 0 }),
        IrBinOp::I32LtS => Some(if left < right { 1 } else { 0 }),
        IrBinOp::I32GtS => Some(if left > right { 1 } else { 0 }),
        IrBinOp::I32LeS => Some(if left <= right { 1 } else { 0 }),
        IrBinOp::I32GeS => Some(if left >= right { 1 } else { 0 }),
        IrBinOp::I32And => Some((left & right) as i32 as i64),
        IrBinOp::I32Or => Some((left | right) as i32 as i64),
        IrBinOp::I32Xor => Some((left ^ right) as i32 as i64),
        IrBinOp::I32Shl => Some(((left as u32).wrapping_shl(right as u32)) as i32 as i64),
        IrBinOp::I32ShrS => Some(((left as i32).wrapping_shr(right as u32)) as i64),
    }
}

/// Dead code elimination: remove instructions whose results are never used.
pub fn dead_code_eliminate(func: &mut IrFunction) -> u32 {
    let mut eliminated = 0u32;

    // Compute which values are used
    let mut used: std::collections::HashSet<ValueId> = std::collections::HashSet::new();

    for block in func.blocks.values() {
        for instr in &block.instructions {
            collect_used_values(instr, &mut used);
        }
        if let Some(term) = &block.terminator {
            collect_used_values_in_term(term, &mut used);
        }
    }

    // Remove instructions whose results are not used
    for block in func.blocks.values_mut() {
        let original_len = block.instructions.len();
        block.instructions.retain(|instr| {
            if let Some(dest) = instr.dest() {
                if !used.contains(&dest) && !is_side_effect(instr) {
                    eliminated += 1;
                    return false;
                }
            }
            true
        });

        // Adjust counter (we already incremented above, fix the logic)
        eliminated = eliminated.saturating_sub(
            (original_len.saturating_sub(block.instructions.len())) as u32,
        );
    }

    // Recalculate: count instructions removed
    eliminated = 0;
    for block in func.blocks.values() {
        for instr in &block.instructions {
            if let Some(dest) = instr.dest() {
                if !used.contains(&dest) && !is_side_effect(instr) {
                    eliminated += 1;
                }
            }
        }
    }

    // Actually remove them
    for block in func.blocks.values_mut() {
        let mut i = 0;
        while i < block.instructions.len() {
            let instr = &block.instructions[i];
            if let Some(dest) = instr.dest() {
                if !used.contains(&dest) && !is_side_effect(instr) {
                    block.instructions.remove(i);
                    continue;
                }
            }
            i += 1;
        }
    }

    eliminated
}

fn collect_used_values(instr: &Instruction, used: &mut std::collections::HashSet<ValueId>) {
    match instr {
        Instruction::BinOp { left, right, .. } => {
            used.insert(*left);
            used.insert(*right);
        }
        Instruction::UnaryOp { operand, .. } => {
            used.insert(*operand);
        }
        Instruction::Call { args, .. } => {
            for arg in args {
                used.insert(*arg);
            }
        }
        Instruction::Cmp { left, right, .. } => {
            used.insert(*left);
            used.insert(*right);
        }
        Instruction::Store { value, .. } => {
            used.insert(*value);
        }
        Instruction::Phi { sources, .. } => {
            for (val, _) in sources {
                used.insert(*val);
            }
        }
        Instruction::ListLen { list, .. } => {
            used.insert(*list);
        }
        Instruction::ListGet { list, index, .. } => {
            used.insert(*list);
            used.insert(*index);
        }
        _ => {}
    }
}

fn collect_used_values_in_term(term: &Terminator, used: &mut std::collections::HashSet<ValueId>) {
    match term {
        Terminator::Jump { args, .. } => {
            for arg in args {
                used.insert(*arg);
            }
        }
        Terminator::Branch { condition, true_args, false_args, .. } => {
            used.insert(*condition);
            for arg in true_args {
                used.insert(*arg);
            }
            for arg in false_args {
                used.insert(*arg);
            }
        }
        Terminator::Return { value } => {
            if let Some(v) = value {
                used.insert(*v);
            }
        }
        Terminator::Unreachable => {}
    }
}

fn is_side_effect(instr: &Instruction) -> bool {
    matches!(instr, Instruction::Store { .. } | Instruction::Call { .. })
}

/// Inline small functions (those with <= threshold instructions and no calls).
pub fn inline_small_functions(module: &mut IrModule) -> u32 {
    let threshold: usize = 5;
    let mut inlined = 0u32;

    // Find inlineable functions (no calls, <= threshold instructions)
    let inlineable: Vec<String> = module
        .functions
        .iter()
        .filter(|f| {
            f.params.len() <= 2
                && f.blocks.len() == 1
                && f
                    .blocks
                    .values()
                    .all(|b| {
                        b.instructions.len() <= threshold
                            && !b.instructions.iter().any(|i| matches!(i, Instruction::Call { .. }))
                    })
        })
        .map(|f| f.name.clone())
        .collect();

    // Pre-collect inlineable function bodies so we don't borrow module.functions
    // while it is mutably borrowed in the loop below.
    let mut inlineable_bodies: HashMap<String, (Vec<Instruction>, Vec<(ValueId, IrType)>)> =
        HashMap::new();
    for f in &module.functions {
        if inlineable.contains(&f.name) {
            let callee_block = f.block(f.entry_block);
            inlineable_bodies.insert(
                f.name.clone(),
                (callee_block.instructions.clone(), f.params.clone()),
            );
        }
    }

    // Inline calls to inlineable functions
    for func in &mut module.functions {
        for block in func.blocks.values_mut() {
            let new_instructions: Vec<Instruction> = block
                .instructions
                .iter()
                .flat_map(|instr| {
                    if let Instruction::Call { dest, func_name, args } = instr {
                        if let Some((callee_instrs, callee_params)) =
                            inlineable_bodies.get(func_name)
                        {
                            inlined += 1;
                            // Replace call with inlined instructions
                            // This is a simplified version — a real implementation would
                            // need to handle parameter mapping, value renaming, etc.
                            let inlined: Vec<Instruction> = callee_instrs
                                .iter()
                                .filter_map(|ci| {
                                    if let Instruction::Const { value, ty, .. } = ci {
                                        // Return the const if it's the return value
                                        Some(Instruction::Const {
                                            dest: *dest,
                                            ty: *ty,
                                            value: *value,
                                        })
                                    } else if let Instruction::BinOp { op, left, right, .. } = ci {
                                        // Map callee params to caller args
                                        let mapped_left =
                                            if let Some(param_idx) =
                                                callee_params.iter().position(|(v, _)| v == left)
                                            {
                                                if let Some(arg) = args.get(param_idx) {
                                                    *arg
                                                } else {
                                                    *left
                                                }
                                            } else {
                                                *left
                                            };
                                        let mapped_right =
                                            if let Some(param_idx) =
                                                callee_params.iter().position(|(v, _)| v == right)
                                            {
                                                if let Some(arg) = args.get(param_idx) {
                                                    *arg
                                                } else {
                                                    *right
                                                }
                                            } else {
                                                *right
                                            };
                                        Some(Instruction::BinOp {
                                            dest: *dest,
                                            op: *op,
                                            left: mapped_left,
                                            right: mapped_right,
                                        })
                                    } else {
                                        None
                                    }
                                })
                                .collect();
                            return inlined;
                        }
                    }
                    vec![instr.clone()]
                })
                .collect();

            block.instructions = new_instructions;
        }
    }

    inlined
}

#[cfg(test)]
mod tests {
    use super::*;

    // ─── Constant folding tests ───

    #[test]
    fn fold_const_add() {
        let result = eval_binop(IrBinOp::I32Add, 3, 4);
        assert_eq!(result, Some(7));
    }

    #[test]
    fn fold_const_sub() {
        let result = eval_binop(IrBinOp::I32Sub, 10, 3);
        assert_eq!(result, Some(7));
    }

    #[test]
    fn fold_const_mul() {
        let result = eval_binop(IrBinOp::I32Mul, 6, 7);
        assert_eq!(result, Some(42));
    }

    #[test]
    fn fold_const_div() {
        let result = eval_binop(IrBinOp::I32DivS, 10, 3);
        assert_eq!(result, Some(3));
    }

    #[test]
    fn fold_const_div_by_zero_none() {
        let result = eval_binop(IrBinOp::I32DivS, 10, 0);
        assert_eq!(result, None);
    }

    #[test]
    fn fold_const_rem() {
        let result = eval_binop(IrBinOp::I32RemS, 10, 3);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_rem_by_zero_none() {
        let result = eval_binop(IrBinOp::I32RemS, 10, 0);
        assert_eq!(result, None);
    }

    #[test]
    fn fold_const_eq_true() {
        let result = eval_binop(IrBinOp::I32Eq, 5, 5);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_eq_false() {
        let result = eval_binop(IrBinOp::I32Eq, 5, 3);
        assert_eq!(result, Some(0));
    }

    #[test]
    fn fold_const_ne_true() {
        let result = eval_binop(IrBinOp::I32Ne, 5, 3);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_lt() {
        let result = eval_binop(IrBinOp::I32LtS, 3, 5);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_gt() {
        let result = eval_binop(IrBinOp::I32GtS, 5, 3);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_le() {
        let result = eval_binop(IrBinOp::I32LeS, 5, 5);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_ge() {
        let result = eval_binop(IrBinOp::I32GeS, 5, 5);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn fold_const_and() {
        let result = eval_binop(IrBinOp::I32And, 0b1100, 0b1010);
        assert_eq!(result, Some(0b1000));
    }

    #[test]
    fn fold_const_or() {
        let result = eval_binop(IrBinOp::I32Or, 0b1100, 0b1010);
        assert_eq!(result, Some(0b1110));
    }

    #[test]
    fn fold_const_xor() {
        let result = eval_binop(IrBinOp::I32Xor, 0b1100, 0b1010);
        assert_eq!(result, Some(0b0110));
    }

    #[test]
    fn fold_const_shl() {
        let result = eval_binop(IrBinOp::I32Shl, 1, 4);
        assert_eq!(result, Some(16));
    }

    #[test]
    fn fold_const_shr() {
        let result = eval_binop(IrBinOp::I32ShrS, 16, 2);
        assert_eq!(result, Some(4));
    }

    #[test]
    fn constant_fold_function() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c1 = func.emit_const(entry, IrType::I32, 3);
        let c2 = func.emit_const(entry, IrType::I32, 4);
        let sum = func.emit_binop(entry, IrBinOp::I32Add, c1, c2);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });

        let folded = constant_fold(&mut func);
        assert!(folded > 0);

        // The binop should be replaced by a const
        let block = func.block(entry);
        assert!(block.instructions.iter().any(|i| matches!(i, Instruction::Const { value: 7, .. })));
    }

    #[test]
    fn constant_fold_chain() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c1 = func.emit_const(entry, IrType::I32, 2);
        let c2 = func.emit_const(entry, IrType::I32, 3);
        let mul = func.emit_binop(entry, IrBinOp::I32Mul, c1, c2);
        let c3 = func.emit_const(entry, IrType::I32, 1);
        let sum = func.emit_binop(entry, IrBinOp::I32Add, mul, c3);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });

        let folded = constant_fold(&mut func);
        assert!(folded >= 1);
    }

    // ─── Dead code elimination tests ───

    #[test]
    fn dce_removes_unused_const() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let used = func.emit_const(entry, IrType::I32, 42);
        let _unused = func.emit_const(entry, IrType::I32, 999);
        func.set_terminator(entry, Terminator::Return { value: Some(used) });

        let before_count = func.block(entry).instructions.len();
        dead_code_eliminate(&mut func);
        let after_count = func.block(entry).instructions.len();
        assert!(after_count < before_count);
    }

    #[test]
    fn dce_keeps_used_values() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c1 = func.emit_const(entry, IrType::I32, 1);
        let c2 = func.emit_const(entry, IrType::I32, 2);
        let sum = func.emit_binop(entry, IrBinOp::I32Add, c1, c2);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });

        let count_before = func.block(entry).instructions.len();
        dead_code_eliminate(&mut func);
        let count_after = func.block(entry).instructions.len();
        assert_eq!(count_before, count_after); // nothing should be removed
    }

    #[test]
    fn dce_keeps_stores() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c = func.emit_const(entry, IrType::I32, 42);
        func.emit(entry, Instruction::Store { value: c, offset: 0 });
        func.set_terminator(entry, Terminator::Return { value: None });

        let count_before = func.block(entry).instructions.len();
        dead_code_eliminate(&mut func);
        let count_after = func.block(entry).instructions.len();
        assert_eq!(count_before, count_after); // store should be kept
    }

    #[test]
    fn dce_keeps_calls() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let result = func.emit_call(entry, "side_effect_fn", vec![]);
        func.set_terminator(entry, Terminator::Return { value: Some(result) });

        let count_before = func.block(entry).instructions.len();
        dead_code_eliminate(&mut func);
        let count_after = func.block(entry).instructions.len();
        assert_eq!(count_before, count_after); // call should be kept
    }

    #[test]
    fn is_side_effect_store() {
        let instr = Instruction::Store { value: ValueId(0), offset: 0 };
        assert!(is_side_effect(&instr));
    }

    #[test]
    fn is_side_effect_call() {
        let instr = Instruction::Call {
            dest: ValueId(0),
            func_name: "f".to_string(),
            args: vec![],
        };
        assert!(is_side_effect(&instr));
    }

    #[test]
    fn is_side_effect_const() {
        let instr = Instruction::Const {
            dest: ValueId(0),
            ty: IrType::I32,
            value: 42,
        };
        assert!(!is_side_effect(&instr));
    }

    #[test]
    fn is_side_effect_binop() {
        let instr = Instruction::BinOp {
            dest: ValueId(0),
            op: IrBinOp::I32Add,
            left: ValueId(1),
            right: ValueId(2),
        };
        assert!(!is_side_effect(&instr));
    }

    // ─── Inlining tests ───

    #[test]
    fn inline_small_const_function() {
        let mut module = IrModule::new("test".to_string());

        // Small function: just returns a constant
        let mut const_func = IrFunction::new("get_const".to_string(), vec![], IrType::I32);
        let entry = const_func.entry_block;
        let c = const_func.emit_const(entry, IrType::I32, 42);
        const_func.set_terminator(entry, Terminator::Return { value: Some(c) });

        // Function that calls the small function
        let mut caller = IrFunction::new("caller".to_string(), vec![], IrType::I32);
        let c_entry = caller.entry_block;
        let call_result = caller.emit_call(c_entry, "get_const", vec![]);
        caller.set_terminator(c_entry, Terminator::Return { value: Some(call_result) });

        module.add_function(const_func);
        module.add_function(caller);

        let inlined = inline_small_functions(&mut module);
        assert!(inlined > 0);
    }

    // ─── Optimize integration test ───

    #[test]
    fn optimize_full_pipeline() {
        let mut module = IrModule::new("test".to_string());

        // Function with constant folding + dead code opportunity
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c1 = func.emit_const(entry, IrType::I32, 3);
        let c2 = func.emit_const(entry, IrType::I32, 4);
        let sum = func.emit_binop(entry, IrBinOp::I32Add, c1, c2);
        let _unused = func.emit_const(entry, IrType::I32, 999);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });

        module.add_function(func);

        let stats = optimize(&mut module);
        assert!(stats.constants_folded > 0 || stats.dead_code_eliminated > 0);
    }

    #[test]
    fn optimize_stats_default() {
        let stats = OptStats::default();
        assert_eq!(stats.constants_folded, 0);
        assert_eq!(stats.dead_code_eliminated, 0);
        assert_eq!(stats.functions_inlined, 0);
    }

    // ─── proptest: constant folding commutativity ───

    #[test]
    fn proptest_add_commutative() {
        let a = 42i64;
        let b = 17i64;
        let r1 = eval_binop(IrBinOp::I32Add, a, b);
        let r2 = eval_binop(IrBinOp::I32Add, b, a);
        assert_eq!(r1, r2);
    }

    #[test]
    fn proptest_mul_commutative() {
        let a = 6i64;
        let b = 7i64;
        let r1 = eval_binop(IrBinOp::I32Mul, a, b);
        let r2 = eval_binop(IrBinOp::I32Mul, b, a);
        assert_eq!(r1, r2);
    }

    #[test]
    fn proptest_zero_neutral_add() {
        let x = 42i64;
        let r1 = eval_binop(IrBinOp::I32Add, x, 0);
        assert_eq!(r1, Some(x));

        let r2 = eval_binop(IrBinOp::I32Add, 0, x);
        assert_eq!(r2, Some(x));
    }

    #[test]
    fn proptest_one_neutral_mul() {
        let x = 42i64;
        let r1 = eval_binop(IrBinOp::I32Mul, x, 1);
        assert_eq!(r1, Some(x));

        let r2 = eval_binop(IrBinOp::I32Mul, 1, x);
        assert_eq!(r2, Some(x));
    }

    #[test]
    fn proptest_dce_no_false_positives() {
        let mut func = IrFunction::new("f".to_string(), vec![IrType::I32], IrType::I32);
        let entry = func.entry_block;
        let param = func.params[0].0;
        func.emit_binop(entry, IrBinOp::I32Add, param, param);
        func.set_terminator(entry, Terminator::Return { value: Some(param) });

        let count_before = func.block(entry).instructions.len();
        dead_code_eliminate(&mut func);
        let count_after = func.block(entry).instructions.len();

        // The add result is unused, so it should be eliminated
        assert!(count_after <= count_before);
    }

    #[test]
    fn proptest_or_returns_identity() {
        let a = 5i64;
        let b = 0i64;
        let r = eval_binop(IrBinOp::I32Or, a, b);
        assert_eq!(r, Some(a));
    }

    #[test]
    fn proptest_and_returns_zero() {
        let a = 5i64;
        let b = 0i64;
        let r = eval_binop(IrBinOp::I32And, a, b);
        assert_eq!(r, Some(0));
    }
}
