//! Effect system for the Apolon DSL — tracks purity / randomness / mutation.

use crate::ast::*;
use crate::error::Span;
use std::collections::HashMap;

// ---------------------------------------------------------------------------
// Effect lattice
// ---------------------------------------------------------------------------

/// Effect level of a computation.
///
/// Ordering: `Pure < Random < Mutating` (subtyping / impurity lattice).
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Effect {
    /// No side-effects.
    Pure,
    /// Uses randomness (e.g. `roll`).
    Random,
    /// Mutates game state (e.g. `damage`).
    Mutating,
}

impl std::fmt::Display for Effect {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Effect::Pure => write!(f, "pure"),
            Effect::Random => write!(f, "random"),
            Effect::Mutating => write!(f, "mutating"),
        }
    }
}

impl Effect {
    /// Convert an AST-level effect annotation into an `Effect`.
    pub fn from_ann(ann: EffectAnn) -> Self {
        match ann {
            EffectAnn::Pure => Effect::Pure,
            EffectAnn::Random => Effect::Random,
            EffectAnn::Mutating => Effect::Mutating,
        }
    }

    /// Compute the least upper bound (join) of two effects.
    ///
    /// ```text
    /// pure + pure = pure
    /// pure + random = random
    /// pure + mutating = mutating
    /// random + random = random
    /// random + mutating = mutating
    /// mutating + mutating = mutating
    /// ```
    #[must_use]
    pub fn lattice_join(e1: Effect, e2: Effect) -> Effect {
        std::cmp::max(e1, e2)
    }
}

// ---------------------------------------------------------------------------
// Effect errors
// ---------------------------------------------------------------------------

/// Kinds of effect errors.
#[derive(Debug, Clone, PartialEq)]
pub enum EffectErrorKind {
    /// An impure call was made inside a context that requires purity.
    ImpureCallInPureContext {
        /// The effect level of the called function.
        called: Effect,
        /// The effect level of the enclosing context.
        context: Effect,
    },
    /// A mixed-effect call was encountered inside a pure context.
    MixedEffectInPureContext {
        /// The effect level of the called function.
        called: Effect,
    },
}

impl std::fmt::Display for EffectErrorKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::ImpureCallInPureContext { called, context } => {
                write!(f, "{} call in {} context is not allowed", called, context)
            }
            Self::MixedEffectInPureContext { called } => {
                write!(f, "{} effect not allowed in pure context", called)
            }
        }
    }
}

/// An effect-checking error with source position.
#[derive(Debug, Clone, PartialEq)]
pub struct EffectError {
    /// The specific kind of effect error.
    pub kind: EffectErrorKind,
    /// Source span where the error occurred.
    pub span: Span,
}

impl std::fmt::Display for EffectError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "effect error at {}: {}", self.span, self.kind)
    }
}

impl std::error::Error for EffectError {}

// ---------------------------------------------------------------------------
// Built-in function effects
// ---------------------------------------------------------------------------

/// Return the effect level of a built-in function by name.
fn builtin_effect(name: &str) -> Effect {
    match name {
        "damage" | "heal" | "shield" | "apply" => Effect::Mutating,
        "roll" | "roll_percent" | "choose" => Effect::Random,
        "is_alive" | "is_dead" | "has_shield" => Effect::Pure,
        "min" | "max" | "abs" | "clamp" => Effect::Pure,
        _ => Effect::Pure,
    }
}

// ---------------------------------------------------------------------------
// EffectChecker
// ---------------------------------------------------------------------------

/// Checks that function / ability effects are compatible with their declared
/// effect annotations.
pub struct EffectChecker {
    /// Known effect for each function name.
    fn_effects: HashMap<String, Effect>,
    /// Currently active effect context.
    context: Effect,
    /// Collected effect errors.
    errors: Vec<EffectError>,
}

impl Default for EffectChecker {
    fn default() -> Self {
        Self::new()
    }
}

