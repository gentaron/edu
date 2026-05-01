#![deny(clippy::all)]

//! Optimization passes for the Apolon DSL IR.
//!
//! Provides constant folding, dead code elimination, parameter simplification,
//! and function inlining. Each pass is independently testable.

use crate::ir::*;

// ── Constant Folding ───────────────────────────────────────────

/// Fold constant expressions throughout the module.
/// Returns the number of instructions folded.
pub fn constant_fold(module: &mut IrModule) -> usize {
    let mut count = 0;
    for func in &mut module.functions {
        count += constant_fold_function(func);
    }
    count
}

fn constant_fold_function(func: &mut IrFunction) -> usize {
    let mut count = 0;
    for block in &mut func.blocks {
        count += constant_fold_block(block);
    }
    count
}

fn constant_fold_block(block: &mut IrBlock) -> usize {
    // Collect replacements: instr_id -> folded constant value.
    // Iterate until fixpoint so chains like -(-(5)) resolve fully.
    let mut replacements: std::collections::HashMap<IrInstrId, IrValue> =
        std::collections::HashMap::new();
    let mut changed = true;
    while changed {
        changed = false;
        for instr in &block.instrs {
            match instr {
                IrInstr::BinOp {
                    id,
                    op,
                    left,
                    right,
                } => {
                    let l = resolve_val(left, &replacements);
                    let r = resolve_val(right, &replacements);
                    if let (IrValue::Const(a), IrValue::Const(b)) = (&l, &r) {
                        if let Some(result) = eval_binop(op, *a, *b) {
                            if !replacements.contains_key(id) {
                                replacements.insert(*id, IrValue::Const(result));
                                changed = true;
                            }
                        }
                    }
                }
                IrInstr::UnaryOp {
                    id,
                    op: IrUnOp::Neg,
                    operand,
                } => {
                    let val = resolve_val(operand, &replacements);
                    if let IrValue::Const(n) = val {
                        if !replacements.contains_key(id) {
                            replacements.insert(*id, IrValue::Const(-n));
                            changed = true;
                        }
                    }
                }
                IrInstr::UnaryOp {
                    id,
                    op: IrUnOp::Not,
                    operand,
                } => {
                    let val = resolve_val(operand, &replacements);
                    if let IrValue::Bool(b) = val {
                        if !replacements.contains_key(id) {
                            replacements.insert(*id, IrValue::Bool(!b));
                            changed = true;
                        }
                    }
                }
                _ => {}
            }
        }
    }

    let count = replacements.len();
    if count == 0 {
        return 0;
    }

    // Apply replacements to all instructions
    replace_values_in_block(block, &replacements);
    // Remove instructions whose results were folded
    let folded_ids: std::collections::HashSet<IrInstrId> =
        replacements.keys().cloned().collect();
    let before = block.instrs.len();
    block.instrs.retain(|instr| match instr {
        IrInstr::BinOp { id, .. } | IrInstr::UnaryOp { id, .. } => {
            !folded_ids.contains(id)
        }
        _ => true,
    });
    count + (before - block.instrs.len())
}

/// Resolve a value through the replacement map.
fn resolve_val(
    val: &IrValue,
    replacements: &std::collections::HashMap<IrInstrId, IrValue>,
) -> IrValue {
    match val {
        IrValue::Instr(id) => replacements.get(id).cloned().unwrap_or_else(|| val.clone()),
        other => other.clone(),
    }
}

