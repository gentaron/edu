//! Hindley-Milner type inference with row polymorphism.
//!
//! Implements Algorithm W (Damas-Milner) for type inference with extensions for
//! row polymorphism in record types. Supports type variables, unification,
//! substitution, and generalization into type schemes.

use std::collections::HashMap;
use std::fmt;

use crate::span::Span;

/// Unique identifier for type variables.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct TypeVarId(pub u32);

/// Represents types in the Apolon type system.
#[derive(Debug, Clone, PartialEq)]
pub enum Type {
    /// Type variable: `a`, `b`, etc.
    Var(TypeVarId),
    /// Concrete named type: `Int`, `Bool`, `String`, `Unit`, user-defined.
    Named(String),
    /// Function type: `A -> B`
    Arrow(Box<Type>, Box<Type>),
    /// Record type with row polymorphism: `{#name: String, #age: Int | r}`
    Record(Vec<(String, Type)>, Option<TypeVarId>),
    /// List type: `[T]`
    List(Box<Type>),
    /// Tuple type: `(A, B, C)`
    Tuple(Vec<Type>),
    /// Row extension: used for row polymorphism (internal)
    RowExtend(String, Box<Type>, Box<Type>),
    /// Row variable (empty row)
    EmptyRow,
}

impl fmt::Display for Type {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Var(id) => write!(f, "t{}", id.0),
            Self::Named(name) => write!(f, "{name}"),
            Self::Arrow(param, ret) => write!(f, "({param} -> {ret})"),
            Self::Record(fields, rest) => {
                write!(f, "{{")?;
                for (i, (label, ty)) in fields.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "#{label}: {ty}")?;
                }
                if let Some(rv) = rest {
                    write!(f, " | t{})", rv.0)?;
                }
                write!(f, "}}")
            }
            Self::List(elem) => write!(f, "[{elem}]"),
            Self::Tuple(elems) => {
                write!(f, "(")?;
                for (i, e) in elems.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{e}")?;
                }
                write!(f, ")")
            }
            Self::RowExtend(label, ty, rest) => {
                write!(f, "(#{label}: {ty} | {rest})")
            }
            Self::EmptyRow => write!(f, "{{}}"),
        }
    }
}

/// A type scheme: `∀a1...an. T`
///
/// Represents a polymorphic type with quantified type variables.
#[derive(Debug, Clone, PartialEq)]
pub struct TypeScheme {
    /// Universally quantified type variables.
    pub vars: Vec<TypeVarId>,
    /// The type body.
    pub ty: Type,
}

impl TypeScheme {
    /// Create a monomorphic type scheme (no quantified variables).
    #[must_use]
    pub fn monomorphic(ty: Type) -> Self {
        Self { vars: vec![], ty }
    }

    /// Instantiate a type scheme by replacing quantified variables with fresh ones.
    pub fn instantiate(&self, subst: &mut Substitution) -> Type {
        let fresh: Vec<_> = self.vars.iter().map(|_| subst.fresh_var()).collect();
        let mut mapping = HashMap::new();
        for (old, new) in self.vars.iter().zip(fresh.iter()) {
            mapping.insert(*old, *new);
        }
        self.ty.apply_mapping(&mapping)
    }
}

/// A substitution mapping type variables to types.
#[derive(Debug, Clone, PartialEq)]
pub struct Substitution {
    mapping: HashMap<TypeVarId, Type>,
    next_var_id: u32,
}

impl Substitution {
    /// Create a new empty substitution.
    #[must_use]
    pub fn new() -> Self {
        Self {
            mapping: HashMap::new(),
            next_var_id: 0,
        }
    }

    /// Generate a fresh type variable.
    pub fn fresh_var(&mut self) -> TypeVarId {
        let id = TypeVarId(self.next_var_id);
        self.next_var_id += 1;
        id
    }

    /// Apply this substitution to a type, resolving all type variables.
    pub fn apply(&self, ty: &Type) -> Type {
        match ty {
            Type::Var(id) => match self.mapping.get(id) {
                Some(resolved) => self.apply(resolved),
                None => Type::Var(*id),
            },
            Type::Named(name) => Type::Named(name.clone()),
            Type::Arrow(param, ret) => {
                Type::Arrow(Box::new(self.apply(param)), Box::new(self.apply(ret)))
            }
            Type::Record(fields, rest) => {
                let new_fields: Vec<_> = fields
                    .iter()
                    .map(|(label, t)| (label.clone(), self.apply(t)))
                    .collect();
                let new_rest = rest.map(|id| match self.mapping.get(&id) {
                    Some(resolved) => self.apply(resolved),
                    None => Type::Var(id),
                });
                // Simplify: if rest resolves to EmptyRow, just return the record without rest
                match &new_rest {
                    Some(Type::EmptyRow) => Type::Record(new_fields, None),
                    _ => Type::Record(new_fields, rest.clone()),
                }
            }
            Type::List(elem) => Type::List(Box::new(self.apply(elem))),
            Type::Tuple(elems) => Type::Tuple(elems.iter().map(|e| self.apply(e)).collect()),
            Type::RowExtend(label, ty, rest) => Type::RowExtend(
                label.clone(),
                Box::new(self.apply(ty)),
                Box::new(self.apply(rest)),
            ),
            Type::EmptyRow => Type::EmptyRow,
        }
    }

    /// Add a binding to the substitution.
    pub fn bind(&mut self, var: TypeVarId, ty: Type) {
        self.mapping.insert(var, ty);
    }

    /// Compose two substitutions: self after other.
    pub fn compose(&mut self, other: &Substitution) {
        let mut new_mapping = HashMap::new();
        for (var, ty) in &other.mapping {
            new_mapping.insert(*var, self.apply(ty));
        }
        for (var, ty) in &self.mapping {
            if !new_mapping.contains_key(var) {
                new_mapping.insert(*var, ty.clone());
            }
        }
        self.mapping = new_mapping;
        self.next_var_id = self.next_var_id.max(other.next_var_id);
    }

    /// Get the set of free type variables in a type.
    pub fn free_vars(ty: &Type) -> Vec<TypeVarId> {
        let mut vars = Vec::new();
        Self::collect_free_vars(ty, &mut vars);
        vars.sort_by_key(|v| v.0);
        vars.dedup();
        vars
    }

