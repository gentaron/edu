//! Static Single Assignment (SSA) Intermediate Representation.
//!
//! The IR uses named values and basic blocks. Each instruction defines a new
//! SSA value that is assigned exactly once. Control flow uses basic blocks
//! with terminators (Jump, Branch, Return).

use std::collections::HashMap;
use std::fmt;

/// Unique identifier for SSA values.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ValueId(pub u32);

impl fmt::Display for ValueId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "v{}", self.0)
    }
}

/// Unique identifier for basic blocks.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct BlockId(pub u32);

impl fmt::Display for BlockId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "bb{}", self.0)
    }
}

/// WASM-compatible value types.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum IrType {
    I32,
    I64,
    F32,
    F64,
    /// Void/unit type (no value).
    Void,
}

impl fmt::Display for IrType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::I32 => write!(f, "i32"),
            Self::I64 => write!(f, "i64"),
            Self::F32 => write!(f, "f32"),
            Self::F64 => write!(f, "f64"),
            Self::Void => write!(f, "void"),
        }
    }
}

/// Binary operations in the IR.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum IrBinOp {
    I32Add,
    I32Sub,
    I32Mul,
    I32DivS,
    I32RemS,
    I32Eq,
    I32Ne,
    I32LtS,
    I32GtS,
    I32LeS,
    I32GeS,
    I32And,
    I32Or,
    I32Xor,
    I32Shl,
    I32ShrS,
}

impl IrBinOp {
    /// Returns the result type of this operation.
    #[must_use]
    pub fn result_type(&self) -> IrType {
        IrType::I32
    }
}

/// Unary operations in the IR.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum IrUnaryOp {
    I32Eqz,
    I32Clz,
    I32Ctz,
    I32Popcnt,
    I32Neg, // synthesized as sub(0, x)
}

impl IrUnaryOp {
    /// Returns the result type of this operation.
    #[must_use]
    pub fn result_type(&self) -> IrType {
        IrType::I32
    }
}

/// Comparison kind for branch conditions.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CmpKind {
    Eq,
    Ne,
    Lt,
    Gt,
    Le,
    Ge,
}

/// Instructions in the SSA IR.
#[derive(Debug, Clone, PartialEq)]
pub enum Instruction {
    /// Binary operation: `v1 = binop v2, v3`
    BinOp {
        dest: ValueId,
        op: IrBinOp,
        left: ValueId,
        right: ValueId,
    },
    /// Unary operation: `v1 = unop v2`
    UnaryOp {
        dest: ValueId,
        op: IrUnaryOp,
        operand: ValueId,
    },
    /// Load a constant: `v1 = const.i32 42`
    Const {
        dest: ValueId,
        ty: IrType,
        value: i64,
    },
    /// Function call: `v1 = call func_name(v2, v3, ...)`
    Call {
        dest: ValueId,
        func_name: String,
        args: Vec<ValueId>,
    },
    /// Comparison: `v1 = cmp kind v2, v3`
    Cmp {
        dest: ValueId,
        kind: CmpKind,
        left: ValueId,
        right: ValueId,
    },
    /// Memory load: `v1 = load.i32 offset`
    Load {
        dest: ValueId,
        ty: IrType,
        offset: u32,
    },
    /// Memory store: `store.i32 v1, offset`
    Store {
        value: ValueId,
        offset: u32,
    },
    /// Phi node placeholder: `v1 = phi [v2, bb0] [v3, bb1]`
    Phi {
        dest: ValueId,
        ty: IrType,
        sources: Vec<(ValueId, BlockId)>,
    },
    /// Get the length of a list: `v1 = list_len v2`
    ListLen {
        dest: ValueId,
        list: ValueId,
    },
    /// Get an element from a list: `v1 = list_get v2, v3`
    ListGet {
        dest: ValueId,
        list: ValueId,
        index: ValueId,
    },
    /// Get a string's data offset: `v1 = string_offset "hello"`
    StringOffset {
        dest: ValueId,
        index: u32,
    },
}

