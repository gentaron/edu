//! Abstract Syntax Tree node definitions for the Apolon DSL.
//!
//! Defines all AST node types used by the parser and consumed by later
//! compilation stages (type checking, effect analysis, IR generation).

use crate::span::Span;

// ────────────────────────────────────────────────────────────
// Top-level program structure
// ────────────────────────────────────────────────────────────

/// A complete Apolon program: a sequence of module declarations.
#[derive(Debug, Clone, PartialEq)]
pub struct Program {
    pub modules: Vec<Module>,
}

/// A module declaration: `module path::name { ... }`
#[derive(Debug, Clone, PartialEq)]
pub struct Module {
    pub span: Span,
    pub path: Vec<String>,
    pub declarations: Vec<TopLevel>,
}

/// Top-level declarations inside a module.
#[derive(Debug, Clone, PartialEq)]
pub enum TopLevel {
    Import(ImportDecl),
    Card(CardDecl),
    Fn(FnDecl),
    Type(TypeDecl),
    Effect(EffectDecl),
    Let(LetDecl),
}

/// Import declaration: `import path::name [as alias]`
#[derive(Debug, Clone, PartialEq)]
pub struct ImportDecl {
    pub span: Span,
    pub path: Vec<String>,
    pub alias: Option<String>,
}

// ────────────────────────────────────────────────────────────
// Card declaration
// ────────────────────────────────────────────────────────────

/// Card declaration: `card name { ... }`
#[derive(Debug, Clone, PartialEq)]
pub struct CardDecl {
    pub span: Span,
    pub name: String,
    pub fields: Vec<CardField>,
}

/// Fields inside a card declaration.
#[derive(Debug, Clone, PartialEq)]
pub enum CardField {
    Meta(CardMetaField),
    Ability(CardAbilityDecl),
}

/// Metadata fields for a card (name, rarity, attack, etc.).
#[derive(Debug, Clone, PartialEq)]
pub enum CardMetaField {
    Name { span: Span, value: String },
    Rarity { span: Span, value: Rarity },
    Affiliation { span: Span, value: String },
    Attack { span: Span, value: i64 },
    Defense { span: Span, value: i64 },
    ImageUrl { span: Span, value: String },
    FlavorText { span: Span, value: String },
}

/// Card rarity levels.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Rarity {
    Common,
    Rare,
    SuperRare,
}

/// Card ability declaration.
#[derive(Debug, Clone, PartialEq)]
pub struct CardAbilityDecl {
    pub span: Span,
    pub name: String,
    pub params: Vec<Param>,
    pub return_type: TypeExpr,
    pub body: AbilityBody,
}

/// The body of a card ability — either a simple expression or an effect-annotated body.
#[derive(Debug, Clone, PartialEq)]
pub enum AbilityBody {
    Expr(Expr),
    Effect(Vec<EffectClause>),
}

/// An effect clause: `pure { ... }`, `view { ... }`, or `mut { ... }`.
#[derive(Debug, Clone, PartialEq)]
pub struct EffectClause {
    pub span: Span,
    pub effect_level: EffectLevel,
    pub stmts: Vec<Stmt>,
}

/// Effect level classification.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum EffectLevel {
    Pure,
    View,
    Mut,
}

/// Statements inside effect blocks.
#[derive(Debug, Clone, PartialEq)]
pub enum Stmt {
    Let(LetStmt),
    Expr(ExprStmt),
    Return(ReturnStmt),
}

/// Let statement with optional type annotation.
#[derive(Debug, Clone, PartialEq)]
pub struct LetStmt {
    pub span: Span,
    pub name: String,
    pub type_ann: Option<TypeExpr>,
    pub value: Expr,
}

/// Expression statement.
#[derive(Debug, Clone, PartialEq)]
pub struct ExprStmt {
    pub span: Span,
    pub expr: Expr,
}

/// Return statement.
#[derive(Debug, Clone, PartialEq)]
pub struct ReturnStmt {
    pub span: Span,
    pub expr: Expr,
}

// ────────────────────────────────────────────────────────────
// Function declaration
// ────────────────────────────────────────────────────────────

