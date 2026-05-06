//! State-vector simulation — the heart of the quantum interpreter.
//!
//! Implements a stack-allocated complex amplitude array for up to 12 qubits.
//! All gate operations are performed in-place on the state vector.
//!
//! # Contract (Creusot/Prusti)
//! ```text
//! invariant 0 <= n_qubits <= 12
//! invariant forall i in 0..2^n_qubits: state[i] is a valid complex number
//! invariant sum of |state[i]|^2 for i in 0..2^n_qubits == 1.0 (after reset)
//! ```

use crate::MAX_STATE_SIZE;

/// A complex number with `f64` real and imaginary parts.
///
/// Designed to be `Copy` and `repr(C)` for FFI compatibility.
///
/// # Contract (Creusot/Prusti)
/// ```text
/// invariant is_finite(re) && is_finite(im)
/// ensures |self|^2 = re*re + im*im >= 0
/// ```
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Complex {
    pub re: f64,
    pub im: f64,
}

impl Complex {
    /// Zero amplitude.
    pub const ZERO: Self = Self { re: 0.0, im: 0.0 };

    /// One (1 + 0i).
    pub const ONE: Self = Self { re: 1.0, im: 0.0 };

    /// Create a new complex number.
    #[must_use]
    pub const fn new(re: f64, im: f64) -> Self {
        Self { re, im }
    }

    /// Squared magnitude: |z|^2 = re^2 + im^2.
    #[must_use]
    pub fn norm_sq(self) -> f64 {
        self.re * self.re + self.im * self.im
    }

    /// Multiply by a scalar.
    #[must_use]
    pub fn scale(self, s: f64) -> Self {
        Self {
            re: self.re * s,
            im: self.im * s,
        }
    }

    /// Add another complex number (component-wise).
    #[must_use]
    pub fn plus(self, other: Self) -> Self {
        Self {
            re: self.re + other.re,
            im: self.im + other.im,
        }
    }

    /// Subtract another complex number (component-wise).
    #[must_use]
    pub fn minus(self, other: Self) -> Self {
        Self {
            re: self.re - other.re,
            im: self.im - other.im,
        }
    }
}

impl Default for Complex {
    fn default() -> Self {
        Self::ZERO
    }
}

/// Quantum state-vector for up to 12 qubits.
///
/// Stack-allocated: 4096 × 16 bytes = 64 KB.
/// The `active_len` field tracks how many entries are actually in use (2^n_qubits).
///
/// # Contract (Creusot/Prusti)
/// ```text
/// requires n_qubits <= 12
/// ensures amplitudes[0] == 1.0+0i and amplitudes[1..active_len] == 0.0+0i
/// ensures active_len == 1 << n_qubits
/// ```
pub struct QuantumState {
    /// Complex amplitude array (zero-initialized beyond active_len).
    amplitudes: [Complex; MAX_STATE_SIZE],
    /// Number of qubits in the system.
    n_qubits: u8,
    /// Active length: 2^n_qubits.
    active_len: usize,
}

impl QuantumState {
    /// Create a new quantum state initialized to |0...0⟩.
    ///
    /// # Panics
    /// Panics if `n_qubits > 12`.
    #[must_use]
    pub fn new(n_qubits: u8) -> Self {
        assert!(n_qubits <= 12, "n_qubits must be <= 12, got {n_qubits}");
        let active_len = 1usize << n_qubits;
        let mut amplitudes = [Complex::ZERO; MAX_STATE_SIZE];
        amplitudes[0] = Complex::ONE;
        Self {
            amplitudes,
            n_qubits,
            active_len,
        }
    }

    /// Reset the state to |0...0⟩.
    pub fn reset(&mut self) {
        for a in self.amplitudes[..self.active_len].iter_mut() {
            *a = Complex::ZERO;
        }
        self.amplitudes[0] = Complex::ONE;
    }

    /// Number of qubits.
    #[must_use]
    pub fn n_qubits(&self) -> u8 {
        self.n_qubits
    }

    /// Active state-vector length (2^n_qubits).
    #[must_use]
    pub fn active_len(&self) -> usize {
        self.active_len
    }

    /// Get amplitude at index (for testing).
    #[must_use]
    pub fn amplitude(&self, idx: usize) -> Complex {
        self.amplitudes[idx]
    }

    /// Get raw slice of active amplitudes (for advanced use).
    #[must_use]
    pub fn amplitudes(&self) -> &[Complex] {
        &self.amplitudes[..self.active_len]
    }

    // ─── Gate operations ───────────────────────────────────────────────

