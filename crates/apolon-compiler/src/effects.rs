//! Three-level effect system for the Apolon DSL.
//!
//! Every function and ability is classified by its effect level:
//! - **Pure** (L0): No side effects
//! - **View** (L1): May read BattleState but not modify it
//! - **Mut** (L2): May read and write BattleState
//!
//! The effect system performs bottom-up inference of effect levels from function
//! calls, and rejects violations (pure calling mut, view calling mut).

use crate::ast::{Expr, Stmt};
pub use crate::ast::EffectLevel;
use crate::span::Span;
use std::collections::HashMap;
use std::fmt;

impl fmt::Display for EffectLevel {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Pure => write!(f, "pure"),
            Self::View => write!(f, "view"),
            Self::Mut => write!(f, "mut"),
        }
    }
}

/// Effect system errors.
#[derive(Debug, Clone, PartialEq)]
pub enum EffectError {
    /// A pure function calls a view or mut function.
    PureViolation {
        function_name: String,
        called_name: String,
        called_level: EffectLevel,
        span: Span,
    },
    /// A view function calls a mut function.
    ViewViolation {
        function_name: String,
        called_name: String,
        span: Span,
    },
    /// Missing effect annotation where required.
    MissingAnnotation {
        function_name: String,
        inferred_level: EffectLevel,
        span: Span,
    },
}

impl fmt::Display for EffectError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::PureViolation {
                function_name,
                called_name,
                called_level,
                ..
            } => {
                write!(
                    f,
                    "[E0005] effect violation: pure function '{}' calls {} function '{}'",
                    function_name, called_level, called_name
                )
            }
            Self::ViewViolation {
                function_name,
                called_name,
                ..
            } => {
                write!(
                    f,
                    "[E0005] effect violation: view function '{}' calls mut function '{}'",
                    function_name, called_name
                )
            }
            Self::MissingAnnotation {
                function_name,
                inferred_level,
                ..
            } => {
                write!(
                    f,
                    "[E0007] function '{}' has inferred effect level {} but lacks effect annotation",
                    function_name, inferred_level
                )
            }
        }
    }
}

impl std::error::Error for EffectError {}

impl EffectError {
    /// Get the error code (always "E0005" for effect violations, "E0007" for missing annotations).
    #[must_use]
    pub fn code(&self) -> &'static str {
        match self {
            Self::PureViolation { .. } | Self::ViewViolation { .. } => "E0005",
            Self::MissingAnnotation { .. } => "E0007",
        }
    }
}

/// An entry in the effect environment mapping function names to their effect levels.
#[derive(Debug, Clone, PartialEq)]
pub struct EffectInfo {
    /// The declared (or inferred) effect level of the function.
    pub level: EffectLevel,
    /// Whether the function was explicitly annotated.
    pub annotated: bool,
    /// Source span for error reporting.
    pub span: Span,
}

/// The effect environment tracks the effect level of all known functions.
#[derive(Debug, Clone)]
pub struct EffectEnv {
    bindings: HashMap<String, EffectInfo>,
}

impl EffectEnv {
    /// Create a new empty effect environment.
    #[must_use]
    pub fn new() -> Self {
        Self {
            bindings: HashMap::new(),
        }
    }

    /// Create an environment pre-populated with the Apolon prelude effect info.
    #[must_use]
    pub fn prelude() -> Self {
        let mut env = Self::new();

        // Pure prelude functions
        let pure_fns = [
            "add", "sub", "mul", "div", "mod", "clamp", "max", "min",
            "eq", "ne", "lt", "le", "gt", "ge", "not", "and", "or",
            "len", "nth", "map", "foldl", "filter", "append", "concat",
            "str_len", "str_concat", "str_eq", "str_contains",
            "apply_effect_type", "classify_effect", "make_result",
        ];

        for name in &pure_fns {
            env.bind(name, EffectLevel::Pure, true);
        }

        // View functions
        let view_fns = [
            "get_turn", "get_enemy_hp", "get_field", "get_shield_buffer", "is_poison_active",
        ];

        for name in &view_fns {
            env.bind(name, EffectLevel::View, true);
        }

        // Mut functions
        let mut_fns = [
            "deal_damage", "heal_target", "apply_shield", "reduce_attack",
            "log_message", "advance_turn",
        ];

        for name in &mut_fns {
            env.bind(name, EffectLevel::Mut, true);
        }

        env
    }

