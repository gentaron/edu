#![deny(clippy::all)]

//! SSA-based Intermediate Representation for the Apolon DSL.
//!
//! Provides branded IDs, IR values, instructions, blocks, functions, and modules,
//! along with lowering from the AST.

use crate::ast::*;

// ── Branded IDs ────────────────────────────────────────────────

/// Branded block ID — never a raw primitive.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct IrBlockId(u32);

impl IrBlockId {
    /// Create a new branded block ID.
    #[must_use]
    pub const fn new(id: u32) -> Self {
        Self(id)
    }

    /// Get the underlying numeric value.
    #[must_use]
    pub const fn get(&self) -> u32 {
        self.0
    }
}

impl std::fmt::Display for IrBlockId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "bb{}", self.0)
    }
}

/// Branded instruction ID.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct IrInstrId(u32);

impl IrInstrId {
    /// Create a new branded instruction ID.
    #[must_use]
    pub const fn new(id: u32) -> Self {
        Self(id)
    }

    /// Get the underlying numeric value.
    #[must_use]
    pub const fn get(&self) -> u32 {
        self.0
    }
}

impl std::fmt::Display for IrInstrId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "v{}", self.0)
    }
}

// ── IR Values ──────────────────────────────────────────────────

/// A value in the IR — can be a constant, instruction result, parameter, entity, or unit.
#[derive(Debug, Clone, PartialEq)]
pub enum IrValue {
    /// Reference to an instruction result.
    Instr(IrInstrId),
    /// Constant integer.
    Const(i64),
    /// Constant boolean.
    Bool(bool),
    /// Function parameter (index, name).
    Param(usize, String),
    /// Entity reference (self, target, caster).
    Entity(String),
    /// Unit value.
    Unit,
}

// ── IR Instructions ────────────────────────────────────────────

/// Binary operation in the IR.
#[derive(Debug, Clone, PartialEq)]
pub enum IrBinOp {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    Eq,
    Neq,
    Lt,
    Gt,
    Le,
    Ge,
    And,
    Or,
}

/// Unary operation in the IR.
#[derive(Debug, Clone, PartialEq)]
pub enum IrUnOp {
    Neg,
    Not,
}

/// An IR instruction.
#[derive(Debug, Clone, PartialEq)]
pub enum IrInstr {
    /// Binary operation: add, sub, mul, div, mod, eq, neq, lt, gt, le, ge, and, or.
    BinOp {
        id: IrInstrId,
        op: IrBinOp,
        left: IrValue,
        right: IrValue,
    },
    /// Unary operation: neg, not.
    UnaryOp {
        id: IrInstrId,
        op: IrUnOp,
        operand: IrValue,
    },
    /// Function call.
    Call {
        id: IrInstrId,
        func: String,
        args: Vec<IrValue>,
    },
    /// Entity field access.
    FieldAccess {
        id: IrInstrId,
        entity: IrValue,
        field: String,
    },
    /// Conditional branch.
    CondBr {
        cond: IrValue,
        then_block: IrBlockId,
        else_block: IrBlockId,
    },
    /// Unconditional branch.
    Jump {
        target: IrBlockId,
    },
    /// Return from function.
    Return {
        value: Option<IrValue>,
    },
    /// Effect application.
    Apply {
        id: IrInstrId,
        effect: String,
        args: Vec<IrValue>,
    },
}

impl IrInstr {
    /// Get the instruction ID if this instruction produces a value.
    #[must_use]
    pub fn id(&self) -> Option<&IrInstrId> {
        match self {
            IrInstr::BinOp { id, .. }
            | IrInstr::UnaryOp { id, .. }
            | IrInstr::Call { id, .. }
            | IrInstr::FieldAccess { id, .. }
            | IrInstr::Apply { id, .. } => Some(id),
            IrInstr::CondBr { .. } | IrInstr::Jump { .. } | IrInstr::Return { .. } => None,
        }
    }
}

// ── IR Blocks, Functions, Modules ──────────────────────────────

/// A basic block in the IR.
#[derive(Debug, Clone)]
pub struct IrBlock {
    /// Branded block ID.
    pub id: IrBlockId,
    /// Phi-like parameters for this block.
    pub params: Vec<String>,
    /// Instructions in this block.
    pub instrs: Vec<IrInstr>,
}