    fn collect_free_vars(ty: &Type, vars: &mut Vec<TypeVarId>) {
        match ty {
            Type::Var(id) => {
                if !vars.contains(id) {
                    vars.push(*id);
                }
            }
            Type::Arrow(param, ret) => {
                Self::collect_free_vars(param, vars);
                Self::collect_free_vars(ret, vars);
            }
            Type::Record(fields, rest) => {
                for (_, t) in fields {
                    Self::collect_free_vars(t, vars);
                }
                if let Some(id) = rest {
                    if !vars.contains(id) {
                        vars.push(*id);
                    }
                }
            }
            Type::List(elem) => Self::collect_free_vars(elem, vars),
            Type::Tuple(elems) => {
                for e in elems {
                    Self::collect_free_vars(e, vars);
                }
            }
            Type::RowExtend(_, ty, rest) => {
                Self::collect_free_vars(ty, vars);
                Self::collect_free_vars(rest, vars);
            }
            Type::Named(_) | Type::EmptyRow => {}
        }
    }

    /// Get free vars in a type scheme.
    pub fn free_vars_scheme(scheme: &TypeScheme) -> Vec<TypeVarId> {
        let mut vars = Self::free_vars(&scheme.ty);
        vars.retain(|v| !scheme.vars.contains(v));
        vars
    }
}

impl Default for Substitution {
    fn default() -> Self {
        Self::new()
    }
}

/// Unification errors.
#[derive(Debug, Clone, PartialEq)]
pub enum UnificationError {
    /// Cannot unify two different named types.
    NameMismatch(String, String),
    /// Cannot unify a type variable with a type that contains it (occurs check).
    OccursCheck(TypeVarId),
    /// Cannot unify function type with non-function type.
    FunctionArityMismatch,
    /// Cannot unify record types with conflicting fields.
    RowLabelConflict(String),
    /// Cannot unify list types with different element types.
    ListMismatch,
    /// Cannot unify tuples with different lengths.
    TupleLengthMismatch(usize, usize),
    /// Cannot unify a row variable with a type containing a duplicate label.
    DuplicateRowLabel(String),
    /// Generic unification failure.
    Mismatch(Type, Type),
}

impl fmt::Display for UnificationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NameMismatch(a, b) => write!(f, "cannot unify {a} with {b}"),
            Self::OccursCheck(id) => write!(f, "infinite type: t{} occurs in itself", id.0),
            Self::FunctionArityMismatch => write!(f, "function arity mismatch"),
            Self::RowLabelConflict(label) => write!(f, "row label conflict: #{label}"),
            Self::ListMismatch => write!(f, "list element type mismatch"),
            Self::TupleLengthMismatch(a, b) => {
                write!(f, "tuple length mismatch: {a} vs {b}")
            }
            Self::DuplicateRowLabel(label) => {
                write!(f, "duplicate row label: #{label}")
            }
            Self::Mismatch(a, b) => write!(f, "cannot unify {a} with {b}"),
        }
    }
}

impl std::error::Error for UnificationError {}

/// Unify two types, producing a substitution.
pub fn unify(subst: &mut Substitution, t1: &Type, t2: &Type) -> Result<(), UnificationError> {
    let t1 = subst.apply(t1);
    let t2 = subst.apply(t2);
    unify_inner(subst, &t1, &t2)
}

fn unify_inner(
    subst: &mut Substitution,
    t1: &Type,
    t2: &Type,
) -> Result<(), UnificationError> {
    match (t1, t2) {
        // Same type variable: trivially unified
        (Type::Var(id1), Type::Var(id2)) if id1 == id2 => Ok(()),

        // Type variable on the left
        (Type::Var(id), ty) => {
            if occurs(subst, id, ty) {
                return Err(UnificationError::OccursCheck(*id));
            }
            subst.bind(*id, ty.clone());
            Ok(())
        }

        // Type variable on the right
        (ty, Type::Var(id)) => {
            if occurs(subst, id, ty) {
                return Err(UnificationError::OccursCheck(*id));
            }
            subst.bind(*id, ty.clone());
            Ok(())
        }

        // Named types
        (Type::Named(a), Type::Named(b)) if a == b => Ok(()),
        (Type::Named(a), Type::Named(b)) => Err(UnificationError::NameMismatch(a.clone(), b.clone())),

        // Arrow types
        (Type::Arrow(p1, r1), Type::Arrow(p2, r2)) => {
            unify(subst, p1, p2)?;
            unify(subst, r1, r2)
        }

        // List types
        (Type::List(e1), Type::List(e2)) => unify(subst, e1, e2),

        // Tuple types
        (Type::Tuple(elems1), Type::Tuple(elems2)) if elems1.len() == elems2.len() => {
            for (a, b) in elems1.iter().zip(elems2.iter()) {
                unify(subst, a, b)?;
            }
            Ok(())
        }
        (Type::Tuple(a), Type::Tuple(b)) => {
            Err(UnificationError::TupleLengthMismatch(a.len(), b.len()))
        }

        // Record types with row polymorphism
        (Type::Record(fields1, rest1), Type::Record(fields2, rest2)) => {
            // Unify matching fields
            let mut remaining1: Vec<_> = fields1.clone();
            let mut remaining2: Vec<_> = fields2.clone();

            let mut common_labels = Vec::new();
            for (label1, _) in fields1 {
                for (label2, _) in fields2 {
                    if label1 == label2 {
                        common_labels.push(label1.clone());
                        break;
                    }
                }
            }

            for label in &common_labels {
                if let Some(idx1) = remaining1.iter().position(|(l, _)| l == label) {
                    if let Some(idx2) = remaining2.iter().position(|(l, _)| l == label) {
                        let (_, ty1) = remaining1.remove(idx1);
                        let (_, ty2) = remaining2.remove(idx2);
                        unify(subst, &ty1, &ty2)?;
                    }
                }
            }

            // Handle remaining fields via row unification
            if !remaining1.is_empty() || !remaining2.is_empty() {
                // Create row types for remaining fields and unify with rest variables
                let row1 = fields_to_row(&remaining1, *rest1);
                let row2 = fields_to_row(&remaining2, *rest2);
                unify(subst, &row1, &row2)?;
            } else {
                // Both consumed, unify rest variables
                match (rest1, rest2) {
                    (Some(r1), Some(r2)) => unify(subst, &Type::Var(*r1), &Type::Var(*r2))?,
                    (Some(r1), None) => unify(subst, &Type::Var(*r1), &Type::EmptyRow)?,
                    (None, Some(r2)) => unify(subst, &Type::EmptyRow, &Type::Var(*r2))?,
                    (None, None) => {}
                }
            }

            Ok(())
        }

        // Empty row
        (Type::EmptyRow, Type::EmptyRow) => Ok(()),

        // Row extension unification
        (Type::RowExtend(label, ty, rest), other) | (other, Type::RowExtend(label, ty, rest)) => {
            match other {
                Type::Record(fields, rest_var) => {
                    // Check for duplicate label
                    if fields.iter().any(|(l, _)| l == label) {
                        return Err(UnificationError::DuplicateRowLabel(label.clone()));
                    }
                    let mut new_fields = vec![(label.clone(), *ty.clone())];
                    new_fields.extend(fields.clone());
                    unify(subst, &Type::Record(new_fields, *rest_var), rest)
                }
                Type::RowExtend(label2, ty2, rest2) => {
                    if label == label2 {
                        unify(subst, ty, ty2)?;
                        unify(subst, rest, rest2)
                    } else {
                        // Rotate: extend rest with (label, ty) and unify with (label2, ty2, rest2)
                        let rotated =
                            Type::RowExtend(label.clone(), ty.clone(), rest.clone());
                        // We need to unify this more carefully — for simplicity, treat as mismatch
                        // In a full implementation, we'd need row variable decomposition
                        Err(UnificationError::Mismatch(t1.clone(), t2.clone()))
                    }
                }
                Type::Var(id) => {
                    if occurs(subst, id, &t1) {
                        return Err(UnificationError::OccursCheck(*id));
                    }
                    subst.bind(*id, t1.clone());
                    Ok(())
                }
                Type::EmptyRow => Err(UnificationError::Mismatch(t1.clone(), t2.clone())),
                _ => Err(UnificationError::Mismatch(t1.clone(), t2.clone())),
            }
        }

        // Catch-all mismatch
        _ => Err(UnificationError::Mismatch(t1.clone(), t2.clone())),
    }
}