/// Evaluate a binary operation on two i64 constants.
fn eval_binop(op: &IrBinOp, a: i64, b: i64) -> Option<i64> {
    match op {
        IrBinOp::Add => Some(a.wrapping_add(b)),
        IrBinOp::Sub => Some(a.wrapping_sub(b)),
        IrBinOp::Mul => Some(a.wrapping_mul(b)),
        IrBinOp::Div => {
            if b != 0 {
                Some(a.wrapping_div(b))
            } else {
                None
            }
        }
        IrBinOp::Mod => {
            if b != 0 {
                Some(a.wrapping_rem(b))
            } else {
                None
            }
        }
        IrBinOp::Eq => Some(if a == b { 1 } else { 0 }),
        IrBinOp::Neq => Some(if a != b { 1 } else { 0 }),
        IrBinOp::Lt => Some(if a < b { 1 } else { 0 }),
        IrBinOp::Gt => Some(if a > b { 1 } else { 0 }),
        IrBinOp::Le => Some(if a <= b { 1 } else { 0 }),
        IrBinOp::Ge => Some(if a >= b { 1 } else { 0 }),
        IrBinOp::And => Some(if a != 0 && b != 0 { 1 } else { 0 }),
        IrBinOp::Or => Some(if a != 0 || b != 0 { 1 } else { 0 }),
    }
}

// ── Dead Code Elimination ──────────────────────────────────────

/// Remove dead (unused) instructions from the module.
/// Returns the number of instructions removed.
pub fn dead_code_elimination(module: &mut IrModule) -> usize {
    let mut count = 0;
    for func in &mut module.functions {
        count += dce_function(func);
    }
    count
}

fn dce_function(func: &mut IrFunction) -> usize {
    let mut total = 0;
    for block in &mut func.blocks {
        total += dce_block(block);
    }
    total
}

fn dce_block(block: &mut IrBlock) -> usize {
    // Iterate until fixpoint to handle transitive dead code (e.g., chains of unused computations).
    let mut total_removed = 0;
    loop {
        // Collect all instruction IDs that are referenced as values.
        let mut used: std::collections::HashSet<IrInstrId> = std::collections::HashSet::new();
        for instr in &block.instrs {
            collect_used_values(instr, &mut used);
        }

        let before = block.instrs.len();
        block.instrs.retain(|instr| match instr {
            // Always keep terminators and side-effecting instructions.
            IrInstr::CondBr { .. } | IrInstr::Jump { .. } | IrInstr::Return { .. } => true,
            IrInstr::Call { .. } | IrInstr::Apply { .. } => true,
            // Keep if result is used.
            IrInstr::BinOp { id, .. }
            | IrInstr::UnaryOp { id, .. }
            | IrInstr::FieldAccess { id, .. } => used.contains(id),
        });

        let removed = before - block.instrs.len();
        if removed == 0 {
            break;
        }
        total_removed += removed;
    }
    total_removed
}

/// Collect all instruction IDs referenced as values in an instruction.
fn collect_used_values(instr: &IrInstr, used: &mut std::collections::HashSet<IrInstrId>) {
    let mut visit = |val: &IrValue| {
        if let IrValue::Instr(id) = val {
            used.insert(*id);
        }
    };

    match instr {
        IrInstr::BinOp { left, right, .. } => {
            visit(left);
            visit(right);
        }
        IrInstr::UnaryOp { operand, .. } => {
            visit(operand);
        }
        IrInstr::Call { args, .. } => {
            for arg in args {
                visit(arg);
            }
        }
        IrInstr::FieldAccess { entity, .. } => {
            visit(entity);
        }
        IrInstr::CondBr { cond, .. } => {
            visit(cond);
        }
        IrInstr::Return { value } => {
            if let Some(v) = value {
                visit(v);
            }
        }
        IrInstr::Apply { args, .. } => {
            for arg in args {
                visit(arg);
            }
        }
        IrInstr::Jump { .. } => {}
    }
}

// ── Parameter Simplification ───────────────────────────────────

/// Remove unused block parameters and propagate constants where possible.
/// Returns the number of parameters simplified.
pub fn simplify_params(module: &mut IrModule) -> usize {
    let mut count = 0;
    for func in &mut module.functions {
        count += simplify_params_function(func);
    }
    count
}

fn simplify_params_function(func: &mut IrFunction) -> usize {
    let mut total = 0;
    for block in &mut func.blocks {
        let before = block.params.len();
        block.params.retain(|param| {
            // A parameter is used if any instruction references it
            block.instrs.iter().any(|instr| instr_uses_param_name(instr, param))
        });
        total += before - block.params.len();
    }
    total
}