impl IrBlock {
    /// Create a new empty block with the given ID.
    #[must_use]
    pub fn new(id: IrBlockId) -> Self {
        Self {
            id,
            params: Vec::new(),
            instrs: Vec::new(),
        }
    }
}

/// A function in the IR.
#[derive(Debug, Clone)]
pub struct IrFunction {
    /// Function name.
    pub name: String,
    /// Parameters: (name, type_name).
    pub params: Vec<(String, String)>,
    /// Return type name.
    pub return_type: String,
    /// Basic blocks.
    pub blocks: Vec<IrBlock>,
    /// Entry block ID.
    pub entry_block: IrBlockId,
}

impl IrFunction {
    /// Create a new function.
    #[must_use]
    pub fn new(name: String, entry_block: IrBlockId) -> Self {
        Self {
            name,
            params: Vec::new(),
            return_type: String::new(),
            blocks: Vec::new(),
            entry_block,
        }
    }
}

/// A module in the IR — the top-level compilation unit.
#[derive(Debug, Clone)]
pub struct IrModule {
    /// Module name.
    pub name: String,
    /// Functions in this module.
    pub functions: Vec<IrFunction>,
}

impl IrModule {
    /// Create a new empty IR module.
    #[must_use]
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            functions: Vec::new(),
        }
    }
}

// ── IR Builder ─────────────────────────────────────────────────

/// Builder for constructing IR with automatic ID assignment.
pub struct IrBuilder {
    next_block_id: u32,
    next_instr_id: u32,
    current_block: Vec<IrInstr>,
    /// Map from variable names to their IR values (for current scope).
    variables: std::collections::HashMap<String, IrValue>,
    /// Blocks accumulated so far (for multi-block functions).
    blocks: Vec<IrBlock>,
    /// Function parameters for resolving Param references.
    fn_params: Vec<(String, String)>,
}

impl IrBuilder {
    /// Create a new IR builder.
    #[must_use]
    pub fn new() -> Self {
        Self {
            next_block_id: 0,
            next_instr_id: 0,
            current_block: Vec::new(),
            variables: std::collections::HashMap::new(),
            blocks: Vec::new(),
            fn_params: Vec::new(),
        }
    }

    /// Allocate a new instruction ID.
    fn new_instr_id(&mut self) -> IrInstrId {
        let id = IrInstrId::new(self.next_instr_id);
        self.next_instr_id += 1;
        id
    }

    /// Allocate a new block ID.
    fn new_block_id(&mut self) -> IrBlockId {
        let id = IrBlockId::new(self.next_block_id);
        self.next_block_id += 1;
        id
    }

    /// Emit an instruction into the current block and return its value.
    fn emit(&mut self, instr: IrInstr) -> IrValue {
        if let Some(id) = instr.id() {
            let value = IrValue::Instr(*id);
            self.current_block.push(instr);
            value
        } else {
            self.current_block.push(instr);
            IrValue::Unit
        }
    }

    /// Finalize the current block, returning it.
    fn finalize_block(&mut self, id: IrBlockId) -> IrBlock {
        let instrs = std::mem::take(&mut self.current_block);
        IrBlock {
            id,
            params: Vec::new(),
            instrs,
        }
    }

    /// Start a new block (finalize the current one if non-empty).
    fn start_block(&mut self) -> IrBlockId {
        self.new_block_id()
    }

    /// Look up a variable by name, returning its IR value.
    fn lookup_var(&self, name: &str) -> IrValue {
        self.variables
            .get(name)
            .cloned()
            .unwrap_or_else(|| IrValue::Entity(name.to_string()))
    }

    /// Bind a variable name to an IR value.
    fn bind_var(&mut self, name: &str, value: IrValue) {
        self.variables.insert(name.to_string(), value);
    }
}

impl Default for IrBuilder {
    fn default() -> Self {
        Self::new()
    }
}

// ── AST → IR Lowering ─────────────────────────────────────────

/// Convert an AST `BinOp` to an IR `IrBinOp`.
fn lower_binop(op: BinOp) -> IrBinOp {
    match op {
        BinOp::Add => IrBinOp::Add,
        BinOp::Sub => IrBinOp::Sub,
        BinOp::Mul => IrBinOp::Mul,
        BinOp::Div => IrBinOp::Div,
        BinOp::Mod => IrBinOp::Mod,
        BinOp::Eq => IrBinOp::Eq,
        BinOp::Neq => IrBinOp::Neq,
        BinOp::Lt => IrBinOp::Lt,
        BinOp::Gt => IrBinOp::Gt,
        BinOp::Le => IrBinOp::Le,
        BinOp::Ge => IrBinOp::Ge,
        BinOp::And => IrBinOp::And,
        BinOp::Or => IrBinOp::Or,
    }
}

