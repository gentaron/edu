//! Abstract Syntax Tree types for the Apolon DSL.

/// A complete Apolon program (compilation unit).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Program {
    /// Optional module declaration.
    pub module: Option<String>,
    /// Top-level items.
    pub items: Vec<Item>,
}

/// Top-level items in a program.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Item {
    /// Card definition.
    Card(CardDef),
    /// Effect definition.
    Effect(EffectDef),
    /// Function definition.
    Fn(FnDef),
    /// Constant definition.
    Const(ConstDef),
    /// Use declaration.
    Use(UseDecl),
}

/// Card definition: `card "Name" : Rarity { ... }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CardDef {
    /// Card name (string literal).
    pub name: String,
    /// Card rarity.
    pub rarity: String,
    /// Card body (stats, abilities, passives).
    pub body: Vec<CardBodyItem>,
}

/// Items inside a card body.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CardBodyItem {
    /// Stats block.
    Stats(StatsBlock),
    /// Ability definition.
    Ability(AbilityDef),
    /// Passive definition.
    Passive(PassiveDef),
}

/// Stats block: `stats { hp = 120, atk = 45, ... }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StatsBlock {
    /// Stat fields (name, value pairs).
    pub fields: Vec<StatField>,
}

/// A single stat field: `name = expr`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StatField {
    /// Field name.
    pub name: String,
    /// Field value expression.
    pub value: Expr,
}

/// Ability definition: `ability "Name"(...) { ... }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AbilityDef {
    /// Ability name.
    pub name: String,
    /// Parameters (usually empty for abilities).
    pub params: Vec<Param>,
    /// Ability body clauses.
    pub body: Vec<AbilityBodyItem>,
}

/// Items inside an ability body.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AbilityBodyItem {
    /// Cost clause: `cost: 3 mana`
    Cost(CostClause),
    /// Trigger clause: `on cast { ... }`
    Trigger(TriggerClause),
    /// Regular statement.
    Stmt(Stmt),
}

/// Cost clause: `cost: expr resource`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CostClause {
    /// Cost amount (expression).
    pub amount: Expr,
    /// Resource type.
    pub resource: CostResource,
}

/// Resource type for cost clauses.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CostResource {
    /// Mana cost.
    Mana,
    /// HP cost.
    Hp,
    /// Shield cost.
    Shield,
}

/// Trigger clause: `on event_name { ... }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TriggerClause {
    /// Trigger event name (e.g., "cast", "turn_start", "turn_end").
    pub event: String,
    /// Optional effect annotation.
    pub effect: Option<EffectAnn>,
    /// Body statements.
    pub body: Vec<Stmt>,
}

/// Passive definition: `passive "Name" { ... }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PassiveDef {
    /// Passive name.
    pub name: String,
    /// Body statements.
    pub body: Vec<Stmt>,
}

/// Effect definition: `effect Name { variant* }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EffectDef {
    /// Effect name.
    pub name: String,
    /// Effect variants.
    pub variants: Vec<EffectVariant>,
}

/// An effect variant: `Name(params) -> RetType? { body }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EffectVariant {
    /// Variant name.
    pub name: String,
    /// Variant parameters.
    pub params: Vec<Param>,
    /// Optional return type.
    pub return_type: Option<TypeAnn>,
    /// Body statements.
    pub body: Vec<Stmt>,
}

/// Function definition: `fn name(params) -> RetType? :effect? { body }`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FnDef {
    /// Function name.
    pub name: String,
    /// Function parameters.
    pub params: Vec<Param>,
    /// Optional return type.
    pub return_type: Option<TypeAnn>,
    /// Optional effect annotation.
    pub effect: Option<EffectAnn>,
    /// Body statements.
    pub body: Vec<Stmt>,
}

/// Effect annotation: pure, random, or mutating.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EffectAnn {
    /// Pure function (no side effects).
    Pure,
    /// Uses randomness.
    Random,
    /// Mutates game state.
    Mutating,
}

/// Constant definition: `const name: Type = expr;`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ConstDef {
    /// Constant name.
    pub name: String,
    /// Type annotation.
    pub type_ann: TypeAnn,
    /// Value expression.
    pub value: Expr,
}

/// Use declaration: `use path::to::module;`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UseDecl {
    /// Path segments.
    pub path: Vec<String>,
}

/// A function parameter: `name: Type`
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Param {
    /// Parameter name.
    pub name: String,
    /// Parameter type.
    pub type_ann: TypeAnn,
}