impl Instruction {
    /// Returns the destination value ID if this instruction defines one.
    #[must_use]
    pub fn dest(&self) -> Option<ValueId> {
        match self {
            Self::BinOp { dest, .. }
            | Self::UnaryOp { dest, .. }
            | Self::Const { dest, .. }
            | Self::Call { dest, .. }
            | Self::Cmp { dest, .. }
            | Self::Load { dest, .. }
            | Self::Phi { dest, .. }
            | Self::ListLen { dest, .. }
            | Self::ListGet { dest, .. }
            | Self::StringOffset { dest, .. } => Some(*dest),
            Self::Store { .. } => None,
        }
    }
}

/// Terminator instructions that end a basic block.
#[derive(Debug, Clone, PartialEq)]
pub enum Terminator {
    /// Unconditional jump: `jump bb1(v1, v2, ...)`
    Jump {
        target: BlockId,
        args: Vec<ValueId>,
    },
    /// Conditional branch: `branch v1, bb_true(v2), bb_false(v3)`
    Branch {
        condition: ValueId,
        true_target: BlockId,
        true_args: Vec<ValueId>,
        false_target: BlockId,
        false_args: Vec<ValueId>,
    },
    /// Return from function: `return v1`
    Return {
        value: Option<ValueId>,
    },
    /// Unreachable (after panic/divergence).
    Unreachable,
}

/// A basic block in SSA form.
#[derive(Debug, Clone, PartialEq)]
pub struct BasicBlock {
    /// Block ID.
    pub id: BlockId,
    /// Block parameters (phi inputs from predecessors).
    pub params: Vec<(ValueId, IrType)>,
    /// Regular instructions.
    pub instructions: Vec<Instruction>,
    /// Terminator instruction.
    pub terminator: Option<Terminator>,
}

impl BasicBlock {
    /// Create a new basic block.
    #[must_use]
    pub fn new(id: BlockId) -> Self {
        Self {
            id,
            params: Vec::new(),
            instructions: Vec::new(),
            terminator: None,
        }
    }

    /// Add a parameter to this block.
    pub fn add_param(&mut self, value: ValueId, ty: IrType) {
        self.params.push((value, ty));
    }

    /// Add an instruction to this block.
    pub fn add_instruction(&mut self, instr: Instruction) {
        self.instructions.push(instr);
    }

    /// Set the terminator for this block.
    pub fn set_terminator(&mut self, term: Terminator) {
        self.terminator = Some(term);
    }

    /// Check if this block is properly terminated.
    #[must_use]
    pub fn is_terminated(&self) -> bool {
        self.terminator.is_some()
    }

    /// Get all values defined by instructions in this block.
    #[must_use]
    pub fn defined_values(&self) -> Vec<ValueId> {
        self.instructions
            .iter()
            .filter_map(|i| i.dest())
            .collect()
    }
}

/// A function in the SSA IR.
#[derive(Debug, Clone)]
pub struct IrFunction {
    /// Function name.
    pub name: String,
    /// Function parameters.
    pub params: Vec<(ValueId, IrType)>,
    /// Return type.
    pub return_type: IrType,
    /// Basic blocks.
    pub blocks: HashMap<BlockId, BasicBlock>,
    /// Entry block ID.
    pub entry_block: BlockId,
    /// Next available value ID.
    pub next_value_id: u32,
    /// Next available block ID.
    pub next_block_id: u32,
    /// Whether this function should be exported.
    pub exported: bool,
}

impl IrFunction {
    /// Create a new IR function.
    #[must_use]
    pub fn new(name: String, params: Vec<IrType>, return_type: IrType) -> Self {
        let mut func = Self {
            name,
            params: Vec::new(),
            return_type,
            blocks: HashMap::new(),
            entry_block: BlockId(0),
            next_value_id: 0,
            next_block_id: 0,
            exported: false,
        };

        let entry = func.create_block();
        func.entry_block = entry;

        for ty in params {
            let value = func.fresh_value();
            func.params.push((value, ty));
        }

        func
    }

