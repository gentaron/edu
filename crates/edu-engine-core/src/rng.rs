//! xoshiro256++ deterministic PRNG — `no_std` compatible.
//!
//! # Design
//! Xoshiro256++ is a fast, high-quality 64-bit PRNG with a period of 2^256 - 1.
//! It requires no heap allocation and is fully deterministic given the same seed.
//!
//! # Canon (Lore-Tech)
//! This RNG is the **Apolonium Seeded Cascade** — the deterministic
//! probability field that governs all random events in the EDU universe.
//! Same seed → same cascade → same universe.

/// Internal state for xoshiro256++.
#[derive(Clone, Copy, Debug)]
pub struct Xoshiro256pp {
    s: [u64; 4],
}

impl Xoshiro256pp {
    /// Create a new RNG from a 256-bit seed (4 × u64).
    #[must_use]
    pub const fn new(seed: [u64; 4]) -> Self {
        // Ensure no all-zero state (xoshiro produces all zeros for zero seed)
        let s = if seed[0] == 0 && seed[1] == 0 && seed[2] == 0 && seed[3] == 0 {
            [1, 0, 0, 0]
        } else {
            seed
        };
        Self { s }
    }

    /// Seed from a single u64 using splitmix64.
    #[must_use]
    pub fn seed_from_u64(mut seed: u64) -> Self {
        let mut s = [0u64; 4];
        for val in s.iter_mut() {
            seed = splitmix64(seed);
            *val = seed;
        }
        Self::new(s)
    }

    /// Generate the next u64 value.
    pub fn next_u64(&mut self) -> u64 {
        let result = rotl(self.s[0].wrapping_add(self.s[3]), 23)
            .wrapping_add(self.s[0]);

        let t = self.s[1] << 17;
        self.s[2] ^= self.s[0];
        self.s[3] ^= self.s[1];
        self.s[1] ^= self.s[2];
        self.s[0] ^= self.s[3];
        self.s[2] ^= t;
        self.s[3] = rotl(self.s[3], 45);

        result
    }

    /// Generate a u32 in `[0, upper_bound)`.
    #[must_use]
    pub fn next_u32_bounded(&mut self, upper_bound: u32) -> u32 {
        if upper_bound <= 1 {
            return 0;
        }
        // Fast path for powers of 2
        if upper_bound.is_power_of_two() {
            (self.next_u64() as u32) & (upper_bound - 1)
        } else {
            // Rejection sampling
            let mask = upper_bound.next_power_of_two() - 1;
            loop {
                let v = (self.next_u64() as u32) & mask;
                if v < upper_bound {
                    return v;
                }
            }
        }
    }

    /// Generate an i32 in `[0, upper_bound)`.
    #[must_use]
    pub fn next_i32_bounded(&mut self, upper_bound: i32) -> i32 {
        self.next_u32_bounded(upper_bound.max(1) as u32) as i32
    }

    /// Generate a f64 in `[0.0, 1.0)`.
    #[must_use]
    pub fn next_f64(&mut self) -> f64 {
        // Use upper 53 bits of u64 for uniform [0, 1)
        (self.next_u64() >> 11) as f64 * (1.0f64 / (1u64 << 53) as f64)
    }

    /// Skip ahead by 2^64 positions (equivalent to calling next_u64() 2^64 times).
    pub fn jump(&mut self) {
        jump_impl(&mut self.s);
    }
}

/// Splitmix64 — used for seeding from a single u64.
fn splitmix64(mut x: u64) -> u64 {
    x = x.wrapping_add(0x9E37_79B9_7F4A_7C15);
    x = (x ^ (x >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    x ^ (x >> 31)
}

/// 64-bit left rotation.
const fn rotl(x: u64, k: u32) -> u64 {
    (x << k) | (x >> (64 - k))
}

/// Jump function for xoshiro256++ — advance by 2^64 steps.
fn jump_impl(s: &mut [u64; 4]) {
    let jump: [u64; 4] = [
        0x180E_C6D5_5CA5_75A1,
        0xD35A_2D97_B4A0_649B,
        0x3FCC_522A_364A_4A5B,
        0x4B1C_1CB1_A535_0FEB,
    ];

    let mut s0 = 0u64;
    let mut s1 = 0u64;
    let mut s2 = 0u64;
    let mut s3 = 0u64;

    for j in 0..4 {
        for b in 0..64 {
            if (jump[j] >> b) & 1 != 0 {
                s0 ^= s[0];
                s1 ^= s[1];
                s2 ^= s[2];
                s3 ^= s[3];
            }
            // Inline xoshiro step
            let t = s[1] << 17;
            s[2] ^= s[0];
            s[3] ^= s[1];
            s[1] ^= s[2];
            s[0] ^= s[3];
            s[2] ^= t;
            s[3] = rotl(s[3], 45);
        }
    }

    s[0] = s0;
    s[1] = s1;
    s[2] = s2;
    s[3] = s3;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deterministic_sequence() {
        let mut rng1 = Xoshiro256pp::seed_from_u64(42);
        let mut rng2 = Xoshiro256pp::seed_from_u64(42);
        for _ in 0..100 {
            assert_eq!(rng1.next_u64(), rng2.next_u64());
        }
    }

    #[test]
    fn test_different_seeds_differ() {
        let mut rng1 = Xoshiro256pp::seed_from_u64(1);
        let mut rng2 = Xoshiro256pp::seed_from_u64(2);
        assert_ne!(rng1.next_u64(), rng2.next_u64());
    }

    #[test]
    fn test_zero_seed_handled() {
        let mut rng = Xoshiro256pp::new([0, 0, 0, 0]);
        // Should not produce all zeros
        assert_ne!(rng.next_u64(), 0);
    }

    #[test]
    fn test_next_u32_bounded() {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        for _ in 0..1000 {
            let v = rng.next_u32_bounded(10);
            assert!(v < 10);
        }
    }

    #[test]
    fn test_next_u32_bounded_zero() {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        assert_eq!(rng.next_u32_bounded(0), 0);
        assert_eq!(rng.next_u32_bounded(1), 0);
    }

    #[test]
    fn test_next_f64_range() {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        for _ in 0..1000 {
            let v = rng.next_f64();
            assert!(v >= 0.0 && v < 1.0, "f64 out of range: {}", v);
        }
    }

    #[test]
    fn test_period_quality_no_trivial_cycle() {
        let mut rng = Xoshiro256pp::seed_from_u64(12345);
        let first = rng.next_u64();
        for _ in 0..10000 {
            assert_ne!(rng.next_u64(), first, "Cycle detected within 10000 steps");
        }
    }

    #[test]
    fn test_jump_advances_state() {
        let mut rng1 = Xoshiro256pp::seed_from_u64(42);
        let mut rng2 = Xoshiro256pp::seed_from_u64(42);
        rng1.jump();
        let _ = rng2.next_u64(); // Just verify they differ after jump
        assert_ne!(rng1.next_u64(), rng2.next_u64());
    }
}