/// Function declaration: `fn name<...>(...) : RetType where ... = body`
#[derive(Debug, Clone, PartialEq)]
pub struct FnDecl {
    pub span: Span,
    pub name: String,
    pub type_params: Vec<String>,
    pub params: Vec<Param>,
    pub return_type: Option<TypeExpr>,
    pub constraints: Vec<Constraint>,
    pub body: Expr,
}

/// A function parameter: `name : Type`
#[derive(Debug, Clone, PartialEq)]
pub struct Param {
    pub span: Span,
    pub name: String,
    pub type_ann: TypeExpr,
}

/// A type constraint: `Ident : KindExpr`
#[derive(Debug, Clone, PartialEq)]
pub struct Constraint {
    pub span: Span,
    pub var: String,
    pub kind: KindExpr,
}

/// Kind expressions (simplified).
#[derive(Debug, Clone, PartialEq)]
pub enum KindExpr {
    Star,
    Arrow(Box<KindExpr>, Box<KindExpr>),
    Named(String),
}

// ────────────────────────────────────────────────────────────
// Type declarations
// ────────────────────────────────────────────────────────────

/// Type declaration: `type Name<T> = ...` or `alias Name<T> = ...`
#[derive(Debug, Clone, PartialEq)]
pub struct TypeDecl {
    pub span: Span,
    pub name: String,
    pub type_params: Vec<String>,
    pub body: TypeExpr,
    pub is_alias: bool,
}

/// Effect declaration: `effect name = pure | view | mut`
#[derive(Debug, Clone, PartialEq)]
pub struct EffectDecl {
    pub span: Span,
    pub name: String,
    pub spec: EffectLevel,
}

// ────────────────────────────────────────────────────────────
// Let declaration (top-level)
// ────────────────────────────────────────────────────────────

/// Top-level let declaration.
#[derive(Debug, Clone, PartialEq)]
pub struct LetDecl {
    pub span: Span,
    pub name: String,
    pub type_ann: Option<TypeExpr>,
    pub value: Expr,
}

// ────────────────────────────────────────────────────────────
// Type expressions
// ────────────────────────────────────────────────────────────

/// Type expressions in the Apolon type system.
#[derive(Debug, Clone, PartialEq)]
pub enum TypeExpr {
    /// Named type: `Int`, `Bool`, `String`, `Unit`, user-defined types.
    Named {
        span: Span,
        name: String,
    },
    /// Function type: `A -> B` (right-associative).
    Arrow {
        span: Span,
        param: Box<TypeExpr>,
        ret: Box<TypeExpr>,
    },
    /// Record type: `{#name: String, #age: Int | r}`
    Record {
        span: Span,
        fields: Vec<RowField>,
        rest: Option<Box<TypeExpr>>,
    },
    /// List type: `[T]`
    List {
        span: Span,
        element: Box<TypeExpr>,
    },
    /// Tuple type: `(A, B, C)`
    Tuple {
        span: Span,
        elements: Vec<TypeExpr>,
    },
    /// Row extension: `T + #label: U`
    RowExt {
        span: Span,
        base: Box<TypeExpr>,
        label: String,
        field_type: Box<TypeExpr>,
    },
    /// Type variable: `a`, `b`, etc.
    Var {
        span: Span,
        name: String,
    },
}

/// A labeled field in a record type: `#label : Type`
#[derive(Debug, Clone, PartialEq)]
pub struct RowField {
    pub span: Span,
    pub label: String,
    pub field_type: TypeExpr,
}

// ────────────────────────────────────────────────────────────
// Expressions
// ────────────────────────────────────────────────────────────