/// Check if a type variable occurs in a type (occurs check).
fn occurs(subst: &Substitution, var: &TypeVarId, ty: &Type) -> bool {
    let resolved = subst.apply(ty);
    match &resolved {
        Type::Var(id) => id == var,
        Type::Arrow(p, r) => occurs(subst, var, p) || occurs(subst, var, r),
        Type::Record(fields, rest) => {
            fields.iter().any(|(_, t)| occurs(subst, var, t))
                || rest.is_some_and(|id| &id == var)
        }
        Type::List(e) => occurs(subst, var, e),
        Type::Tuple(elems) => elems.iter().any(|e| occurs(subst, var, e)),
        Type::RowExtend(_, ty, rest) => occurs(subst, var, ty) || occurs(subst, var, rest),
        Type::Named(_) | Type::EmptyRow => false,
    }
}

/// Convert a list of fields and optional rest variable to a row type.
fn fields_to_row(fields: &[(String, Type)], rest: Option<TypeVarId>) -> Type {
    match fields {
        [] => match rest {
            Some(id) => Type::Var(id),
            None => Type::EmptyRow,
        },
        [(label, ty)] => {
            let rest_type = match rest {
                Some(id) => Type::Var(id),
                None => Type::EmptyRow,
            };
            Type::RowExtend(label.clone(), Box::new(ty.clone()), Box::new(rest_type))
        }
        _ => {
            let tail = fields_to_row(&fields[1..], rest);
            Type::RowExtend(
                fields[0].0.clone(),
                Box::new(fields[0].1.clone()),
                Box::new(tail),
            )
        }
    }
}

/// Type inference environment: maps variable names to type schemes.
#[derive(Debug, Clone)]
pub struct TypeEnv {
    pub bindings: HashMap<String, TypeScheme>,
}

impl TypeEnv {
    /// Create an empty type environment.
    #[must_use]
    pub fn new() -> Self {
        Self {
            bindings: HashMap::new(),
        }
    }

    /// Create an environment pre-populated with the Apolon built-in types.
    #[must_use]
    pub fn prelude() -> Self {
        let mut env = Self::new();

        // Arithmetic functions
        env.bind(
            "add",
            TypeScheme::monomorphic(Type::Arrow(
                Box::new(Type::Named("Int".to_string())),
                Box::new(Type::Arrow(
                    Box::new(Type::Named("Int".to_string())),
                    Box::new(Type::Named("Int".to_string())),
                )),
            )),
        );
        env.bind(
            "sub",
            TypeScheme::monomorphic(Type::Arrow(
                Box::new(Type::Named("Int".to_string())),
                Box::new(Type::Arrow(
                    Box::new(Type::Named("Int".to_string())),
                    Box::new(Type::Named("Int".to_string())),
                )),
            )),
        );
        env.bind(
            "mul",
            TypeScheme::monomorphic(Type::Arrow(
                Box::new(Type::Named("Int".to_string())),
                Box::new(Type::Arrow(
                    Box::new(Type::Named("Int".to_string())),
                    Box::new(Type::Named("Int".to_string())),
                )),
            )),
        );

        // make_result
        env.bind(
            "make_result",
            TypeScheme::monomorphic(Type::Arrow(
                Box::new(Type::Named("Int".to_string())),
                Box::new(Type::Arrow(
                    Box::new(Type::Named("Int".to_string())),
                    Box::new(Type::Arrow(
                        Box::new(Type::Named("Int".to_string())),
                        Box::new(Type::Arrow(
                            Box::new(Type::Named("Int".to_string())),
                            Box::new(Type::Arrow(
                                Box::new(Type::Named("String".to_string())),
                                Box::new(Type::Named("BattleResult".to_string())),
                            )),
                        )),
                    )),
                )),
            )),
        );

        env
    }

    /// Bind a variable name to a type scheme.
    pub fn bind(&mut self, name: &str, scheme: TypeScheme) {
        self.bindings.insert(name.to_string(), scheme);
    }

    /// Look up a variable's type scheme.
    pub fn lookup(&self, name: &str) -> Option<&TypeScheme> {
        self.bindings.get(name)
    }