    /// Register a function with its effect level.
    pub fn bind(&mut self, name: &str, level: EffectLevel, annotated: bool) {
        self.bindings.insert(
            name.to_string(),
            EffectInfo {
                level,
                annotated,
                span: Span::dummy(),
            },
        );
    }

    /// Register a function with its effect level and source span.
    pub fn bind_with_span(&mut self, name: &str, level: EffectLevel, annotated: bool, span: Span) {
        self.bindings.insert(
            name.to_string(),
            EffectInfo {
                level,
                annotated,
                span,
            },
        );
    }

    /// Look up the effect level of a function.
    #[must_use]
    pub fn lookup(&self, name: &str) -> Option<&EffectInfo> {
        self.bindings.get(name)
    }

    /// Get just the effect level for a function.
    #[must_use]
    pub fn get_level(&self, name: &str) -> Option<EffectLevel> {
        self.bindings.get(name).map(|info| info.level)
    }

    /// Get all registered function names.
    #[must_use]
    pub fn function_names(&self) -> Vec<&str> {
        self.bindings.keys().map(String::as_str).collect()
    }
}

impl Default for EffectEnv {
    fn default() -> Self {
        Self::new()
    }
}

/// Infer the effect level of an expression.
///
/// Bottom-up inference: the effect level of an expression is the maximum
/// of all effect levels of function calls within it.
#[must_use]
pub fn infer_expr_effect(env: &EffectEnv, expr: &Expr) -> EffectLevel {
    match expr {
        Expr::IntLit { .. }
        | Expr::BoolLit { .. }
        | Expr::StringLit { .. }
        | Expr::Var { .. }
        | Expr::Constructor { .. }
        | Expr::Unit { .. }
        | Expr::List { .. }
        | Expr::Record { .. } => EffectLevel::Pure,

        Expr::BinOp { left, right, .. } => {
            infer_expr_effect(env, left).max(infer_expr_effect(env, right))
        }

        Expr::UnaryOp { operand, .. } => infer_expr_effect(env, operand),

        Expr::If {
            condition,
            then_branch,
            else_branch,
            ..
        } => infer_expr_effect(env, condition)
            .max(infer_expr_effect(env, then_branch))
            .max(infer_expr_effect(env, else_branch)),

        Expr::Let { value, body, .. } => {
            infer_expr_effect(env, value).max(infer_expr_effect(env, body))
        }

        Expr::Lambda { body, .. } => infer_expr_effect(env, body),

        Expr::App { func, args, .. } => {
            // Get effect level of the called function
            let func_effect = match func.as_ref() {
                Expr::Var { name, .. } => env.get_level(name).unwrap_or(EffectLevel::Pure),
                _ => infer_expr_effect(env, func),
            };

            let args_effect = args
                .iter()
                .map(|a| infer_expr_effect(env, a))
                .max()
                .unwrap_or(EffectLevel::Pure);

            func_effect.max(args_effect)
        }

        Expr::FieldAccess { record, .. } => infer_expr_effect(env, record),

        Expr::Pipe { left, right, .. } => {
            let left_effect = infer_expr_effect(env, left);
            let right_effect = env.get_level(right).unwrap_or(EffectLevel::Pure);
            left_effect.max(right_effect)
        }

        Expr::Cons { head, tail, .. } => {
            infer_expr_effect(env, head).max(infer_expr_effect(env, tail))
        }

        Expr::Match { scrutinee, arms, .. } => {
            let scrutinee_effect = infer_expr_effect(env, scrutinee);
            let arms_effect = arms
                .iter()
                .map(|arm| infer_expr_effect(env, &arm.body))
                .max()
                .unwrap_or(EffectLevel::Pure);
            scrutinee_effect.max(arms_effect)
        }
    }
}

/// Infer the effect level of a statement.
#[must_use]
pub fn infer_stmt_effect(env: &EffectEnv, stmt: &Stmt) -> EffectLevel {
    match stmt {
        Stmt::Let(l) => infer_expr_effect(env, &l.value),
        Stmt::Expr(e) => infer_expr_effect(env, &e.expr),
        Stmt::Return(r) => infer_expr_effect(env, &r.expr),
    }
}

