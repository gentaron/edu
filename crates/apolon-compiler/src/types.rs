//! Hindley-Milner type inference with row polymorphism for the Apolon DSL.

use crate::ast::*;
use crate::error::Span;
use std::collections::{HashMap, HashSet};

// ---------------------------------------------------------------------------
// Type representations
// ---------------------------------------------------------------------------

/// Type representations for inference.
#[derive(Debug, Clone, PartialEq)]
pub enum Ty {
    /// Integer type.
    Int,
    /// Boolean type.
    Bool,
    /// String type.
    Str,
    /// Unit type (void).
    Unit,
    /// Entity type (game entity with stat fields).
    Entity,
    /// Effect type (user-defined effect).
    Effect,
    /// Row type with named fields and optional row tail variable for extension.
    Row(Vec<(String, Ty)>, Option<u32>),
    /// Function type: parameter types → return type.
    Fn(Vec<Ty>, Box<Ty>),
    /// List (homogeneous) type.
    List(Box<Ty>),
    /// Type variable used during inference.
    Var(u32),
    /// User-defined / named type.
    Named(String),
}

impl std::fmt::Display for Ty {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Ty::Int => write!(f, "int"),
            Ty::Bool => write!(f, "bool"),
            Ty::Str => write!(f, "str"),
            Ty::Unit => write!(f, "unit"),
            Ty::Entity => write!(f, "entity"),
            Ty::Effect => write!(f, "Effect"),
            Ty::Row(fields, None) => {
                write!(f, "{{")?;
                for (i, (name, ty)) in fields.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}: {}", name, ty)?;
                }
                write!(f, "}}")
            }
            Ty::Row(fields, Some(v)) => {
                write!(f, "{{")?;
                for (i, (name, ty)) in fields.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}: {}", name, ty)?;
                }
                write!(f, ", ..|?{}}}", v)
            }
            Ty::Fn(params, ret) => {
                write!(f, "(")?;
                for (i, param) in params.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{}", param)?;
                }
                write!(f, ") -> {}", ret)
            }
            Ty::List(inner) => write!(f, "[{}]", inner),
            Ty::Var(id) => write!(f, "?{}", id),
            Ty::Named(name) => write!(f, "{}", name),
        }
    }
}

// ---------------------------------------------------------------------------
// Type scheme (let-polymorphism)
// ---------------------------------------------------------------------------

/// Type scheme: universally quantified type variables + body type.
#[derive(Debug, Clone, PartialEq)]
pub struct TypeScheme {
    /// Quantified (bound) type variables.
    pub vars: Vec<u32>,
    /// The type body.
    pub ty: Ty,
}

impl TypeScheme {
    /// Create a new type scheme.
    pub fn new(vars: Vec<u32>, ty: Ty) -> Self {
        Self { vars, ty }
    }

    /// Create a monomorphic (non-quantified) type scheme.
    pub fn monomorphic(ty: Ty) -> Self {
        Self {
            vars: vec![],
            ty,
        }
    }
}

// ---------------------------------------------------------------------------
// Type errors
// ---------------------------------------------------------------------------

/// Kinds of type errors.
#[derive(Debug, Clone, PartialEq)]
pub enum TypeErrorKind {
    /// Two types could not be unified.
    UnificationMismatch(Ty, Ty),
    /// A name was used but is not defined in scope.
    UndefinedVariable(String),
    /// A non-function type was called.
    NotAFunction(Ty),
    /// Wrong number of arguments supplied to a function.
    ArityMismatch {
        expected: usize,
        found: usize,
    },
    /// Row fields do not match.
    RowMismatch {
        missing: Vec<String>,
        extra: Vec<String>,
    },
    /// An effect annotation was required but not provided.
    EffectAnnotationMissing,
    /// Infinite / cyclic type detected (occurs check failed).
    CyclicType,
}

impl std::fmt::Display for TypeErrorKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnificationMismatch(t1, t2) => {
                write!(f, "type mismatch: expected {}, got {}", t1, t2)
            }
            Self::UndefinedVariable(name) => {
                write!(f, "undefined variable: {}", name)
            }
            Self::NotAFunction(ty) => {
                write!(f, "cannot call non-function type: {}", ty)
            }
            Self::ArityMismatch { expected, found } => {
                write!(
                    f,
                    "arity mismatch: expected {} argument(s), found {}",
                    expected, found
                )
            }
            Self::RowMismatch { missing, extra } => {
                write!(
                    f,
                    "row mismatch: missing fields {:?}, extra fields {:?}",
                    missing, extra
                )
            }
            Self::EffectAnnotationMissing => {
                write!(f, "effect annotation missing")
            }
            Self::CyclicType => {
                write!(f, "cyclic type detected")
            }
        }
    }
}

/// A type error with source position.
#[derive(Debug, Clone, PartialEq)]
pub struct TypeError {
    /// The specific kind of type error.
    pub kind: TypeErrorKind,
    /// Source span where the error occurred.
    pub span: Span,
}

impl std::fmt::Display for TypeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "type error at {}: {}", self.span, self.kind)
    }
}

impl std::error::Error for TypeError {}

// ---------------------------------------------------------------------------
// Known entity fields (all typed as Int in the game domain)
// ---------------------------------------------------------------------------

const ENTITY_FIELDS: &[&str] = &["hp", "maxhp", "atk", "def", "shield"];

// ---------------------------------------------------------------------------
// TypeChecker
// ---------------------------------------------------------------------------

/// Hindley-Milner type checker with row polymorphism.
pub struct TypeChecker {
    /// Type variable → type substitution map.
    subst: HashMap<u32, Ty>,
    /// Monotonic counter for generating fresh type variables.
    next_var: u32,
    /// Scoped environment: each scope is a name → TypeScheme map.
    env: Vec<HashMap<String, TypeScheme>>,
    /// Collected type errors (non-fatal).
    errors: Vec<TypeError>,
}

impl Default for TypeChecker {
    fn default() -> Self {
        Self::new()
    }
}

impl TypeChecker {
    /// Create a new type checker with built-in environment.
    pub fn new() -> Self {
        let mut checker = Self {
            subst: HashMap::new(),
            next_var: 0,
            env: vec![HashMap::new()],
            errors: vec![],
        };
        checker.register_builtins();
        checker
    }

    // -----------------------------------------------------------------------
    // Built-in environment
    // -----------------------------------------------------------------------

    fn register_builtins(&mut self) {
        let entity = Ty::Entity;
        let int = Ty::Int;
        let bool = Ty::Bool;
        let unit = Ty::Unit;
        let effect = Ty::Effect;

        // damage: (entity, int) -> unit
        self.env[0].insert(
            "damage".into(),
            TypeScheme::monomorphic(Ty::Fn(
                vec![entity.clone(), int.clone()],
                Box::new(unit.clone()),
            )),
        );
        // heal: (entity, int) -> unit
        self.env[0].insert(
            "heal".into(),
            TypeScheme::monomorphic(Ty::Fn(
                vec![entity.clone(), int.clone()],
                Box::new(unit.clone()),
            )),
        );
        // shield: (entity, int, int) -> unit
        self.env[0].insert(
            "shield".into(),
            TypeScheme::monomorphic(Ty::Fn(
                vec![entity.clone(), int.clone(), int.clone()],
                Box::new(unit.clone()),
            )),
        );
        // apply: (entity, Effect) -> unit
        self.env[0].insert(
            "apply".into(),
            TypeScheme::monomorphic(Ty::Fn(
                vec![entity.clone(), effect.clone()],
                Box::new(unit.clone()),
            )),
        );
        // target / self / caster: entity
        for name in &["target", "self", "caster"] {
            self.env[0].insert(
                (*name).into(),
                TypeScheme::monomorphic(entity.clone()),
            );
        }
        // is_alive / is_dead / has_shield: entity -> bool
        for name in &["is_alive", "is_dead", "has_shield"] {
            self.env[0].insert(
                (*name).into(),
                TypeScheme::monomorphic(Ty::Fn(
                    vec![entity.clone()],
                    Box::new(bool.clone()),
                )),
            );
        }
        // min / max: (int, int) -> int
        for name in &["min", "max"] {
            self.env[0].insert(
                (*name).into(),
                TypeScheme::monomorphic(Ty::Fn(
                    vec![int.clone(), int.clone()],
                    Box::new(int.clone()),
                )),
            );
        }
        // abs: int -> int
        self.env[0].insert(
            "abs".into(),
            TypeScheme::monomorphic(Ty::Fn(vec![int.clone()], Box::new(int.clone()))),
        );
        // clamp: (int, int, int) -> int
        self.env[0].insert(
            "clamp".into(),
            TypeScheme::monomorphic(Ty::Fn(
                vec![int.clone(), int.clone(), int.clone()],
                Box::new(int.clone()),
            )),
        );
        // roll: int -> int
        self.env[0].insert(
            "roll".into(),
            TypeScheme::monomorphic(Ty::Fn(vec![int.clone()], Box::new(int.clone()))),
        );
        // roll_percent: () -> int
        self.env[0].insert(
            "roll_percent".into(),
            TypeScheme::monomorphic(Ty::Fn(vec![], Box::new(int.clone()))),
        );
        // choose: int -> int
        self.env[0].insert(
            "choose".into(),
            TypeScheme::monomorphic(Ty::Fn(vec![int.clone()], Box::new(int.clone()))),
        );
    }

