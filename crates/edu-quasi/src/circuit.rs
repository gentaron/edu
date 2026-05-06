//! High-level quantum circuit builder and executor.
//!
//! Provides a fluent API for constructing quantum circuits and executing them
//! via state-vector simulation. Zero heap by default.
//!
//! # Contract (Creusot/Prusti)
//! ```text
//! requires n_qubits <= 12
//! ensures execute_shots(s).shots == s
//! ensures execute_shots(s).n_qubits == self.n_qubits
//! ensures sum of execute_shots(s).counts == s
//! ```

use crate::state::{QuantumState, Rng};
use crate::{GateKind, Instruction, MAX_INSTRUCTIONS};

/// Result of running a quantum circuit with multiple shots.
///
/// Uses a fixed-size array indexed by measurement outcome (bitmask).
///
/// # Contract (Creusot/Prusti)
/// ```text
/// invariant n_qubits <= 12
/// invariant shots == sum(counts)
/// invariant forall i: counts[i] >= 0
/// ```
#[derive(Clone, Debug)]
pub struct MeasurementCounts {
    /// Number of qubits measured.
    pub n_qubits: u8,
    /// Total number of shots executed.
    pub shots: u32,
    /// `counts[outcome]` = number of times bitmask `outcome` was measured.
    pub counts: [u32; crate::MAX_STATE_SIZE],
}

impl MeasurementCounts {
    /// Get the count for a specific outcome bitmask.
    #[must_use]
    pub fn get(&self, outcome: u32) -> u32 {
        self.counts[outcome as usize]
    }

    /// Get the probability (relative frequency) of an outcome.
    #[must_use]
    pub fn probability(&self, outcome: u32) -> f64 {
        if self.shots == 0 {
            return 0.0;
        }
        self.counts[outcome as usize] as f64 / self.shots as f64
    }

    /// Find the most frequent outcome and its count.
    #[must_use]
    pub fn most_frequent(&self) -> (u32, u32) {
        let mut best_outcome = 0u32;
        let mut best_count = 0u32;
        let n = 1usize << self.n_qubits;
        for (i, &c) in self.counts[..n].iter().enumerate() {
            if c > best_count {
                best_count = c;
                best_outcome = i as u32;
            }
        }
        (best_outcome, best_count)
    }

    /// Total number of shots (sum of all counts).
    #[must_use]
    pub fn total(&self) -> u32 {
        self.shots
    }

    /// Total number of distinct outcomes observed.
    #[must_use]
    pub fn distinct_outcomes(&self) -> usize {
        let n = 1usize << self.n_qubits;
        self.counts[..n].iter().filter(|&&c| c > 0).count()
    }
}

/// A quantum circuit — the primary user-facing API.
///
/// Build a circuit with the fluent API, then execute with shots.
///
/// # Contract (Creusot/Prusti)
/// ```text
/// requires n_qubits <= 12
/// ensures n_qubits == self.state.n_qubits()
/// ensures n_instructions <= MAX_INSTRUCTIONS
/// ```
pub struct Circuit {
    /// The quantum state (reset before each shot).
    state: QuantumState,
    /// Instruction buffer.
    instructions: [Instruction; MAX_INSTRUCTIONS],
    /// Number of valid instructions.
    n_instructions: usize,
    /// RNG seed for reproducibility.
    seed: u64,
}

impl Circuit {
    /// Create a new circuit with `n_qubits` qubits.
    ///
    /// Uses a default seed of 42.
    ///
    /// # Panics
    /// Panics if `n_qubits > 12`.
    #[must_use]
    pub fn new(n_qubits: u8) -> Self {
        Self::with_seed(n_qubits, 42)
    }

    /// Create a new circuit with a specific RNG seed.
    ///
    /// # Panics
    /// Panics if `n_qubits > 12`.
    #[must_use]
    pub fn with_seed(n_qubits: u8, seed: u64) -> Self {
        Self {
            state: QuantumState::new(n_qubits),
            instructions: [Instruction::none(); MAX_INSTRUCTIONS],
            n_instructions: 0,
            seed,
        }
    }

    /// Number of qubits in this circuit.
    #[must_use]
    pub fn n_qubits(&self) -> u8 {
        self.state.n_qubits()
    }

    /// Number of instructions in this circuit.
    #[must_use]
    pub fn n_instructions(&self) -> usize {
        self.n_instructions
    }