/// All expression variants in the Apolon language.
#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    /// Integer literal: `42`
    IntLit {
        span: Span,
        value: i64,
    },
    /// Boolean literal: `true`, `false`
    BoolLit {
        span: Span,
        value: bool,
    },
    /// String literal: `"hello"`
    StringLit {
        span: Span,
        value: String,
    },
    /// Variable reference: `x`
    Var {
        span: Span,
        name: String,
    },
    /// Constructor/upper-case identifier: `Some`, `None`, `true`
    Constructor {
        span: Span,
        name: String,
    },
    /// Function application: `f(x, y)`
    App {
        span: Span,
        func: Box<Expr>,
        args: Vec<Expr>,
    },
    /// Binary operation: `a + b`
    BinOp {
        span: Span,
        op: BinOp,
        left: Box<Expr>,
        right: Box<Expr>,
    },
    /// Unary operation: `!x`, `-x`
    UnaryOp {
        span: Span,
        op: UnaryOp,
        operand: Box<Expr>,
    },
    /// If-then-else: `if cond then a else b`
    If {
        span: Span,
        condition: Box<Expr>,
        then_branch: Box<Expr>,
        else_branch: Box<Expr>,
    },
    /// Pattern match: `match expr { pat => body, ... }`
    Match {
        span: Span,
        scrutinee: Box<Expr>,
        arms: Vec<MatchArm>,
    },
    /// Let binding: `let x = expr in body`
    Let {
        span: Span,
        name: String,
        type_ann: Option<TypeExpr>,
        value: Box<Expr>,
        body: Box<Expr>,
    },
    /// Lambda: `fn(x) => x` (sugar for let)
    Lambda {
        span: Span,
        params: Vec<Param>,
        body: Box<Expr>,
    },
    /// Record literal: `{#name: "Alice", #age: 30}`
    Record {
        span: Span,
        fields: Vec<RecordField>,
    },
    /// Field access: `r.name`
    FieldAccess {
        span: Span,
        record: Box<Expr>,
        field: String,
    },
    /// Pipe operator: `expr |> f`
    Pipe {
        span: Span,
        left: Box<Expr>,
        right: String,
    },
    /// List cons: `x :: xs`
    Cons {
        span: Span,
        head: Box<Expr>,
        tail: Box<Expr>,
    },
    /// List literal: `[1, 2, 3]`
    List {
        span: Span,
        elements: Vec<Expr>,
    },
    /// Unit literal: `()` (represented as empty tuple)
    Unit {
        span: Span,
    },
}

/// A field in a record literal: `#label = expr`
#[derive(Debug, Clone, PartialEq)]
pub struct RecordField {
    pub span: Span,
    pub label: String,
    pub value: Expr,
}

/// A match arm: `pattern => expr`
#[derive(Debug, Clone, PartialEq)]
pub struct MatchArm {
    pub span: Span,
    pub pattern: Pattern,
    pub body: Expr,
}

/// Pattern variants for pattern matching.
#[derive(Debug, Clone, PartialEq)]
pub enum Pattern {
    /// Integer pattern: `42`
    Int {
        span: Span,
        value: i64,
    },
    /// Boolean pattern: `true`, `false`
    Bool {
        span: Span,
        value: bool,
    },
    /// String pattern: `"hello"`
    String {
        span: Span,
        value: String,
    },
    /// Wildcard pattern: `_`
    Wildcard {
        span: Span,
    },
    /// Variable binding pattern: `x`
    Var {
        span: Span,
        name: String,
    },
    /// Constructor pattern: `Some(x)`, `None`
    Constructor {
        span: Span,
        name: String,
        args: Vec<Pattern>,
    },
    /// Tuple pattern: `(a, b, c)`
    Tuple {
        span: Span,
        elements: Vec<Pattern>,
    },
}

// ────────────────────────────────────────────────────────────
// Operators
// ────────────────────────────────────────────────────────────

/// Binary operators.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BinOp {
    // Arithmetic
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    // Comparison
    Eq,
    Neq,
    Lt,
    Gt,
    Le,
    Ge,
    // Logical
    And,
    Or,
}

impl BinOp {
    /// Returns the precedence level of the operator (higher binds tighter).
    #[must_use]
    pub fn precedence(&self) -> u8 {
        match self {
            Self::Or => 1,
            Self::And => 2,
            Self::Eq | Self::Neq | Self::Lt | Self::Gt | Self::Le | Self::Ge => 3,
            Self::Add | Self::Sub => 4,
            Self::Mul | Self::Div | Self::Mod => 5,
        }
    }