    // -----------------------------------------------------------------------
    // Fresh variable helpers
    // -----------------------------------------------------------------------

    /// Generate a fresh type variable id.
    pub fn fresh_var(&mut self) -> u32 {
        let v = self.next_var;
        self.next_var += 1;
        v
    }

    /// Generate a fresh type variable as a `Ty`.
    fn fresh_ty(&mut self) -> Ty {
        Ty::Var(self.fresh_var())
    }

    // -----------------------------------------------------------------------
    // Substitution helpers
    // -----------------------------------------------------------------------

    /// Fully resolve a type by chasing all substitution chains (non-mutating).
    pub fn resolve(&self, ty: &Ty) -> Ty {
        match ty {
            Ty::Var(v) => match self.subst.get(v) {
                Some(resolved) => self.resolve(resolved),
                None => Ty::Var(*v),
            },
            Ty::Row(fields, tail) => Ty::Row(
                fields
                    .iter()
                    .map(|(name, t)| (name.clone(), self.resolve(t)))
                    .collect(),
                *tail,
            ),
            Ty::Fn(params, ret) => Ty::Fn(
                params.iter().map(|p| self.resolve(p)).collect(),
                Box::new(self.resolve(ret)),
            ),
            Ty::List(inner) => Ty::List(Box::new(self.resolve(inner))),
            Ty::Int
            | Ty::Bool
            | Ty::Str
            | Ty::Unit
            | Ty::Entity
            | Ty::Effect
            | Ty::Named(_) => ty.clone(),
        }
    }

    /// Apply current substitution to a type (with path compression).
    pub fn apply_subst(&mut self, ty: &Ty) -> Ty {
        match ty {
            Ty::Var(v) => match self.subst.get(v).cloned() {
                Some(resolved) => {
                    let fully = self.apply_subst(&resolved);
                    self.subst.insert(*v, fully.clone());
                    fully
                }
                None => Ty::Var(*v),
            },
            Ty::Row(fields, tail) => Ty::Row(
                fields
                    .iter()
                    .map(|(name, t)| (name.clone(), self.apply_subst(t)))
                    .collect(),
                *tail,
            ),
            Ty::Fn(params, ret) => Ty::Fn(
                params.iter().map(|p| self.apply_subst(p)).collect(),
                Box::new(self.apply_subst(ret)),
            ),
            Ty::List(inner) => Ty::List(Box::new(self.apply_subst(inner))),
            Ty::Int
            | Ty::Bool
            | Ty::Str
            | Ty::Unit
            | Ty::Entity
            | Ty::Effect
            | Ty::Named(_) => ty.clone(),
        }
    }

    // -----------------------------------------------------------------------
    // Free variables
    // -----------------------------------------------------------------------

    /// Collect the set of free (unbound) type variables in a type.
    fn free_vars(&self, ty: &Ty) -> HashSet<u32> {
        match ty {
            Ty::Var(v) => match self.subst.get(v) {
                Some(resolved) => self.free_vars(resolved),
                None => {
                    let mut s = HashSet::new();
                    s.insert(*v);
                    s
                }
            },
            Ty::Row(fields, tail) => {
                let mut vars = HashSet::new();
                for (_, t) in fields {
                    vars.extend(self.free_vars(t));
                }
                if let Some(tv) = tail {
                    if !self.subst.contains_key(tv) {
                        vars.insert(*tv);
                    }
                }
                vars
            }
            Ty::Fn(params, ret) => {
                let mut vars = HashSet::new();
                for p in params {
                    vars.extend(self.free_vars(p));
                }
                vars.extend(self.free_vars(ret));
                vars
            }
            Ty::List(inner) => self.free_vars(inner),
            Ty::Int
            | Ty::Bool
            | Ty::Str
            | Ty::Unit
            | Ty::Entity
            | Ty::Effect
            | Ty::Named(_) => HashSet::new(),
        }
    }

    /// Check whether a type variable occurs in a type (occurs check).
    fn occurs_in(&self, var: u32, ty: &Ty) -> bool {
        match ty {
            Ty::Var(v) => {
                if *v == var {
                    return true;
                }
                match self.subst.get(v) {
                    Some(resolved) => self.occurs_in(var, resolved),
                    None => false,
                }
            }
            Ty::Row(fields, tail) => {
                if fields.iter().any(|(_, t)| self.occurs_in(var, t)) {
                    return true;
                }
                if let Some(tv) = tail {
                    if *tv == var {
                        return true;
                    }
                    if let Some(resolved) = self.subst.get(tv) {
                        return self.occurs_in(var, resolved);
                    }
                }
                false
            }
            Ty::Fn(params, ret) => {
                params.iter().any(|p| self.occurs_in(var, p)) || self.occurs_in(var, ret)
            }
            Ty::List(inner) => self.occurs_in(var, inner),
            Ty::Int
            | Ty::Bool
            | Ty::Str
            | Ty::Unit
            | Ty::Entity
            | Ty::Effect
            | Ty::Named(_) => false,
        }
    }

    // -----------------------------------------------------------------------
    // Unification
    // -----------------------------------------------------------------------

    /// Unify two types, extending the substitution as needed.
    pub fn unify(&mut self, t1: &Ty, t2: &Ty, span: &Span) -> Result<(), TypeError> {
        let t1 = self.apply_subst(t1);
        let t2 = self.apply_subst(t2);
        self.unify_inner(&t1, &t2, span)
    }

    fn unify_inner(&mut self, t1: &Ty, t2: &Ty, span: &Span) -> Result<(), TypeError> {
        match (t1, t2) {
            // Identical concrete types
            (Ty::Int, Ty::Int)
            | (Ty::Bool, Ty::Bool)
            | (Ty::Str, Ty::Str)
            | (Ty::Unit, Ty::Unit)
            | (Ty::Entity, Ty::Entity)
            | (Ty::Effect, Ty::Effect) => Ok(()),

            // Named types (nominal equality)
            (Ty::Named(n1), Ty::Named(n2)) if n1 == n2 => Ok(()),

            // Type variable on left
            (Ty::Var(v), _) => {
                if self.occurs_in(*v, t2) {
                    let err = TypeError {
                        kind: TypeErrorKind::CyclicType,
                        span: *span,
                    };
                    self.errors.push(err.clone());
                    Err(err)
                } else {
                    self.subst.insert(*v, t2.clone());
                    Ok(())
                }
            }

            // Type variable on right
            (_, Ty::Var(v)) => {
                if self.occurs_in(*v, t1) {
                    let err = TypeError {
                        kind: TypeErrorKind::CyclicType,
                        span: *span,
                    };
                    self.errors.push(err.clone());
                    Err(err)
                } else {
                    self.subst.insert(*v, t1.clone());
                    Ok(())
                }
            }

            // Function types
            (Ty::Fn(p1, r1), Ty::Fn(p2, r2)) => {
                if p1.len() != p2.len() {
                    let err = TypeError {
                        kind: TypeErrorKind::ArityMismatch {
                            expected: p1.len(),
                            found: p2.len(),
                        },
                        span: *span,
                    };
                    self.errors.push(err.clone());
                    return Err(err);
                }
                for (a, b) in p1.iter().zip(p2.iter()) {
                    self.unify(a, b, span)?;
                }
                self.unify(r1, r2, span)?;
                Ok(())
            }

            // List types
            (Ty::List(a), Ty::List(b)) => self.unify(a, b, span),

            // Row types
            (Ty::Row(fields1, tail1), Ty::Row(fields2, tail2)) => {
                self.unify_rows(fields1, *tail1, fields2, *tail2, span)
            }

            // Anything else: mismatch
            _ => {
                let err = TypeError {
                    kind: TypeErrorKind::UnificationMismatch(t1.clone(), t2.clone()),
                    span: *span,
                };
                self.errors.push(err.clone());
                Err(err)
            }
        }
    }

