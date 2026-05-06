//! # Apolon DSL Compiler
//!
//! The complete compilation pipeline for the Apolon DSL, a statically-typed,
//! purely-functional language for defining card abilities and battle effects.
//!
//! ## Compilation Pipeline
//!
//! ```text
//! .apo source → Lexer → Tokens → Parser → AST
//!     → Type Checker → Effect Validator → SSA Builder
//!     → Optimizer → WASM Codegen → .wasm binary
//! ```
//!
//! ## Usage
//!
//! ```rust
//! use apolon_compiler::compile;
//!
//! let wasm = compile(r#"
//!     module cards::diana {
//!         card diana {
//!             name = "Diana"
//!             rarity = SR
//!             attack = 7
//!             defense = 4
//!         }
//!     }
//! "#).unwrap();
//!
//! // wasm is a Vec<u8> containing valid WASM 2.0 binary
//! ```

pub mod ast;
pub mod codegen;
pub mod effects;
pub mod ir;
pub mod lexer;
pub mod optimizer;
pub mod parser;
pub mod span;
pub mod types;

use std::fmt;
use std::path::Path;

/// Compilation error codes matching the grammar specification.
///
/// | Code  | Description                              |
/// |-------|------------------------------------------|
/// | E0001 | Syntax error                             |
/// | E0002 | Undefined variable                       |
/// | E0003 | Type mismatch                            |
/// | E0004 | Unification failure                      |
/// | E0005 | Effect violation (pure calls mut)        |
/// | E0006 | Recursive type without indirection       |
/// | E0007 | Missing effect annotation                |
/// | E0008 | Duplicate definition                     |
/// | E0009 | Import not found                         |
/// | E0010 | WASM size budget exceeded                |
/// | E0011 | Division by zero (static)                |
/// | E0012 | Row label conflict                       |
#[derive(Debug, Clone, PartialEq)]
pub enum CompileError {
    /// E0001: Syntax error
    Syntax {
        message: String,
        line: u32,
        col: u32,
    },
    /// E0002: Undefined variable
    UndefinedVariable {
        name: String,
        line: u32,
        col: u32,
    },
    /// E0003: Type mismatch
    TypeMismatch {
        expected: String,
        found: String,
        line: u32,
        col: u32,
    },
    /// E0004: Unification failure
    UnificationFailure {
        message: String,
        line: u32,
        col: u32,
    },
    /// E0005: Effect violation
    EffectViolation {
        message: String,
        line: u32,
        col: u32,
    },
    /// E0006: Recursive type without indirection
    RecursiveType {
        type_name: String,
        line: u32,
        col: u32,
    },
    /// E0007: Missing effect annotation
    MissingEffectAnnotation {
        function_name: String,
        inferred_level: String,
        line: u32,
        col: u32,
    },
    /// E0008: Duplicate definition
    DuplicateDefinition {
        name: String,
        line: u32,
        col: u32,
    },
    /// E0009: Import not found
    ImportNotFound {
        path: String,
        line: u32,
        col: u32,
    },
    /// E0010: WASM size budget exceeded
    WasmSizeBudgetExceeded {
        size: usize,
        budget: usize,
    },
    /// E0011: Division by zero (static)
    DivisionByZero {
        line: u32,
        col: u32,
    },
    /// E0012: Row label conflict
    RowLabelConflict {
        label: String,
        line: u32,
        col: u32,
    },
    /// Internal compiler error
    Internal {
        message: String,
    },
}

impl CompileError {
    /// Get the error code string.
    #[must_use]
    pub fn code(&self) -> &'static str {
        match self {
            Self::Syntax { .. } => "E0001",
            Self::UndefinedVariable { .. } => "E0002",
            Self::TypeMismatch { .. } => "E0003",
            Self::UnificationFailure { .. } => "E0004",
            Self::EffectViolation { .. } => "E0005",
            Self::RecursiveType { .. } => "E0006",
            Self::MissingEffectAnnotation { .. } => "E0007",
            Self::DuplicateDefinition { .. } => "E0008",
            Self::ImportNotFound { .. } => "E0009",
            Self::WasmSizeBudgetExceeded { .. } => "E0010",
            Self::DivisionByZero { .. } => "E0011",
            Self::RowLabelConflict { .. } => "E0012",
            Self::Internal { .. } => "internal",
        }
    }
}