    /// Returns the symbol string for the operator.
    #[must_use]
    pub fn symbol(&self) -> &'static str {
        match self {
            Self::Add => "+",
            Self::Sub => "-",
            Self::Mul => "*",
            Self::Div => "/",
            Self::Mod => "%",
            Self::Eq => "==",
            Self::Neq => "!=",
            Self::Lt => "<",
            Self::Gt => ">",
            Self::Le => "<=",
            Self::Ge => ">=",
            Self::And => "&&",
            Self::Or => "||",
        }
    }
}

/// Unary operators.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum UnaryOp {
    Neg,  // `-x`
    Not,  // `!x`
}

impl UnaryOp {
    /// Returns the symbol string for the operator.
    #[must_use]
    pub fn symbol(&self) -> &'static str {
        match self {
            Self::Neg => "-",
            Self::Not => "!",
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn program_empty() {
        let p = Program { modules: vec![] };
        assert!(p.modules.is_empty());
    }

    #[test]
    fn module_creation() {
        let m = Module {
            span: Span::dummy(),
            path: vec!["cards".to_string(), "diana".to_string()],
            declarations: vec![],
        };
        assert_eq!(m.path.len(), 2);
    }

    #[test]
    fn card_decl_basic() {
        let c = CardDecl {
            span: Span::dummy(),
            name: "diana".to_string(),
            fields: vec![],
        };
        assert_eq!(c.name, "diana");
    }

    #[test]
    fn card_meta_field_name() {
        let f = CardMetaField::Name {
            span: Span::dummy(),
            value: "Diana".to_string(),
        };
        assert_eq!(f.rarity_or_name(), "Diana");
    }

    #[test]
    fn card_meta_field_rarity() {
        let f = CardMetaField::Rarity {
            span: Span::dummy(),
            value: Rarity::SuperRare,
        };
        assert_eq!(f.rarity_or_name(), "SR");
    }

    #[test]
    fn rarity_eq() {
        assert_eq!(Rarity::Common, Rarity::Common);
        assert_ne!(Rarity::Common, Rarity::Rare);
    }

    #[test]
    fn effect_level_ordering() {
        assert!(EffectLevel::Pure < EffectLevel::View);
        assert!(EffectLevel::View < EffectLevel::Mut);
    }

    #[test]
    fn expr_int_lit() {
        let e = Expr::IntLit {
            span: Span::dummy(),
            value: 42,
        };
        assert_eq!(e.as_int(), Some(42));
    }

    #[test]
    fn expr_bool_lit() {
        let e = Expr::BoolLit {
            span: Span::dummy(),
            value: true,
        };
        assert_eq!(e.as_bool(), Some(true));
    }

    #[test]
    fn expr_string_lit() {
        let e = Expr::StringLit {
            span: Span::dummy(),
            value: "hello".to_string(),
        };
        assert_eq!(e.as_string(), Some("hello"));
    }

    #[test]
    fn binop_precedence() {
        assert!(BinOp::Mul.precedence() > BinOp::Add.precedence());
        assert!(BinOp::Add.precedence() > BinOp::Eq.precedence());
        assert!(BinOp::Eq.precedence() > BinOp::And.precedence());
    }

    #[test]
    fn binop_symbols() {
        assert_eq!(BinOp::Add.symbol(), "+");
        assert_eq!(BinOp::Eq.symbol(), "==");
        assert_eq!(BinOp::And.symbol(), "&&");
    }

    #[test]
    fn unaryop_symbols() {
        assert_eq!(UnaryOp::Neg.symbol(), "-");
        assert_eq!(UnaryOp::Not.symbol(), "!");
    }

    #[test]
    fn type_expr_named() {
        let t = TypeExpr::Named {
            span: Span::dummy(),
            name: "Int".to_string(),
        };
        assert_eq!(t.type_name(), Some("Int"));
    }

    #[test]
    fn type_expr_arrow() {
        let t = TypeExpr::Arrow {
            span: Span::dummy(),
            param: Box::new(TypeExpr::Named {
                span: Span::dummy(),
                name: "Int".to_string(),
            }),
            ret: Box::new(TypeExpr::Named {
                span: Span::dummy(),
                name: "Bool".to_string(),
            }),
        };
        assert_eq!(t.type_name(), None);
    }

    #[test]
    fn pattern_wildcard() {
        let p = Pattern::Wildcard {
            span: Span::dummy(),
        };
        assert!(p.is_wildcard());
    }

    #[test]
    fn pattern_var() {
        let p = Pattern::Var {
            span: Span::dummy(),
            name: "x".to_string(),
        };
        assert!(!p.is_wildcard());
        assert_eq!(p.as_var(), Some("x"));
    }

    #[test]
    fn param_creation() {
        let p = Param {
            span: Span::dummy(),
            name: "x".to_string(),
            type_ann: TypeExpr::Named {
                span: Span::dummy(),
                name: "Int".to_string(),
            },
        };
        assert_eq!(p.name, "x");
    }

    #[test]
    fn fn_decl_no_type_params() {
        let f = FnDecl {
            span: Span::dummy(),
            name: "add".to_string(),
            type_params: vec![],
            params: vec![],
            return_type: None,
            constraints: vec![],
            body: Expr::IntLit {
                span: Span::dummy(),
                value: 0,
            },
        };
        assert_eq!(f.name, "add");
        assert!(f.type_params.is_empty());
    }

    #[test]
    fn import_decl_basic() {
        let i = ImportDecl {
            span: Span::dummy(),
            path: vec!["prelude".to_string()],
            alias: None,
        };
        assert!(i.alias.is_none());
    }

    #[test]
    fn import_decl_with_alias() {
        let i = ImportDecl {
            span: Span::dummy(),
            path: vec!["cards".to_string(), "diana".to_string()],
            alias: Some("d".to_string()),
        };
        assert_eq!(i.alias.as_deref(), Some("d"));
    }

    #[test]
    fn type_decl_alias() {
        let t = TypeDecl {
            span: Span::dummy(),
            name: "MyInt".to_string(),
            type_params: vec![],
            body: TypeExpr::Named {
                span: Span::dummy(),
                name: "Int".to_string(),
            },
            is_alias: true,
        };
        assert!(t.is_alias);
    }

    #[test]
    fn effect_decl() {
        let e = EffectDecl {
            span: Span::dummy(),
            name: "my_effect".to_string(),
            spec: EffectLevel::Mut,
        };
        assert_eq!(e.spec, EffectLevel::Mut);
    }

    #[test]
    fn match_arm() {
        let arm = MatchArm {
            span: Span::dummy(),
            pattern: Pattern::Wildcard {
                span: Span::dummy(),
            },
            body: Expr::IntLit {
                span: Span::dummy(),
                value: 0,
            },
        };
        assert!(arm.pattern.is_wildcard());
    }

    #[test]
    fn constraint_creation() {
        let c = Constraint {
            span: Span::dummy(),
            var: "a".to_string(),
            kind: KindExpr::Star,
        };
        assert_eq!(c.var, "a");
    }

    #[test]
    fn record_field_creation() {
        let rf = RecordField {
            span: Span::dummy(),
            label: "name".to_string(),
            value: Expr::StringLit {
                span: Span::dummy(),
                value: "Alice".to_string(),
            },
        };
        assert_eq!(rf.label, "name");
    }

    #[test]
    fn expr_var() {
        let e = Expr::Var {
            span: Span::dummy(),
            name: "x".to_string(),
        };
        assert_eq!(e.as_var_name(), Some("x"));
    }

    #[test]
    fn expr_list() {
        let e = Expr::List {
            span: Span::dummy(),
            elements: vec![
                Expr::IntLit {
                    span: Span::dummy(),
                    value: 1,
                },
                Expr::IntLit {
                    span: Span::dummy(),
                    value: 2,
                },
            ],
        };
        assert_eq!(e.as_list_len(), Some(2));
    }

    #[test]
    fn ability_body_expr() {
        let b = AbilityBody::Expr(Expr::IntLit {
            span: Span::dummy(),
            value: 42,
        });
        assert!(b.is_expr());
    }

    #[test]
    fn ability_body_effect() {
        let b = AbilityBody::Effect(vec![EffectClause {
            span: Span::dummy(),
            effect_level: EffectLevel::Pure,
            stmts: vec![],
        }]);
        assert!(!b.is_expr());
    }

    #[test]
    fn let_stmt() {
        let s = Stmt::Let(LetStmt {
            span: Span::dummy(),
            name: "x".to_string(),
            type_ann: None,
            value: Expr::IntLit {
                span: Span::dummy(),
                value: 42,
            },
        });
        assert!(s.is_let());
    }

    #[test]
    fn stmt_return() {
        let s = Stmt::Return(ReturnStmt {
            span: Span::dummy(),
            expr: Expr::IntLit {
                span: Span::dummy(),
                value: 0,
            },
        });
        assert!(s.is_return());
    }

    #[test]
    fn expr_pipe() {
        let e = Expr::Pipe {
            span: Span::dummy(),
            left: Box::new(Expr::Var {
                span: Span::dummy(),
                name: "x".to_string(),
            }),
            right: "f".to_string(),
        };
        assert!(e.is_pipe());
    }

    #[test]
    fn expr_cons() {
        let e = Expr::Cons {
            span: Span::dummy(),
            head: Box::new(Expr::IntLit {
                span: Span::dummy(),
                value: 1,
            }),
            tail: Box::new(Expr::Var {
                span: Span::dummy(),
                name: "xs".to_string(),
            }),
        };
        assert!(e.is_cons());
    }
}

// ────────────────────────────────────────────────────────────
// Helper trait impls for tests
// ────────────────────────────────────────────────────────────

impl CardMetaField {
    /// Get a string representation of the field value for testing.
    fn rarity_or_name(&self) -> &str {
        match self {
            Self::Name { value, .. } => value,
            Self::Rarity { value, .. } => match value {
                Rarity::Common => "C",
                Rarity::Rare => "R",
                Rarity::SuperRare => "SR",
            },
            Self::Affiliation { value, .. } => value,
            Self::Attack { .. } => "attack",
            Self::Defense { .. } => "defense",
            Self::ImageUrl { value, .. } => value,
            Self::FlavorText { value, .. } => value,
        }
    }
}

impl Expr {
    fn as_int(&self) -> Option<i64> {
        match self {
            Self::IntLit { value, .. } => Some(*value),
            _ => None,
        }
    }