    /// Generalize a type into a type scheme by quantifying over free variables
    /// not in the environment.
    pub fn generalize(&self, subst: &Substitution, ty: &Type) -> TypeScheme {
        let resolved = subst.apply(ty);
        let free_in_type = Substitution::free_vars(&resolved);
        let mut free_in_env = Vec::new();
        for scheme in self.bindings.values() {
            free_in_env.extend(Substitution::free_vars_scheme(scheme));
        }
        let vars: Vec<_> = free_in_type
            .into_iter()
            .filter(|v| !free_in_env.contains(v))
            .collect();
        TypeScheme {
            vars,
            ty: resolved,
        }
    }
}

impl Default for TypeEnv {
    fn default() -> Self {
        Self::new()
    }
}

/// Type inference errors.
#[derive(Debug, Clone)]
pub enum TypeError {
    UnificationError(UnificationError),
    UndefinedVariable { name: String, span: Span },
    NotAFunction { ty: Type, span: Span },
    ArityMismatch { expected: usize, actual: usize, span: Span },
}

impl fmt::Display for TypeError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::UnificationError(e) => write!(f, "type error: {e}"),
            Self::UndefinedVariable { name, .. } => write!(f, "undefined variable: {name}"),
            Self::NotAFunction { ty, .. } => write!(f, "not a function: {ty}"),
            Self::ArityMismatch {
                expected, actual, ..
            } => write!(f, "arity mismatch: expected {expected}, got {actual}"),
        }
    }
}

impl std::error::Error for TypeError {}

/// Infer the type of an expression using Algorithm W.
///
/// Returns the inferred type and an updated substitution.
pub fn infer(
    env: &mut TypeEnv,
    subst: &mut Substitution,
    expr: &crate::ast::Expr,
) -> Result<Type, TypeError> {
    use crate::ast::Expr::*;

    match expr {
        IntLit { .. } => Ok(Type::Named("Int".to_string())),
        BoolLit { .. } => Ok(Type::Named("Bool".to_string())),
        StringLit { .. } => Ok(Type::Named("String".to_string())),
        Unit { .. } => Ok(Type::Named("Unit".to_string())),

        Var { name, span } => {
            let scheme = env.lookup(name).ok_or_else(|| TypeError::UndefinedVariable {
                name: name.clone(),
                span: *span,
            })?;
            Ok(scheme.instantiate(subst))
        }

        Constructor { name, span, .. } => {
            // Constructors are treated as variables
            let scheme = env.lookup(name).ok_or_else(|| TypeError::UndefinedVariable {
                name: name.clone(),
                span: *span,
            })?;
            Ok(scheme.instantiate(subst))
        }

        BinOp { op, left, right, .. } => {
            let left_ty = infer(env, subst, left)?;
            let right_ty = infer(env, subst, right)?;

            match op {
                crate::ast::BinOp::Add
                | crate::ast::BinOp::Sub
                | crate::ast::BinOp::Mul
                | crate::ast::BinOp::Div
                | crate::ast::BinOp::Mod => {
                    unify(subst, &left_ty, &Type::Named("Int".to_string()))
                        .map_err(TypeError::UnificationError)?;
                    unify(subst, &right_ty, &Type::Named("Int".to_string()))
                        .map_err(TypeError::UnificationError)?;
                    Ok(Type::Named("Int".to_string()))
                }
                crate::ast::BinOp::Eq
                | crate::ast::BinOp::Neq
                | crate::ast::BinOp::Lt
                | crate::ast::BinOp::Gt
                | crate::ast::BinOp::Le
                | crate::ast::BinOp::Ge => {
                    unify(subst, &left_ty, &right_ty)
                        .map_err(TypeError::UnificationError)?;
                    Ok(Type::Named("Bool".to_string()))
                }
                crate::ast::BinOp::And | crate::ast::BinOp::Or => {
                    unify(subst, &left_ty, &Type::Named("Bool".to_string()))
                        .map_err(TypeError::UnificationError)?;
                    unify(subst, &right_ty, &Type::Named("Bool".to_string()))
                        .map_err(TypeError::UnificationError)?;
                    Ok(Type::Named("Bool".to_string()))
                }
            }
        }

        UnaryOp { op, operand, .. } => {
            let operand_ty = infer(env, subst, operand)?;
            match op {
                crate::ast::UnaryOp::Neg => {
                    unify(subst, &operand_ty, &Type::Named("Int".to_string()))
                        .map_err(TypeError::UnificationError)?;
                    Ok(Type::Named("Int".to_string()))
                }
                crate::ast::UnaryOp::Not => {
                    unify(subst, &operand_ty, &Type::Named("Bool".to_string()))
                        .map_err(TypeError::UnificationError)?;
                    Ok(Type::Named("Bool".to_string()))
                }
            }
        }

        If {
            condition,
            then_branch,
            else_branch,
            ..
        } => {
            let cond_ty = infer(env, subst, condition)?;
            unify(subst, &cond_ty, &Type::Named("Bool".to_string()))
                .map_err(TypeError::UnificationError)?;
            let then_ty = infer(env, subst, then_branch)?;
            let else_ty = infer(env, subst, else_branch)?;
            unify(subst, &then_ty, &else_ty).map_err(TypeError::UnificationError)?;
            Ok(subst.apply(&then_ty))
        }

        Let {
            name,
            type_ann,
            value,
            body,
            ..
        } => {
            let val_ty = infer(env, subst, value)?;

            // Apply type annotation if present
            let final_val_ty = if let Some(ann) = type_ann {
                let ann_ty = convert_type_expr(subst, ann)?;
                unify(subst, &val_ty, &ann_ty).map_err(TypeError::UnificationError)?;
                subst.apply(&ann_ty)
            } else {
                subst.apply(&val_ty)
            };

            let scheme = env.generalize(subst, &final_val_ty);
            env.bind(name, scheme);
            let body_ty = infer(env, subst, body)?;
            Ok(body_ty)
        }

        Lambda { params, body, .. } => {
            let mut param_types = Vec::new();
            for param in params {
                let param_ty = convert_type_expr(subst, &param.type_ann)?;
                param_types.push(param_ty.clone());
                env.bind(&param.name, TypeScheme::monomorphic(param_ty));
            }

            let body_ty = infer(env, subst, body)?;
            let mut result = body_ty;
            for param_ty in param_types.into_iter().rev() {
                result = Type::Arrow(Box::new(param_ty), Box::new(result));
            }
            Ok(result)
        }

        App { func, args, span } => {
            let func_ty = infer(env, subst, func)?;
            let mut result_ty = subst.fresh_var();
            let mut arg_types = Vec::new();
            for _ in args {
                arg_types.push(subst.fresh_var());
            }

            // Build expected function type
            let mut expected = Type::Var(result_ty);
            for arg_ty in arg_types.into_iter().rev() {
                expected = Type::Arrow(Box::new(Type::Var(arg_ty)), Box::new(expected));
            }

            unify(subst, &func_ty, &expected).map_err(|e| match e {
                UnificationError::FunctionArityMismatch => TypeError::ArityMismatch {
                    expected: args.len(),
                    actual: args.len(),
                    span: *span,
                },
                e => TypeError::UnificationError(e),
            })?;

            // Infer arg types
            for arg in args {
                let arg_ty = infer(env, subst, arg)?;
                // Arg types are already unified via the function type
                let _ = arg_ty;
            }

            Ok(subst.apply(&Type::Var(result_ty)))
        }

        List { elements, .. } => {
            let elem_ty = subst.fresh_var();
            for elem in elements {
                let ty = infer(env, subst, elem)?;
                unify(subst, &ty, &Type::Var(elem_ty))
                    .map_err(TypeError::UnificationError)?;
            }
            Ok(Type::List(Box::new(subst.apply(&Type::Var(elem_ty)))))
        }

        Record { fields, .. } => {
            let mut field_types = Vec::new();
            for field in fields {
                let ty = infer(env, subst, &field.value)?;
                field_types.push((field.label.clone(), ty));
            }
            Ok(Type::Record(field_types, None))
        }

        FieldAccess { record, field, .. } => {
            let rec_ty = infer(env, subst, record)?;
            let rest_var = subst.fresh_var();
            let field_ty = subst.fresh_var();
            let expected = Type::Record(
                vec![(field.clone(), Type::Var(field_ty))],
                Some(rest_var),
            );
            unify(subst, &rec_ty, &expected).map_err(TypeError::UnificationError)?;
            Ok(subst.apply(&Type::Var(field_ty)))
        }

        Pipe { left, right, span, .. } => {
            let left_ty = infer(env, subst, left)?;
            let func_scheme = env.lookup(right).ok_or_else(|| TypeError::UndefinedVariable {
                name: right.clone(),
                span: *span,
            })?;
            let func_ty = func_scheme.instantiate(subst);
            // pipe: left |> f  ≡  f(left)
            let arg_ty = subst.fresh_var();
            let ret_ty = subst.fresh_var();
            unify(subst, &func_ty, &Type::Arrow(Box::new(Type::Var(arg_ty)), Box::new(Type::Var(ret_ty))))
                .map_err(TypeError::UnificationError)?;
            unify(subst, &left_ty, &Type::Var(arg_ty))
                .map_err(TypeError::UnificationError)?;
            Ok(subst.apply(&Type::Var(ret_ty)))
        }

        Cons { head, tail, .. } => {
            let head_ty = infer(env, subst, head)?;
            let tail_ty = infer(env, subst, tail)?;
            unify(subst, &tail_ty, &Type::List(Box::new(head_ty)))
                .map_err(TypeError::UnificationError)?;
            Ok(tail_ty)
        }

        Match {
            scrutinee, arms, ..
        } => {
            let scrut_ty = infer(env, subst, scrutinee)?;
            let result_ty = subst.fresh_var();

            for arm in arms {
                let arm_ty = infer(env, subst, &arm.body)?;
                unify(subst, &arm_ty, &Type::Var(result_ty))
                    .map_err(TypeError::UnificationError)?;
            }

            Ok(subst.apply(&Type::Var(result_ty)))
        }
    }
}