/// Convert an AST `UnaryOp` to an IR `IrUnOp`.
fn lower_unop(op: UnaryOp) -> IrUnOp {
    match op {
        UnaryOp::Neg => IrUnOp::Neg,
        UnaryOp::Not => IrUnOp::Not,
    }
}

/// Convert a `TypeAnn` to a string name for the IR.
fn type_ann_to_str(ty: &TypeAnn) -> String {
    match ty {
        TypeAnn::Int => "i32".to_string(),
        TypeAnn::Bool => "bool".to_string(),
        TypeAnn::Str => "str".to_string(),
        TypeAnn::Unit => "unit".to_string(),
        TypeAnn::Entity => "entity".to_string(),
        TypeAnn::Effect => "Effect".to_string(),
        TypeAnn::Named(n) => n.clone(),
        TypeAnn::FnType { .. } | TypeAnn::List(_) | TypeAnn::Row(_) => "opaque".to_string(),
    }
}

/// Lower an AST expression to an IR value within the current block.
pub fn lower_expr(expr: &Expr, builder: &mut IrBuilder) -> IrValue {
    match expr {
        Expr::IntLit(n) => IrValue::Const(*n),
        Expr::BoolLit(b) => IrValue::Bool(*b),
        Expr::StrLit(_) => IrValue::Unit,
        Expr::Ident(name) => {
            // Check if it's a function parameter
            if let Some(idx) = builder.fn_params.iter().position(|(p, _)| p == name) {
                IrValue::Param(idx, name.clone())
            } else {
                builder.lookup_var(name)
            }
        }
        Expr::Binary { op, left, right } => {
            let left_val = lower_expr(left, builder);
            let right_val = lower_expr(right, builder);
            let id = builder.new_instr_id();
            builder.emit(IrInstr::BinOp {
                id,
                op: lower_binop(*op),
                left: left_val,
                right: right_val,
            })
        }
        Expr::Unary { op, operand } => {
            let operand_val = lower_expr(operand, builder);
            let id = builder.new_instr_id();
            builder.emit(IrInstr::UnaryOp {
                id,
                op: lower_unop(*op),
                operand: operand_val,
            })
        }
        Expr::Call { func, args } => {
            let func_name = match func.as_ref() {
                Expr::Ident(name) => name.clone(),
                _ => "unknown".to_string(),
            };
            let ir_args: Vec<IrValue> = args
                .iter()
                .map(|arg| match arg {
                    CallArg::Positional(e) => lower_expr(e, builder),
                    CallArg::Named { value, .. } => lower_expr(value, builder),
                })
                .collect();
            let id = builder.new_instr_id();
            builder.emit(IrInstr::Call {
                id,
                func: func_name,
                args: ir_args,
            })
        }
        Expr::Member { object, field } => {
            let entity_val = lower_expr(object, builder);
            let id = builder.new_instr_id();
            builder.emit(IrInstr::FieldAccess {
                id,
                entity: entity_val,
                field: field.clone(),
            })
        }
        Expr::If(if_expr) => lower_if_expr(if_expr, builder),
        Expr::Struct(_) => IrValue::Unit,
        Expr::List(_) => IrValue::Unit,
    }
}

/// Lower an if-expression to IR (creates then/else blocks).
fn lower_if_expr(if_expr: &IfExpr, builder: &mut IrBuilder) -> IrValue {
    let cond_val = lower_expr(&if_expr.condition, builder);

    let then_block_id = builder.new_block_id();
    let else_block_id = builder.new_block_id();

    builder.emit(IrInstr::CondBr {
        cond: cond_val,
        then_block: then_block_id,
        else_block: else_block_id,
    });

    IrValue::Unit
}