/// Check effect compatibility between a declared effect level and the inferred one.
///
/// Returns an error if there is a violation.
pub fn check_effect(
    env: &EffectEnv,
    function_name: &str,
    declared_level: EffectLevel,
    inferred_level: EffectLevel,
    span: Span,
) -> Result<(), EffectError> {
    if inferred_level > declared_level {
        match (declared_level, inferred_level) {
            (EffectLevel::Pure, EffectLevel::View) => {
                // Find the violating call for error message
                return Err(EffectError::PureViolation {
                    function_name: function_name.to_string(),
                    called_name: "view function".to_string(),
                    called_level: EffectLevel::View,
                    span,
                });
            }
            (EffectLevel::Pure, EffectLevel::Mut) => {
                return Err(EffectError::PureViolation {
                    function_name: function_name.to_string(),
                    called_name: "mut function".to_string(),
                    called_level: EffectLevel::Mut,
                    span,
                });
            }
            (EffectLevel::View, EffectLevel::Mut) => {
                return Err(EffectError::ViewViolation {
                    function_name: function_name.to_string(),
                    called_name: "mut function".to_string(),
                    span,
                });
            }
            _ => {}
        }
    }
    Ok(())
}

/// Check whether a specific function call violates the current effect context.
///
/// This is a more granular check that identifies the specific violating call.
pub fn check_call_effect(
    env: &EffectEnv,
    caller_name: &str,
    caller_level: EffectLevel,
    callee_name: &str,
    callee_level: EffectLevel,
    span: Span,
) -> Result<(), EffectError> {
    if callee_level > caller_level {
        match (caller_level, callee_level) {
            (EffectLevel::Pure, _) => Err(EffectError::PureViolation {
                function_name: caller_name.to_string(),
                called_name: callee_name.to_string(),
                called_level: callee_level,
                span,
            }),
            (EffectLevel::View, EffectLevel::Mut) => Err(EffectError::ViewViolation {
                function_name: caller_name.to_string(),
                called_name: callee_name.to_string(),
                span,
            }),
            _ => Ok(()),
        }
    } else {
        Ok(())
    }
}

/// Collect all function calls within an expression, returning their names and spans.
pub fn collect_calls(expr: &Expr) -> Vec<(&str, Span)> {
    let mut calls: Vec<(&str, Span)> = Vec::new();

    fn walk<'a>(expr: &'a Expr, calls: &mut Vec<(&'a str, Span)>) {
        match expr {
            Expr::IntLit { .. }
            | Expr::BoolLit { .. }
            | Expr::StringLit { .. }
            | Expr::Var { .. }
            | Expr::Constructor { .. }
            | Expr::Unit { .. }
            | Expr::List { .. }
            | Expr::Record { .. } => {}

            Expr::BinOp { left, right, .. } => {
                walk(left, calls);
                walk(right, calls);
            }
            Expr::UnaryOp { operand, .. } => {
                walk(operand, calls);
            }
            Expr::If {
                condition,
                then_branch,
                else_branch,
                ..
            } => {
                walk(condition, calls);
                walk(then_branch, calls);
                walk(else_branch, calls);
            }
            Expr::Let { value, body, .. } => {
                walk(value, calls);
                walk(body, calls);
            }
            Expr::Lambda { body, .. } => {
                walk(body, calls);
            }
            Expr::App { func, args, .. } => {
                match func.as_ref() {
                    Expr::Var { name, span } => {
                        calls.push((name.as_str(), *span));
                    }
                    _ => {
                        walk(func, calls);
                    }
                }
                for arg in args {
                    walk(arg, calls);
                }
            }
            Expr::FieldAccess { record, .. } => {
                walk(record, calls);
            }
            Expr::Pipe { left, .. } => {
                walk(left, calls);
            }
            Expr::Cons { head, tail, .. } => {
                walk(head, calls);
                walk(tail, calls);
            }
            Expr::Match { scrutinee, arms, .. } => {
                walk(scrutinee, calls);
                for arm in arms {
                    walk(&arm.body, calls);
                }
            }
        }
    }

    walk(expr, &mut calls);
    calls
}