    fn unify_rows(
        &mut self,
        fields1: &[(String, Ty)],
        tail1: Option<u32>,
        fields2: &[(String, Ty)],
        tail2: Option<u32>,
        span: &Span,
    ) -> Result<(), TypeError> {
        let map2: HashMap<&str, &Ty> = fields2
            .iter()
            .map(|(n, t)| (n.as_str(), t))
            .collect();

        let map1: HashMap<&str, &Ty> = fields1
            .iter()
            .map(|(n, t)| (n.as_str(), t))
            .collect();

        // Unify common fields
        for (name, ty1) in fields1 {
            if let Some(ty2) = map2.get(name.as_str()) {
                self.unify(ty1, ty2, span)?;
            }
        }

        // Collect remaining (non-common) fields
        let remaining1: Vec<(String, Ty)> = fields1
            .iter()
            .filter(|(n, _)| !map2.contains_key(n.as_str()))
            .map(|(n, t)| (n.clone(), t.clone()))
            .collect();

        let remaining2: Vec<(String, Ty)> = fields2
            .iter()
            .filter(|(n, _)| !map1.contains_key(n.as_str()))
            .map(|(n, t)| (n.clone(), t.clone()))
            .collect();

        match (tail1, tail2) {
            (None, None) => {
                if !remaining1.is_empty() || !remaining2.is_empty() {
                    let err = TypeError {
                        kind: TypeErrorKind::RowMismatch {
                            missing: remaining1.iter().map(|(n, _)| n.clone()).collect(),
                            extra: remaining2.iter().map(|(n, _)| n.clone()).collect(),
                        },
                        span: *span,
                    };
                    self.errors.push(err.clone());
                    Err(err)
                } else {
                    Ok(())
                }
            }
            (Some(v1), None) => {
                let remaining_ty = if remaining2.is_empty() {
                    Ty::Row(vec![], None)
                } else {
                    Ty::Row(remaining2, None)
                };
                self.unify(&Ty::Var(v1), &remaining_ty, span)
            }
            (None, Some(v2)) => {
                let remaining_ty = if remaining1.is_empty() {
                    Ty::Row(vec![], None)
                } else {
                    Ty::Row(remaining1, None)
                };
                self.unify(&Ty::Var(v2), &remaining_ty, span)
            }
            (Some(v1), Some(_v2)) => {
                // v1 unifies with Row(remaining2, Some(v2))
                let ty_for_v1 = Ty::Row(remaining2, tail2);
                self.unify(&Ty::Var(v1), &ty_for_v1, span)
            }
        }
    }

    // -----------------------------------------------------------------------
    // Generalization & instantiation (let-polymorphism)
    // -----------------------------------------------------------------------

    /// Instantiate a type scheme by replacing quantified variables with fresh ones.
    pub fn instantiate(&mut self, scheme: &TypeScheme) -> Ty {
        if scheme.vars.is_empty() {
            return scheme.ty.clone();
        }
        let mapping: HashMap<u32, u32> = scheme
            .vars
            .iter()
            .map(|&v| (v, self.fresh_var()))
            .collect();
        self.remap_ty(&scheme.ty, &mapping)
    }

    fn remap_ty(&self, ty: &Ty, mapping: &HashMap<u32, u32>) -> Ty {
        match ty {
            Ty::Var(v) => match mapping.get(v) {
                Some(&nv) => Ty::Var(nv),
                None => Ty::Var(*v),
            },
            Ty::Row(fields, tail) => Ty::Row(
                fields
                    .iter()
                    .map(|(name, t)| (name.clone(), self.remap_ty(t, mapping)))
                    .collect(),
                *tail,
            ),
            Ty::Fn(params, ret) => Ty::Fn(
                params.iter().map(|p| self.remap_ty(p, mapping)).collect(),
                Box::new(self.remap_ty(ret, mapping)),
            ),
            Ty::List(inner) => Ty::List(Box::new(self.remap_ty(inner, mapping))),
            _ => ty.clone(),
        }
    }

    /// Generalize a type by quantifying over free variables not in the environment.
    pub fn generalize(&mut self, ty: &Ty) -> TypeScheme {
        let resolved = self.apply_subst(ty);
        let ty_free = self.free_vars(&resolved);

        // Collect all free vars in the environment
        let mut env_free: HashSet<u32> = HashSet::new();
        for scope in &self.env {
            for scheme in scope.values() {
                // Add free vars of the scheme body
                env_free.extend(self.free_vars(&scheme.ty));
                // Remove quantified vars (they are not free)
                for &v in &scheme.vars {
                    env_free.remove(&v);
                }
            }
        }

        let quantified: Vec<u32> = ty_free.difference(&env_free).copied().collect();
        TypeScheme::new(quantified, resolved)
    }

    // -----------------------------------------------------------------------
    // Environment helpers
    // -----------------------------------------------------------------------

    /// Look up a name in the scoped environment.
    fn lookup_env(&self, name: &str) -> Option<&TypeScheme> {
        for scope in self.env.iter().rev() {
            if let Some(scheme) = scope.get(name) {
                return Some(scheme);
            }
        }
        None
    }

    /// Enter a new lexical scope.
    fn enter_scope(&mut self) {
        self.env.push(HashMap::new());
    }

    /// Exit the current lexical scope.
    fn exit_scope(&mut self) {
        self.env.pop();
    }

    /// Add a binding to the innermost scope.
    fn push_env(&mut self, name: String, scheme: TypeScheme) {
        if let Some(scope) = self.env.last_mut() {
            scope.insert(name, scheme);
        }
    }

    // -----------------------------------------------------------------------
    // Type annotation conversion
    // -----------------------------------------------------------------------

    /// Convert a syntax-level type annotation into a `Ty`.
    fn type_ann_to_ty(&mut self, ann: &TypeAnn) -> Ty {
        match ann {
            TypeAnn::Int => Ty::Int,
            TypeAnn::Bool => Ty::Bool,
            TypeAnn::Str => Ty::Str,
            TypeAnn::Unit => Ty::Unit,
            TypeAnn::Entity => Ty::Entity,
            TypeAnn::Effect => Ty::Effect,
            TypeAnn::FnType { params, ret } => Ty::Fn(
                params.iter().map(|p| self.type_ann_to_ty(p)).collect(),
                Box::new(self.type_ann_to_ty(ret)),
            ),
            TypeAnn::List(inner) => Ty::List(Box::new(self.type_ann_to_ty(inner))),
            TypeAnn::Row(fields) => Ty::Row(
                fields
                    .iter()
                    .map(|(name, a)| (name.clone(), self.type_ann_to_ty(a)))
                    .collect(),
                None,
            ),
            TypeAnn::Named(name) => Ty::Named(name.clone()),
        }
    }

    // -----------------------------------------------------------------------
    // Statement inference
    // -----------------------------------------------------------------------