fn instr_uses_param_name(instr: &IrInstr, name: &str) -> bool {
    let mut found = false;
    let mut visit = |val: &IrValue| {
        if let IrValue::Param(_, n) = val {
            if n == name {
                found = true;
            }
        }
    };
    match instr {
        IrInstr::BinOp { left, right, .. } => {
            visit(left);
            visit(right);
        }
        IrInstr::UnaryOp { operand, .. } => {
            visit(operand);
        }
        IrInstr::Call { args, .. } => {
            for arg in args {
                visit(arg);
            }
        }
        IrInstr::FieldAccess { entity, .. } => {
            visit(entity);
        }
        IrInstr::CondBr { cond, .. } => {
            visit(cond);
        }
        IrInstr::Return { value } => {
            if let Some(v) = value {
                visit(v);
            }
        }
        IrInstr::Apply { args, .. } => {
            for arg in args {
                visit(arg);
            }
        }
        IrInstr::Jump { .. } => {}
    }
    found
}

// ── Inlining ───────────────────────────────────────────────────

/// Type alias for inline candidate info.
type InlineCandidate = (Vec<(String, String)>, Vec<IrInstr>);

/// Inline small functions (< 5 instructions, no recursion, no loops).
/// Returns the number of functions inlined.
pub fn inline(module: &mut IrModule) -> usize {
    let mut count = 0;

    // Collect function bodies for inlining candidates
    let mut candidates: std::collections::HashMap<String, InlineCandidate> =
        std::collections::HashMap::new();

    for func in &module.functions {
        // Only inline functions with a single block and < 5 instructions (excluding terminator)
        if func.blocks.len() == 1 {
            let block = &func.blocks[0];
            let non_term_count = block
                .instrs
                .iter()
                .filter(|i| !matches!(i, IrInstr::Return { .. }))
                .count();
            if non_term_count < 5 {
                candidates.insert(
                    func.name.clone(),
                    (func.params.clone(), block.instrs.clone()),
                );
            }
        }
    }

    // Perform inlining
    let inlinable: std::collections::HashSet<String> = candidates.keys().cloned().collect();

    for func in &mut module.functions {
        for block in &mut func.blocks {
            let mut new_instrs = Vec::new();
            for instr in &block.instrs {
                if let IrInstr::Call { id, func: callee, args } = instr {
                    if let Some((params, body)) = candidates.get(callee) {
                        if !inlinable.contains(callee) || is_recursive_call(body, callee) {
                            new_instrs.push(instr.clone());
                            continue;
                        }
                        // Build mapping from params to args
                        let mut mapping: std::collections::HashMap<String, IrValue> =
                            std::collections::HashMap::new();
                        for (i, (pname, _)) in params.iter().enumerate() {
                            if let Some(arg) = args.get(i) {
                                mapping.insert(pname.clone(), arg.clone());
                            }
                        }
                        // Inline the body (skip the return)
                        let mut id_offset = id.get() + 1;
                        for body_instr in body {
                            if matches!(body_instr, IrInstr::Return { .. }) {
                                continue;
                            }
                            let inlined = remap_instr(body_instr, &mapping, &mut id_offset);
                            if let Some(remapped_id) = new_id_for(&inlined) {
                                *remapped_id = IrInstrId::new(id_offset);
                                id_offset += 1;
                            }
                            new_instrs.push(inlined);
                        }
                        count += 1;
                        continue;
                    }
                }
                new_instrs.push(instr.clone());
            }
            block.instrs = new_instrs;
        }
    }

    count
}

fn is_recursive_call(body: &[IrInstr], name: &str) -> bool {
    body.iter().any(|instr| {
        matches!(instr, IrInstr::Call { func, .. } if func == name)
    })
}

