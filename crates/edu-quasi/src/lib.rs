//! # edu-quasi
//!
//! `#![no_std]` QASM-2 subset interpreter — zero heap by default, target-independent.
//! Opt-in `alloc` and `std` features for convenience in hosted environments.
//!
//! ## Supported QASM-2 Subset
//! - Gates: `H`, `X`, `Z`, `CX` (a.k.a. `CNOT`), `MEASURE`
//! - Registers: `qreg`, `creg`
//! - Up to 12 qubits (4096 complex amplitudes, 64 KB on stack)
//!
//! ## Canon Mapping (Lore-Tech)
//! This crate is the **Apolonium Runtime Kernel** — the bare-metal quantum
//! interpreter that executes quantum programs without any runtime dependency.
//! It compiles to RISC-V, WASM, and native x86_64 equally.
//!
//! ## Example
//! ```rust
//! use edu_quasi::Circuit;
//!
//! let mut circuit = Circuit::with_seed(2, 42);
//! circuit.h(0).cx(0, 1);
//! let result = circuit.execute_shots(1000);
//! // Bell state: ~50% |00⟩ and ~50% |11⟩
//! ```

#![cfg_attr(not(feature = "std"), no_std)]
#![deny(unsafe_code)]
#![allow(clippy::module_name_repetitions)]

#[cfg(feature = "alloc")]
extern crate alloc;

/// Maximum number of qubits supported by the state-vector simulator.
///
/// 2^12 = 4096 complex numbers × 16 bytes = 64 KB (acceptable on stack).
pub const MAX_QUBITS: u8 = 12;

/// Maximum state-vector size: 2^12 = 4096 entries.
pub const MAX_STATE_SIZE: usize = 1 << MAX_QUBITS as usize; // 4096

/// Maximum number of instructions in a parsed program or circuit.
pub const MAX_INSTRUCTIONS: usize = 256;

// ─── Shared types ────────────────────────────────────────────────────

/// Supported gate kinds — `#[repr(u8)]` for FFI compatibility.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
#[repr(u8)]
pub enum GateKind {
    /// Hadamard gate.
    #[default]
    H = 0,
    /// Pauli-X (NOT) gate.
    X = 1,
    /// Pauli-Z gate.
    Z = 2,
    /// CNOT (controlled-X) gate.
    Cnot = 3,
    /// Measurement.
    Measure = 4,
}

impl GateKind {
    /// Number of gate kind variants.
    pub const COUNT: usize = 5;

    /// Convert a u8 discriminant to a `GateKind`.
    #[must_use]
    pub const fn from_discriminant(v: u8) -> Option<Self> {
        match v {
            0 => Some(Self::H),
            1 => Some(Self::X),
            2 => Some(Self::Z),
            3 => Some(Self::Cnot),
            4 => Some(Self::Measure),
            _ => None,
        }
    }
}

/// A single instruction in a quantum circuit.
///
/// Uses fixed u8 fields for zero-heap representation.
/// `arg1` is only used by `Cnot` (target qubit).
#[repr(C)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct Instruction {
    /// The gate kind.
    pub kind: GateKind,
    /// First argument (qubit index, or control for CNOT).
    pub arg0: u8,
    /// Second argument (target qubit for CNOT, unused otherwise).
    pub arg1: u8,
}

impl Instruction {
    /// Create a no-op placeholder instruction.
    #[must_use]
    pub const fn none() -> Self {
        Self {
            kind: GateKind::H,
            arg0: 0,
            arg1: 0,
        }
    }

    /// Check if this is a no-op placeholder.
    #[must_use]
    pub fn is_none(&self) -> bool {
        self.kind == GateKind::H && self.arg0 == 0 && self.arg1 == 0
    }
}

// ─── Modules ─────────────────────────────────────────────────────────

pub mod circuit;
pub mod parser;
pub mod state;

// Re-export key types at crate root for convenience.
pub use circuit::{Circuit, MeasurementCounts};
pub use parser::{ParseError, ParsedProgram};
pub use state::{Complex, QuantumState};