    /// Apply the Hadamard gate to qubit `q`.
    ///
    /// H|0⟩ = (|0⟩ + |1⟩)/√2
    /// H|1⟩ = (|0⟩ − |1⟩)/√2
    ///
    /// # Contract (Creusot/Prusti)
    /// ```text
    /// requires q < n_qubits
    /// ensures sum of |amplitudes[i]|^2 == 1.0 (unitarity preserved)
    /// ```
    pub fn apply_h(&mut self, q: u8) {
        let mask = 1usize << q;
        let inv_sqrt2 = core::f64::consts::FRAC_1_SQRT_2;

        let n = self.active_len;
        for i in 0..n {
            if i & mask == 0 {
                let j = i | mask;
                let a = self.amplitudes[i];
                let b = self.amplitudes[j];
                self.amplitudes[i] = Complex::new(
                    (a.re + b.re) * inv_sqrt2,
                    (a.im + b.im) * inv_sqrt2,
                );
                self.amplitudes[j] = Complex::new(
                    (a.re - b.re) * inv_sqrt2,
                    (a.im - b.im) * inv_sqrt2,
                );
            }
        }
    }

    /// Apply the Pauli-X (NOT) gate to qubit `q`.
    ///
    /// X|0⟩ = |1⟩, X|1⟩ = |0⟩
    ///
    /// # Contract (Creusot/Prusti)
    /// ```text
    /// requires q < n_qubits
    /// ensures sum of |amplitudes[i]|^2 == 1.0
    /// ```
    pub fn apply_x(&mut self, q: u8) {
        let mask = 1usize << q;
        let n = self.active_len;
        for i in 0..n {
            if i & mask == 0 {
                let j = i | mask;
                self.amplitudes.swap(i, j);
            }
        }
    }

    /// Apply the Pauli-Z gate to qubit `q`.
    ///
    /// Z|0⟩ = |0⟩, Z|1⟩ = −|1⟩
    ///
    /// # Contract (Creusot/Prusti)
    /// ```text
    /// requires q < n_qubits
    /// ensures sum of |amplitudes[i]|^2 == 1.0
    /// ```
    pub fn apply_z(&mut self, q: u8) {
        let mask = 1usize << q;
        let n = self.active_len;
        for i in 0..n {
            if i & mask != 0 {
                let a = &mut self.amplitudes[i];
                a.re = -a.re;
                a.im = -a.im;
            }
        }
    }

    /// Apply the CNOT gate with `control` and `target` qubits.
    ///
    /// If control is |1⟩, flip target.
    ///
    /// # Contract (Creusot/Prusti)
    /// ```text
    /// requires control != target
    /// requires control < n_qubits
    /// requires target < n_qubits
    /// ensures sum of |amplitudes[i]|^2 == 1.0
    /// ```
    pub fn apply_cnot(&mut self, control: u8, target: u8) {
        let c_mask = 1usize << control;
        let t_mask = 1usize << target;
        let n = self.active_len;
        for i in 0..n {
            if (i & c_mask != 0) && (i & t_mask == 0) {
                let j = i | t_mask;
                self.amplitudes.swap(i, j);
            }
        }
    }

    /// Measure qubit `q`, collapsing the state.
    ///
    /// Returns `true` if the measured value is |1⟩, `false` for |0⟩.
    ///
    /// # Contract (Creusot/Prusti)
    /// ```text
    /// requires q < n_qubits
    /// ensures result in {true, false}
    /// ensures sum of |amplitudes[i]|^2 == 1.0 (post-measurement normalization)
    /// ```
    pub fn measure(&mut self, q: u8, rng: &mut Rng) -> bool {
        let mask = 1usize << q;
        let n = self.active_len;

        // Calculate probability of |1⟩
        let mut p1: f64 = 0.0;
        for i in 0..n {
            if i & mask != 0 {
                p1 += self.amplitudes[i].norm_sq();
            }
        }

        // Clamp to [0, 1] for numerical stability
        let p1 = p1.clamp(0.0, 1.0);
        let r = rng.next_f64();

        let measured_one = r < p1;
        let p = if measured_one { p1 } else { 1.0 - p1 };
        let inv_sqrt_p = if p > 1e-15 { 1.0 / f64_sqrt(p) } else { 0.0 };

        for i in 0..n {
            let bit_is_one = i & mask != 0;
            if measured_one == bit_is_one {
                // Renormalize surviving amplitudes
                let a = &mut self.amplitudes[i];
                a.re *= inv_sqrt_p;
                a.im *= inv_sqrt_p;
            } else {
                // Zero out
                self.amplitudes[i] = Complex::ZERO;
            }
        }

        measured_one
    }

    /// Compute the total probability (should be ≈ 1.0 for a valid state).
    #[must_use]
    pub fn total_probability(&self) -> f64 {
        let mut sum = 0.0_f64;
        for a in self.amplitudes[..self.active_len].iter() {
            sum += a.norm_sq();
        }
        sum
    }
}