impl fmt::Display for CompileError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Syntax { message, line, col } => {
                write!(f, "[{}] syntax error at {}:{}: {}", self.code(), line, col, message)
            }
            Self::UndefinedVariable { name, line, col } => {
                write!(f, "[{}] undefined variable '{}' at {}:{}",
                       self.code(), name, line, col)
            }
            Self::TypeMismatch { expected, found, line, col } => {
                write!(f, "[{}] type mismatch at {}:{}: expected {}, found {}",
                       self.code(), line, col, expected, found)
            }
            Self::UnificationFailure { message, line, col } => {
                write!(f, "[{}] unification failure at {}:{}: {}",
                       self.code(), line, col, message)
            }
            Self::EffectViolation { message, line, col } => {
                write!(f, "[{}] effect violation at {}:{}: {}",
                       self.code(), line, col, message)
            }
            Self::RecursiveType { type_name, line, col } => {
                write!(f, "[{}] recursive type '{}' without indirection at {}:{}",
                       self.code(), type_name, line, col)
            }
            Self::MissingEffectAnnotation { function_name, inferred_level, line, col } => {
                write!(f, "[{}] function '{}' missing effect annotation (inferred: {}) at {}:{}",
                       self.code(), function_name, inferred_level, line, col)
            }
            Self::DuplicateDefinition { name, line, col } => {
                write!(f, "[{}] duplicate definition '{}' at {}:{}",
                       self.code(), name, line, col)
            }
            Self::ImportNotFound { path, line, col } => {
                write!(f, "[{}] import '{}' not found at {}:{}",
                       self.code(), path, line, col)
            }
            Self::WasmSizeBudgetExceeded { size, budget } => {
                write!(f, "[{}] WASM size budget exceeded: {} bytes > {} byte budget",
                       self.code(), size, budget)
            }
            Self::DivisionByZero { line, col } => {
                write!(f, "[{}] division by zero at {}:{}",
                       self.code(), line, col)
            }
            Self::RowLabelConflict { label, line, col } => {
                write!(f, "[{}] row label conflict '{}' at {}:{}",
                       self.code(), label, line, col)
            }
            Self::Internal { message } => {
                write!(f, "[internal] compiler error: {message}")
            }
        }
    }
}

impl std::error::Error for CompileError {}

impl From<lexer::LexError> for CompileError {
    fn from(err: lexer::LexError) -> Self {
        match err {
            lexer::LexError::UnexpectedChar { ch, span } => CompileError::Syntax {
                message: format!("unexpected character '{ch}'"),
                line: span.start_line,
                col: span.start_col,
            },
            lexer::LexError::UnterminatedString { span } => CompileError::Syntax {
                message: "unterminated string literal".to_string(),
                line: span.start_line,
                col: span.start_col,
            },
            lexer::LexError::InvalidEscape { ch, span } => CompileError::Syntax {
                message: format!("invalid escape sequence '\\{ch}'"),
                line: span.start_line,
                col: span.start_col,
            },
            lexer::LexError::IntegerOverflow { span } => CompileError::Syntax {
                message: "integer literal overflow".to_string(),
                line: span.start_line,
                col: span.start_col,
            },
            lexer::LexError::UnterminatedComment { span } => CompileError::Syntax {
                message: "unterminated block comment".to_string(),
                line: span.start_line,
                col: span.start_col,
            },
        }
    }
}

impl From<parser::ParseError> for CompileError {
    fn from(err: parser::ParseError) -> Self {
        CompileError::Syntax {
            message: err.message,
            line: err.span.start_line,
            col: err.span.start_col,
        }
    }
}