impl EffectChecker {
    /// Create a new effect checker with built-in function effects registered.
    pub fn new() -> Self {
        let mut checker = Self {
            fn_effects: HashMap::new(),
            context: Effect::Pure,
            errors: vec![],
        };
        // Register builtins
        for name in [
            "damage", "heal", "shield", "apply",
            "roll", "roll_percent", "choose",
            "is_alive", "is_dead", "has_shield",
            "min", "max", "abs", "clamp",
        ] {
            checker
                .fn_effects
                .insert(name.to_string(), builtin_effect(name));
        }
        checker
    }

    // -----------------------------------------------------------------------
    // Lattice join (public helper)
    // -----------------------------------------------------------------------

    /// Compute the least upper bound of two effects.
    #[must_use]
    pub fn lattice_join(e1: Effect, e2: Effect) -> Effect {
        Effect::lattice_join(e1, e2)
    }

    // -----------------------------------------------------------------------
    // Expression / statement effect inference
    // -----------------------------------------------------------------------

    /// Infer the effect level of an expression.
    pub fn infer_expr_effect(&mut self, expr: &Expr) -> Effect {
        match expr {
            Expr::IntLit(_) | Expr::BoolLit(_) | Expr::StrLit(_) => Effect::Pure,

            Expr::Ident(name) => self
                .fn_effects
                .get(name)
                .copied()
                .unwrap_or(Effect::Pure),

            Expr::Binary { left, right, .. } => {
                let le = self.infer_expr_effect(left);
                let re = self.infer_expr_effect(right);
                Effect::lattice_join(le, re)
            }

            Expr::Unary { operand, .. } => self.infer_expr_effect(operand),

            Expr::Call { func, args } => {
                let func_eff = self.infer_expr_effect(func);
                // Also compute effects from evaluating arguments
                let mut eff = func_eff;
                for arg in args {
                    let arg_eff = match arg {
                        CallArg::Positional(e) => self.infer_expr_effect(e),
                        CallArg::Named { value, .. } => self.infer_expr_effect(value),
                    };
                    eff = Effect::lattice_join(eff, arg_eff);
                }
                // In a pure context, any non-pure call is an error
                if self.context == Effect::Pure && eff != Effect::Pure {
                    self.errors.push(EffectError {
                        kind: EffectErrorKind::ImpureCallInPureContext {
                            called: eff,
                            context: self.context,
                        },
                        span: Span::at(0),
                    });
                }
                eff
            }

            Expr::Member { object, .. } => {
                // Entity field access is pure
                let _ = self.infer_expr_effect(object);
                Effect::Pure
            }

            Expr::If(if_expr) => {
                let cond_eff = self.infer_expr_effect(&if_expr.condition);
                let mut eff = cond_eff;
                for stmt in &if_expr.then_block {
                    eff = Effect::lattice_join(eff, self.infer_stmt_effect(stmt));
                }
                if let Some(else_clause) = &if_expr.else_clause {
                    eff = Effect::lattice_join(eff, self.infer_else_effect(else_clause));
                }
                eff
            }

            Expr::Struct(fields) => {
                let mut eff = Effect::Pure;
                for (_, expr) in fields {
                    eff = Effect::lattice_join(eff, self.infer_expr_effect(expr));
                }
                eff
            }

            Expr::List(elements) => {
                let mut eff = Effect::Pure;
                for elem in elements {
                    eff = Effect::lattice_join(eff, self.infer_expr_effect(elem));
                }
                eff
            }
        }
    }

    fn infer_else_effect(&mut self, clause: &ElseClause) -> Effect {
        match clause {
            ElseClause::Block(stmts) => {
                let mut eff = Effect::Pure;
                for stmt in stmts {
                    eff = Effect::lattice_join(eff, self.infer_stmt_effect(stmt));
                }
                eff
            }
            ElseClause::If(inner) => {
                let cond_eff = self.infer_expr_effect(&inner.condition);
                let mut eff = cond_eff;
                for stmt in &inner.then_block {
                    eff = Effect::lattice_join(eff, self.infer_stmt_effect(stmt));
                }
                if let Some(ec) = &inner.else_clause {
                    eff = Effect::lattice_join(eff, self.infer_else_effect(ec));
                }
                eff
            }
        }
    }