    /// Generate a fresh value ID.
    pub fn fresh_value(&mut self) -> ValueId {
        let id = ValueId(self.next_value_id);
        self.next_value_id += 1;
        id
    }

    /// Generate a fresh block ID.
    pub fn fresh_block_id(&mut self) -> BlockId {
        let id = BlockId(self.next_block_id);
        self.next_block_id += 1;
        id
    }

    /// Create a new basic block and return its ID.
    pub fn create_block(&mut self) -> BlockId {
        let id = self.fresh_block_id();
        self.blocks.insert(id, BasicBlock::new(id));
        id
    }

    /// Get a mutable reference to a block.
    pub fn block_mut(&mut self, block_id: BlockId) -> &mut BasicBlock {
        self.blocks.get_mut(&block_id).expect("block should exist")
    }

    /// Get a reference to a block.
    pub fn block(&self, block_id: BlockId) -> &BasicBlock {
        self.blocks.get(&block_id).expect("block should exist")
    }

    /// Add an instruction to the current (last active) block.
    pub fn emit(&mut self, block_id: BlockId, instr: Instruction) {
        self.block_mut(block_id).add_instruction(instr);
    }

    /// Add a constant value.
    pub fn emit_const(&mut self, block_id: BlockId, ty: IrType, value: i64) -> ValueId {
        let dest = self.fresh_value();
        self.emit(block_id, Instruction::Const { dest, ty, value });
        dest
    }

    /// Add a binary operation.
    pub fn emit_binop(&mut self, block_id: BlockId, op: IrBinOp, left: ValueId, right: ValueId) -> ValueId {
        let dest = self.fresh_value();
        self.emit(block_id, Instruction::BinOp { dest, op, left, right });
        dest
    }

    /// Add a function call.
    pub fn emit_call(&mut self, block_id: BlockId, func_name: &str, args: Vec<ValueId>) -> ValueId {
        let dest = self.fresh_value();
        self.emit(
            block_id,
            Instruction::Call {
                dest,
                func_name: func_name.to_string(),
                args,
            },
        );
        dest
    }

    /// Set the terminator for a block.
    pub fn set_terminator(&mut self, block_id: BlockId, term: Terminator) {
        self.block_mut(block_id).set_terminator(term);
    }

    /// Get all value definitions in the function.
    #[must_use]
    pub fn all_defined_values(&self) -> Vec<ValueId> {
        let mut values = self.params.iter().map(|(v, _)| *v).collect::<Vec<_>>();
        for block in self.blocks.values() {
            values.extend(block.defined_values());
        }
        values.sort_by_key(|v| v.0);
        values
    }

    /// Check if a value is used anywhere in the function.
    #[must_use]
    pub fn is_value_used(&self, value: ValueId) -> bool {
        fn check_value_in_instr(value: ValueId, instr: &Instruction) -> bool {
            match instr {
                Instruction::BinOp { left, right, .. } => *left == value || *right == value,
                Instruction::UnaryOp { operand, .. } => *operand == value,
                Instruction::Call { args, .. } => args.contains(&value),
                Instruction::Cmp { left, right, .. } => *left == value || *right == value,
                Instruction::Store { value: v, .. } => *v == value,
                Instruction::Phi { sources, .. } => sources.iter().any(|(v, _)| *v == value),
                Instruction::ListLen { list, .. } => *list == value,
                Instruction::ListGet { list, index, .. } => *list == value || *index == value,
                _ => false,
            }
        }

        fn check_value_in_term(value: ValueId, term: &Terminator) -> bool {
            match term {
                Terminator::Jump { args, .. } => args.contains(&value),
                Terminator::Branch { condition, true_args, false_args, .. } => {
                    *condition == value || true_args.contains(&value) || false_args.contains(&value)
                }
                Terminator::Return { value: v } => *v == Some(value),
                Terminator::Unreachable => false,
            }
        }

        for block in self.blocks.values() {
            for instr in &block.instructions {
                if check_value_in_instr(value, instr) {
                    return true;
                }
            }
            if let Some(term) = &block.terminator {
                if check_value_in_term(value, term) {
                    return true;
                }
            }
        }
        false
    }