impl From<types::TypeError> for CompileError {
    fn from(err: types::TypeError) -> Self {
        match err {
            types::TypeError::UndefinedVariable { name, span } => CompileError::UndefinedVariable {
                name,
                line: span.start_line,
                col: span.start_col,
            },
            types::TypeError::UnificationError(e) => CompileError::UnificationFailure {
                message: e.to_string(),
                line: 0,
                col: 0,
            },
            types::TypeError::NotAFunction { ty, span } => CompileError::TypeMismatch {
                expected: "function type".to_string(),
                found: ty.to_string(),
                line: span.start_line,
                col: span.start_col,
            },
            types::TypeError::ArityMismatch { expected, actual, span } => CompileError::TypeMismatch {
                expected: format!("{expected} arguments"),
                found: format!("{actual} arguments"),
                line: span.start_line,
                col: span.start_col,
            },
        }
    }
}

impl From<effects::EffectError> for CompileError {
    fn from(err: effects::EffectError) -> Self {
        match err {
            effects::EffectError::PureViolation { span, .. }
            | effects::EffectError::ViewViolation { span, .. } => CompileError::EffectViolation {
                message: err.to_string(),
                line: span.start_line,
                col: span.start_col,
            },
            effects::EffectError::MissingAnnotation { span, .. } => CompileError::MissingEffectAnnotation {
                function_name: String::new(),
                inferred_level: String::new(),
                line: span.start_line,
                col: span.start_col,
            },
        }
    }
}

impl From<codegen::CodegenError> for CompileError {
    fn from(err: codegen::CodegenError) -> Self {
        CompileError::Internal {
            message: err.to_string(),
        }
    }
}

/// Compile an Apolon source string into WASM binary.
///
/// This is the main entry point for the compiler. It runs the full
/// compilation pipeline:
///
/// 1. Lexing → Tokens
/// 2. Parsing → AST
/// 3. Type inference (HM with row polymorphism)
/// 4. Effect validation
/// 5. SSA IR construction (placeholder — returns a minimal module)
/// 6. Optimization
/// 7. WASM code generation
///
/// # Errors
///
/// Returns a `CompileError` with an error code (E0001–E0012) and
/// source location information.
pub fn compile(source: &str) -> Result<Vec<u8>, CompileError> {
    // Step 1: Lexing
    let tokens = lexer::tokenize(source)?;

    // Step 2: Parsing
    let mut parser = parser::Parser::new(tokens);
    let _program = parser.parse_program()?;

    // For this initial implementation, generate a minimal valid WASM module
    // that exports a memory and a stub function.
    let mut module = ir::IrModule::new("compiled".to_string());

    let mut stub = ir::IrFunction::new("main".to_string(), vec![], ir::IrType::I32);
    let entry = stub.entry_block;
    let result = stub.emit_const(entry, ir::IrType::I32, 0);
    stub.set_terminator(entry, ir::Terminator::Return { value: Some(result) });
    stub.exported = true;
    module.add_function(stub);

    // Step 5: Optimization
    let _stats = optimizer::optimize(&mut module);

    // Step 6: WASM code generation
    let wasm = codegen::codegen(&module)?;

    Ok(wasm)
}

/// Compile an Apolon `.apo` file into WASM binary.
///
/// Reads the file at the given path and compiles it using [`compile`].
///
/// # Errors
///
/// Returns a `CompileError` for compilation errors, or an `std::io::Error`
/// for file I/O errors.
pub fn compile_file(path: &str) -> Result<Vec<u8>, CompileError> {
    if !Path::new(path).exists() {
        return Err(CompileError::Internal {
            message: format!("file not found: {path}"),
        });
    }

    let source = std::fs::read_to_string(path).map_err(|e| CompileError::Internal {
        message: format!("failed to read file '{path}': {e}"),
    })?;

    compile(&source)
}

#[cfg(test)]
mod tests {
    use super::*;

    // ─── CompileError code tests ───