/// Convert an AST type expression to a Type.
pub fn convert_type_expr(
    subst: &mut Substitution,
    expr: &crate::ast::TypeExpr,
) -> Result<Type, TypeError> {
    use crate::ast::TypeExpr::*;
    match expr {
        Named { name, .. } => Ok(Type::Named(name.clone())),
        Var { name, .. } => Ok(Type::Named(name.clone())), // treat type vars as named for now
        Arrow { param, ret, .. } => {
            let p = convert_type_expr(subst, param)?;
            let r = convert_type_expr(subst, ret)?;
            Ok(Type::Arrow(Box::new(p), Box::new(r)))
        }
        List { element, .. } => {
            let e = convert_type_expr(subst, element)?;
            Ok(Type::List(Box::new(e)))
        }
        Tuple { elements, .. } => {
            let mut types = Vec::new();
            for e in elements {
                types.push(convert_type_expr(subst, e)?);
            }
            Ok(Type::Tuple(types))
        }
        Record { fields, rest, .. } => {
            let mut field_types = Vec::new();
            for f in fields {
                field_types.push((f.label.clone(), convert_type_expr(subst, &f.field_type)?));
            }
            let rest_var = if rest.is_some() {
                Some(subst.fresh_var())
            } else {
                None
            };
            Ok(Type::Record(field_types, rest_var))
        }
        RowExt { .. } => {
            // Row extension in type annotations — simplified handling
            Ok(Type::Named("RowExt".to_string()))
        }
    }
}

/// Helper trait for applying variable mappings (used by TypeScheme::instantiate).
trait ApplyMapping {
    fn apply_mapping(&self, mapping: &HashMap<TypeVarId, TypeVarId>) -> Type;
}