    fn infer_stmt_effect(&mut self, stmt: &Stmt) -> Effect {
        match stmt {
            Stmt::Expr(expr) => self.infer_expr_effect(expr),

            Stmt::Let(let_stmt) => self.infer_expr_effect(&let_stmt.value),

            Stmt::Assign(_) => Effect::Mutating,

            Stmt::If(if_stmt) => {
                let cond_eff = self.infer_expr_effect(&if_stmt.condition);
                let mut eff = cond_eff;
                for s in &if_stmt.then_block {
                    eff = Effect::lattice_join(eff, self.infer_stmt_effect(s));
                }
                if let Some(ec) = &if_stmt.else_clause {
                    eff = Effect::lattice_join(eff, self.infer_else_effect(ec));
                }
                eff
            }

            Stmt::Return(ret) => match &ret.value {
                Some(expr) => self.infer_expr_effect(expr),
                None => Effect::Pure,
            },
        }
    }

    fn infer_body_effect(&mut self, stmts: &[Stmt]) -> Effect {
        let mut eff = Effect::Pure;
        for stmt in stmts {
            eff = Effect::lattice_join(eff, self.infer_stmt_effect(stmt));
        }
        eff
    }

    // -----------------------------------------------------------------------
    // Top-level checking
    // -----------------------------------------------------------------------

    /// Check a function definition's declared vs inferred effect.
    pub fn check_function_def(&mut self, fn_def: &FnDef) {
        let declared = fn_def
            .effect
            .map(Effect::from_ann)
            .unwrap_or(Effect::Mutating);

        let saved = self.context;
        self.context = declared;

        let inferred = self.infer_body_effect(&fn_def.body);

        if inferred > declared {
            self.errors.push(EffectError {
                kind: EffectErrorKind::ImpureCallInPureContext {
                    called: inferred,
                    context: declared,
                },
                span: Span::at(0),
            });
        }

        // Register so later calls can see the effect
        self.fn_effects.insert(fn_def.name.clone(), declared);

        self.context = saved;
    }

    /// Check an ability definition.  Abilities default to `Mutating`.
    pub fn check_ability(&mut self, ability: &AbilityDef) {
        let declared = Effect::Mutating;

        let saved = self.context;
        self.context = declared;

        for body_item in &ability.body {
            match body_item {
                AbilityBodyItem::Cost(cost) => {
                    let _ = self.infer_expr_effect(&cost.amount);
                }
                AbilityBodyItem::Trigger(trigger) => {
                    let trigger_eff = trigger
                        .effect
                        .map(Effect::from_ann)
                        .unwrap_or(declared);

                    let prev = self.context;
                    self.context = trigger_eff;

                    let inferred = self.infer_body_effect(&trigger.body);
                    if inferred > trigger_eff {
                        self.errors.push(EffectError {
                            kind: EffectErrorKind::ImpureCallInPureContext {
                                called: inferred,
                                context: trigger_eff,
                            },
                            span: Span::at(0),
                        });
                    }

                    self.context = prev;
                }
                AbilityBodyItem::Stmt(stmt) => {
                    let _ = self.infer_stmt_effect(stmt);
                }
            }
        }

        self.context = saved;
    }

    /// Check a complete program for effect violations.
    pub fn check_program(&mut self, program: &Program) -> Result<(), Vec<EffectError>> {
        for item in &program.items {
            match item {
                Item::Fn(fn_def) => self.check_function_def(fn_def),
                Item::Card(card) => {
                    for body_item in &card.body {
                        if let CardBodyItem::Ability(ability) = body_item {
                            self.check_ability(ability);
                        }
                    }
                }
                _ => {} // Const, Effect def, Use — skip
            }
        }

        if self.errors.is_empty() {
            Ok(())
        } else {
            Err(std::mem::take(&mut self.errors))
        }
    }

    // -----------------------------------------------------------------------
    // Accessors
    // -----------------------------------------------------------------------

    /// Get collected errors.
    pub fn errors(&self) -> &[EffectError] {
        &self.errors
    }