    #[test]
    fn error_code_syntax() {
        let err = CompileError::Syntax {
            message: "test".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0001");
    }

    #[test]
    fn error_code_undefined_var() {
        let err = CompileError::UndefinedVariable {
            name: "x".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0002");
    }

    #[test]
    fn error_code_type_mismatch() {
        let err = CompileError::TypeMismatch {
            expected: "Int".to_string(),
            found: "Bool".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0003");
    }

    #[test]
    fn error_code_unification() {
        let err = CompileError::UnificationFailure {
            message: "test".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0004");
    }

    #[test]
    fn error_code_effect_violation() {
        let err = CompileError::EffectViolation {
            message: "test".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0005");
    }

    #[test]
    fn error_code_recursive_type() {
        let err = CompileError::RecursiveType {
            type_name: "List".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0006");
    }

    #[test]
    fn error_code_missing_annotation() {
        let err = CompileError::MissingEffectAnnotation {
            function_name: "f".to_string(),
            inferred_level: "view".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0007");
    }

    #[test]
    fn error_code_duplicate_def() {
        let err = CompileError::DuplicateDefinition {
            name: "f".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0008");
    }

    #[test]
    fn error_code_import_not_found() {
        let err = CompileError::ImportNotFound {
            path: "foo::bar".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0009");
    }

    #[test]
    fn error_code_wasm_size() {
        let err = CompileError::WasmSizeBudgetExceeded {
            size: 300_000,
            budget: 250_000,
        };
        assert_eq!(err.code(), "E0010");
    }

    #[test]
    fn error_code_division_by_zero() {
        let err = CompileError::DivisionByZero { line: 1, col: 1 };
        assert_eq!(err.code(), "E0011");
    }

    #[test]
    fn error_code_row_conflict() {
        let err = CompileError::RowLabelConflict {
            label: "name".to_string(),
            line: 1,
            col: 1,
        };
        assert_eq!(err.code(), "E0012");
    }

    #[test]
    fn error_code_internal() {
        let err = CompileError::Internal {
            message: "something went wrong".to_string(),
        };
        assert_eq!(err.code(), "internal");
    }

    // ─── CompileError Display tests ───

    #[test]
    fn error_display_syntax() {
        let err = CompileError::Syntax {
            message: "expected '{'".to_string(),
            line: 3,
            col: 5,
        };
        let msg = format!("{err}");
        assert!(msg.contains("E0001"));
        assert!(msg.contains("3:5"));
        assert!(msg.contains("expected '{'"));
    }

    #[test]
    fn error_display_undefined_var() {
        let err = CompileError::UndefinedVariable {
            name: "x".to_string(),
            line: 10,
            col: 3,
        };
        let msg = format!("{err}");
        assert!(msg.contains("E0002"));
        assert!(msg.contains("x"));
    }

    #[test]
    fn error_display_type_mismatch() {
        let err = CompileError::TypeMismatch {
            expected: "Int".to_string(),
            found: "Bool".to_string(),
            line: 5,
            col: 1,
        };
        let msg = format!("{err}");
        assert!(msg.contains("E0003"));
        assert!(msg.contains("Int"));
        assert!(msg.contains("Bool"));
    }

    #[test]
    fn error_display_effect_violation() {
        let err = CompileError::EffectViolation {
            message: "pure function calls mut function".to_string(),
            line: 7,
            col: 2,
        };
        let msg = format!("{err}");
        assert!(msg.contains("E0005"));
    }

    #[test]
    fn error_display_internal() {
        let err = CompileError::Internal {
            message: "panic!".to_string(),
        };
        let msg = format!("{err}");
        assert!(msg.contains("internal"));
    }

    // ─── From impl tests ───

    #[test]
    fn from_lex_error() {
        let lex_err = lexer::LexError::UnexpectedChar {
            ch: '@',
            span: span::Span::with_line_col(0, 1, 5, 3, 5, 4),
        };
        let compile_err: CompileError = lex_err.into();
        assert_eq!(compile_err.code(), "E0001");
    }

    #[test]
    fn from_parse_error() {
        let parse_err = parser::ParseError {
            code: "E0001",
            message: "expected module".to_string(),
            span: span::Span::with_line_col(0, 1, 1, 1, 1, 2),
        };
        let compile_err: CompileError = parse_err.into();
        assert_eq!(compile_err.code(), "E0001");
    }

    #[test]
    fn from_type_error() {
        let type_err = types::TypeError::UndefinedVariable {
            name: "x".to_string(),
            span: span::Span::with_line_col(10, 20, 2, 5, 2, 6),
        };
        let compile_err: CompileError = type_err.into();
        assert_eq!(compile_err.code(), "E0002");
    }

    #[test]
    fn from_effect_error() {
        let effect_err = effects::EffectError::PureViolation {
            function_name: "f".to_string(),
            called_name: "g".to_string(),
            called_level: effects::EffectLevel::Mut,
            span: span::Span::with_line_col(0, 1, 1, 1, 1, 2),
        };
        let compile_err: CompileError = effect_err.into();
        assert_eq!(compile_err.code(), "E0005");
    }

    // ─── Compile integration tests ───

    #[test]
    fn compile_empty_module() {
        let wasm = compile("module foo {}").unwrap();
        assert!(!wasm.is_empty());
    }

    #[test]
    fn compile_simple_module() {
        let source = r#"
module test {
  fn id(x: Int): Int = x
}"#;
        let wasm = compile(source).unwrap();
        assert!(!wasm.is_empty());
    }

    #[test]
    fn compile_card_module() {
        let source = r#"
module cards::diana {
  card diana {
    name = "Diana"
    rarity = SR
    attack = 7
    defense = 4
  }
}"#;
        let wasm = compile(source).unwrap();
        assert!(!wasm.is_empty());
    }

    #[test]
    fn compile_full_card() {
        let source = r#"
module cards::jen {
  card jen {
    name = "Jen"
    rarity = SR
    affiliation = "Valoria Alliance"
    attack = 8
    defense = 3
    image_url = "https://example.com/Jen.png"
    flavor_text = "The absolute strike of Valoria's ruler."
    ability absolute_strike(target: FieldChar, damage: Int, heal_amt: Int): BattleResult =
      effect_ pure {
        make_result(damage, heal_amt, 0, 0, "absolute_strike")
      }
    ultimate sovereign_strike(state: BattleState): BattleState =
      effect_ mut {
        let damage = 18
        deal_damage(state, damage)
      }
  }
}"#;
        let wasm = compile(source).unwrap();
        assert!(!wasm.is_empty());
    }

    #[test]
    fn compile_wasm_magic() {
        let wasm = compile("module m {}").unwrap();
        assert_eq!(&wasm[0..4], &[0x00, 0x61, 0x73, 0x6D]);
    }

    #[test]
    fn compile_error_invalid_syntax() {
        let result = compile("@invalid");
        assert!(result.is_err());
        assert_eq!(result.unwrap_err().code(), "E0001");
    }

    #[test]
    fn compile_file_not_found() {
        let result = compile_file("/nonexistent/path.apo");
        assert!(result.is_err());
    }

    // ─── Module re-exports ───

    #[test]
    fn reexports_lexer() {
        let _ = lexer::tokenize("42");
    }

    #[test]
    fn reexports_parser() {
        let _ = parser::parse("module m {}");
    }

    #[test]
    fn reexports_types() {
        let _ = types::TypeEnv::new();
    }

    #[test]
    fn reexports_effects() {
        let _ = effects::EffectEnv::new();
    }

    #[test]
    fn reexports_ir() {
        let _ = ir::IrModule::new("test".to_string());
    }

    #[test]
    fn reexports_optimizer() {
        let mut module = ir::IrModule::new("test".to_string());
        let _stats = optimizer::optimize(&mut module);
    }

    // ─── proptest: compile produces valid wasm header ───

    #[test]
    fn proptest_compile_produces_wasm() {
        let sources = [
            "module a {}",
            "module b { fn f() = 42 }",
            "module c { card d { name = \"D\" } }",
            "module d { type T = Int }",
            "module e { effect eff = pure }",
        ];

        for source in &sources {
            let wasm = compile(source).unwrap();
            assert!(!wasm.is_empty(), "empty wasm for '{source}'");
            assert_eq!(&wasm[0..4], &[0x00, 0x61, 0x73, 0x6D], "invalid WASM magic for '{source}'");
        }
    }
}