    /// Format the function as a human-readable string.
    #[must_use]
    pub fn to_string(&self) -> String {
        let mut s = String::new();
        s.push_str(&format!("fn {}(", self.name));
        for (i, (vid, ty)) in self.params.iter().enumerate() {
            if i > 0 {
                s.push_str(", ");
            }
            s.push_str(&format!("{vid}: {ty}"));
        }
        s.push_str(&format!("): {} {{\n", self.return_type));

        // Print blocks in order
        let mut block_ids: Vec<_> = self.blocks.keys().copied().collect();
        block_ids.sort_by_key(|b| b.0);

        for bid in block_ids {
            let block = &self.blocks[&bid];
            s.push_str(&format!("  block {bid}"));

            // Parameters
            if !block.params.is_empty() {
                s.push('(');
                for (i, (vid, ty)) in block.params.iter().enumerate() {
                    if i > 0 {
                        s.push_str(", ");
                    }
                    s.push_str(&format!("{vid}: {ty}"));
                }
                s.push(')');
            }
            s.push_str(":\n");

            for instr in &block.instructions {
                s.push_str(&format!("    {instr}\n"));
            }

            if let Some(term) = &block.terminator {
                s.push_str(&format!("    {term}\n"));
            }
        }

        s.push_str("}\n");
        s
    }
}

/// An IR module containing multiple functions.
#[derive(Debug, Clone)]
pub struct IrModule {
    /// Module name.
    pub name: String,
    /// Functions in the module.
    pub functions: Vec<IrFunction>,
    /// Static data (strings, record layouts).
    pub data_section: Vec<(u32, Vec<u8>)>,
    /// Next available data offset.
    pub next_data_offset: u32,
}

impl IrModule {
    /// Create a new IR module.
    #[must_use]
    pub fn new(name: String) -> Self {
        Self {
            name,
            functions: Vec::new(),
            data_section: Vec::new(),
            next_data_offset: 0,
        }
    }

    /// Add a function to the module.
    pub fn add_function(&mut self, func: IrFunction) {
        self.functions.push(func);
    }

    /// Add static data to the data section.
    pub fn add_data(&mut self, data: &[u8]) -> u32 {
        let offset = self.next_data_offset;
        // Align to 4 bytes
        let aligned = (offset + 3) & !3;
        self.next_data_offset = aligned + data.len() as u32;
        self.data_section.push((aligned, data.to_vec()));
        aligned
    }
}

impl fmt::Display for Instruction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::BinOp { dest, op, left, right } => {
                write!(f, "{dest} = {:?} {left}, {right}", op)
            }
            Self::UnaryOp { dest, op, operand } => {
                write!(f, "{dest} = {:?} {operand}", op)
            }
            Self::Const { dest, ty, value } => {
                write!(f, "{dest} = const.{ty} {value}")
            }
            Self::Call { dest, func_name, args } => {
                write!(f, "{dest} = call {func_name}(")?;
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{arg}")?;
                }
                write!(f, ")")
            }
            Self::Cmp { dest, kind, left, right } => {
                write!(f, "{dest} = cmp.{:?} {left}, {right}", kind)
            }
            Self::Load { dest, ty, offset } => {
                write!(f, "{dest} = load.{ty} offset={offset}")
            }
            Self::Store { value, offset } => {
                write!(f, "store.i32 {value}, offset={offset}")
            }
            Self::Phi { dest, ty, sources } => {
                write!(f, "{dest} = phi.{ty} ")?;
                for (i, (val, bid)) in sources.iter().enumerate() {
                    if i > 0 {
                        write!(f, " ")?;
                    }
                    write!(f, "[{val}, {bid}]")?;
                }
                Ok(())
            }
            Self::ListLen { dest, list } => {
                write!(f, "{dest} = list_len {list}")
            }
            Self::ListGet { dest, list, index } => {
                write!(f, "{dest} = list_get {list}, {index}")
            }
            Self::StringOffset { dest, index } => {
                write!(f, "{dest} = string_offset @{index}")
            }
        }
    }
}