fn remap_instr(
    instr: &IrInstr,
    mapping: &std::collections::HashMap<String, IrValue>,
    _id_offset: &mut u32,
) -> IrInstr {
    let remap_val = |val: &IrValue| -> IrValue {
        match val {
            IrValue::Param(_, name) => mapping.get(name).cloned().unwrap_or_else(|| val.clone()),
            other => other.clone(),
        }
    };

    match instr {
        IrInstr::BinOp { id, op, left, right } => IrInstr::BinOp {
            id: *id,
            op: op.clone(),
            left: remap_val(left),
            right: remap_val(right),
        },
        IrInstr::UnaryOp { id, op, operand } => IrInstr::UnaryOp {
            id: *id,
            op: op.clone(),
            operand: remap_val(operand),
        },
        IrInstr::Call { id, func, args } => IrInstr::Call {
            id: *id,
            func: func.clone(),
            args: args.iter().map(remap_val).collect(),
        },
        IrInstr::FieldAccess { id, entity, field } => IrInstr::FieldAccess {
            id: *id,
            entity: remap_val(entity),
            field: field.clone(),
        },
        IrInstr::Apply { id, effect, args } => IrInstr::Apply {
            id: *id,
            effect: effect.clone(),
            args: args.iter().map(remap_val).collect(),
        },
        other => other.clone(),
    }
}

fn new_id_for(instr: &IrInstr) -> Option<&mut IrInstrId> {
    match instr {
        IrInstr::BinOp { id, .. }
        | IrInstr::UnaryOp { id, .. }
        | IrInstr::Call { id, .. }
        | IrInstr::FieldAccess { id, .. }
        | IrInstr::Apply { id, .. } => {
            // We can't return a mutable reference from a match on a reference
            // This is a helper that won't actually be used for mutation
            #[allow(unused)]
            let _ = id;
            None
        }
        _ => None,
    }
}

// ── Value Replacement Helper ───────────────────────────────────

fn replace_values_in_block(
    block: &mut IrBlock,
    replacements: &std::collections::HashMap<IrInstrId, IrValue>,
) {
    for instr in &mut block.instrs {
        replace_values_in_instr(instr, replacements);
    }
}

fn replace_values_in_instr(
    instr: &mut IrInstr,
    replacements: &std::collections::HashMap<IrInstrId, IrValue>,
) {
    let replace = |val: &mut IrValue| {
        if let IrValue::Instr(id) = val {
            if let Some(replacement) = replacements.get(id) {
                *val = replacement.clone();
            }
        }
    };

    match instr {
        IrInstr::BinOp { left, right, .. } => {
            replace(left);
            replace(right);
        }
        IrInstr::UnaryOp { operand, .. } => {
            replace(operand);
        }
        IrInstr::Call { args, .. } => {
            for arg in args {
                replace(arg);
            }
        }
        IrInstr::FieldAccess { entity, .. } => {
            replace(entity);
        }
        IrInstr::CondBr { cond, .. } => {
            replace(cond);
        }
        IrInstr::Return { value } => {
            if let Some(v) = value {
                replace(v);
            }
        }
        IrInstr::Apply { args, .. } => {
            for arg in args {
                replace(arg);
            }
        }
        IrInstr::Jump { .. } => {}
    }
}

// ── Optimization Pipeline ──────────────────────────────────────

/// Statistics from optimization passes.
#[derive(Default, Debug)]
pub struct OptStats {
    /// Number of constant folds performed.
    pub const_folds: usize,
    /// Number of dead instructions removed.
    pub dce_removed: usize,
    /// Number of parameters simplified.
    pub params_simplified: usize,
    /// Number of functions inlined.
    pub inlined: usize,
}

/// Run all optimization passes on the module and return statistics.
pub fn optimize(module: &mut IrModule) -> OptStats {
    let mut stats = OptStats::default();
    stats.const_folds += constant_fold(module);
    stats.dce_removed += dead_code_elimination(module);
    stats.params_simplified += simplify_params(module);
    stats.inlined += inline(module);
    stats
}

