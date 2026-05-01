#![deny(clippy::all)]

//! Apolon DSL Compiler
//!
//! A statically-typed domain-specific language for defining card abilities
//! in the edu battle system. Compiles `.apo` files to WASM 2.0 modules.

pub mod ast;
pub mod codegen;
pub mod effects;
pub mod error;
pub mod ir;
pub mod lexer;
pub mod opt;
pub mod parser;
pub mod types;

pub use ast::*;
pub use codegen::WasmCodegen;
pub use effects::{Effect, EffectChecker, EffectError, EffectErrorKind};
pub use error::{CompileError, Span};
pub use ir::{lower_program, IrModule};
pub use lexer::{Lexer, Token, TokenKind};
pub use parser::{parse_source, Parser};
pub use types::{TypeChecker, TypeError, TypeErrorKind, TypeScheme, Ty};

/// Compile an Apolon source string to WASM bytes.
///
/// # Errors
/// Returns an error if parsing fails or code generation encounters
/// an unsupported construct.
pub fn compile(source: &str) -> Result<Vec<u8>, CompileError> {
    let ast = parser::parse_source(source).map_err(|errs| {
        // Report the first error
        errs.into_iter().next().unwrap_or_else(|| {
            CompileError::new(
                error::Span::at(0),
                "unknown parsing error".to_string(),
            )
        })
    })?;

    let mut ir_module = ir::lower_program(&ast);
    opt::optimize(&mut ir_module);

    let mut codegen = WasmCodegen::new();
    codegen.emit_module(&ir_module).map_err(|e| {
        CompileError::new(
            error::Span::at(0),
            format!("codegen error: {e}"),
        )
    })
}
