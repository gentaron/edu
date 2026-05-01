#![deny(clippy::all)]

//! Apolon DSL Compiler
//!
//! A statically-typed domain-specific language for defining card abilities
//! in the edu battle system. Compiles `.apo` files to WASM 2.0 modules.

pub mod ast;
pub mod error;
pub mod lexer;
pub mod parser;

pub use ast::*;
pub use error::{CompileError, Span};
pub use lexer::{Lexer, Token, TokenKind};
pub use parser::{parse_source, Parser};