/// A statement.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Stmt {
    /// Expression statement: `expr;`
    Expr(Expr),
    /// Let binding: `let name [: Type] = expr;`
    Let(LetStmt),
    /// Assignment: `name = expr;`
    Assign(AssignStmt),
    /// If/else statement.
    If(IfStmt),
    /// Return statement: `return expr?;`
    Return(ReturnStmt),
}

/// Let binding statement.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LetStmt {
    /// Binding name.
    pub name: String,
    /// Optional type annotation.
    pub type_ann: Option<TypeAnn>,
    /// Value expression.
    pub value: Expr,
}

/// Assignment statement.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AssignStmt {
    /// Target variable name.
    pub name: String,
    /// Value expression.
    pub value: Expr,
}

/// If statement with optional else clause.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct IfStmt {
    /// Condition expression.
    pub condition: Expr,
    /// Then-branch body.
    pub then_block: Vec<Stmt>,
    /// Optional else clause.
    pub else_clause: Option<ElseClause>,
}

/// Else clause: either a block or another if statement.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ElseClause {
    /// Else block: `else { ... }`
    Block(Vec<Stmt>),
    /// Else-if: `else if ... { ... }`
    If(Box<IfStmt>),
}

/// Return statement.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ReturnStmt {
    /// Optional return value.
    pub value: Option<Expr>,
}

/// An expression.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Expr {
    /// Integer literal.
    IntLit(i64),
    /// Boolean literal.
    BoolLit(bool),
    /// String literal.
    StrLit(String),
    /// Identifier (variable, function name, etc.).
    Ident(String),
    /// Binary operation.
    Binary {
        /// Operator.
        op: BinOp,
        /// Left operand.
        left: Box<Expr>,
        /// Right operand.
        right: Box<Expr>,
    },
    /// Unary operation.
    Unary {
        /// Operator.
        op: UnaryOp,
        /// Operand.
        operand: Box<Expr>,
    },
    /// Function call: `func(args)`
    Call {
        /// Function expression.
        func: Box<Expr>,
        /// Arguments (positional or named).
        args: Vec<CallArg>,
    },
    /// Member access: `object.field`
    Member {
        /// Object expression.
        object: Box<Expr>,
        /// Field name.
        field: String,
    },
    /// If expression: `if cond { then } else { ... }`
    If(Box<IfExpr>),
    /// Struct literal: `{ field: value, ... }`
    Struct(Vec<(String, Expr)>),
    /// List literal: `[expr, ...]`
    List(Vec<Expr>),
}

/// A function call argument.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CallArg {
    /// Positional argument: `expr`
    Positional(Expr),
    /// Named argument: `name: expr`
    Named {
        /// Argument name.
        name: String,
        /// Argument value.
        value: Expr,
    },
}

/// If expression (used in expression context).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct IfExpr {
    /// Condition.
    pub condition: Expr,
    /// Then-branch.
    pub then_block: Vec<Stmt>,
    /// Optional else clause.
    pub else_clause: Option<ElseClause>,
}

/// Binary operator.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BinOp {
    /// Addition.
    Add,
    /// Subtraction.
    Sub,
    /// Multiplication.
    Mul,
    /// Division.
    Div,
    /// Modulo.
    Mod,
    /// Equality.
    Eq,
    /// Inequality.
    Neq,
    /// Less than.
    Lt,
    /// Greater than.
    Gt,
    /// Less than or equal.
    Le,
    /// Greater than or equal.
    Ge,
    /// Logical AND.
    And,
    /// Logical OR.
    Or,
}

/// Unary operator.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnaryOp {
    /// Negation.
    Neg,
    /// Logical NOT.
    Not,
}

/// Type annotation.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TypeAnn {
    /// `int`
    Int,
    /// `bool`
    Bool,
    /// `str`
    Str,
    /// `unit`
    Unit,
    /// `entity`
    Entity,
    /// `Effect`
    Effect,
    /// Function type: `fn(params) -> Ret`
    FnType {
        /// Parameter types.
        params: Vec<TypeAnn>,
        /// Return type.
        ret: Box<TypeAnn>,
    },
    /// List type: `[T]`
    List(Box<TypeAnn>),
    /// Row type: `{ field: Type, ... }`
    Row(Vec<(String, TypeAnn)>),
    /// Named/user-defined type: e.g., custom type names
    Named(String),
}