    /// Infer the type of a statement (returns the type of the produced value).
    pub fn infer_stmt(&mut self, stmt: &Stmt) -> Ty {
        let dummy = Span::at(0);
        match stmt {
            Stmt::Expr(expr) => self.infer_expr(expr),

            Stmt::Let(let_stmt) => {
                let value_ty = self.infer_expr(&let_stmt.value);
                let final_ty = if let Some(ann) = &let_stmt.type_ann {
                    let ann_ty = self.type_ann_to_ty(ann);
                    let _ = self.unify(&value_ty, &ann_ty, &dummy);
                    ann_ty
                } else {
                    value_ty
                };
                let scheme = self.generalize(&final_ty);
                self.push_env(let_stmt.name.clone(), scheme);
                final_ty
            }

            Stmt::Assign(assign_stmt) => {
                let value_ty = self.infer_expr(&assign_stmt.value);
                match self.lookup_env(&assign_stmt.name).cloned() {
                    Some(scheme) => {
                        let expected = self.instantiate(&scheme);
                        let _ = self.unify(&value_ty, &expected, &dummy);
                    }
                    None => {
                        self.errors.push(TypeError {
                            kind: TypeErrorKind::UndefinedVariable(assign_stmt.name.clone()),
                            span: dummy,
                        });
                    }
                }
                Ty::Unit
            }

            Stmt::If(if_stmt) => {
                let cond_ty = self.infer_expr(&if_stmt.condition);
                let _ = self.unify(&cond_ty, &Ty::Bool, &dummy);
                let then_ty = self.infer_block(&if_stmt.then_block);
                let else_ty = match &if_stmt.else_clause {
                    Some(ElseClause::Block(stmts)) => self.infer_block(stmts),
                    Some(ElseClause::If(inner)) => {
                        self.infer_stmt(&Stmt::If((**inner).clone()))
                    }
                    None => Ty::Unit,
                };
                let _ = self.unify(&then_ty, &else_ty, &dummy);
                Ty::Unit
            }

            Stmt::Return(ret) => match &ret.value {
                Some(expr) => self.infer_expr(expr),
                None => Ty::Unit,
            },
        }
    }

    // -----------------------------------------------------------------------
    // Expression inference
    // -----------------------------------------------------------------------

    /// Infer the type of an expression.
    pub fn infer_expr(&mut self, expr: &Expr) -> Ty {
        let dummy = Span::at(0);
        match expr {
            // ----- literals -----
            Expr::IntLit(_) => Ty::Int,
            Expr::BoolLit(_) => Ty::Bool,
            Expr::StrLit(_) => Ty::Str,

            // ----- identifier -----
            Expr::Ident(name) => match self.lookup_env(name).cloned() {
                Some(scheme) => self.instantiate(&scheme),
                None => {
                    self.errors.push(TypeError {
                        kind: TypeErrorKind::UndefinedVariable(name.clone()),
                        span: dummy,
                    });
                    self.fresh_ty()
                }
            },

            // ----- binary operations -----
            Expr::Binary { op, left, right } => {
                let lt = self.infer_expr(left);
                let rt = self.infer_expr(right);
                match op {
                    BinOp::Add | BinOp::Sub | BinOp::Mul | BinOp::Div | BinOp::Mod => {
                        let _ = self.unify(&lt, &Ty::Int, &dummy);
                        let _ = self.unify(&rt, &Ty::Int, &dummy);
                        Ty::Int
                    }
                    BinOp::Eq | BinOp::Neq => {
                        let _ = self.unify(&lt, &rt, &dummy);
                        Ty::Bool
                    }
                    BinOp::Lt | BinOp::Gt | BinOp::Le | BinOp::Ge => {
                        let _ = self.unify(&lt, &Ty::Int, &dummy);
                        let _ = self.unify(&rt, &Ty::Int, &dummy);
                        Ty::Bool
                    }
                    BinOp::And | BinOp::Or => {
                        let _ = self.unify(&lt, &Ty::Bool, &dummy);
                        let _ = self.unify(&rt, &Ty::Bool, &dummy);
                        Ty::Bool
                    }
                }
            }

            // ----- unary operations -----
            Expr::Unary { op, operand } => {
                let ot = self.infer_expr(operand);
                match op {
                    UnaryOp::Neg => {
                        let _ = self.unify(&ot, &Ty::Int, &dummy);
                        Ty::Int
                    }
                    UnaryOp::Not => {
                        let _ = self.unify(&ot, &Ty::Bool, &dummy);
                        Ty::Bool
                    }
                }
            }

            // ----- function call -----
            Expr::Call { func, args } => {
                let func_ty = self.infer_expr(func);
                let arg_tys: Vec<Ty> = args
                    .iter()
                    .map(|arg| match arg {
                        CallArg::Positional(e) => self.infer_expr(e),
                        CallArg::Named { value, .. } => self.infer_expr(value),
                    })
                    .collect();

                let ret_ty = self.fresh_ty();
                let expected_fn = Ty::Fn(arg_tys, Box::new(ret_ty.clone()));

                if let Err(e) = self.unify(&func_ty, &expected_fn, &dummy) {
                    // Provide a more specific NotAFunction diagnostic when applicable
                    if matches!(e.kind, TypeErrorKind::UnificationMismatch(_, _)) {
                        let resolved = self.apply_subst(&func_ty);
                        if !matches!(resolved, Ty::Fn(_, _) | Ty::Var(_)) {
                            self.errors.push(TypeError {
                                kind: TypeErrorKind::NotAFunction(resolved),
                                span: dummy,
                            });
                        }
                    }
                }
                self.apply_subst(&ret_ty)
            }

            // ----- member access -----
            Expr::Member { object, field } => {
                let obj_ty = self.infer_expr(object);
                let obj_resolved = self.apply_subst(&obj_ty);

                match &obj_resolved {
                    Ty::Entity => {
                        if ENTITY_FIELDS.contains(&field.as_str()) {
                            Ty::Int
                        } else {
                            // Unknown field – don't cascade; just return Int as a best guess
                            Ty::Int
                        }
                    }
                    Ty::Row(fields, _tail) => {
                        if let Some((_, ty)) = fields.iter().find(|(n, _)| n == field) {
                            ty.clone()
                        } else {
                            self.fresh_ty()
                        }
                    }
                    _ => {
                        self.errors.push(TypeError {
                            kind: TypeErrorKind::UnificationMismatch(obj_resolved, Ty::Entity),
                            span: dummy,
                        });
                        self.fresh_ty()
                    }
                }
            }

            // ----- if expression -----
            Expr::If(if_expr) => {
                let cond_ty = self.infer_expr(&if_expr.condition);
                let _ = self.unify(&cond_ty, &Ty::Bool, &dummy);
                let then_ty = self.infer_block(&if_expr.then_block);
                let else_ty = match &if_expr.else_clause {
                    Some(ElseClause::Block(stmts)) => self.infer_block(stmts),
                    Some(ElseClause::If(inner)) => {
                        let if_expr = IfExpr {
                            condition: inner.condition.clone(),
                            then_block: inner.then_block.clone(),
                            else_clause: inner.else_clause.clone(),
                        };
                        self.infer_expr(&Expr::If(Box::new(if_expr)))
                    }
                    None => Ty::Unit,
                };
                let _ = self.unify(&then_ty, &else_ty, &dummy);
                then_ty
            }

            // ----- struct / row literal -----
            Expr::Struct(fields) => {
                let typed_fields: Vec<(String, Ty)> = fields
                    .iter()
                    .map(|(name, expr)| (name.clone(), self.infer_expr(expr)))
                    .collect();
                let tail = self.fresh_var();
                Ty::Row(typed_fields, Some(tail))
            }

            // ----- list literal -----
            Expr::List(elements) => {
                if elements.is_empty() {
                    Ty::List(Box::new(self.fresh_ty()))
                } else {
                    let first = self.infer_expr(&elements[0]);
                    for elem in &elements[1..] {
                        let et = self.infer_expr(elem);
                        let _ = self.unify(&first, &et, &dummy);
                    }
                    Ty::List(Box::new(first))
                }
            }
        }
    }

    // -----------------------------------------------------------------------
    // Block inference
    // -----------------------------------------------------------------------

    /// Infer the type produced by a block of statements.
    fn infer_block(&mut self, stmts: &[Stmt]) -> Ty {
        self.enter_scope();
        let mut last = Ty::Unit;
        for stmt in stmts {
            last = self.infer_stmt(stmt);
        }
        self.exit_scope();
        last
    }

    // -----------------------------------------------------------------------
    // Top-level program checking
    // -----------------------------------------------------------------------