/// Validate all effect constraints in an expression against a caller's effect level.
pub fn validate_effects(
    env: &EffectEnv,
    caller_name: &str,
    caller_level: EffectLevel,
    expr: &Expr,
) -> Result<(), EffectError> {
    let calls = collect_calls(expr);

    for (callee_name, span) in &calls {
        if let Some(callee_level) = env.get_level(callee_name) {
            check_call_effect(env, caller_name, caller_level, callee_name, callee_level, *span)?;
        }
    }

    // Also validate nested expressions
    match expr {
        Expr::BinOp { left, right, .. } => {
            validate_effects(env, caller_name, caller_level, left)?;
            validate_effects(env, caller_name, caller_level, right)?;
        }
        Expr::UnaryOp { operand, .. } => {
            validate_effects(env, caller_name, caller_level, operand)?;
        }
        Expr::If {
            condition,
            then_branch,
            else_branch,
            ..
        } => {
            validate_effects(env, caller_name, caller_level, condition)?;
            validate_effects(env, caller_name, caller_level, then_branch)?;
            validate_effects(env, caller_name, caller_level, else_branch)?;
        }
        Expr::Let { value, body, .. } => {
            validate_effects(env, caller_name, caller_level, value)?;
            validate_effects(env, caller_name, caller_level, body)?;
        }
        Expr::Match { scrutinee, arms, .. } => {
            validate_effects(env, caller_name, caller_level, scrutinee)?;
            for arm in arms {
                validate_effects(env, caller_name, caller_level, &arm.body)?;
            }
        }
        Expr::App { func, args, .. } => {
            validate_effects(env, caller_name, caller_level, func)?;
            for arg in args {
                validate_effects(env, caller_name, caller_level, arg)?;
            }
        }
        Expr::Cons { head, tail, .. } => {
            validate_effects(env, caller_name, caller_level, head)?;
            validate_effects(env, caller_name, caller_level, tail)?;
        }
        Expr::FieldAccess { record, .. } => {
            validate_effects(env, caller_name, caller_level, record)?;
        }
        Expr::Pipe { left, .. } => {
            validate_effects(env, caller_name, caller_level, left)?;
        }
        Expr::List { elements, .. } => {
            for elem in elements {
                validate_effects(env, caller_name, caller_level, elem)?;
            }
        }
        Expr::Record { fields, .. } => {
            for field in fields {
                validate_effects(env, caller_name, caller_level, &field.value)?;
            }
        }
        Expr::Lambda { body, .. } => {
            validate_effects(env, caller_name, caller_level, body)?;
        }
        _ => {}
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn i64_val(v: i64) -> Expr {
        Expr::IntLit {
            span: Span::dummy(),
            value: v,
        }
    }

    fn bool_val(v: bool) -> Expr {
        Expr::BoolLit {
            span: Span::dummy(),
            value: v,
        }
    }

    fn var(name: &str) -> Expr {
        Expr::Var {
            span: Span::dummy(),
            name: name.to_string(),
        }
    }

    fn app(name: &str, args: Vec<Expr>) -> Expr {
        Expr::App {
            span: Span::dummy(),
            func: Box::new(var(name)),
            args,
        }
    }

    fn bin(op: crate::ast::BinOp, l: Expr, r: Expr) -> Expr {
        Expr::BinOp {
            span: Span::dummy(),
            op,
            left: Box::new(l),
            right: Box::new(r),
        }
    }

    // ─── EffectEnv tests ───

    #[test]
    fn env_new() {
        let env = EffectEnv::new();
        assert!(env.lookup("foo").is_none());
    }

    #[test]
    fn env_bind_and_lookup() {
        let mut env = EffectEnv::new();
        env.bind("f", EffectLevel::Pure, true);
        assert_eq!(env.get_level("f"), Some(EffectLevel::Pure));
    }

    #[test]
    fn env_prelude_has_pure() {
        let env = EffectEnv::prelude();
        assert_eq!(env.get_level("add"), Some(EffectLevel::Pure));
        assert_eq!(env.get_level("make_result"), Some(EffectLevel::Pure));
    }

    #[test]
    fn env_prelude_has_view() {
        let env = EffectEnv::prelude();
        assert_eq!(env.get_level("get_turn"), Some(EffectLevel::View));
        assert_eq!(env.get_level("get_enemy_hp"), Some(EffectLevel::View));
    }

    #[test]
    fn env_prelude_has_mut() {
        let env = EffectEnv::prelude();
        assert_eq!(env.get_level("deal_damage"), Some(EffectLevel::Mut));
        assert_eq!(env.get_level("heal_target"), Some(EffectLevel::Mut));
    }

    #[test]
    fn env_function_names() {
        let env = EffectEnv::prelude();
        let names = env.function_names();
        assert!(names.contains(&"add"));
        assert!(names.contains(&"deal_damage"));
    }

    #[test]
    fn env_bind_with_span() {
        let mut env = EffectEnv::new();
        let span = Span::with_line_col(0, 5, 1, 1, 1, 6);
        env.bind_with_span("f", EffectLevel::Pure, true, span);
        let info = env.lookup("f").unwrap();
        assert_eq!(info.span.start, 0);
    }

    // ─── Effect inference tests ───

    #[test]
    fn infer_pure_literal() {
        let env = EffectEnv::new();
        assert_eq!(infer_expr_effect(&env, &i64_val(42)), EffectLevel::Pure);
    }

    #[test]
    fn infer_pure_variable() {
        let env = EffectEnv::new();
        assert_eq!(infer_expr_effect(&env, &var("x")), EffectLevel::Pure);
    }

    #[test]
    fn infer_pure_binop() {
        let env = EffectEnv::new();
        let expr = bin(crate::ast::BinOp::Add, i64_val(1), i64_val(2));
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Pure);
    }

    #[test]
    fn infer_pure_function_call() {
        let env = EffectEnv::prelude();
        let expr = app("add", vec![i64_val(1), i64_val(2)]);
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Pure);
    }

    #[test]
    fn infer_view_function_call() {
        let env = EffectEnv::prelude();
        let expr = app("get_turn", vec![var("state")]);
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::View);
    }

    #[test]
    fn infer_mut_function_call() {
        let env = EffectEnv::prelude();
        let expr = app("deal_damage", vec![var("state"), i64_val(10)]);
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Mut);
    }

    #[test]
    fn infer_nested_mut_call() {
        let env = EffectEnv::prelude();
        // let x = deal_damage(state, 10) in x
        let expr = Expr::Let {
            span: Span::dummy(),
            name: "x".to_string(),
            type_ann: None,
            value: Box::new(app("deal_damage", vec![var("state"), i64_val(10)])),
            body: Box::new(var("x")),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Mut);
    }

    #[test]
    fn infer_if_with_mut_branch() {
        let env = EffectEnv::prelude();
        let expr = Expr::If {
            span: Span::dummy(),
            condition: Box::new(bool_val(true)),
            then_branch: Box::new(app("deal_damage", vec![var("state"), i64_val(10)])),
            else_branch: Box::new(i64_val(0)),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Mut);
    }

    #[test]
    fn infer_if_both_pure() {
        let env = EffectEnv::prelude();
        let expr = Expr::If {
            span: Span::dummy(),
            condition: Box::new(bool_val(true)),
            then_branch: Box::new(i64_val(1)),
            else_branch: Box::new(i64_val(2)),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Pure);
    }

    #[test]
    fn infer_match_with_mixed_effects() {
        let env = EffectEnv::prelude();
        let expr = Expr::Match {
            span: Span::dummy(),
            scrutinee: Box::new(var("x")),
            arms: vec![
                crate::ast::MatchArm {
                    span: Span::dummy(),
                    pattern: crate::ast::Pattern::Int {
                        span: Span::dummy(),
                        value: 0,
                    },
                    body: app("deal_damage", vec![var("state"), i64_val(10)]),
                },
                crate::ast::MatchArm {
                    span: Span::dummy(),
                    pattern: crate::ast::Pattern::Wildcard {
                        span: Span::dummy(),
                    },
                    body: i64_val(0),
                },
            ],
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Mut);
    }

    #[test]
    fn infer_pipe_with_mut() {
        let env = EffectEnv::prelude();
        let expr = Expr::Pipe {
            span: Span::dummy(),
            left: Box::new(var("state")),
            right: "deal_damage".to_string(),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Mut);
    }

    #[test]
    fn infer_unary_pure() {
        let env = EffectEnv::new();
        let expr = Expr::UnaryOp {
            span: Span::dummy(),
            op: crate::ast::UnaryOp::Neg,
            operand: Box::new(i64_val(5)),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Pure);
    }

    #[test]
    fn infer_cons_pure() {
        let env = EffectEnv::new();
        let expr = Expr::Cons {
            span: Span::dummy(),
            head: Box::new(i64_val(1)),
            tail: Box::new(var("xs")),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Pure);
    }

    // ─── Effect checking tests ───

    #[test]
    fn check_pure_calling_pure_ok() {
        let env = EffectEnv::prelude();
        assert!(check_effect(&env, "f", EffectLevel::Pure, EffectLevel::Pure, Span::dummy()).is_ok());
    }

    #[test]
    fn check_view_calling_view_ok() {
        let env = EffectEnv::prelude();
        assert!(check_effect(&env, "f", EffectLevel::View, EffectLevel::View, Span::dummy()).is_ok());
    }

    #[test]
    fn check_mut_calling_mut_ok() {
        let env = EffectEnv::prelude();
        assert!(check_effect(&env, "f", EffectLevel::Mut, EffectLevel::Mut, Span::dummy()).is_ok());
    }

    #[test]
    fn check_view_calling_pure_ok() {
        let env = EffectEnv::prelude();
        assert!(check_effect(&env, "f", EffectLevel::View, EffectLevel::Pure, Span::dummy()).is_ok());
    }

    #[test]
    fn check_mut_calling_pure_ok() {
        let env = EffectEnv::prelude();
        assert!(check_effect(&env, "f", EffectLevel::Mut, EffectLevel::Pure, Span::dummy()).is_ok());
    }

    #[test]
    fn check_pure_calling_view_fails() {
        let env = EffectEnv::prelude();
        let result = check_effect(&env, "f", EffectLevel::Pure, EffectLevel::View, Span::dummy());
        assert!(matches!(result, Err(EffectError::PureViolation { .. })));
    }

    #[test]
    fn check_pure_calling_mut_fails() {
        let env = EffectEnv::prelude();
        let result = check_effect(&env, "f", EffectLevel::Pure, EffectLevel::Mut, Span::dummy());
        assert!(matches!(result, Err(EffectError::PureViolation { .. })));
    }

    #[test]
    fn check_view_calling_mut_fails() {
        let env = EffectEnv::prelude();
        let result = check_effect(&env, "f", EffectLevel::View, EffectLevel::Mut, Span::dummy());
        assert!(matches!(result, Err(EffectError::ViewViolation { .. })));
    }

    #[test]
    fn check_call_effect_pure_to_mut() {
        let env = EffectEnv::prelude();
        let result = check_call_effect(
            &env,
            "my_pure_fn",
            EffectLevel::Pure,
            "deal_damage",
            EffectLevel::Mut,
            Span::dummy(),
        );
        match result {
            Err(EffectError::PureViolation { called_name, .. }) => {
                assert_eq!(called_name, "deal_damage");
            }
            other => panic!("expected PureViolation, got {other:?}"),
        }
    }

    #[test]
    fn validate_effects_pure_with_add_ok() {
        let env = EffectEnv::prelude();
        let expr = app("add", vec![i64_val(1), i64_val(2)]);
        assert!(validate_effects(&env, "f", EffectLevel::Pure, &expr).is_ok());
    }

    #[test]
    fn validate_effects_pure_with_deal_damage_fails() {
        let env = EffectEnv::prelude();
        let expr = app("deal_damage", vec![var("state"), i64_val(10)]);
        let result = validate_effects(&env, "pure_fn", EffectLevel::Pure, &expr);
        assert!(matches!(result, Err(EffectError::PureViolation { .. })));
    }

    #[test]
    fn validate_effects_view_with_deal_damage_fails() {
        let env = EffectEnv::prelude();
        let expr = app("deal_damage", vec![var("state"), i64_val(10)]);
        let result = validate_effects(&env, "view_fn", EffectLevel::View, &expr);
        assert!(matches!(result, Err(EffectError::ViewViolation { .. })));
    }

    #[test]
    fn validate_effects_mut_with_deal_damage_ok() {
        let env = EffectEnv::prelude();
        let expr = app("deal_damage", vec![var("state"), i64_val(10)]);
        assert!(validate_effects(&env, "mut_fn", EffectLevel::Mut, &expr).is_ok());
    }

    #[test]
    fn collect_calls_basic() {
        let expr = app("add", vec![i64_val(1), i64_val(2)]);
        let calls = collect_calls(&expr);
        assert_eq!(calls.len(), 1);
        assert_eq!(calls[0].0, "add");
    }

    #[test]
    fn collect_calls_nested() {
        let inner = app("add", vec![i64_val(1), i64_val(2)]);
        let outer = app("mul", vec![inner, i64_val(3)]);
        let calls = collect_calls(&outer);
        assert_eq!(calls.len(), 2);
    }

    #[test]
    fn collect_calls_let() {
        let expr = Expr::Let {
            span: Span::dummy(),
            name: "x".to_string(),
            type_ann: None,
            value: Box::new(app("add", vec![i64_val(1), i64_val(2)])),
            body: Box::new(app("mul", vec![var("x"), i64_val(3)])),
        };
        let calls = collect_calls(&expr);
        assert_eq!(calls.len(), 2);
    }

    #[test]
    fn effect_level_ordering() {
        assert!(EffectLevel::Pure < EffectLevel::View);
        assert!(EffectLevel::View < EffectLevel::Mut);
        assert!(EffectLevel::Pure < EffectLevel::Mut);
    }

    #[test]
    fn effect_error_code() {
        let err = EffectError::PureViolation {
            function_name: "f".to_string(),
            called_name: "g".to_string(),
            called_level: EffectLevel::Mut,
            span: Span::dummy(),
        };
        assert_eq!(err.code(), "E0005");

        let err2 = EffectError::MissingAnnotation {
            function_name: "f".to_string(),
            inferred_level: EffectLevel::View,
            span: Span::dummy(),
        };
        assert_eq!(err2.code(), "E0007");
    }

    #[test]
    fn effect_error_display() {
        let err = EffectError::ViewViolation {
            function_name: "view_fn".to_string(),
            called_name: "deal_damage".to_string(),
            span: Span::dummy(),
        };
        let msg = format!("{err}");
        assert!(msg.contains("E0005"));
        assert!(msg.contains("view_fn"));
        assert!(msg.contains("deal_damage"));
    }

    #[test]
    fn infer_stmt_let() {
        let env = EffectEnv::prelude();
        let stmt = Stmt::Let(crate::ast::LetStmt {
            span: Span::dummy(),
            name: "x".to_string(),
            type_ann: None,
            value: app("deal_damage", vec![var("state"), i64_val(10)]),
        });
        assert_eq!(infer_stmt_effect(&env, &stmt), EffectLevel::Mut);
    }

    #[test]
    fn infer_stmt_return() {
        let env = EffectEnv::prelude();
        let stmt = Stmt::Return(crate::ast::ReturnStmt {
            span: Span::dummy(),
            expr: i64_val(42),
        });
        assert_eq!(infer_stmt_effect(&env, &stmt), EffectLevel::Pure);
    }

    #[test]
    fn infer_stmt_expr() {
        let env = EffectEnv::prelude();
        let stmt = Stmt::Expr(crate::ast::ExprStmt {
            span: Span::dummy(),
            expr: app("add", vec![i64_val(1), i64_val(2)]),
        });
        assert_eq!(infer_stmt_effect(&env, &stmt), EffectLevel::Pure);
    }

    // ─── proptest: effect level monotonicity ───

    #[test]
    fn proptest_effect_level_max() {
        assert_eq!(EffectLevel::Pure.max(EffectLevel::Pure), EffectLevel::Pure);
        assert_eq!(EffectLevel::Pure.max(EffectLevel::Mut), EffectLevel::Mut);
        assert_eq!(EffectLevel::View.max(EffectLevel::Mut), EffectLevel::Mut);
        assert_eq!(EffectLevel::Mut.max(EffectLevel::Pure), EffectLevel::Mut);
    }

    #[test]
    fn proptest_all_prelude_fns_have_levels() {
        let env = EffectEnv::prelude();
        let names = env.function_names();
        assert!(!names.is_empty());
        for name in names {
            assert!(env.get_level(name).is_some(), "prelude fn '{name}' missing effect level");
        }
    }

    #[test]
    fn proptest_nested_let_effects() {
        let env = EffectEnv::prelude();
        let expr = Expr::Let {
            span: Span::dummy(),
            name: "a".to_string(),
            type_ann: None,
            value: Box::new(i64_val(1)),
            body: Box::new(Expr::Let {
                span: Span::dummy(),
                name: "b".to_string(),
                type_ann: None,
                value: Box::new(app("deal_damage", vec![var("state"), i64_val(10)])),
                body: Box::new(var("b")),
            }),
        };
        assert_eq!(infer_expr_effect(&env, &expr), EffectLevel::Mut);
    }
}