    /// Add a Hadamard gate on `qubit`.
    ///
    /// # Panics
    /// Panics if `qubit >= n_qubits` or instruction buffer is full.
    pub fn h(&mut self, qubit: u8) -> &mut Self {
        assert!(qubit < self.state.n_qubits(), "qubit {qubit} out of range");
        self.push(Instruction {
            kind: GateKind::H,
            arg0: qubit,
            arg1: 0,
        });
        self
    }

    /// Add a Pauli-X (NOT) gate on `qubit`.
    ///
    /// # Panics
    /// Panics if `qubit >= n_qubits` or instruction buffer is full.
    pub fn x(&mut self, qubit: u8) -> &mut Self {
        assert!(qubit < self.state.n_qubits(), "qubit {qubit} out of range");
        self.push(Instruction {
            kind: GateKind::X,
            arg0: qubit,
            arg1: 0,
        });
        self
    }

    /// Add a Pauli-Z gate on `qubit`.
    ///
    /// # Panics
    /// Panics if `qubit >= n_qubits` or instruction buffer is full.
    pub fn z(&mut self, qubit: u8) -> &mut Self {
        assert!(qubit < self.state.n_qubits(), "qubit {qubit} out of range");
        self.push(Instruction {
            kind: GateKind::Z,
            arg0: qubit,
            arg1: 0,
        });
        self
    }

    /// Add a CNOT gate with `control` and `target`.
    ///
    /// # Panics
    /// Panics if `control >= n_qubits`, `target >= n_qubits`,
    /// `control == target`, or instruction buffer is full.
    pub fn cx(&mut self, control: u8, target: u8) -> &mut Self {
        assert!(
            control < self.state.n_qubits(),
            "control qubit {control} out of range"
        );
        assert!(
            target < self.state.n_qubits(),
            "target qubit {target} out of range"
        );
        assert!(control != target, "control and target must differ");
        self.push(Instruction {
            kind: GateKind::Cnot,
            arg0: control,
            arg1: target,
        });
        self
    }

    /// Add a measurement on `qubit`.
    ///
    /// The measurement collapses the qubit and stores the result.
    ///
    /// # Panics
    /// Panics if `qubit >= n_qubits` or instruction buffer is full.
    pub fn measure(&mut self, qubit: u8) -> &mut Self {
        assert!(qubit < self.state.n_qubits(), "qubit {qubit} out of range");
        self.push(Instruction {
            kind: GateKind::Measure,
            arg0: qubit,
            arg1: 0,
        });
        self
    }

    /// Execute the circuit with 1000 shots (default).
    #[must_use]
    pub fn execute(&mut self) -> MeasurementCounts {
        self.execute_shots(1000)
    }

    /// Execute the circuit for `shots` iterations, returning measurement counts.
    ///
    /// For each shot:
    /// 1. Reset state to |0...0⟩
    /// 2. Apply all instructions in order
    /// 3. Measure any unmeasured qubits
    /// 4. Record the outcome
    #[must_use]
    pub fn execute_shots(&mut self, shots: u32) -> MeasurementCounts {
        let mut counts = [0u32; crate::MAX_STATE_SIZE];
        let mut rng = Rng::new(self.seed);

        for _ in 0..shots {
            // Reset state to |0...0⟩
            self.state.reset();

            // Track which qubits have been measured
            let mut measured_mask = 0u32;

            // Execute all instructions
            for instr in &self.instructions[..self.n_instructions] {
                match instr.kind {
                    GateKind::H => self.state.apply_h(instr.arg0),
                    GateKind::X => self.state.apply_x(instr.arg0),
                    GateKind::Z => self.state.apply_z(instr.arg0),
                    GateKind::Cnot => self.state.apply_cnot(instr.arg0, instr.arg1),
                    GateKind::Measure => {
                        if measured_mask & (1u32 << instr.arg0) == 0 {
                            let result = self.state.measure(instr.arg0, &mut rng);
                            if result {
                                measured_mask |= 1u32 << instr.arg0;
                            }
                        }
                    }
                }
            }

            // Measure any unmeasured qubits
            for q in 0..self.state.n_qubits() {
                if measured_mask & (1u32 << q) == 0 {
                    let result = self.state.measure(q, &mut rng);
                    if result {
                        measured_mask |= 1u32 << q;
                    }
                }
            }

            counts[measured_mask as usize] += 1;
        }

        MeasurementCounts {
            n_qubits: self.state.n_qubits(),
            shots,
            counts,
        }
    }