    /// Type-check a complete program. Returns `Ok(())` or all collected errors.
    pub fn check_program(&mut self, program: &Program) -> Result<(), Vec<TypeError>> {
        for item in &program.items {
            self.check_item(item);
        }
        if self.errors.is_empty() {
            Ok(())
        } else {
            Err(std::mem::take(&mut self.errors))
        }
    }

    fn check_item(&mut self, item: &Item) {
        match item {
            Item::Card(card) => self.check_card(card),
            Item::Fn(fn_def) => self.check_fn_def(fn_def),
            Item::Const(const_def) => self.check_const(const_def),
            Item::Effect(effect_def) => self.check_effect_def(effect_def),
            Item::Use(_) => {} // skip imports
        }
    }

    fn check_card(&mut self, card: &CardDef) {
        for body_item in &card.body {
            match body_item {
                CardBodyItem::Stats(stats) => {
                    for field in &stats.fields {
                        let vt = self.infer_expr(&field.value);
                        let _ = self.unify(&vt, &Ty::Int, &Span::at(0));
                    }
                }
                CardBodyItem::Ability(ability) => self.check_ability(ability),
                CardBodyItem::Passive(passive) => self.check_passive(passive),
            }
        }
    }

    fn check_ability(&mut self, ability: &AbilityDef) {
        self.enter_scope();
        for param in &ability.params {
            let ty = self.type_ann_to_ty(&param.type_ann);
            self.push_env(param.name.clone(), TypeScheme::monomorphic(ty));
        }
        for body_item in &ability.body {
            match body_item {
                AbilityBodyItem::Cost(cost) => {
                    let at = self.infer_expr(&cost.amount);
                    let _ = self.unify(&at, &Ty::Int, &Span::at(0));
                }
                AbilityBodyItem::Trigger(trigger) => {
                    for stmt in &trigger.body {
                        self.infer_stmt(stmt);
                    }
                }
                AbilityBodyItem::Stmt(stmt) => {
                    self.infer_stmt(stmt);
                }
            }
        }
        self.exit_scope();
    }

    fn check_passive(&mut self, passive: &PassiveDef) {
        self.enter_scope();
        for stmt in &passive.body {
            self.infer_stmt(stmt);
        }
        self.exit_scope();
    }

    fn check_fn_def(&mut self, fn_def: &FnDef) {
        self.enter_scope();
        for param in &fn_def.params {
            let ty = self.type_ann_to_ty(&param.type_ann);
            self.push_env(param.name.clone(), TypeScheme::monomorphic(ty));
        }

        // Allocate return type
        let ret_ty = fn_def
            .return_type
            .as_ref()
            .map(|a| self.type_ann_to_ty(a))
            .unwrap_or_else(|| self.fresh_ty());

        // Check body
        for stmt in &fn_def.body {
            self.infer_stmt(stmt);
        }

        // Register function type in global scope for later use
        let param_tys: Vec<Ty> = fn_def
            .params
            .iter()
            .map(|p| self.type_ann_to_ty(&p.type_ann))
            .collect();
        let fn_ty = Ty::Fn(param_tys, Box::new(ret_ty));
        self.env[0].insert(fn_def.name.clone(), TypeScheme::monomorphic(fn_ty));

        self.exit_scope();
    }

    fn check_const(&mut self, const_def: &ConstDef) {
        let vt = self.infer_expr(&const_def.value);
        let at = self.type_ann_to_ty(&const_def.type_ann);
        let _ = self.unify(&vt, &at, &Span::at(0));
        self.env[0].insert(
            const_def.name.clone(),
            TypeScheme::monomorphic(at),
        );
    }

    fn check_effect_def(&mut self, effect_def: &EffectDef) {
        // Register the effect type name
        self.env[0].insert(
            effect_def.name.clone(),
            TypeScheme::monomorphic(Ty::Named(effect_def.name.clone())),
        );

        for variant in &effect_def.variants {
            self.enter_scope();
            for param in &variant.params {
                let ty = self.type_ann_to_ty(&param.type_ann);
                self.push_env(param.name.clone(), TypeScheme::monomorphic(ty));
            }
            for stmt in &variant.body {
                self.infer_stmt(stmt);
            }
            self.exit_scope();
        }
    }

    // -----------------------------------------------------------------------
    // Error accessors
    // -----------------------------------------------------------------------

    /// Get a reference to collected errors.
    pub fn errors(&self) -> &[TypeError] {
        &self.errors
    }

    /// Drain collected errors.
    pub fn take_errors(&mut self) -> Vec<TypeError> {
        std::mem::take(&mut self.errors)
    }
}