    /// Drain collected errors.
    pub fn take_errors(&mut self) -> Vec<EffectError> {
        std::mem::take(&mut self.errors)
    }
}

// ===========================================================================
// Tests
// ===========================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // -----------------------------------------------------------------------
    // Effect Display
    // -----------------------------------------------------------------------

    #[test]
    fn test_effect_display() {
        assert_eq!(format!("{}", Effect::Pure), "pure");
        assert_eq!(format!("{}", Effect::Random), "random");
        assert_eq!(format!("{}", Effect::Mutating), "mutating");
    }

    // -----------------------------------------------------------------------
    // Lattice join
    // -----------------------------------------------------------------------

    #[test]
    fn test_lattice_join_pure_pure() {
        assert_eq!(Effect::lattice_join(Effect::Pure, Effect::Pure), Effect::Pure);
    }

    #[test]
    fn test_lattice_join_pure_random() {
        assert_eq!(Effect::lattice_join(Effect::Pure, Effect::Random), Effect::Random);
    }

    #[test]
    fn test_lattice_join_pure_mutating() {
        assert_eq!(
            Effect::lattice_join(Effect::Pure, Effect::Mutating),
            Effect::Mutating
        );
    }

    #[test]
    fn test_lattice_join_random_random() {
        assert_eq!(
            Effect::lattice_join(Effect::Random, Effect::Random),
            Effect::Random
        );
    }

    #[test]
    fn test_lattice_join_random_mutating() {
        assert_eq!(
            Effect::lattice_join(Effect::Random, Effect::Mutating),
            Effect::Mutating
        );
    }

    #[test]
    fn test_lattice_join_mutating_mutating() {
        assert_eq!(
            Effect::lattice_join(Effect::Mutating, Effect::Mutating),
            Effect::Mutating
        );
    }

    #[test]
    fn test_lattice_join_commutative() {
        assert_eq!(
            Effect::lattice_join(Effect::Random, Effect::Pure),
            Effect::lattice_join(Effect::Pure, Effect::Random)
        );
    }

    #[test]
    fn test_lattice_join_associative() {
        let a = Effect::lattice_join(
            Effect::lattice_join(Effect::Pure, Effect::Random),
            Effect::Mutating,
        );
        let b = Effect::lattice_join(
            Effect::Pure,
            Effect::lattice_join(Effect::Random, Effect::Mutating),
        );
        assert_eq!(a, b);
    }

    #[test]
    fn test_static_method_lattice_join() {
        assert_eq!(
            EffectChecker::lattice_join(Effect::Pure, Effect::Mutating),
            Effect::Mutating
        );
    }

    // -----------------------------------------------------------------------
    // Ordering
    // -----------------------------------------------------------------------

    #[test]
    fn test_effect_ordering() {
        assert!(Effect::Pure < Effect::Random);
        assert!(Effect::Random < Effect::Mutating);
        assert!(Effect::Pure < Effect::Mutating);
    }

    #[test]
    fn test_effect_equality() {
        assert_eq!(Effect::Pure, Effect::Pure);
        assert_eq!(Effect::Random, Effect::Random);
        assert_eq!(Effect::Mutating, Effect::Mutating);
        assert_ne!(Effect::Pure, Effect::Random);
    }

    // -----------------------------------------------------------------------
    // Literal / expression inference
    // -----------------------------------------------------------------------

    #[test]
    fn test_pure_literal() {
        let mut ec = EffectChecker::new();
        assert_eq!(ec.infer_expr_effect(&Expr::IntLit(42)), Effect::Pure);
        assert_eq!(ec.infer_expr_effect(&Expr::BoolLit(true)), Effect::Pure);
        assert_eq!(
            ec.infer_expr_effect(&Expr::StrLit("hi".into())),
            Effect::Pure
        );
    }

    #[test]
    fn test_pure_variable() {
        let mut ec = EffectChecker::new();
        assert_eq!(
            ec.infer_expr_effect(&Expr::Ident("min".into())),
            Effect::Pure
        );
    }

    #[test]
    fn test_mutating_builtin() {
        let mut ec = EffectChecker::new();
        assert_eq!(
            ec.infer_expr_effect(&Expr::Ident("damage".into())),
            Effect::Mutating
        );
        assert_eq!(
            ec.infer_expr_effect(&Expr::Ident("heal".into())),
            Effect::Mutating
        );
    }

    #[test]
    fn test_random_builtin() {
        let mut ec = EffectChecker::new();
        assert_eq!(
            ec.infer_expr_effect(&Expr::Ident("roll".into())),
            Effect::Random
        );
        assert_eq!(
            ec.infer_expr_effect(&Expr::Ident("choose".into())),
            Effect::Random
        );
    }

    // -----------------------------------------------------------------------
    // Binary / unary expression effects
    // -----------------------------------------------------------------------

    #[test]
    fn test_binary_expression_effect() {
        let mut ec = EffectChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::IntLit(1)),
            right: Box::new(Expr::IntLit(2)),
        };
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Pure);
    }

    #[test]
    fn test_binary_with_random() {
        let mut ec = EffectChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::Ident("roll".into())),
            right: Box::new(Expr::IntLit(1)),
        };
        // roll is Random but called through Ident, not Call.
        // The Ident itself returns Random, so the join is Random.
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Random);
    }

    #[test]
    fn test_unary_expression_effect() {
        let mut ec = EffectChecker::new();
        let expr = Expr::Unary {
            op: UnaryOp::Neg,
            operand: Box::new(Expr::IntLit(5)),
        };
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Pure);
    }

    // -----------------------------------------------------------------------
    // If expression effect
    // -----------------------------------------------------------------------

    #[test]
    fn test_if_expression_pure_branches() {
        let mut ec = EffectChecker::new();
        let expr = Expr::If(Box::new(IfExpr {
            condition: Expr::BoolLit(true),
            then_block: vec![],
            else_clause: Some(ElseClause::Block(vec![])),
        }));
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Pure);
    }

    #[test]
    fn test_if_expression_mutating_branch() {
        let mut ec = EffectChecker::new();
        // damage is Mutating
        let expr = Expr::If(Box::new(IfExpr {
            condition: Expr::BoolLit(true),
            then_block: vec![Stmt::Expr(Expr::Ident("damage".into()))],
            else_clause: None,
        }));
        // damage Ident resolves to Mutating
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Mutating);
    }

    // -----------------------------------------------------------------------
    // Member access
    // -----------------------------------------------------------------------

    #[test]
    fn test_member_access_effect() {
        let mut ec = EffectChecker::new();
        let expr = Expr::Member {
            object: Box::new(Expr::Ident("target".into())),
            field: "hp".into(),
        };
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Pure);
    }

    // -----------------------------------------------------------------------
    // Struct / list expression effects
    // -----------------------------------------------------------------------

    #[test]
    fn test_struct_literal_effect() {
        let mut ec = EffectChecker::new();
        let expr = Expr::Struct(vec![
            ("hp".into(), Expr::IntLit(100)),
            ("atk".into(), Expr::IntLit(25)),
        ]);
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Pure);
    }

    #[test]
    fn test_list_literal_effect() {
        let mut ec = EffectChecker::new();
        let expr = Expr::List(vec![Expr::IntLit(1), Expr::IntLit(2)]);
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Pure);
    }

    // -----------------------------------------------------------------------
    // Statement effects
    // -----------------------------------------------------------------------

    #[test]
    fn test_assignment_is_mutating() {
        let mut ec = EffectChecker::new();
        let stmt = Stmt::Assign(AssignStmt {
            name: "x".into(),
            value: Expr::IntLit(1),
        });
        assert_eq!(ec.infer_stmt_effect(&stmt), Effect::Mutating);
    }

    #[test]
    fn test_let_statement_effect() {
        let mut ec = EffectChecker::new();
        let stmt = Stmt::Let(LetStmt {
            name: "x".into(),
            type_ann: None,
            value: Expr::IntLit(1),
        });
        assert_eq!(ec.infer_stmt_effect(&stmt), Effect::Pure);
    }

    // -----------------------------------------------------------------------
    // Mixed effects in expression
    // -----------------------------------------------------------------------

    #[test]
    fn test_mixed_effects_in_expression() {
        let mut ec = EffectChecker::new();
        // roll() + damage — Random ∨ Mutating = Mutating
        // But these are Idents, not Calls. The effect of an Ident is the
        // registered function effect.
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::Ident("roll".into())),
            right: Box::new(Expr::Ident("damage".into())),
        };
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Mutating);
    }

    // -----------------------------------------------------------------------
    // Function checking
    // -----------------------------------------------------------------------

    #[test]
    fn test_pure_function_with_pure_calls() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "pure_fn".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Pure),
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("min".into())),
                args: vec![
                    CallArg::Positional(Expr::IntLit(1)),
                    CallArg::Positional(Expr::IntLit(2)),
                ],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(ec.errors().is_empty());
    }

    #[test]
    fn test_pure_function_with_random_call_fails() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "bad_pure".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Pure),
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("roll".into())),
                args: vec![CallArg::Positional(Expr::IntLit(6))],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(!ec.errors().is_empty());
        // Also check the call-level error
        assert!(matches!(
            &ec.errors()[0].kind,
            EffectErrorKind::ImpureCallInPureContext { .. }
        ));
    }

    #[test]
    fn test_pure_function_with_mutating_call_fails() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "bad_pure2".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Pure),
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("damage".into())),
                args: vec![
                    CallArg::Positional(Expr::Ident("target".into())),
                    CallArg::Positional(Expr::IntLit(10)),
                ],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(!ec.errors().is_empty());
    }

    #[test]
    fn test_random_function_with_pure_calls() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "rand_fn".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Random),
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("min".into())),
                args: vec![
                    CallArg::Positional(Expr::IntLit(1)),
                    CallArg::Positional(Expr::IntLit(2)),
                ],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(ec.errors().is_empty());
    }

    #[test]
    fn test_random_function_with_random_calls() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "rand_fn2".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Random),
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("roll".into())),
                args: vec![CallArg::Positional(Expr::IntLit(6))],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(ec.errors().is_empty());
    }

    #[test]
    fn test_mutating_function_accepts_any_call() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "mut_fn".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Mutating),
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("damage".into())),
                args: vec![
                    CallArg::Positional(Expr::Ident("target".into())),
                    CallArg::Positional(Expr::IntLit(10)),
                ],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(ec.errors().is_empty());
    }

    #[test]
    fn test_function_defaults_to_mutating() {
        let mut ec = EffectChecker::new();
        let fn_def = FnDef {
            name: "no_ann".into(),
            params: vec![],
            return_type: None,
            effect: None,
            body: vec![Stmt::Expr(Expr::Call {
                func: Box::new(Expr::Ident("damage".into())),
                args: vec![
                    CallArg::Positional(Expr::Ident("target".into())),
                    CallArg::Positional(Expr::IntLit(5)),
                ],
            })],
        };
        ec.check_function_def(&fn_def);
        assert!(ec.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Ability checking
    // -----------------------------------------------------------------------

    #[test]
    fn test_ability_defaults_to_mutating() {
        let mut ec = EffectChecker::new();
        let ability = AbilityDef {
            name: "test_ability".into(),
            params: vec![],
            body: vec![AbilityBodyItem::Trigger(TriggerClause {
                event: "cast".into(),
                effect: None,
                body: vec![Stmt::Expr(Expr::Call {
                    func: Box::new(Expr::Ident("damage".into())),
                    args: vec![
                        CallArg::Positional(Expr::Ident("target".into())),
                        CallArg::Positional(Expr::IntLit(10)),
                    ],
                })],
            })],
        };
        ec.check_ability(&ability);
        assert!(ec.errors().is_empty());
    }

    #[test]
    fn test_ability_trigger_pure_annotation_violation() {
        let mut ec = EffectChecker::new();
        let ability = AbilityDef {
            name: "bad_ability".into(),
            params: vec![],
            body: vec![AbilityBodyItem::Trigger(TriggerClause {
                event: "cast".into(),
                effect: Some(EffectAnn::Pure),
                body: vec![Stmt::Expr(Expr::Call {
                    func: Box::new(Expr::Ident("damage".into())),
                    args: vec![
                        CallArg::Positional(Expr::Ident("target".into())),
                        CallArg::Positional(Expr::IntLit(10)),
                    ],
                })],
            })],
        };
        ec.check_ability(&ability);
        assert!(!ec.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Program-level checking
    // -----------------------------------------------------------------------

    #[test]
    fn test_check_program_no_errors() {
        let mut ec = EffectChecker::new();
        let program = Program {
            module: None,
            items: vec![Item::Fn(FnDef {
                name: "my_fn".into(),
                params: vec![],
                return_type: None,
                effect: Some(EffectAnn::Mutating),
                body: vec![Stmt::Expr(Expr::Call {
                    func: Box::new(Expr::Ident("damage".into())),
                    args: vec![
                        CallArg::Positional(Expr::Ident("target".into())),
                        CallArg::Positional(Expr::IntLit(10)),
                    ],
                })],
            })],
        };
        assert!(ec.check_program(&program).is_ok());
    }

    #[test]
    fn test_check_program_with_errors() {
        let mut ec = EffectChecker::new();
        let program = Program {
            module: None,
            items: vec![Item::Fn(FnDef {
                name: "bad_fn".into(),
                params: vec![],
                return_type: None,
                effect: Some(EffectAnn::Pure),
                body: vec![Stmt::Expr(Expr::Call {
                    func: Box::new(Expr::Ident("roll".into())),
                    args: vec![CallArg::Positional(Expr::IntLit(6))],
                })],
            })],
        };
        let result = ec.check_program(&program);
        assert!(result.is_err());
        assert!(!result.unwrap_err().is_empty());
    }

    // -----------------------------------------------------------------------
    // Error messages / display
    // -----------------------------------------------------------------------

    #[test]
    fn test_effect_error_display() {
        let err = EffectError {
            kind: EffectErrorKind::ImpureCallInPureContext {
                called: Effect::Random,
                context: Effect::Pure,
            },
            span: Span::new(5, 15),
        };
        let s = format!("{}", err);
        assert!(s.contains("random"));
        assert!(s.contains("pure"));
        assert!(s.contains("5..15"));
    }

    #[test]
    fn test_effect_error_kind_display() {
        let kind = EffectErrorKind::MixedEffectInPureContext {
            called: Effect::Mutating,
        };
        let s = format!("{}", kind);
        assert!(s.contains("mutating"));
        assert!(s.contains("pure"));
    }

    // -----------------------------------------------------------------------
    // Nested call effects
    // -----------------------------------------------------------------------

    #[test]
    fn test_nested_call_effects() {
        let mut ec = EffectChecker::new();
        // clamp(roll(6), 1, 10) → Random ∨ Pure ∨ Pure = Random
        let expr = Expr::Call {
            func: Box::new(Expr::Ident("clamp".into())),
            args: vec![
                CallArg::Positional(Expr::Call {
                    func: Box::new(Expr::Ident("roll".into())),
                    args: vec![CallArg::Positional(Expr::IntLit(6))],
                }),
                CallArg::Positional(Expr::IntLit(1)),
                CallArg::Positional(Expr::IntLit(10)),
            ],
        };
        assert_eq!(ec.infer_expr_effect(&expr), Effect::Random);
    }

    // -----------------------------------------------------------------------
    // Context management
    // -----------------------------------------------------------------------

    #[test]
    fn test_context_restored_after_check() {
        let mut ec = EffectChecker::new();
        assert_eq!(ec.context, Effect::Pure);
        let fn_def = FnDef {
            name: "f".into(),
            params: vec![],
            return_type: None,
            effect: Some(EffectAnn::Mutating),
            body: vec![],
        };
        ec.check_function_def(&fn_def);
        // Context should be restored
        assert_eq!(ec.context, Effect::Pure);
    }
}