    /// Push an instruction to the buffer.
    fn push(&mut self, instr: Instruction) {
        assert!(
            self.n_instructions < MAX_INSTRUCTIONS,
            "instruction buffer full (max {MAX_INSTRUCTIONS})"
        );
        self.instructions[self.n_instructions] = instr;
        self.n_instructions += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::GateKind;

    #[test]
    fn test_circuit_new() {
        let circuit = Circuit::new(3);
        assert_eq!(circuit.n_qubits(), 3);
        assert_eq!(circuit.n_instructions(), 0);
    }

    #[test]
    fn test_circuit_fluent_api() {
        let mut circuit = Circuit::new(2);
        circuit.h(0).cx(0, 1).measure(0);
        assert_eq!(circuit.n_instructions(), 3);
        assert_eq!(circuit.instructions[0].kind, GateKind::H);
        assert_eq!(circuit.instructions[1].kind, GateKind::Cnot);
        assert_eq!(circuit.instructions[2].kind, GateKind::Measure);
    }

    #[test]
    fn test_empty_circuit_always_zero() {
        let mut circuit = Circuit::with_seed(2, 42);
        let result = circuit.execute_shots(100);
        assert_eq!(result.shots, 100);
        assert_eq!(result.get(0), 100);
        assert!((result.probability(0) - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_single_x_gate() {
        let mut circuit = Circuit::with_seed(1, 42);
        circuit.x(0);
        let result = circuit.execute_shots(100);
        assert_eq!(result.get(1), 100); // Always |1⟩
    }

    #[test]
    fn test_x_gate_idempotent() {
        let mut circuit = Circuit::with_seed(1, 42);
        circuit.x(0).x(0);
        let result = circuit.execute_shots(100);
        assert_eq!(result.get(0), 100); // XX = I
    }

    #[test]
    fn test_h_gate_distribution() {
        let mut circuit = Circuit::with_seed(1, 12345);
        circuit.h(0);
        let result = circuit.execute_shots(10000);
        let p0 = result.probability(0);
        assert!(
            (p0 - 0.5).abs() < 0.05,
            "Expected ~50%, got {p0:.3}"
        );
    }

    #[test]
    fn test_z_gate_does_not_change_distribution() {
        // |+⟩ state: H(0) gives 50/50, Z(0) should preserve this
        let mut circuit = Circuit::with_seed(1, 12345);
        circuit.h(0).z(0);
        let result = circuit.execute_shots(10000);
        let p0 = result.probability(0);
        assert!(
            (p0 - 0.5).abs() < 0.05,
            "Z should not change H distribution, got {p0:.3}"
        );
    }

    #[test]
    fn test_cnot_control_zero() {
        // |00⟩ → CNOT(0,1) → |00⟩
        let mut circuit = Circuit::with_seed(2, 42);
        circuit.cx(0, 1);
        let result = circuit.execute_shots(100);
        assert_eq!(result.get(0), 100);
    }

    #[test]
    fn test_cnot_control_one() {
        // |10⟩ → CNOT(0,1) → |11⟩
        let mut circuit = Circuit::with_seed(2, 42);
        circuit.x(0).cx(0, 1);
        let result = circuit.execute_shots(100);
        assert_eq!(result.get(3), 100); // |11⟩ = 0b11 = 3
    }

    #[test]
    fn test_bell_state() {
        // H(0); CX(0,1) should produce ~50% |00⟩ and ~50% |11⟩
        let mut circuit = Circuit::with_seed(2, 99999);
        circuit.h(0).cx(0, 1);
        let result = circuit.execute_shots(10000);

        let p00 = result.probability(0b00);
        let p11 = result.probability(0b11);
        let p01 = result.probability(0b01);
        let p10 = result.probability(0b10);

        // |00⟩ and |11⟩ should each be ~50%
        assert!(
            (p00 - 0.5).abs() < 0.05,
            "Bell state |00⟩ should be ~50%, got {p00:.3}"
        );
        assert!(
            (p11 - 0.5).abs() < 0.05,
            "Bell state |11⟩ should be ~50%, got {p11:.3}"
        );
        // |01⟩ and |10⟩ should be ~0%
        assert!(
            p01 < 0.05,
            "Bell state |01⟩ should be ~0%, got {p01:.3}"
        );
        assert!(
            p10 < 0.05,
            "Bell state |10⟩ should be ~0%, got {p10:.3}"
        );
    }

    #[test]
    fn test_bell_state_deterministic() {
        // Same seed → same results
        let mut c1 = Circuit::with_seed(2, 42);
        c1.h(0).cx(0, 1);
        let r1 = c1.execute_shots(1000);

        let mut c2 = Circuit::with_seed(2, 42);
        c2.h(0).cx(0, 1);
        let r2 = c2.execute_shots(1000);

        assert_eq!(r1.counts[..4], r2.counts[..4]);
    }

    #[test]
    fn test_measurement_counts_total() {
        let mut circuit = Circuit::with_seed(3, 42);
        circuit.h(0).h(1).cx(0, 2);
        let result = circuit.execute_shots(500);
        let total: u32 = result.counts[..8].iter().sum();
        assert_eq!(total, 500);
    }

    #[test]
    fn test_most_frequent() {
        let mut circuit = Circuit::with_seed(1, 42);
        // No gates → always |0⟩
        let result = circuit.execute_shots(100);
        let (outcome, count) = result.most_frequent();
        assert_eq!(outcome, 0);
        assert_eq!(count, 100);
    }

    #[test]
    fn test_distinct_outcomes() {
        let mut circuit = Circuit::with_seed(1, 42);
        let result = circuit.execute_shots(100);
        assert_eq!(result.distinct_outcomes(), 1); // Only |0⟩

        let mut circuit2 = Circuit::with_seed(1, 12345);
        circuit2.h(0);
        let result2 = circuit2.execute_shots(10000);
        assert_eq!(result2.distinct_outcomes(), 2); // Both |0⟩ and |1⟩
    }

    #[test]
    #[should_panic]
    fn test_qubit_out_of_range() {
        let mut circuit = Circuit::new(2);
        circuit.h(5);
    }

    #[test]
    #[should_panic]
    fn test_cnot_same_qubit() {
        let mut circuit = Circuit::new(2);
        circuit.cx(0, 0);
    }

    #[test]
    #[should_panic]
    fn test_too_many_qubits() {
        let _ = Circuit::new(13);
    }

    #[test]
    fn test_one_qubit_circuit() {
        let mut circuit = Circuit::with_seed(1, 42);
        circuit.h(0);
        let result = circuit.execute_shots(1000);
        assert_eq!(result.n_qubits, 1);
        assert_eq!(result.shots, 1000);
    }

    #[test]
    fn test_twelve_qubit_circuit() {
        let mut circuit = Circuit::with_seed(12, 42);
        circuit.h(0).h(1);
        let result = circuit.execute_shots(10);
        assert_eq!(result.n_qubits, 12);
        assert_eq!(result.shots, 10);
        // Total counts should sum to 10
        let total: u32 = result.counts.iter().sum();
        assert_eq!(total, 10);
    }

    #[test]
    fn test_zero_shots() {
        let mut circuit = Circuit::with_seed(2, 42);
        circuit.h(0).cx(0, 1);
        let result = circuit.execute_shots(0);
        assert_eq!(result.shots, 0);
        assert_eq!(result.total(), 0);
    }

    #[test]
    fn test_ghz_state() {
        // H(0); CX(0,1); CX(0,2) → GHZ: (|000⟩ + |111⟩)/√2
        let mut circuit = Circuit::with_seed(3, 77777);
        circuit.h(0).cx(0, 1).cx(0, 2);
        let result = circuit.execute_shots(10000);

        let p000 = result.probability(0b000);
        let p111 = result.probability(0b111);

        assert!(
            (p000 - 0.5).abs() < 0.05,
            "GHZ |000⟩ should be ~50%, got {p000:.3}"
        );
        assert!(
            (p111 - 0.5).abs() < 0.05,
            "GHZ |111⟩ should be ~50%, got {p111:.3}"
        );
    }

    #[test]
    fn test_gate_kind_from_discriminant() {
        assert_eq!(GateKind::from_discriminant(0), Some(GateKind::H));
        assert_eq!(GateKind::from_discriminant(4), Some(GateKind::Measure));
        assert_eq!(GateKind::from_discriminant(5), None);
        assert_eq!(GateKind::from_discriminant(255), None);
    }

    #[test]
    fn test_instruction_default() {
        let instr = Instruction::default();
        assert_eq!(instr.kind, GateKind::H);
        assert_eq!(instr.arg0, 0);
        assert_eq!(instr.arg1, 0);
    }

    #[test]
    fn test_execute_default_shots() {
        let mut circuit = Circuit::with_seed(1, 42);
        let result = circuit.execute();
        assert_eq!(result.shots, 1000);
    }
}
