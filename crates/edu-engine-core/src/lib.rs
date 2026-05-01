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

#[cfg(feature = "alloc")]
extern crate alloc;

pub mod damage;
pub mod fsm;
pub mod rng;
pub mod types;

#[cfg(feature = "std")]
pub mod proofs;