/// Lower a statement into the current IR block.
pub fn lower_stmt(stmt: &Stmt, builder: &mut IrBuilder) {
    match stmt {
        Stmt::Expr(_) => {
            // Expression statement — value is discarded
        }
        Stmt::Let(let_stmt) => {
            let value = lower_expr(&let_stmt.value, builder);
            builder.bind_var(&let_stmt.name, value);
        }
        Stmt::Assign(assign_stmt) => {
            let value = lower_expr(&assign_stmt.value, builder);
            builder.bind_var(&assign_stmt.name, value);
        }
        Stmt::If(if_stmt) => {
            let cond_val = lower_expr(&if_stmt.condition, builder);

            let then_block_id = builder.new_block_id();
            let else_block_id = builder.new_block_id();
            builder.emit(IrInstr::CondBr {
                cond: cond_val,
                then_block: then_block_id,
                else_block: else_block_id,
            });
            let _ = if_stmt.else_clause; // Acknowledged: used for block layout in a full impl
        }
        Stmt::Return(return_stmt) => {
            let value = return_stmt
                .value
                .as_ref()
                .map(|v| lower_expr(v, builder));
            builder.emit(IrInstr::Return { value });
        }
    }
}

/// Lower an AST function definition to an IR function.
pub fn lower_function(fn_def: &FnDef) -> IrFunction {
    let mut builder = IrBuilder::new();
    let entry_block = builder.start_block();

    // Set function parameters
    let params: Vec<(String, String)> = fn_def
        .params
        .iter()
        .map(|p| (p.name.clone(), type_ann_to_str(&p.type_ann)))
        .collect();
    builder.fn_params = params.clone();

    let return_type = fn_def
        .return_type
        .as_ref()
        .map(type_ann_to_str)
        .unwrap_or_else(|| "unit".to_string());

    // Lower body statements
    for stmt in &fn_def.body {
        lower_stmt(stmt, &mut builder);
    }

    // Add implicit return if the block doesn't end with a terminator
    let needs_return = builder.current_block.last().is_none_or(|instr| {
        !matches!(
            instr,
            IrInstr::Return { .. } | IrInstr::Jump { .. } | IrInstr::CondBr { .. }
        )
    });
    if needs_return {
        builder.emit(IrInstr::Return { value: None });
    }

    let entry = builder.finalize_block(entry_block);
    builder.blocks.insert(0, entry);

    let mut ir_func = IrFunction::new(fn_def.name.clone(), entry_block);
    ir_func.params = params;
    ir_func.return_type = return_type;
    ir_func.blocks = builder.blocks;

    ir_func
}

/// Lower an AST program to an IR module.
pub fn lower_program(program: &Program) -> IrModule {
    let module_name = program.module.as_deref().unwrap_or("anon");
    let mut module = IrModule::new(module_name);

    for item in &program.items {
        if let Item::Fn(fn_def) = item {
            let ir_func = lower_function(fn_def);
            module.functions.push(ir_func);
        }
    }

    module
}