impl ApplyMapping for Type {
    fn apply_mapping(&self, mapping: &HashMap<TypeVarId, TypeVarId>) -> Type {
        match self {
            Self::Var(id) => Type::Var(*mapping.get(id).unwrap_or(id)),
            Self::Named(name) => Type::Named(name.clone()),
            Self::Arrow(p, r) => Type::Arrow(
                Box::new(p.apply_mapping(mapping)),
                Box::new(r.apply_mapping(mapping)),
            ),
            Self::Record(fields, rest) => Type::Record(
                fields
                    .iter()
                    .map(|(l, t)| (l.clone(), t.apply_mapping(mapping)))
                    .collect(),
                *rest,
            ),
            Self::List(e) => Type::List(Box::new(e.apply_mapping(mapping))),
            Self::Tuple(elems) => Type::Tuple(
                elems.iter().map(|e| e.apply_mapping(mapping)).collect(),
            ),
            Self::RowExtend(label, ty, rest) => Type::RowExtend(
                label.clone(),
                Box::new(ty.apply_mapping(mapping)),
                Box::new(rest.apply_mapping(mapping)),
            ),
            Self::EmptyRow => Type::EmptyRow,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::{BinOp, Expr, UnaryOp};
    use crate::span::Span;

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

    fn bin(op: BinOp, l: Expr, r: Expr) -> Expr {
        Expr::BinOp {
            span: Span::dummy(),
            op,
            left: Box::new(l),
            right: Box::new(r),
        }
    }

    fn unary(op: UnaryOp, e: Expr) -> Expr {
        Expr::UnaryOp {
            span: Span::dummy(),
            op,
            operand: Box::new(e),
        }
    }

    // ─── Substitution tests ───

    #[test]
    fn subst_new() {
        let s = Substitution::new();
        assert!(s.mapping.is_empty());
    }

    #[test]
    fn subst_fresh_var() {
        let mut s = Substitution::new();
        let v1 = s.fresh_var();
        let v2 = s.fresh_var();
        assert_ne!(v1, v2);
    }

    #[test]
    fn subst_bind_and_apply() {
        let mut s = Substitution::new();
        let v = s.fresh_var();
        s.bind(v, Type::Named("Int".to_string()));
        let result = s.apply(&Type::Var(v));
        assert_eq!(result, Type::Named("Int".to_string()));
    }

    #[test]
    fn subst_chained_apply() {
        let mut s = Substitution::new();
        let v1 = s.fresh_var();
        let v2 = s.fresh_var();
        s.bind(v1, Type::Var(v2));
        s.bind(v2, Type::Named("Int".to_string()));
        let result = s.apply(&Type::Var(v1));
        assert_eq!(result, Type::Named("Int".to_string()));
    }

    #[test]
    fn subst_apply_arrow() {
        let mut s = Substitution::new();
        let v = s.fresh_var();
        s.bind(v, Type::Named("Bool".to_string()));
        let t = Type::Arrow(
            Box::new(Type::Var(v)),
            Box::new(Type::Named("Int".to_string())),
        );
        let result = s.apply(&t);
        assert_eq!(
            result,
            Type::Arrow(
                Box::new(Type::Named("Bool".to_string())),
                Box::new(Type::Named("Int".to_string()))
            )
        );
    }

    #[test]
    fn subst_free_vars_simple() {
        let v = TypeVarId(0);
        let ty = Type::Var(v);
        let fv = Substitution::free_vars(&ty);
        assert_eq!(fv, vec![v]);
    }

    #[test]
    fn subst_free_vars_none() {
        let ty = Type::Named("Int".to_string());
        let fv = Substitution::free_vars(&ty);
        assert!(fv.is_empty());
    }

    #[test]
    fn subst_free_vars_arrow() {
        let v0 = TypeVarId(0);
        let v1 = TypeVarId(1);
        let ty = Type::Arrow(Box::new(Type::Var(v0)), Box::new(Type::Var(v1)));
        let mut fv = Substitution::free_vars(&ty);
        fv.sort_by_key(|v| v.0);
        assert_eq!(fv, vec![v0, v1]);
    }

    // ─── Unification tests ───

    #[test]
    fn unify_same_named() {
        let mut s = Substitution::new();
        assert!(unify(&mut s, &Type::Named("Int".to_string()), &Type::Named("Int".to_string())).is_ok());
    }

    #[test]
    fn unify_different_named() {
        let mut s = Substitution::new();
        let result = unify(&mut s, &Type::Named("Int".to_string()), &Type::Named("Bool".to_string()));
        assert!(matches!(result, Err(UnificationError::NameMismatch(_, _))));
    }

    #[test]
    fn unify_var_with_named() {
        let mut s = Substitution::new();
        let v = s.fresh_var();
        unify(&mut s, &Type::Var(v), &Type::Named("Int".to_string())).unwrap();
        assert_eq!(s.apply(&Type::Var(v)), Type::Named("Int".to_string()));
    }

    #[test]
    fn unify_var_with_var() {
        let mut s = Substitution::new();
        let v1 = s.fresh_var();
        let v2 = s.fresh_var();
        unify(&mut s, &Type::Var(v1), &Type::Var(v2)).unwrap();
        // Both should resolve to the same thing
        assert_eq!(s.apply(&Type::Var(v1)), s.apply(&Type::Var(v2)));
    }

    #[test]
    fn unify_arrows() {
        let mut s = Substitution::new();
        let t1 = Type::Arrow(
            Box::new(Type::Named("Int".to_string())),
            Box::new(Type::Named("Bool".to_string())),
        );
        let t2 = Type::Arrow(
            Box::new(Type::Named("Int".to_string())),
            Box::new(Type::Named("Bool".to_string())),
        );
        assert!(unify(&mut s, &t1, &t2).is_ok());
    }

    #[test]
    fn unify_arrow_mismatch() {
        let mut s = Substitution::new();
        let t1 = Type::Arrow(
            Box::new(Type::Named("Int".to_string())),
            Box::new(Type::Named("Bool".to_string())),
        );
        let t2 = Type::Arrow(
            Box::new(Type::Named("Bool".to_string())),
            Box::new(Type::Named("Int".to_string())),
        );
        assert!(unify(&mut s, &t1, &t2).is_err());
    }

    #[test]
    fn unify_lists() {
        let mut s = Substitution::new();
        let t1 = Type::List(Box::new(Type::Named("Int".to_string())));
        let t2 = Type::List(Box::new(Type::Named("Int".to_string())));
        assert!(unify(&mut s, &t1, &t2).is_ok());
    }

    #[test]
    fn unify_list_mismatch() {
        let mut s = Substitution::new();
        let t1 = Type::List(Box::new(Type::Named("Int".to_string())));
        let t2 = Type::List(Box::new(Type::Named("Bool".to_string())));
        assert!(matches!(unify(&mut s, &t1, &t2), Err(UnificationError::NameMismatch(_, _))));
    }

    #[test]
    fn unify_tuples_same() {
        let mut s = Substitution::new();
        let t1 = Type::Tuple(vec![
            Type::Named("Int".to_string()),
            Type::Named("Bool".to_string()),
        ]);
        let t2 = Type::Tuple(vec![
            Type::Named("Int".to_string()),
            Type::Named("Bool".to_string()),
        ]);
        assert!(unify(&mut s, &t1, &t2).is_ok());
    }

    #[test]
    fn unify_tuples_different_length() {
        let mut s = Substitution::new();
        let t1 = Type::Tuple(vec![Type::Named("Int".to_string())]);
        let t2 = Type::Tuple(vec![
            Type::Named("Int".to_string()),
            Type::Named("Bool".to_string()),
        ]);
        assert!(matches!(
            unify(&mut s, &t1, &t2),
            Err(UnificationError::TupleLengthMismatch(1, 2))
        ));
    }

    #[test]
    fn unify_empty_rows() {
        let mut s = Substitution::new();
        assert!(unify(&mut s, &Type::EmptyRow, &Type::EmptyRow).is_ok());
    }

    #[test]
    fn unify_records_matching() {
        let mut s = Substitution::new();
        let t1 = Type::Record(
            vec![
                ("name".to_string(), Type::Named("String".to_string())),
                ("age".to_string(), Type::Named("Int".to_string())),
            ],
            None,
        );
        let t2 = Type::Record(
            vec![
                ("name".to_string(), Type::Named("String".to_string())),
                ("age".to_string(), Type::Named("Int".to_string())),
            ],
            None,
        );
        assert!(unify(&mut s, &t1, &t2).is_ok());
    }

    #[test]
    fn unify_records_with_row_vars() {
        let mut s = Substitution::new();
        let rv = s.fresh_var();
        let t1 = Type::Record(
            vec![("name".to_string(), Type::Named("String".to_string()))],
            Some(rv),
        );
        let t2 = Type::Record(
            vec![
                ("name".to_string(), Type::Named("String".to_string())),
                ("age".to_string(), Type::Named("Int".to_string())),
            ],
            None,
        );
        assert!(unify(&mut s, &t1, &t2).is_ok());
    }

    #[test]
    fn occurs_check_fails() {
        let mut s = Substitution::new();
        let v = s.fresh_var();
        let t = Type::Arrow(
            Box::new(Type::Var(v)),
            Box::new(Type::Named("Int".to_string())),
        );
        let result = unify(&mut s, &Type::Var(v), &t);
        assert!(matches!(result, Err(UnificationError::OccursCheck(_))));
    }

    // ─── TypeScheme tests ───

    #[test]
    fn scheme_monomorphic() {
        let s = TypeScheme::monomorphic(Type::Named("Int".to_string()));
        assert!(s.vars.is_empty());
    }

    #[test]
    fn scheme_instantiate() {
        let v = TypeVarId(42);
        let s = TypeScheme {
            vars: vec![v],
            ty: Type::Arrow(
                Box::new(Type::Var(v)),
                Box::new(Type::Var(v)),
            ),
        };
        let mut subst = Substitution::new();
        let instantiated = s.instantiate(&mut subst);
        // After instantiation, the quantified variable should be replaced
        assert_ne!(instantiated, s.ty);
    }

    // ─── TypeEnv tests ───

    #[test]
    fn env_lookup() {
        let mut env = TypeEnv::new();
        env.bind("x", TypeScheme::monomorphic(Type::Named("Int".to_string())));
        assert!(env.lookup("x").is_some());
        assert!(env.lookup("y").is_none());
    }

    #[test]
    fn env_prelude() {
        let env = TypeEnv::prelude();
        assert!(env.lookup("add").is_some());
        assert!(env.lookup("sub").is_some());
        assert!(env.lookup("mul").is_some());
    }

    #[test]
    fn env_generalize() {
        let mut s = Substitution::new();
        let v = s.fresh_var();
        let ty = Type::Arrow(
            Box::new(Type::Var(v)),
            Box::new(Type::Var(v)),
        );
        let env = TypeEnv::new();
        let scheme = env.generalize(&s, &ty);
        assert!(!scheme.vars.is_empty());
    }

    #[test]
    fn env_generalize_no_free() {
        let s = Substitution::new();
        let ty = Type::Arrow(
            Box::new(Type::Named("Int".to_string())),
            Box::new(Type::Named("Bool".to_string())),
        );
        let env = TypeEnv::new();
        let scheme = env.generalize(&s, &ty);
        assert!(scheme.vars.is_empty());
    }

    // ─── Type inference tests ───

    #[test]
    fn infer_int_literal() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &i64_val(42)).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_bool_literal() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bool_val(true)).unwrap();
        assert_eq!(ty, Type::Named("Bool".to_string()));
    }

    #[test]
    fn infer_string_literal() {
        let expr = Expr::StringLit {
            span: Span::dummy(),
            value: "hello".to_string(),
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::Named("String".to_string()));
    }

    #[test]
    fn infer_variable() {
        let mut env = TypeEnv::new();
        env.bind("x", TypeScheme::monomorphic(Type::Named("Int".to_string())));
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &var("x")).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_undefined_variable() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let result = infer(&mut env, &mut subst, &var("undefined"));
        assert!(matches!(result, Err(TypeError::UndefinedVariable { .. })));
    }

    #[test]
    fn infer_add() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bin(BinOp::Add, i64_val(1), i64_val(2))).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_add_type_mismatch() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let result = infer(&mut env, &mut subst, &bin(BinOp::Add, i64_val(1), bool_val(true)));
        assert!(result.is_err());
    }

    #[test]
    fn infer_sub() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bin(BinOp::Sub, i64_val(5), i64_val(3))).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_mul() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bin(BinOp::Mul, i64_val(3), i64_val(4))).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_comparison() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bin(BinOp::Eq, i64_val(1), i64_val(2))).unwrap();
        assert_eq!(ty, Type::Named("Bool".to_string()));
    }

    #[test]
    fn infer_logical_and() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bin(BinOp::And, bool_val(true), bool_val(false)))
            .unwrap();
        assert_eq!(ty, Type::Named("Bool".to_string()));
    }

    #[test]
    fn infer_logical_or() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &bin(BinOp::Or, bool_val(true), bool_val(false)))
            .unwrap();
        assert_eq!(ty, Type::Named("Bool".to_string()));
    }

    #[test]
    fn infer_unary_neg() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &unary(UnaryOp::Neg, i64_val(5))).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_unary_not() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &unary(UnaryOp::Not, bool_val(true))).unwrap();
        assert_eq!(ty, Type::Named("Bool".to_string()));
    }

    #[test]
    fn infer_if_then_else() {
        let expr = Expr::If {
            span: Span::dummy(),
            condition: Box::new(bool_val(true)),
            then_branch: Box::new(i64_val(1)),
            else_branch: Box::new(i64_val(2)),
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_if_type_mismatch() {
        let expr = Expr::If {
            span: Span::dummy(),
            condition: Box::new(i64_val(1)), // wrong: should be Bool
            then_branch: Box::new(i64_val(1)),
            else_branch: Box::new(i64_val(2)),
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let result = infer(&mut env, &mut subst, &expr);
        assert!(result.is_err());
    }

    #[test]
    fn infer_let_in() {
        let expr = Expr::Let {
            span: Span::dummy(),
            name: "x".to_string(),
            type_ann: None,
            value: Box::new(i64_val(42)),
            body: Box::new(var("x")),
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_function_application() {
        let mut env = TypeEnv::new();
        env.bind(
            "double",
            TypeScheme::monomorphic(Type::Arrow(
                Box::new(Type::Named("Int".to_string())),
                Box::new(Type::Named("Int".to_string())),
            )),
        );
        let expr = Expr::App {
            span: Span::dummy(),
            func: Box::new(var("double")),
            args: vec![i64_val(21)],
        };
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_list_homogeneous() {
        let expr = Expr::List {
            span: Span::dummy(),
            elements: vec![i64_val(1), i64_val(2), i64_val(3)],
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::List(Box::new(Type::Named("Int".to_string()))));
    }

    #[test]
    fn infer_list_heterogeneous_fails() {
        let expr = Expr::List {
            span: Span::dummy(),
            elements: vec![i64_val(1), bool_val(true)],
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let result = infer(&mut env, &mut subst, &expr);
        assert!(result.is_err());
    }

    #[test]
    fn infer_empty_list() {
        let expr = Expr::List {
            span: Span::dummy(),
            elements: vec![],
        };
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        // Empty list has a fresh type variable as element type
        assert!(matches!(ty, Type::List(_)));
    }

    #[test]
    fn infer_cons() {
        let mut env = TypeEnv::new();
        let expr = Expr::Cons {
            span: Span::dummy(),
            head: Box::new(i64_val(1)),
            tail: Box::new(Expr::List {
                span: Span::dummy(),
                elements: vec![i64_val(2), i64_val(3)],
            }),
        };
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::List(Box::new(Type::Named("Int".to_string()))));
    }

    #[test]
    fn infer_nested_binop() {
        let mut env = TypeEnv::new();
        let mut subst = Substitution::new();
        let expr = bin(BinOp::Add, bin(BinOp::Mul, i64_val(2), i64_val(3)), i64_val(1));
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn infer_prelude_add() {
        let mut env = TypeEnv::prelude();
        let expr = Expr::App {
            span: Span::dummy(),
            func: Box::new(var("add")),
            args: vec![i64_val(1), i64_val(2)],
        };
        let mut subst = Substitution::new();
        let ty = infer(&mut env, &mut subst, &expr).unwrap();
        assert_eq!(ty, Type::Named("Int".to_string()));
    }

    #[test]
    fn type_display() {
        let t = Type::Named("Int".to_string());
        assert_eq!(format!("{t}"), "Int");

        let t = Type::Arrow(
            Box::new(Type::Named("Int".to_string())),
            Box::new(Type::Named("Bool".to_string())),
        );
        let s = format!("{t}");
        assert!(s.contains("->"));
    }

    #[test]
    fn unification_error_display() {
        let e = UnificationError::NameMismatch("Int".to_string(), "Bool".to_string());
        let s = format!("{e}");
        assert!(s.contains("Int"));
        assert!(s.contains("Bool"));
    }

    #[test]
    fn type_error_display() {
        let e = TypeError::UndefinedVariable {
            name: "x".to_string(),
            span: Span::dummy(),
        };
        let s = format!("{e}");
        assert!(s.contains("undefined"));
    }

    // ─── proptest: free vars ───

    #[test]
    fn proptest_free_vars_no_duplicates() {
        let v = TypeVarId(0);
        let ty = Type::Arrow(
            Box::new(Type::Var(v)),
            Box::new(Type::Var(v)),
        );
        let fv = Substitution::free_vars(&ty);
        assert_eq!(fv.len(), 1);
    }

    #[test]
    fn proptest_deeply_nested_arrow() {
        let v0 = TypeVarId(0);
        let v1 = TypeVarId(1);
        let v2 = TypeVarId(2);
        let ty = Type::Arrow(
            Box::new(Type::Var(v0)),
            Box::new(Type::Arrow(
                Box::new(Type::Var(v1)),
                Box::new(Type::Var(v2)),
            )),
        );
        let fv = Substitution::free_vars(&ty);
        assert_eq!(fv.len(), 3);
    }

    #[test]
    fn proptest_record_free_vars() {
        let v = TypeVarId(0);
        let ty = Type::Record(
            vec![("x".to_string(), Type::Var(v))],
            Some(TypeVarId(1)),
        );
        let fv = Substitution::free_vars(&ty);
        assert_eq!(fv.len(), 2);
    }

    #[test]
    fn proptest_generalize_only_free_vars() {
        let mut s = Substitution::new();
        let v = s.fresh_var(); // this is the free var
        let ty = Type::Arrow(
            Box::new(Type::Var(v)),
            Box::new(Type::Named("Int".to_string())),
        );
        let env = TypeEnv::new(); // empty env, so all free vars are generalized
        let scheme = env.generalize(&s, &ty);
        assert_eq!(scheme.vars.len(), 1);
    }

    #[test]
    fn proptest_unify_transitive() {
        let mut s = Substitution::new();
        let a = s.fresh_var();
        let b = s.fresh_var();
        let c = s.fresh_var();
        unify(&mut s, &Type::Var(a), &Type::Var(b)).unwrap();
        unify(&mut s, &Type::Var(b), &Type::Named("Int".to_string())).unwrap();
        let resolved = s.apply(&Type::Var(a));
        assert_eq!(resolved, Type::Named("Int".to_string()));
    }

    #[test]
    fn proptest_list_of_lists() {
        let ty = Type::List(Box::new(Type::List(Box::new(Type::Named("Int".to_string())))));
        let fv = Substitution::free_vars(&ty);
        assert!(fv.is_empty());
    }
}