impl fmt::Display for Terminator {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Jump { target, args } => {
                write!(f, "jump {target}(")?;
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{arg}")?;
                }
                write!(f, ")")
            }
            Self::Branch {
                condition,
                true_target,
                true_args,
                false_target,
                false_args,
            } => {
                write!(f, "branch {condition}, {true_target}(")?;
                for (i, arg) in true_args.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{arg}")?;
                }
                write!(f, "), {false_target}(")?;
                for (i, arg) in false_args.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{arg}")?;
                }
                write!(f, ")")
            }
            Self::Return { value } => match value {
                Some(v) => write!(f, "return {v}"),
                None => write!(f, "return"),
            },
            Self::Unreachable => write!(f, "unreachable"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // ─── BasicBlock tests ───

    #[test]
    fn block_new() {
        let block = BasicBlock::new(BlockId(0));
        assert_eq!(block.id, BlockId(0));
        assert!(block.instructions.is_empty());
        assert!(!block.is_terminated());
    }

    #[test]
    fn block_add_param() {
        let mut block = BasicBlock::new(BlockId(0));
        block.add_param(ValueId(0), IrType::I32);
        block.add_param(ValueId(1), IrType::I32);
        assert_eq!(block.params.len(), 2);
    }

    #[test]
    fn block_add_instruction() {
        let mut block = BasicBlock::new(BlockId(0));
        block.add_instruction(Instruction::Const {
            dest: ValueId(0),
            ty: IrType::I32,
            value: 42,
        });
        assert_eq!(block.instructions.len(), 1);
    }

    #[test]
    fn block_set_terminator() {
        let mut block = BasicBlock::new(BlockId(0));
        block.set_terminator(Terminator::Return { value: None });
        assert!(block.is_terminated());
    }

    #[test]
    fn block_defined_values() {
        let mut block = BasicBlock::new(BlockId(0));
        block.add_instruction(Instruction::Const {
            dest: ValueId(0),
            ty: IrType::I32,
            value: 42,
        });
        block.add_instruction(Instruction::Const {
            dest: ValueId(1),
            ty: IrType::I32,
            value: 10,
        });
        let defs = block.defined_values();
        assert_eq!(defs.len(), 2);
    }

    // ─── IrFunction tests ───

    #[test]
    fn function_new() {
        let func = IrFunction::new("add".to_string(), vec![IrType::I32, IrType::I32], IrType::I32);
        assert_eq!(func.name, "add");
        assert_eq!(func.params.len(), 2);
        assert_eq!(func.return_type, IrType::I32);
    }

    #[test]
    fn function_fresh_value() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let v1 = func.fresh_value();
        let v2 = func.fresh_value();
        assert_ne!(v1, v2);
    }

    #[test]
    fn function_fresh_block() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let b1 = func.create_block();
        let b2 = func.create_block();
        assert_ne!(b1, b2);
    }

    #[test]
    fn function_emit_const() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let v = func.emit_const(entry, IrType::I32, 42);
        assert_eq!(v, ValueId(0)); // No params, so starts at 0
        // Actually no params so it starts at 0
        assert!(func.block(entry).instructions.len() >= 1);
    }

    #[test]
    fn function_emit_binop() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c1 = func.emit_const(entry, IrType::I32, 1);
        let c2 = func.emit_const(entry, IrType::I32, 2);
        let sum = func.emit_binop(entry, IrBinOp::I32Add, c1, c2);
        assert_eq!(func.block(entry).instructions.len(), 3);
    }

    #[test]
    fn function_emit_call() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let c = func.emit_const(entry, IrType::I32, 42);
        let result = func.emit_call(entry, "make_result", vec![c]);
        assert_eq!(func.block(entry).instructions.len(), 2);
    }

    #[test]
    fn function_set_terminator() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let entry = func.entry_block;
        let v = func.emit_const(entry, IrType::I32, 42);
        func.set_terminator(entry, Terminator::Return { value: Some(v) });
        assert!(func.block(entry).is_terminated());
    }

    #[test]
    fn function_all_defined_values() {
        let mut func = IrFunction::new("f".to_string(), vec![IrType::I32], IrType::I32);
        let entry = func.entry_block;
        func.emit_const(entry, IrType::I32, 42);
        let defs = func.all_defined_values();
        assert_eq!(defs.len(), 2); // param + const
    }

    #[test]
    fn function_is_value_used() {
        let mut func = IrFunction::new("f".to_string(), vec![IrType::I32], IrType::I32);
        let entry = func.entry_block;
        let param_val = func.params[0].0;
        let c = func.emit_const(entry, IrType::I32, 42);
        let sum = func.emit_binop(entry, IrBinOp::I32Add, param_val, c);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });
        assert!(func.is_value_used(param_val));
        assert!(func.is_value_used(c));
        assert!(func.is_value_used(sum));
    }

    #[test]
    fn function_is_value_unused() {
        let mut func = IrFunction::new("f".to_string(), vec![IrType::I32], IrType::I32);
        let entry = func.entry_block;
        let unused = func.emit_const(entry, IrType::I32, 999);
        let used = func.emit_const(entry, IrType::I32, 42);
        func.set_terminator(entry, Terminator::Return { value: Some(used) });
        assert!(!func.is_value_used(unused));
        assert!(func.is_value_used(used));
    }

    #[test]
    fn function_to_string() {
        let mut func = IrFunction::new("add".to_string(), vec![IrType::I32, IrType::I32], IrType::I32);
        let entry = func.entry_block;
        let p0 = func.params[0].0;
        let p1 = func.params[1].0;
        let sum = func.emit_binop(entry, IrBinOp::I32Add, p0, p1);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });
        let s = func.to_string();
        assert!(s.contains("fn add"));
        assert!(s.contains("I32Add"));
        assert!(s.contains("return"));
    }

    // ─── IrModule tests ───

    #[test]
    fn module_new() {
        let module = IrModule::new("test".to_string());
        assert_eq!(module.name, "test");
        assert!(module.functions.is_empty());
    }

    #[test]
    fn module_add_function() {
        let mut module = IrModule::new("test".to_string());
        let func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        module.add_function(func);
        assert_eq!(module.functions.len(), 1);
    }

    #[test]
    fn module_add_data() {
        let mut module = IrModule::new("test".to_string());
        let offset = module.add_data(b"hello");
        assert_eq!(offset, 0);
        let offset2 = module.add_data(b"world");
        assert!(offset2 > offset);
    }

    #[test]
    fn module_data_alignment() {
        let mut module = IrModule::new("test".to_string());
        let offset1 = module.add_data(b"ab"); // 2 bytes
        let offset2 = module.add_data(b"c"); // 1 byte
        // offset2 should be 4-byte aligned
        assert_eq!(offset2, 4);
    }

    // ─── Instruction display tests ───

    #[test]
    fn instruction_display_binop() {
        let instr = Instruction::BinOp {
            dest: ValueId(0),
            op: IrBinOp::I32Add,
            left: ValueId(1),
            right: ValueId(2),
        };
        let s = format!("{instr}");
        assert!(s.contains("I32Add"));
    }

    #[test]
    fn instruction_display_const() {
        let instr = Instruction::Const {
            dest: ValueId(0),
            ty: IrType::I32,
            value: 42,
        };
        let s = format!("{instr}");
        assert!(s.contains("42"));
    }

    #[test]
    fn instruction_display_call() {
        let instr = Instruction::Call {
            dest: ValueId(0),
            func_name: "add".to_string(),
            args: vec![ValueId(1), ValueId(2)],
        };
        let s = format!("{instr}");
        assert!(s.contains("call add"));
    }

    #[test]
    fn instruction_display_phi() {
        let instr = Instruction::Phi {
            dest: ValueId(0),
            ty: IrType::I32,
            sources: vec![(ValueId(1), BlockId(0)), (ValueId(2), BlockId(1))],
        };
        let s = format!("{instr}");
        assert!(s.contains("phi"));
    }

    #[test]
    fn terminator_display_jump() {
        let term = Terminator::Jump {
            target: BlockId(1),
            args: vec![ValueId(0)],
        };
        let s = format!("{term}");
        assert!(s.contains("jump"));
    }

    #[test]
    fn terminator_display_branch() {
        let term = Terminator::Branch {
            condition: ValueId(0),
            true_target: BlockId(1),
            true_args: vec![],
            false_target: BlockId(2),
            false_args: vec![],
        };
        let s = format!("{term}");
        assert!(s.contains("branch"));
    }

    #[test]
    fn terminator_display_return() {
        let term = Terminator::Return { value: None };
        assert_eq!(format!("{term}"), "return");
    }

    // ─── Complex IR construction ───

    #[test]
    fn build_add_function() {
        let mut func = IrFunction::new("add".to_string(), vec![IrType::I32, IrType::I32], IrType::I32);
        let entry = func.entry_block;
        let p0 = func.params[0].0;
        let p1 = func.params[1].0;
        let sum = func.emit_binop(entry, IrBinOp::I32Add, p0, p1);
        func.set_terminator(entry, Terminator::Return { value: Some(sum) });
        assert!(func.block(entry).is_terminated());
        assert_eq!(func.block(entry).instructions.len(), 1);
    }

    #[test]
    fn build_conditional_function() {
        let mut func = IrFunction::new("abs".to_string(), vec![IrType::I32], IrType::I32);
        let entry = func.entry_block;
        let then_block = func.create_block();
        let merge_block = func.create_block();
        let param = func.params[0].0;

        // entry: compare param < 0
        let zero = func.emit_const(entry, IrType::I32, 0);
        let is_neg = func.fresh_value();
        func.emit(entry, Instruction::Cmp {
            dest: is_neg,
            kind: CmpKind::Lt,
            left: param,
            right: zero,
        });
        func.set_terminator(
            entry,
            Terminator::Branch {
                condition: is_neg,
                true_target: then_block,
                true_args: vec![],
                false_target: merge_block,
                false_args: vec![param],
            },
        );

        // then_block: negate param
        let neg = func.emit_binop(then_block, IrBinOp::I32Sub, zero, param);
        func.set_terminator(
            then_block,
            Terminator::Jump {
                target: merge_block,
                args: vec![neg],
            },
        );

        // merge_block
        func.block_mut(merge_block).add_param(ValueId(999), IrType::I32);
        func.set_terminator(
            merge_block,
            Terminator::Return {
                value: Some(ValueId(999)),
            },
        );

        assert_eq!(func.blocks.len(), 3);
        assert!(func.block(entry).is_terminated());
        assert!(func.block(then_block).is_terminated());
        assert!(func.block(merge_block).is_terminated());
    }

    // ─── proptest: value IDs are unique ───

    #[test]
    fn proptest_fresh_values_unique() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let mut seen = std::collections::HashSet::new();
        for _ in 0..100 {
            let v = func.fresh_value();
            assert!(seen.insert(v), "duplicate value ID: {v}");
        }
    }

    #[test]
    fn proptest_block_ids_unique() {
        let mut func = IrFunction::new("f".to_string(), vec![], IrType::I32);
        let mut seen = std::collections::HashSet::new();
        for _ in 0..50 {
            let b = func.create_block();
            assert!(seen.insert(b), "duplicate block ID: {b}");
        }
    }

    #[test]
    fn proptest_value_id_display() {
        let v = ValueId(42);
        assert_eq!(format!("{v}"), "v42");
    }

    #[test]
    fn proptest_block_id_display() {
        let b = BlockId(7);
        assert_eq!(format!("{b}"), "bb7");
    }
}