// ===========================================================================
// Tests
// ===========================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // Helper: create a dummy span for testing.
    fn sp() -> Span {
        Span::at(0)
    }

    // -----------------------------------------------------------------------
    // Primitive literals
    // -----------------------------------------------------------------------

    #[test]
    fn test_int_literal_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::IntLit(42));
        assert_eq!(ty, Ty::Int);
    }

    #[test]
    fn test_bool_literal_type() {
        let mut tc = TypeChecker::new();
        assert_eq!(tc.infer_expr(&Expr::BoolLit(true)), Ty::Bool);
        assert_eq!(tc.infer_expr(&Expr::BoolLit(false)), Ty::Bool);
    }

    #[test]
    fn test_str_literal_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::StrLit("hello".into()));
        assert_eq!(ty, Ty::Str);
    }

    #[test]
    fn test_unit_type_available() {
        // Unit isn't directly produced by a literal, but verify it exists
        let ty = Ty::Unit;
        assert_eq!(ty, Ty::Unit);
    }

    // -----------------------------------------------------------------------
    // Variable lookup
    // -----------------------------------------------------------------------

    #[test]
    fn test_variable_lookup() {
        let mut tc = TypeChecker::new();
        tc.push_env("x".into(), TypeScheme::monomorphic(Ty::Int));
        let ty = tc.infer_expr(&Expr::Ident("x".into()));
        assert_eq!(ty, Ty::Int);
    }

    #[test]
    fn test_undefined_variable_error() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::Ident("nonexistent".into()));
        // Should return a fresh type variable to avoid cascading errors
        assert!(matches!(ty, Ty::Var(_)));
        assert_eq!(tc.errors().len(), 1);
        assert!(matches!(
            &tc.errors()[0].kind,
            TypeErrorKind::UndefinedVariable(n) if n == "nonexistent"
        ));
    }

    #[test]
    fn test_scope_shadowing() {
        let mut tc = TypeChecker::new();
        tc.push_env("x".into(), TypeScheme::monomorphic(Ty::Int));
        tc.enter_scope();
        tc.push_env("x".into(), TypeScheme::monomorphic(Ty::Bool));
        let ty = tc.infer_expr(&Expr::Ident("x".into()));
        assert_eq!(ty, Ty::Bool);
        tc.exit_scope();
        let ty2 = tc.infer_expr(&Expr::Ident("x".into()));
        assert_eq!(ty2, Ty::Int);
    }

    // -----------------------------------------------------------------------
    // Arithmetic operations
    // -----------------------------------------------------------------------

    #[test]
    fn test_arithmetic_add() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::IntLit(1)),
            right: Box::new(Expr::IntLit(2)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_arithmetic_sub() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Sub,
            left: Box::new(Expr::IntLit(10)),
            right: Box::new(Expr::IntLit(3)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
    }

    #[test]
    fn test_arithmetic_mul() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Mul,
            left: Box::new(Expr::IntLit(4)),
            right: Box::new(Expr::IntLit(5)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
    }

    #[test]
    fn test_arithmetic_div() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Div,
            left: Box::new(Expr::IntLit(20)),
            right: Box::new(Expr::IntLit(4)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
    }

    #[test]
    fn test_arithmetic_mod() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Mod,
            left: Box::new(Expr::IntLit(7)),
            right: Box::new(Expr::IntLit(3)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
    }

    #[test]
    fn test_arithmetic_type_mismatch() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Add,
            left: Box::new(Expr::BoolLit(true)),
            right: Box::new(Expr::IntLit(1)),
        };
        let _ = tc.infer_expr(&expr);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Comparison operations
    // -----------------------------------------------------------------------

    #[test]
    fn test_comparison_eq() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Eq,
            left: Box::new(Expr::IntLit(1)),
            right: Box::new(Expr::IntLit(2)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    #[test]
    fn test_comparison_lt() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Lt,
            left: Box::new(Expr::IntLit(1)),
            right: Box::new(Expr::IntLit(2)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    #[test]
    fn test_comparison_ge() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Ge,
            left: Box::new(Expr::IntLit(5)),
            right: Box::new(Expr::IntLit(5)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    #[test]
    fn test_comparison_neq() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Neq,
            left: Box::new(Expr::BoolLit(true)),
            right: Box::new(Expr::BoolLit(false)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    // -----------------------------------------------------------------------
    // Logical operations
    // -----------------------------------------------------------------------

    #[test]
    fn test_logical_and() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::And,
            left: Box::new(Expr::BoolLit(true)),
            right: Box::new(Expr::BoolLit(false)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    #[test]
    fn test_logical_or() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Binary {
            op: BinOp::Or,
            left: Box::new(Expr::BoolLit(true)),
            right: Box::new(Expr::BoolLit(false)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    // -----------------------------------------------------------------------
    // Unary operations
    // -----------------------------------------------------------------------

    #[test]
    fn test_unary_neg() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Unary {
            op: UnaryOp::Neg,
            operand: Box::new(Expr::IntLit(42)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
    }

    #[test]
    fn test_unary_not() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Unary {
            op: UnaryOp::Not,
            operand: Box::new(Expr::BoolLit(true)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Bool);
    }

    // -----------------------------------------------------------------------
    // If expressions
    // -----------------------------------------------------------------------

    #[test]
    fn test_if_expression_both_branches() {
        let mut tc = TypeChecker::new();
        let expr = Expr::If(Box::new(IfExpr {
            condition: Expr::BoolLit(true),
            then_block: vec![Stmt::Expr(Expr::IntLit(1))],
            else_clause: Some(ElseClause::Block(vec![Stmt::Expr(Expr::IntLit(2))])),
        }));
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::Int);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_if_expression_without_else() {
        let mut tc = TypeChecker::new();
        let expr = Expr::If(Box::new(IfExpr {
            condition: Expr::BoolLit(false),
            then_block: vec![Stmt::Expr(Expr::IntLit(1))],
            else_clause: None,
        }));
        let ty = tc.infer_expr(&expr);
        // then-block is Int, else is Unit → mismatch
        assert!(!tc.errors().is_empty());
        assert_eq!(ty, Ty::Int); // returns then-type
    }

    #[test]
    fn test_if_branch_type_mismatch() {
        let mut tc = TypeChecker::new();
        let expr = Expr::If(Box::new(IfExpr {
            condition: Expr::BoolLit(true),
            then_block: vec![Stmt::Expr(Expr::IntLit(1))],
            else_clause: Some(ElseClause::Block(vec![Stmt::Expr(Expr::StrLit("no".into()))])),
        }));
        let _ = tc.infer_expr(&expr);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Let bindings
    // -----------------------------------------------------------------------

    #[test]
    fn test_let_binding() {
        let mut tc = TypeChecker::new();
        let stmt = Stmt::Let(LetStmt {
            name: "x".into(),
            type_ann: None,
            value: Expr::IntLit(10),
        });
        let ty = tc.infer_stmt(&stmt);
        assert_eq!(ty, Ty::Int);
        // Verify x is now in scope
        let lookup = tc.lookup_env("x");
        assert!(lookup.is_some());
    }

    #[test]
    fn test_let_binding_with_annotation() {
        let mut tc = TypeChecker::new();
        let stmt = Stmt::Let(LetStmt {
            name: "x".into(),
            type_ann: Some(TypeAnn::Bool),
            value: Expr::BoolLit(true),
        });
        let ty = tc.infer_stmt(&stmt);
        assert_eq!(ty, Ty::Bool);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_let_binding_annotation_mismatch() {
        let mut tc = TypeChecker::new();
        let stmt = Stmt::Let(LetStmt {
            name: "x".into(),
            type_ann: Some(TypeAnn::Int),
            value: Expr::BoolLit(true),
        });
        let _ = tc.infer_stmt(&stmt);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Assignment
    // -----------------------------------------------------------------------

    #[test]
    fn test_assignment_to_bound_variable() {
        let mut tc = TypeChecker::new();
        tc.push_env("x".into(), TypeScheme::monomorphic(Ty::Int));
        let stmt = Stmt::Assign(AssignStmt {
            name: "x".into(),
            value: Expr::IntLit(99),
        });
        let ty = tc.infer_stmt(&stmt);
        assert_eq!(ty, Ty::Unit);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_assignment_to_undefined_variable() {
        let mut tc = TypeChecker::new();
        let stmt = Stmt::Assign(AssignStmt {
            name: "y".into(),
            value: Expr::IntLit(1),
        });
        let _ = tc.infer_stmt(&stmt);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Function calls
    // -----------------------------------------------------------------------

    #[test]
    fn test_function_call_correct_arity() {
        let mut tc = TypeChecker::new();
        // damage(target, 10) → (entity, int) -> unit
        let expr = Expr::Call {
            func: Box::new(Expr::Ident("damage".into())),
            args: vec![
                CallArg::Positional(Expr::Ident("target".into())),
                CallArg::Positional(Expr::IntLit(10)),
            ],
        };
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::Unit);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_function_call_too_few_args() {
        let mut tc = TypeChecker::new();
        // damage(target) — missing second arg
        let expr = Expr::Call {
            func: Box::new(Expr::Ident("damage".into())),
            args: vec![CallArg::Positional(Expr::Ident("target".into()))],
        };
        let _ = tc.infer_expr(&expr);
        // Should produce an arity mismatch error (Fn unification fails)
        assert!(!tc.errors().is_empty());
    }

    #[test]
    fn test_function_call_too_many_args() {
        let mut tc = TypeChecker::new();
        // is_alive(target, extra) — too many args
        let expr = Expr::Call {
            func: Box::new(Expr::Ident("is_alive".into())),
            args: vec![
                CallArg::Positional(Expr::Ident("target".into())),
                CallArg::Positional(Expr::IntLit(1)),
            ],
        };
        let _ = tc.infer_expr(&expr);
        assert!(!tc.errors().is_empty());
    }

    #[test]
    fn test_call_non_function() {
        let mut tc = TypeChecker::new();
        // 42() — int is not callable
        let expr = Expr::Call {
            func: Box::new(Expr::IntLit(42)),
            args: vec![],
        };
        let _ = tc.infer_expr(&expr);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Member access
    // -----------------------------------------------------------------------

    #[test]
    fn test_member_access_entity_field() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Member {
            object: Box::new(Expr::Ident("target".into())),
            field: "hp".into(),
        };
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::Int);
    }

    #[test]
    fn test_member_access_entity_maxhp() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Member {
            object: Box::new(Expr::Ident("self".into())),
            field: "maxhp".into(),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
    }

    #[test]
    fn test_member_access_entity_atk_def_shield() {
        let mut tc = TypeChecker::new();
        for field in &["atk", "def", "shield"] {
            let expr = Expr::Member {
                object: Box::new(Expr::Ident("caster".into())),
                field: (*field).into(),
            };
            assert_eq!(tc.infer_expr(&expr), Ty::Int);
        }
    }

    #[test]
    fn test_member_access_non_entity() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Member {
            object: Box::new(Expr::IntLit(42)),
            field: "hp".into(),
        };
        let _ = tc.infer_expr(&expr);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Struct / Row literal
    // -----------------------------------------------------------------------

    #[test]
    fn test_struct_literal_row_type() {
        let mut tc = TypeChecker::new();
        let expr = Expr::Struct(vec![
            ("hp".into(), Expr::IntLit(100)),
            ("atk".into(), Expr::IntLit(25)),
        ]);
        let ty = tc.infer_expr(&expr);
        match &ty {
            Ty::Row(fields, Some(_tail)) => {
                assert_eq!(fields.len(), 2);
                assert_eq!(fields[0].0, "hp");
                assert_eq!(fields[0].1, Ty::Int);
                assert_eq!(fields[1].0, "atk");
                assert_eq!(fields[1].1, Ty::Int);
            }
            other => panic!("Expected Row type, got {:?}", other),
        }
    }

    #[test]
    fn test_row_field_access() {
        let mut tc = TypeChecker::new();
        // Create a row and access a field
        tc.push_env(
            "stats".into(),
            TypeScheme::monomorphic(Ty::Row(
                vec![("hp".into(), Ty::Int), ("atk".into(), Ty::Int)],
                None,
            )),
        );
        let expr = Expr::Member {
            object: Box::new(Expr::Ident("stats".into())),
            field: "hp".into(),
        };
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::Int);
    }

    #[test]
    fn test_row_field_not_found() {
        let mut tc = TypeChecker::new();
        tc.push_env(
            "stats".into(),
            TypeScheme::monomorphic(Ty::Row(
                vec![("hp".into(), Ty::Int)],
                None,
            )),
        );
        let expr = Expr::Member {
            object: Box::new(Expr::Ident("stats".into())),
            field: "mp".into(),
        };
        let ty = tc.infer_expr(&expr);
        // Should return a fresh variable (no error emitted for row field miss in this impl)
        assert!(matches!(ty, Ty::Var(_)));
    }

    // -----------------------------------------------------------------------
    // List types
    // -----------------------------------------------------------------------

    #[test]
    fn test_list_literal_type() {
        let mut tc = TypeChecker::new();
        let expr = Expr::List(vec![Expr::IntLit(1), Expr::IntLit(2), Expr::IntLit(3)]);
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::List(Box::new(Ty::Int)));
    }

    #[test]
    fn test_empty_list_type() {
        let mut tc = TypeChecker::new();
        let expr = Expr::List(vec![]);
        let ty = tc.infer_expr(&expr);
        assert!(matches!(ty, Ty::List(_)));
    }

    #[test]
    fn test_list_type_mismatch() {
        let mut tc = TypeChecker::new();
        let expr = Expr::List(vec![Expr::IntLit(1), Expr::BoolLit(true)]);
        let _ = tc.infer_expr(&expr);
        assert!(!tc.errors().is_empty());
    }

    // -----------------------------------------------------------------------
    // Built-in function types
    // -----------------------------------------------------------------------

    #[test]
    fn test_builtin_damage_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::Ident("damage".into()));
        let resolved = tc.resolve(&ty);
        assert_eq!(
            resolved,
            Ty::Fn(vec![Ty::Entity, Ty::Int], Box::new(Ty::Unit))
        );
    }

    #[test]
    fn test_builtin_is_alive_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::Ident("is_alive".into()));
        let resolved = tc.resolve(&ty);
        assert_eq!(
            resolved,
            Ty::Fn(vec![Ty::Entity], Box::new(Ty::Bool))
        );
    }

    #[test]
    fn test_builtin_clamp_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::Ident("clamp".into()));
        let resolved = tc.resolve(&ty);
        assert_eq!(
            resolved,
            Ty::Fn(vec![Ty::Int, Ty::Int, Ty::Int], Box::new(Ty::Int))
        );
    }

    #[test]
    fn test_builtin_abs_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::Ident("abs".into()));
        let resolved = tc.resolve(&ty);
        assert_eq!(resolved, Ty::Fn(vec![Ty::Int], Box::new(Ty::Int)));
    }

    #[test]
    fn test_builtin_heal_type() {
        let mut tc = TypeChecker::new();
        let ty = tc.infer_expr(&Expr::Ident("heal".into()));
        let resolved = tc.resolve(&ty);
        assert_eq!(
            resolved,
            Ty::Fn(vec![Ty::Entity, Ty::Int], Box::new(Ty::Unit))
        );
    }

    // -----------------------------------------------------------------------
    // Unification
    // -----------------------------------------------------------------------

    #[test]
    fn test_unify_same_types() {
        let mut tc = TypeChecker::new();
        assert!(tc.unify(&Ty::Int, &Ty::Int, &sp()).is_ok());
        assert!(tc.unify(&Ty::Bool, &Ty::Bool, &sp()).is_ok());
        assert!(tc.unify(&Ty::Str, &Ty::Str, &sp()).is_ok());
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_unify_mismatch() {
        let mut tc = TypeChecker::new();
        assert!(tc.unify(&Ty::Int, &Ty::Bool, &sp()).is_err());
        assert_eq!(tc.errors().len(), 1);
    }

    #[test]
    fn test_unify_type_variable() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        assert!(tc.unify(&Ty::Var(v), &Ty::Int, &sp()).is_ok());
        let resolved = tc.resolve(&Ty::Var(v));
        assert_eq!(resolved, Ty::Int);
    }

    #[test]
    fn test_unify_two_variables() {
        let mut tc = TypeChecker::new();
        let v1 = tc.fresh_var();
        let v2 = tc.fresh_var();
        assert!(tc.unify(&Ty::Var(v1), &Ty::Var(v2), &sp()).is_ok());
        // Both should now resolve to the same thing
        let r1 = tc.resolve(&Ty::Var(v1));
        let r2 = tc.resolve(&Ty::Var(v2));
        assert_eq!(r1, r2);
    }

    #[test]
    fn test_unify_function_types() {
        let mut tc = TypeChecker::new();
        let t1 = Ty::Fn(vec![Ty::Int, Ty::Int], Box::new(Ty::Bool));
        let t2 = Ty::Fn(vec![Ty::Int, Ty::Int], Box::new(Ty::Bool));
        assert!(tc.unify(&t1, &t2, &sp()).is_ok());
    }

    #[test]
    fn test_unify_list_types() {
        let mut tc = TypeChecker::new();
        let t1 = Ty::List(Box::new(Ty::Int));
        let t2 = Ty::List(Box::new(Ty::Int));
        assert!(tc.unify(&t1, &t2, &sp()).is_ok());
        let t3 = Ty::List(Box::new(Ty::Bool));
        assert!(tc.unify(&t1, &t3, &sp()).is_err());
    }

    // -----------------------------------------------------------------------
    // Cyclic type detection (occurs check)
    // -----------------------------------------------------------------------

    #[test]
    fn test_cyclic_type_detection() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        // Try to unify ?0 = (?0 -> int) → cyclic!
        let fn_ty = Ty::Fn(vec![Ty::Var(v)], Box::new(Ty::Int));
        assert!(tc.unify(&Ty::Var(v), &fn_ty, &sp()).is_err());
        assert!(matches!(
            &tc.errors()[0].kind,
            TypeErrorKind::CyclicType
        ));
    }

    // -----------------------------------------------------------------------
    // Row unification
    // -----------------------------------------------------------------------

    #[test]
    fn test_row_unification_identical() {
        let mut tc = TypeChecker::new();
        let r1 = Ty::Row(vec![("hp".into(), Ty::Int), ("atk".into(), Ty::Int)], None);
        let r2 = Ty::Row(vec![("hp".into(), Ty::Int), ("atk".into(), Ty::Int)], None);
        assert!(tc.unify(&r1, &r2, &sp()).is_ok());
    }

    #[test]
    fn test_row_unification_with_tail() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        let r1 = Ty::Row(vec![("hp".into(), Ty::Int)], Some(v));
        let r2 = Ty::Row(
            vec![("hp".into(), Ty::Int), ("atk".into(), Ty::Int)],
            None,
        );
        assert!(tc.unify(&r1, &r2, &sp()).is_ok());
    }

    #[test]
    fn test_row_unification_mismatch_closed() {
        let mut tc = TypeChecker::new();
        let r1 = Ty::Row(vec![("hp".into(), Ty::Int)], None);
        let r2 = Ty::Row(vec![("atk".into(), Ty::Int)], None);
        // Both closed, no common fields, should fail
        assert!(tc.unify(&r1, &r2, &sp()).is_err());
    }

    // -----------------------------------------------------------------------
    // Generalize & instantiate (let-polymorphism)
    // -----------------------------------------------------------------------

    #[test]
    fn test_generalize_fresh_variable() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        let ty = Ty::Var(v);
        let scheme = tc.generalize(&ty);
        // The variable should be quantified (it's not in the env)
        assert!(scheme.vars.contains(&v));
    }

    #[test]
    fn test_generalize_does_not_quantify_env_vars() {
        let mut tc = TypeChecker::new();
        let env_var = tc.fresh_var();
        tc.subst.insert(env_var, Ty::Int);
        // Now create a type with a fresh var
        let fresh = tc.fresh_var();
        let ty = Ty::Fn(vec![Ty::Var(fresh)], Box::new(Ty::Var(env_var)));
        let scheme = tc.generalize(&ty);
        // fresh should be quantified, env_var should not
        assert!(scheme.vars.contains(&fresh));
        assert!(!scheme.vars.contains(&env_var));
    }

    #[test]
    fn test_instantiate_creates_fresh_vars() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        let scheme = TypeScheme::new(vec![v], Ty::Fn(vec![Ty::Var(v)], Box::new(Ty::Var(v))));
        let inst1 = tc.instantiate(&scheme);
        let inst2 = tc.instantiate(&scheme);
        // The two instances should have different variable ids
        assert_ne!(inst1, inst2);
        // Both should be function types
        assert!(matches!(inst1, Ty::Fn(_, _)));
        assert!(matches!(inst2, Ty::Fn(_, _)));
    }

    #[test]
    fn test_monomorphic_scheme_no_quantification() {
        let mut tc = TypeChecker::new();
        let scheme = TypeScheme::monomorphic(Ty::Int);
        let inst = tc.instantiate(&scheme);
        assert_eq!(inst, Ty::Int);
    }

    // -----------------------------------------------------------------------
    // Resolve
    // -----------------------------------------------------------------------

    #[test]
    fn test_resolve_type_variable() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        tc.subst.insert(v, Ty::Bool);
        assert_eq!(tc.resolve(&Ty::Var(v)), Ty::Bool);
    }

    #[test]
    fn test_resolve_chain() {
        let mut tc = TypeChecker::new();
        let v0 = tc.fresh_var();
        let v1 = tc.fresh_var();
        tc.subst.insert(v0, Ty::Var(v1));
        tc.subst.insert(v1, Ty::Int);
        assert_eq!(tc.resolve(&Ty::Var(v0)), Ty::Int);
    }

    // -----------------------------------------------------------------------
    // apply_subst
    // -----------------------------------------------------------------------

    #[test]
    fn test_apply_subst_primitive() {
        let mut tc = TypeChecker::new();
        assert_eq!(tc.apply_subst(&Ty::Int), Ty::Int);
        assert_eq!(tc.apply_subst(&Ty::Bool), Ty::Bool);
    }

    #[test]
    fn test_apply_subst_variable() {
        let mut tc = TypeChecker::new();
        let v = tc.fresh_var();
        tc.subst.insert(v, Ty::Str);
        assert_eq!(tc.apply_subst(&Ty::Var(v)), Ty::Str);
    }

    // -----------------------------------------------------------------------
    // Program-level checking
    // -----------------------------------------------------------------------

    #[test]
    fn test_check_program_empty() {
        let mut tc = TypeChecker::new();
        let program = Program {
            module: None,
            items: vec![],
        };
        assert!(tc.check_program(&program).is_ok());
    }

    #[test]
    fn test_check_const_definition() {
        let mut tc = TypeChecker::new();
        let program = Program {
            module: None,
            items: vec![Item::Const(ConstDef {
                name: "MAX_HP".into(),
                type_ann: TypeAnn::Int,
                value: Expr::IntLit(100),
            })],
        };
        assert!(tc.check_program(&program).is_ok());
    }

    #[test]
    fn test_check_fn_definition() {
        let mut tc = TypeChecker::new();
        let program = Program {
            module: None,
            items: vec![Item::Fn(FnDef {
                name: "double".into(),
                params: vec![Param {
                    name: "x".into(),
                    type_ann: TypeAnn::Int,
                }],
                return_type: Some(TypeAnn::Int),
                effect: None,
                body: vec![Stmt::Return(ReturnStmt {
                    value: Some(Expr::Binary {
                        op: BinOp::Mul,
                        left: Box::new(Expr::Ident("x".into())),
                        right: Box::new(Expr::IntLit(2)),
                    }),
                })],
            })],
        };
        assert!(tc.check_program(&program).is_ok());
    }

    // -----------------------------------------------------------------------
    // Nested / complex expressions
    // -----------------------------------------------------------------------

    #[test]
    fn test_nested_binary_expression() {
        let mut tc = TypeChecker::new();
        // (1 + 2) * 3
        let expr = Expr::Binary {
            op: BinOp::Mul,
            left: Box::new(Expr::Binary {
                op: BinOp::Add,
                left: Box::new(Expr::IntLit(1)),
                right: Box::new(Expr::IntLit(2)),
            }),
            right: Box::new(Expr::IntLit(3)),
        };
        assert_eq!(tc.infer_expr(&expr), Ty::Int);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_nested_if_expression() {
        let mut tc = TypeChecker::new();
        let expr = Expr::If(Box::new(IfExpr {
            condition: Expr::BoolLit(true),
            then_block: vec![Stmt::Expr(Expr::If(Box::new(IfExpr {
                condition: Expr::BoolLit(false),
                then_block: vec![Stmt::Expr(Expr::IntLit(1))],
                else_clause: Some(ElseClause::Block(vec![Stmt::Expr(Expr::IntLit(2))])),
            })))],
            else_clause: Some(ElseClause::Block(vec![Stmt::Expr(Expr::IntLit(3))])),
        }));
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::Int);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_complex_function_call_chain() {
        let mut tc = TypeChecker::new();
        // clamp(min(a, b), 0, 100)
        let expr = Expr::Call {
            func: Box::new(Expr::Ident("clamp".into())),
            args: vec![
                CallArg::Positional(Expr::Call {
                    func: Box::new(Expr::Ident("min".into())),
                    args: vec![
                        CallArg::Positional(Expr::IntLit(5)),
                        CallArg::Positional(Expr::IntLit(10)),
                    ],
                }),
                CallArg::Positional(Expr::IntLit(0)),
                CallArg::Positional(Expr::IntLit(100)),
            ],
        };
        let ty = tc.infer_expr(&expr);
        assert_eq!(ty, Ty::Int);
        assert!(tc.errors().is_empty());
    }

    #[test]
    fn test_display_type() {
        assert_eq!(format!("{}", Ty::Int), "int");
        assert_eq!(format!("{}", Ty::Bool), "bool");
        assert_eq!(format!("{}", Ty::Str), "str");
        assert_eq!(format!("{}", Ty::Unit), "unit");
        assert_eq!(format!("{}", Ty::Entity), "entity");
    }

    #[test]
    fn test_display_fn_type() {
        let ty = Ty::Fn(vec![Ty::Int, Ty::Int], Box::new(Ty::Bool));
        let s = format!("{}", ty);
        assert!(s.contains("int"));
        assert!(s.contains("bool"));
    }

    #[test]
    fn test_error_display() {
        let err = TypeError {
            kind: TypeErrorKind::UndefinedVariable("foo".into()),
            span: Span::new(10, 20),
        };
        let s = format!("{}", err);
        assert!(s.contains("foo"));
        assert!(s.contains("10..20"));
    }

    #[test]
    fn test_type_error_kind_display() {
        let kind = TypeErrorKind::ArityMismatch {
            expected: 2,
            found: 3,
        };
        let s = format!("{}", kind);
        assert!(s.contains("2") && s.contains("3"));
    }

    #[test]
    fn test_named_type() {
        let mut tc = TypeChecker::new();
        let n1 = Ty::Named("MyType".into());
        let n2 = Ty::Named("MyType".into());
        let n3 = Ty::Named("OtherType".into());
        assert!(tc.unify(&n1, &n2, &sp()).is_ok());
        assert!(tc.unify(&n1, &n3, &sp()).is_err());
    }

    #[test]
    fn test_function_arity_error_in_unify() {
        let mut tc = TypeChecker::new();
        let f1 = Ty::Fn(vec![Ty::Int], Box::new(Ty::Unit));
        let f2 = Ty::Fn(vec![Ty::Int, Ty::Int], Box::new(Ty::Unit));
        let result = tc.unify(&f1, &f2, &sp());
        assert!(result.is_err());
        assert!(matches!(
            result.unwrap_err().kind,
            TypeErrorKind::ArityMismatch { .. }
        ));
    }
}