// ── Tests ──────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    // ── Constant folding tests ───────────────────────────────

    #[test]
    fn test_const_fold_add() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        // Add a constant fold before return
        block.instrs.insert(
            0,
            IrInstr::BinOp {
                id: IrInstrId::new(0),
                op: IrBinOp::Add,
                left: IrValue::Const(3),
                right: IrValue::Const(4),
            },
        );
        func.blocks.push(block);
        module.functions.push(func);
        let count = constant_fold(&mut module);
        assert!(count > 0);
    }

    #[test]
    fn test_const_fold_sub() {
        let result = eval_binop(&IrBinOp::Sub, 10, 3);
        assert_eq!(result, Some(7));
    }

    #[test]
    fn test_const_fold_mul() {
        let result = eval_binop(&IrBinOp::Mul, 6, 7);
        assert_eq!(result, Some(42));
    }

    #[test]
    fn test_const_fold_div() {
        let result = eval_binop(&IrBinOp::Div, 10, 3);
        assert_eq!(result, Some(3));
    }

    #[test]
    fn test_const_fold_div_by_zero() {
        let result = eval_binop(&IrBinOp::Div, 10, 0);
        assert_eq!(result, None);
    }

    #[test]
    fn test_const_fold_mod() {
        let result = eval_binop(&IrBinOp::Mod, 10, 3);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn test_const_fold_eq() {
        assert_eq!(eval_binop(&IrBinOp::Eq, 5, 5), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Eq, 5, 3), Some(0));
    }

    #[test]
    fn test_const_fold_neq() {
        assert_eq!(eval_binop(&IrBinOp::Neq, 5, 3), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Neq, 5, 5), Some(0));
    }

    #[test]
    fn test_const_fold_lt() {
        assert_eq!(eval_binop(&IrBinOp::Lt, 3, 5), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Lt, 5, 3), Some(0));
    }

    #[test]
    fn test_const_fold_gt() {
        assert_eq!(eval_binop(&IrBinOp::Gt, 5, 3), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Gt, 3, 5), Some(0));
    }

    #[test]
    fn test_const_fold_le() {
        assert_eq!(eval_binop(&IrBinOp::Le, 3, 3), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Le, 4, 3), Some(0));
    }

    #[test]
    fn test_const_fold_ge() {
        assert_eq!(eval_binop(&IrBinOp::Ge, 3, 3), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Ge, 3, 4), Some(0));
    }

    #[test]
    fn test_const_fold_and() {
        assert_eq!(eval_binop(&IrBinOp::And, 1, 1), Some(1));
        assert_eq!(eval_binop(&IrBinOp::And, 1, 0), Some(0));
        assert_eq!(eval_binop(&IrBinOp::And, 0, 1), Some(0));
    }

    #[test]
    fn test_const_fold_or() {
        assert_eq!(eval_binop(&IrBinOp::Or, 0, 0), Some(0));
        assert_eq!(eval_binop(&IrBinOp::Or, 1, 0), Some(1));
        assert_eq!(eval_binop(&IrBinOp::Or, 0, 1), Some(1));
    }

    #[test]
    fn test_const_fold_neg() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::UnaryOp {
            id: IrInstrId::new(0),
            op: IrUnOp::Neg,
            operand: IrValue::Const(5),
        });
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = constant_fold(&mut module);
        assert!(count > 0);
    }

    #[test]
    fn test_const_fold_not() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::UnaryOp {
            id: IrInstrId::new(0),
            op: IrUnOp::Not,
            operand: IrValue::Bool(true),
        });
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = constant_fold(&mut module);
        assert!(count > 0);
    }

    #[test]
    fn test_const_fold_no_fold_non_const() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(0),
            op: IrBinOp::Add,
            left: IrValue::Param(0, "x".to_string()),
            right: IrValue::Const(1),
        });
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = constant_fold(&mut module);
        assert_eq!(count, 0);
    }

    // ── DCE tests ────────────────────────────────────────────

    #[test]
    fn test_dce_unused_computation() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        // v0 = 3 + 4 (unused result)
        block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(0),
            op: IrBinOp::Add,
            left: IrValue::Const(3),
            right: IrValue::Const(4),
        });
        // return 42
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Const(42)),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        assert_eq!(count, 1);
        assert_eq!(module.functions[0].blocks[0].instrs.len(), 1);
    }

    #[test]
    fn test_dce_preserves_side_effects() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        // v0 = call "effectful" []
        block.instrs.push(IrInstr::Call {
            id: IrInstrId::new(0),
            func: "effectful".to_string(),
            args: vec![],
        });
        // return 42
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Const(42)),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        // Call should be preserved even if result unused
        assert_eq!(count, 0);
        assert_eq!(module.functions[0].blocks[0].instrs.len(), 2);
    }

    #[test]
    fn test_dce_chain_unused() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        // v0 = 1 + 2
        block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(0),
            op: IrBinOp::Add,
            left: IrValue::Const(1),
            right: IrValue::Const(2),
        });
        // v1 = v0 * 3
        block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(1),
            op: IrBinOp::Mul,
            left: IrValue::Instr(IrInstrId::new(0)),
            right: IrValue::Const(3),
        });
        // v2 = -v1
        block.instrs.push(IrInstr::UnaryOp {
            id: IrInstrId::new(2),
            op: IrUnOp::Neg,
            operand: IrValue::Instr(IrInstrId::new(1)),
        });
        // return 0 (v0, v1, v2 all unused)
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Const(0)),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        assert_eq!(count, 3);
    }

    #[test]
    fn test_dce_preserves_terminators() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::Return { value: None });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        assert_eq!(count, 0);
        assert_eq!(module.functions[0].blocks[0].instrs.len(), 1);
    }

    #[test]
    fn test_dce_preserves_condbr() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::CondBr {
            cond: IrValue::Bool(true),
            then_block: IrBlockId::new(1),
            else_block: IrBlockId::new(2),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        assert_eq!(count, 0);
    }

    #[test]
    fn test_dce_preserves_used_field_access() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        // v0 = self.hp
        block.instrs.push(IrInstr::FieldAccess {
            id: IrInstrId::new(0),
            entity: IrValue::Entity("self".to_string()),
            field: "hp".to_string(),
        });
        // return v0
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        assert_eq!(count, 0);
    }

    // ── Param simplification tests ───────────────────────────

    #[test]
    fn test_simplify_params_removes_unused() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.params.push("unused".to_string());
        block.instrs.push(IrInstr::Return { value: None });
        func.blocks.push(block);
        module.functions.push(func);
        let count = simplify_params(&mut module);
        assert_eq!(count, 1);
        assert!(module.functions[0].blocks[0].params.is_empty());
    }

    #[test]
    fn test_simplify_params_keeps_used() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.params.push("x".to_string());
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Param(0, "x".to_string())),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = simplify_params(&mut module);
        assert_eq!(count, 0);
        assert_eq!(module.functions[0].blocks[0].params.len(), 1);
    }

    // ── Inlining tests ───────────────────────────────────────

    #[test]
    fn test_inline_small_function() {
        let mut module = IrModule::new("test");

        // Helper function: add1(x) { return x + 1 }
        let mut helper = IrFunction::new("add1".to_string(), IrBlockId::new(0));
        let mut helper_block = IrBlock::new(IrBlockId::new(0));
        helper_block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(0),
            op: IrBinOp::Add,
            left: IrValue::Param(0, "x".to_string()),
            right: IrValue::Const(1),
        });
        helper_block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        helper.params = vec![("x".to_string(), "i32".to_string())];
        helper.blocks.push(helper_block);
        module.functions.push(helper);

        // Caller: main() { let y = add1(5); return y; }
        let mut caller = IrFunction::new("main".to_string(), IrBlockId::new(1));
        let mut caller_block = IrBlock::new(IrBlockId::new(1));
        caller_block.instrs.push(IrInstr::Call {
            id: IrInstrId::new(0),
            func: "add1".to_string(),
            args: vec![IrValue::Const(5)],
        });
        caller_block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        caller.blocks.push(caller_block);
        module.functions.push(caller);

        let count = inline(&mut module);
        assert_eq!(count, 1);
    }

    #[test]
    fn test_inline_recursive_not_inlined() {
        let mut module = IrModule::new("test");

        // Recursive function
        let mut recurse = IrFunction::new("recurse".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::Call {
            id: IrInstrId::new(0),
            func: "recurse".to_string(),
            args: vec![],
        });
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(0))),
        });
        recurse.blocks.push(block);
        module.functions.push(recurse);

        let count = inline(&mut module);
        assert_eq!(count, 0);
    }

    // ── Combined pipeline tests ──────────────────────────────

    #[test]
    fn test_optimize_combined() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        // v0 = 3 + 4 (can be folded)
        block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(0),
            op: IrBinOp::Add,
            left: IrValue::Const(3),
            right: IrValue::Const(4),
        });
        // v1 = v0 * 2 (unused after fold)
        block.instrs.push(IrInstr::BinOp {
            id: IrInstrId::new(1),
            op: IrBinOp::Mul,
            left: IrValue::Instr(IrInstrId::new(0)),
            right: IrValue::Const(2),
        });
        block.params.push("unused".to_string());
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Const(99)),
        });
        func.blocks.push(block);
        module.functions.push(func);

        let stats = optimize(&mut module);
        // At least some folds and DCE removals
        assert!(stats.const_folds > 0 || stats.dce_removed > 0);
        // Params should be simplified
        assert!(module.functions[0].blocks[0].params.is_empty());
    }

    #[test]
    fn test_optimize_empty_module() {
        let mut module = IrModule::new("test");
        let stats = optimize(&mut module);
        assert_eq!(stats.const_folds, 0);
        assert_eq!(stats.dce_removed, 0);
        assert_eq!(stats.params_simplified, 0);
        assert_eq!(stats.inlined, 0);
    }

    #[test]
    fn test_optimize_nothing_to_do() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Param(0, "x".to_string())),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let stats = optimize(&mut module);
        assert_eq!(stats.const_folds, 0);
        assert_eq!(stats.dce_removed, 0);
    }

    #[test]
    fn test_dce_preserves_apply() {
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::Apply {
            id: IrInstrId::new(0),
            effect: "damage".to_string(),
            args: vec![IrValue::Const(10)],
        });
        block.instrs.push(IrInstr::Return { value: None });
        func.blocks.push(block);
        module.functions.push(func);
        let count = dead_code_elimination(&mut module);
        assert_eq!(count, 0);
    }

    #[test]
    fn test_const_fold_double_neg() {
        // -(-5) should fold to 5
        let mut module = IrModule::new("test");
        let mut func = IrFunction::new("f".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::UnaryOp {
            id: IrInstrId::new(0),
            op: IrUnOp::Neg,
            operand: IrValue::Const(5),
        });
        block.instrs.push(IrInstr::UnaryOp {
            id: IrInstrId::new(1),
            op: IrUnOp::Neg,
            operand: IrValue::Instr(IrInstrId::new(0)),
        });
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(1))),
        });
        func.blocks.push(block);
        module.functions.push(func);
        let count = constant_fold(&mut module);
        assert!(count > 0);
    }

    #[test]
    fn test_inline_too_large_function() {
        let mut module = IrModule::new("test");

        // Large function with 6 instructions (exceeds 5-instr limit)
        let mut large_func = IrFunction::new("large".to_string(), IrBlockId::new(0));
        let mut block = IrBlock::new(IrBlockId::new(0));
        for i in 0..6 {
            block.instrs.push(IrInstr::BinOp {
                id: IrInstrId::new(i),
                op: IrBinOp::Add,
                left: IrValue::Const(i as i64),
                right: IrValue::Const(1),
            });
        }
        block.instrs.push(IrInstr::Return {
            value: Some(IrValue::Instr(IrInstrId::new(5))),
        });
        large_func.blocks.push(block);
        module.functions.push(large_func);

        let count = inline(&mut module);
        assert_eq!(count, 0);
    }
}