    fn as_bool(&self) -> Option<bool> {
        match self {
            Self::BoolLit { value, .. } => Some(*value),
            _ => None,
        }
    }

    fn as_string(&self) -> Option<&str> {
        match self {
            Self::StringLit { value, .. } => Some(value),
            _ => None,
        }
    }

    fn as_var_name(&self) -> Option<&str> {
        match self {
            Self::Var { name, .. } => Some(name),
            _ => None,
        }
    }

    fn as_list_len(&self) -> Option<usize> {
        match self {
            Self::List { elements, .. } => Some(elements.len()),
            _ => None,
        }
    }

    fn is_pipe(&self) -> bool {
        matches!(self, Self::Pipe { .. })
    }

    fn is_cons(&self) -> bool {
        matches!(self, Self::Cons { .. })
    }
}

impl TypeExpr {
    fn type_name(&self) -> Option<&str> {
        match self {
            Self::Named { name, .. } => Some(name),
            _ => None,
        }
    }
}

impl Pattern {
    fn is_wildcard(&self) -> bool {
        matches!(self, Self::Wildcard { .. })
    }

    fn as_var(&self) -> Option<&str> {
        match self {
            Self::Var { name, .. } => Some(name),
            _ => None,
        }
    }
}

impl AbilityBody {
    fn is_expr(&self) -> bool {
        matches!(self, Self::Expr(_))
    }
}

impl Stmt {
    fn is_let(&self) -> bool {
        matches!(self, Self::Let(_))
    }

    fn is_return(&self) -> bool {
        matches!(self, Self::Return(_))
    }
}
