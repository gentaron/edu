//! # edu-engine-core
//!
//! `#![no_std]` battle engine core — zero heap by default, target-independent.
//! Opt-in `alloc` and `std` features for WASM shell and native testing.
//!
//! ## Canon Mapping (Lore-Tech)
//! This crate is the **Apolon Execution Shrine** — the bare-metal runtime
//! where battle calculations are performed without any runtime dependencies.
//! It compiles to RISC-V, WASM, and native x86_64 equally.

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(unexpected_cfgs)]
#![cfg_attr(all(feature = "simd"), feature(portable_simd))]

#[cfg(feature = "alloc")]
extern crate alloc;

pub mod damage;
pub mod fsm;
pub mod rng;
pub mod types;

/// SIMD-accelerated damage computations using `core::simd`.
///
/// **Requires nightly Rust**: `rustup run nightly cargo test -p edu-engine-core --features simd`
///
/// Canon: **Apolonium Vector Engine** — parallel damage resolution
/// exploiting the quantum probability layer of the EDU universe.
#[cfg(feature = "simd")]
pub mod simd;

#[cfg(feature = "std")]
pub mod proofs;