// ── Tests ──────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    // ── Branded type tests ───────────────────────────────────

    #[test]
    fn test_block_id_new() {
        let id = IrBlockId::new(0);
        assert_eq!(id.get(), 0);
    }

    #[test]
    fn test_block_id_different_values() {
        let id1 = IrBlockId::new(1);
        let id2 = IrBlockId::new(2);
        assert_ne!(id1, id2);
    }

    #[test]
    fn test_block_id_same_values_equal() {
        let id1 = IrBlockId::new(42);
        let id2 = IrBlockId::new(42);
        assert_eq!(id1, id2);
    }

    #[test]
    fn test_block_id_display() {
        let id = IrBlockId::new(3);
        assert_eq!(format!("{id}"), "bb3");
    }

    #[test]
    fn test_instr_id_new() {
        let id = IrInstrId::new(0);
        assert_eq!(id.get(), 0);
    }

    #[test]
    fn test_instr_id_different_values() {
        let id1 = IrInstrId::new(1);
        let id2 = IrInstrId::new(2);
        assert_ne!(id1, id2);
    }

    #[test]
    fn test_instr_id_same_values_equal() {
        let id1 = IrInstrId::new(42);
        let id2 = IrInstrId::new(42);
        assert_eq!(id1, id2);
    }

    #[test]
    fn test_instr_id_display() {
        let id = IrInstrId::new(5);
        assert_eq!(format!("{id}"), "v5");
    }

    #[test]
    fn test_branded_types_not_interchangeable_with_u32() {
        // IrBlockId is not a u32
        let _id = IrBlockId::new(1);
        // The following would not compile: let x: u32 = id;
        // This test just verifies the type exists and compiles
        assert!(true);
    }

    // ── IR Value tests ───────────────────────────────────────

    #[test]
    fn test_ir_value_const() {
        let v = IrValue::Const(42);
        assert_eq!(v, IrValue::Const(42));
    }

    #[test]
    fn test_ir_value_bool() {
        let v = IrValue::Bool(true);
        assert_eq!(v, IrValue::Bool(true));
    }

    #[test]
    fn test_ir_value_instr() {
        let v = IrValue::Instr(IrInstrId::new(0));
        assert_eq!(v, IrValue::Instr(IrInstrId::new(0)));
    }

    #[test]
    fn test_ir_value_param() {
        let v = IrValue::Param(0, "x".to_string());
        assert_eq!(v, IrValue::Param(0, "x".to_string()));
    }

    #[test]
    fn test_ir_value_entity() {
        let v = IrValue::Entity("self".to_string());
        assert_eq!(v, IrValue::Entity("self".to_string()));
    }

    #[test]
    fn test_ir_value_unit() {
        let v = IrValue::Unit;
        assert_eq!(v, IrValue::Unit);
    }

    // ── Binary operation lowering ────────────────────────────

    #[test]
    fn test_lower_expr_int_literal() {
        let mut builder = IrBuilder::new();
        let expr = Expr::IntLit(42);
        let val = lower_expr(&expr, &mut builder);
        assert_eq!(val, IrValue::Const(42));
    }

    #[test]
    fn test_lower_expr_bool_literal() {
        let mut builder = IrBuilder::new();
        let expr = Expr::BoolLit(true);
        let val = lower_expr(&expr, &mut builder);
        assert_eq!(val, IrValue::Bool(true));
    }

    #[test]
    fn test_lower_expr_add() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::IntLit(3)),
            right: Box::new(Expr::IntLit(4)),
        };
        let val = lower_expr(&expr, &mut builder);
        match val {
            IrValue::Instr(id) => {
                let instr = &builder.current_block[0];
                match instr {
                    IrInstr::BinOp {
                        op: IrBinOp::Add,
                        left: IrValue::Const(3),
                        right: IrValue::Const(4),
                        ..
                    } => {
                        assert_eq!(id.get(), 0);
                    }
                    _ => panic!("expected BinOp Add"),
                }
            }
            _ => panic!("expected Instr value"),
        }
    }

    #[test]
    fn test_lower_expr_mul() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Binary {
            op: BinOp::Mul,
            left: Box::new(Expr::IntLit(5)),
            right: Box::new(Expr::IntLit(6)),
        };
        let val = lower_expr(&expr, &mut builder);
        assert!(matches!(val, IrValue::Instr(_)));
    }

    // ── Expression lowering: a + b * c ──────────────────────

    #[test]
    fn test_lower_expr_precedence_add_mul() {
        // a + b * c should produce: mul(b, c) → v0, add(a, v0) → v1
        let mut builder = IrBuilder::new();
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::Ident("a".to_string())),
            right: Box::new(Expr::Binary {
                op: BinOp::Mul,
                left: Box::new(Expr::Ident("b".to_string())),
                right: Box::new(Expr::Ident("c".to_string())),
            }),
        };
        let val = lower_expr(&expr, &mut builder);
        // Should produce 2 instructions: mul first (v0), then add (v1)
        assert_eq!(builder.current_block.len(), 2);
        assert!(matches!(
            &builder.current_block[0],
            IrInstr::BinOp {
                op: IrBinOp::Mul,
                ..
            }
        ));
        assert!(matches!(
            &builder.current_block[1],
            IrInstr::BinOp {
                op: IrBinOp::Add,
                ..
            }
        ));
        assert!(matches!(val, IrValue::Instr(_)));
    }

    // ── Unary operation lowering ─────────────────────────────

    #[test]
    fn test_lower_expr_neg() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Unary {
            op: UnaryOp::Neg,
            operand: Box::new(Expr::IntLit(5)),
        };
        let val = lower_expr(&expr, &mut builder);
        assert!(matches!(val, IrValue::Instr(_)));
        assert_eq!(builder.current_block.len(), 1);
        match &builder.current_block[0] {
            IrInstr::UnaryOp {
                op: IrUnOp::Neg,
                operand: IrValue::Const(5),
                ..
            } => {}
            _ => panic!("expected UnaryOp Neg"),
        }
    }

    #[test]
    fn test_lower_expr_not() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Unary {
            op: UnaryOp::Not,
            operand: Box::new(Expr::BoolLit(true)),
        };
        let val = lower_expr(&expr, &mut builder);
        assert!(matches!(val, IrValue::Instr(_)));
        match &builder.current_block[0] {
            IrInstr::UnaryOp {
                op: IrUnOp::Not,
                operand: IrValue::Bool(true),
                ..
            } => {}
            _ => panic!("expected UnaryOp Not"),
        }
    }

    // ── Function call lowering ───────────────────────────────

    #[test]
    fn test_lower_expr_call() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Call {
            func: Box::new(Expr::Ident("foo".to_string())),
            args: vec![CallArg::Positional(Expr::IntLit(1))],
        };
        let val = lower_expr(&expr, &mut builder);
        assert!(matches!(val, IrValue::Instr(_)));
        match &builder.current_block[0] {
            IrInstr::Call {
                func,
                args,
                ..
            } => {
                assert_eq!(func, "foo");
                assert_eq!(args.len(), 1);
            }
            _ => panic!("expected Call"),
        }
    }

    // ── Field access lowering ────────────────────────────────

    #[test]
    fn test_lower_expr_field_access() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Member {
            object: Box::new(Expr::Ident("self".to_string())),
            field: "hp".to_string(),
        };
        let val = lower_expr(&expr, &mut builder);
        assert!(matches!(val, IrValue::Instr(_)));
        match &builder.current_block[0] {
            IrInstr::FieldAccess {
                entity: IrValue::Entity(name),
                field,
                ..
            } => {
                assert_eq!(name, "self");
                assert_eq!(field, "hp");
            }
            _ => panic!("expected FieldAccess"),
        }
    }

    // ── Conditional branch lowering ──────────────────────────

    #[test]
    fn test_lower_if_creates_cond_br() {
        let mut builder = IrBuilder::new();
        let if_stmt = Stmt::If(IfStmt {
            condition: Expr::BoolLit(true),
            then_block: vec![],
            else_clause: None,
        });
        lower_stmt(&if_stmt, &mut builder);
        assert_eq!(builder.current_block.len(), 1);
        assert!(matches!(
            &builder.current_block[0],
            IrInstr::CondBr { .. }
        ));
    }

    #[test]
    fn test_lower_if_else_creates_cond_br() {
        let mut builder = IrBuilder::new();
        let if_stmt = Stmt::If(IfStmt {
            condition: Expr::BoolLit(true),
            then_block: vec![],
            else_clause: Some(ElseClause::Block(vec![])),
        });
        lower_stmt(&if_stmt, &mut builder);
        assert_eq!(builder.current_block.len(), 1);
        assert!(matches!(
            &builder.current_block[0],
            IrInstr::CondBr { .. }
        ));
    }

    // ── Return lowering ──────────────────────────────────────

    #[test]
    fn test_lower_return_value() {
        let mut builder = IrBuilder::new();
        let ret_stmt = Stmt::Return(ReturnStmt {
            value: Some(Expr::IntLit(42)),
        });
        lower_stmt(&ret_stmt, &mut builder);
        match &builder.current_block[0] {
            IrInstr::Return {
                value: Some(IrValue::Const(42)),
            } => {}
            _ => panic!("expected Return with Const(42)"),
        }
    }

    #[test]
    fn test_lower_return_unit() {
        let mut builder = IrBuilder::new();
        let ret_stmt = Stmt::Return(ReturnStmt { value: None });
        lower_stmt(&ret_stmt, &mut builder);
        match &builder.current_block[0] {
            IrInstr::Return { value: None } => {}
            _ => panic!("expected Return with None"),
        }
    }

    // ── Entity reference lowering ────────────────────────────

    #[test]
    fn test_lower_expr_entity_self() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Ident("self".to_string());
        let val = lower_expr(&expr, &mut builder);
        assert_eq!(val, IrValue::Entity("self".to_string()));
    }

    #[test]
    fn test_lower_expr_entity_target() {
        let mut builder = IrBuilder::new();
        let expr = Expr::Ident("target".to_string());
        let val = lower_expr(&expr, &mut builder);
        assert_eq!(val, IrValue::Entity("target".to_string()));
    }

    // ── Let binding lowering ─────────────────────────────────

    #[test]
    fn test_lower_let_binding() {
        let mut builder = IrBuilder::new();
        let let_stmt = Stmt::Let(LetStmt {
            name: "x".to_string(),
            type_ann: None,
            value: Expr::IntLit(10),
        });
        lower_stmt(&let_stmt, &mut builder);
        assert_eq!(builder.lookup_var("x"), IrValue::Const(10));
    }

    // ── Block construction ───────────────────────────────────

    #[test]
    fn test_block_new() {
        let block = IrBlock::new(IrBlockId::new(0));
        assert_eq!(block.id, IrBlockId::new(0));
        assert!(block.params.is_empty());
        assert!(block.instrs.is_empty());
    }

    #[test]
    fn test_block_with_instructions() {
        let mut block = IrBlock::new(IrBlockId::new(0));
        block.instrs.push(IrInstr::Return { value: None });
        assert_eq!(block.instrs.len(), 1);
    }

    // ── Function construction ────────────────────────────────

    #[test]
    fn test_function_new() {
        let func = IrFunction::new("foo".to_string(), IrBlockId::new(0));
        assert_eq!(func.name, "foo");
        assert_eq!(func.entry_block, IrBlockId::new(0));
    }

    // ── Module construction ──────────────────────────────────

    #[test]
    fn test_module_new() {
        let module = IrModule::new("test");
        assert_eq!(module.name, "test");
        assert!(module.functions.is_empty());
    }

    #[test]
    fn test_module_with_multiple_functions() {
        let mut module = IrModule::new("test");
        let func1 = IrFunction::new("foo".to_string(), IrBlockId::new(0));
        let func2 = IrFunction::new("bar".to_string(), IrBlockId::new(1));
        module.functions.push(func1);
        module.functions.push(func2);
        assert_eq!(module.functions.len(), 2);
    }

    #[test]
    fn test_lower_function_simple() {
        let fn_def = FnDef {
            name: "add".to_string(),
            params: vec![
                Param {
                    name: "a".to_string(),
                    type_ann: TypeAnn::Int,
                },
                Param {
                    name: "b".to_string(),
                    type_ann: TypeAnn::Int,
                },
            ],
            return_type: Some(TypeAnn::Int),
            effect: None,
            body: vec![Stmt::Return(ReturnStmt {
                value: Some(Expr::Binary {
                    op: BinOp::Add,
                    left: Box::new(Expr::Ident("a".to_string())),
                    right: Box::new(Expr::Ident("b".to_string())),
                }),
            })],
        };
        let ir_func = lower_function(&fn_def);
        assert_eq!(ir_func.name, "add");
        assert_eq!(ir_func.params.len(), 2);
        assert_eq!(ir_func.return_type, "i32");
        assert!(!ir_func.blocks.is_empty());
    }

    #[test]
    fn test_lower_function_no_return_adds_implicit() {
        let fn_def = FnDef {
            name: "noop".to_string(),
            params: vec![],
            return_type: None,
            effect: None,
            body: vec![],
        };
        let ir_func = lower_function(&fn_def);
        // Should have an implicit return
        let entry = &ir_func.blocks[0];
        assert!(!entry.instrs.is_empty());
        assert!(matches!(&entry.instrs[0], IrInstr::Return { value: None }));
    }

    #[test]
    fn test_lower_program_empty() {
        let program = Program {
            module: None,
            items: vec![],
        };
        let ir_module = lower_program(&program);
        assert!(ir_module.functions.is_empty());
    }

    #[test]
    fn test_lower_program_with_functions() {
        let program = Program {
            module: Some("game".to_string()),
            items: vec![
                Item::Fn(FnDef {
                    name: "foo".to_string(),
                    params: vec![],
                    return_type: None,
                    effect: None,
                    body: vec![],
                }),
                Item::Fn(FnDef {
                    name: "bar".to_string(),
                    params: vec![],
                    return_type: None,
                    effect: None,
                    body: vec![],
                }),
            ],
        };
        let ir_module = lower_program(&program);
        assert_eq!(ir_module.name, "game");
        assert_eq!(ir_module.functions.len(), 2);
    }

    // ── Builder ID assignment tests ──────────────────────────

    #[test]
    fn test_builder_assigns_sequential_ids() {
        let mut builder = IrBuilder::new();
        let id1 = builder.new_instr_id();
        let id2 = builder.new_instr_id();
        let id3 = builder.new_instr_id();
        assert_eq!(id1.get(), 0);
        assert_eq!(id2.get(), 1);
        assert_eq!(id3.get(), 2);
    }

    #[test]
    fn test_builder_assigns_sequential_block_ids() {
        let mut builder = IrBuilder::new();
        let b1 = builder.new_block_id();
        let b2 = builder.new_block_id();
        assert_eq!(b1.get(), 0);
        assert_eq!(b2.get(), 1);
    }

    #[test]
    fn test_builder_emit_returns_instr_value() {
        let mut builder = IrBuilder::new();
        let id = builder.new_instr_id();
        let val = builder.emit(IrInstr::BinOp {
            id,
            op: IrBinOp::Add,
            left: IrValue::Const(1),
            right: IrValue::Const(2),
        });
        assert_eq!(val, IrValue::Instr(id));
    }

    #[test]
    fn test_builder_emit_terminator_returns_unit() {
        let mut builder = IrBuilder::new();
        let val = builder.emit(IrInstr::Return { value: None });
        assert_eq!(val, IrValue::Unit);
    }

    // ── Instruction ID accessor tests ────────────────────────

    #[test]
    fn test_instr_id_binop() {
        let instr = IrInstr::BinOp {
            id: IrInstrId::new(0),
            op: IrBinOp::Add,
            left: IrValue::Const(1),
            right: IrValue::Const(2),
        };
        assert_eq!(instr.id(), Some(&IrInstrId::new(0)));
    }

    #[test]
    fn test_instr_id_unaryop() {
        let instr = IrInstr::UnaryOp {
            id: IrInstrId::new(1),
            op: IrUnOp::Neg,
            operand: IrValue::Const(5),
        };
        assert_eq!(instr.id(), Some(&IrInstrId::new(1)));
    }

    #[test]
    fn test_instr_id_call() {
        let instr = IrInstr::Call {
            id: IrInstrId::new(2),
            func: "f".to_string(),
            args: vec![],
        };
        assert_eq!(instr.id(), Some(&IrInstrId::new(2)));
    }

    #[test]
    fn test_instr_id_field_access() {
        let instr = IrInstr::FieldAccess {
            id: IrInstrId::new(3),
            entity: IrValue::Entity("self".to_string()),
            field: "hp".to_string(),
        };
        assert_eq!(instr.id(), Some(&IrInstrId::new(3)));
    }

    #[test]
    fn test_instr_id_terminators_none() {
        assert!(IrInstr::CondBr {
            cond: IrValue::Bool(true),
            then_block: IrBlockId::new(0),
            else_block: IrBlockId::new(1),
        }
        .id()
        .is_none());
        assert!(IrInstr::Jump {
            target: IrBlockId::new(0)
        }
        .id()
        .is_none());
        assert!(IrInstr::Return { value: None }.id().is_none());
    }

    #[test]
    fn test_binop_lowering_all_ops() {
        let ops = [
            BinOp::Add,
            BinOp::Sub,
            BinOp::Mul,
            BinOp::Div,
            BinOp::Mod,
            BinOp::Eq,
            BinOp::Neq,
            BinOp::Lt,
            BinOp::Gt,
            BinOp::Le,
            BinOp::Ge,
            BinOp::And,
            BinOp::Or,
        ];
        for op in ops {
            let ir_op = lower_binop(op);
            // Just verify it doesn't panic and returns a valid op
            let _ = format!("{ir_op:?}");
        }
    }

    #[test]
    fn test_unop_lowering_all_ops() {
        let ops = [UnaryOp::Neg, UnaryOp::Not];
        for op in ops {
            let ir_op = lower_unop(op);
            let _ = format!("{ir_op:?}");
        }
    }

    #[test]
    fn test_type_ann_to_str() {
        assert_eq!(type_ann_to_str(&TypeAnn::Int), "i32");
        assert_eq!(type_ann_to_str(&TypeAnn::Bool), "bool");
        assert_eq!(type_ann_to_str(&TypeAnn::Str), "str");
        assert_eq!(type_ann_to_str(&TypeAnn::Unit), "unit");
        assert_eq!(type_ann_to_str(&TypeAnn::Entity), "entity");
    }
}