/// Deterministic PRNG for measurement — xorshift64, no_std compatible.
#[derive(Clone, Copy, Debug)]
pub struct Rng {
    state: u64,
}

impl Rng {
    /// Create a new RNG from a seed.
    #[must_use]
    pub fn new(seed: u64) -> Self {
        let state = if seed == 0 { 0xDEAD_BEEF_CAFE_BABE } else { seed };
        Self { state }
    }

    /// Generate the next f64 in [0.0, 1.0).
    #[must_use]
    pub fn next_f64(&mut self) -> f64 {
        // xorshift64
        let mut x = self.state;
        x ^= x << 13;
        x ^= x >> 7;
        x ^= x << 17;
        self.state = x;

        // Convert to [0, 1)
        (x >> 11) as f64 * (1.0f64 / (1u64 << 53) as f64)
    }
}

/// Square root of an f64 using Newton's method — no_std compatible.
///
/// Uses a biased initial guess and iterates until convergence.
/// Converges to machine epsilon in ~6 iterations.
#[must_use]
fn f64_sqrt(x: f64) -> f64 {
    if x <= 0.0 {
        return 0.0;
    }
    // Start with a rough estimate: always >= true sqrt to converge correctly
    let mut z = if x < 1.0 { x + 1.0 } else { x };
    // Newton iterations: z_{n+1} = (z_n + x/z_n) / 2
    for _ in 0..10 {
        let next = (z + x / z) * 0.5;
        if next >= z {
            break;
        }
        z = next;
    }
    z
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_complex_operations() {
        let a = Complex::new(3.0, 4.0);
        assert!((a.norm_sq() - 25.0).abs() < 1e-10);

        let b = a.scale(2.0);
        assert!((b.re - 6.0).abs() < 1e-10);
        assert!((b.im - 8.0).abs() < 1e-10);

        let c = Complex::new(1.0, 2.0).plus(Complex::new(3.0, 4.0));
        assert!((c.re - 4.0).abs() < 1e-10);
        assert!((c.im - 6.0).abs() < 1e-10);

        let d = Complex::new(5.0, 7.0).minus(Complex::new(2.0, 3.0));
        assert!((d.re - 3.0).abs() < 1e-10);
        assert!((d.im - 4.0).abs() < 1e-10);
    }

    #[test]
    fn test_state_initializes_to_zero() {
        let state = QuantumState::new(2);
        assert!((state.amplitude(0).re - 1.0).abs() < 1e-10);
        assert!((state.amplitude(0).im).abs() < 1e-10);
        assert!((state.amplitude(1).re).abs() < 1e-10);
        assert!((state.amplitude(2).re).abs() < 1e-10);
        assert!((state.amplitude(3).re).abs() < 1e-10);
    }

    #[test]
    fn test_state_total_probability_after_init() {
        let state = QuantumState::new(3);
        assert!((state.total_probability() - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_state_reset() {
        let mut state = QuantumState::new(2);
        state.apply_h(0);
        state.reset();
        assert!((state.amplitude(0).re - 1.0).abs() < 1e-10);
        for i in 1..4 {
            assert!((state.amplitude(i).re).abs() < 1e-10);
        }
    }

    #[test]
    fn test_x_gate_flips() {
        let mut state = QuantumState::new(1);
        state.apply_x(0);
        assert!((state.amplitude(0).re).abs() < 1e-10);
        assert!((state.amplitude(1).re - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_x_gate_twice_is_identity() {
        let mut state = QuantumState::new(1);
        state.apply_x(0);
        state.apply_x(0);
        assert!((state.amplitude(0).re - 1.0).abs() < 1e-10);
        assert!((state.amplitude(1).re).abs() < 1e-10);
    }

    #[test]
    fn test_x_gate_preserves_unitarity() {
        let mut state = QuantumState::new(3);
        state.apply_x(1);
        assert!((state.total_probability() - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_h_gate_creates_superposition() {
        let mut state = QuantumState::new(1);
        state.apply_h(0);
        let expected = core::f64::consts::FRAC_1_SQRT_2;
        assert!((state.amplitude(0).re - expected).abs() < 1e-10);
        assert!((state.amplitude(1).re - expected).abs() < 1e-10);
    }

    #[test]
    fn test_h_gate_twice_is_identity() {
        let mut state = QuantumState::new(2);
        state.apply_h(0);
        state.apply_h(0);
        assert!((state.amplitude(0).re - 1.0).abs() < 1e-10);
        for i in 1..4 {
            assert!((state.amplitude(i).norm_sq()).abs() < 1e-10);
        }
    }

    #[test]
    fn test_h_gate_preserves_unitarity() {
        let mut state = QuantumState::new(5);
        state.apply_h(0);
        state.apply_h(2);
        state.apply_h(4);
        assert!((state.total_probability() - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_z_gate_on_zero_does_nothing() {
        let mut state = QuantumState::new(1);
        state.apply_z(0);
        assert!((state.amplitude(0).re - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_z_gate_negates_one() {
        let mut state = QuantumState::new(1);
        state.apply_x(0); // |1⟩
        state.apply_z(0); // -|1⟩
        assert!((state.amplitude(1).re - (-1.0)).abs() < 1e-10);
    }

    #[test]
    fn test_z_gate_twice_is_identity() {
        let mut state = QuantumState::new(1);
        state.apply_x(0);
        state.apply_z(0);
        state.apply_z(0);
        assert!((state.amplitude(1).re - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_z_gate_preserves_unitarity() {
        let mut state = QuantumState::new(3);
        state.apply_h(0);
        state.apply_z(1);
        assert!((state.total_probability() - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_cnot_with_control_zero_does_nothing() {
        let mut state = QuantumState::new(2);
        // |00⟩ — control (q0) is 0, so target (q1) stays 0
        state.apply_cnot(0, 1);
        assert!((state.amplitude(0).re - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_cnot_flips_target_when_control_is_one() {
        let mut state = QuantumState::new(2);
        state.apply_x(0); // |10⟩
        state.apply_cnot(0, 1); // Should become |11⟩
        assert!((state.amplitude(3).re - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_cnot_preserves_unitarity() {
        let mut state = QuantumState::new(3);
        state.apply_h(0);
        state.apply_h(1);
        state.apply_cnot(0, 2);
        assert!((state.total_probability() - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_cnot_twice_is_identity() {
        let mut state = QuantumState::new(2);
        state.apply_h(0);
        state.apply_cnot(0, 1);
        state.apply_cnot(0, 1);
        // Should be same as just H(0)
        let inv_sqrt2 = core::f64::consts::FRAC_1_SQRT_2;
        assert!((state.amplitude(0).re - inv_sqrt2).abs() < 1e-10);
        assert!((state.amplitude(1).re - inv_sqrt2).abs() < 1e-10);
    }

    #[test]
    fn test_measure_zero_state_always_returns_zero() {
        let mut state = QuantumState::new(1);
        let mut rng = Rng::new(42);
        for _ in 0..100 {
            assert!(!state.measure(0, &mut rng));
            state.reset();
        }
    }

    #[test]
    fn test_measure_one_state_always_returns_one() {
        let mut state = QuantumState::new(1);
        state.apply_x(0);
        let mut rng = Rng::new(42);
        for _ in 0..100 {
            assert!(state.measure(0, &mut rng));
            state.reset();
            state.apply_x(0);
        }
    }

    #[test]
    fn test_measure_superposition_distribution() {
        let mut state = QuantumState::new(1);
        state.apply_h(0);
        let mut rng = Rng::new(12345);
        let mut ones = 0u32;
        let shots = 10000;
        for _ in 0..shots {
            if state.measure(0, &mut rng) {
                ones += 1;
            }
            state.reset();
            state.apply_h(0);
        }
        let ratio = ones as f64 / shots as f64;
        // Should be ~50% — allow wide tolerance for determinism
        assert!(
            (ratio - 0.5).abs() < 0.05,
            "Expected ~50%, got {ratio:.3}"
        );
    }

    #[test]
    fn test_measure_collapses_state() {
        let mut state = QuantumState::new(1);
        state.apply_h(0);
        let mut rng = Rng::new(42);
        let _ = state.measure(0, &mut rng);
        // After measurement, state should be approximately a basis state
        let p = state.total_probability();
        assert!(
            (p - 1.0).abs() < 1e-6,
            "Total probability after measurement should be ~1.0, got {p}"
        );
        let is_basis = (state.amplitude(0).norm_sq() - 1.0).abs() < 1e-6
            || (state.amplitude(1).norm_sq() - 1.0).abs() < 1e-6;
        assert!(is_basis, "State should be a basis state after measurement");
    }

    #[test]
    fn test_rng_deterministic() {
        let mut rng1 = Rng::new(42);
        let mut rng2 = Rng::new(42);
        for _ in 0..100 {
            assert!((rng1.next_f64() - rng2.next_f64()).abs() < 1e-20);
        }
    }

    #[test]
    fn test_rng_different_seeds() {
        let mut rng1 = Rng::new(1);
        let mut rng2 = Rng::new(2);
        assert!((rng1.next_f64() - rng2.next_f64()).abs() > 1e-20);
    }

    #[test]
    #[should_panic]
    fn test_state_too_many_qubits() {
        let _ = QuantumState::new(13);
    }
}
