//! Core type definitions — no WASM, no JS dependencies.
//!
//! All types are designed to work in `#![no_std]` environments.
//! WASM-specific wrappers live in `edu-engine-wasm`.

use core::ops::RangeInclusive;

/// Character card on the battle field.
/// Replaces the original `FieldChar` which depended on `wasm_bindgen`.
#[derive(Clone, Copy, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct FieldChar {
    pub id: u32,
    pub name_idx: u16,
    pub hp: i32,
    pub max_hp: i32,
    pub attack: i32,
    pub defense: i32,
    pub is_down: bool,
    pub rarity: Rarity,
    pub ultimate_damage: i32,
    pub effect_type: EffectType,
}

/// Character rarity tiers.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
#[repr(u8)]
pub enum Rarity {
    N = 0,
    R = 1,
    SR = 2,
    SSR = 3,
}

/// Effect type for a character ability — exhaustive enum.
/// Maps 1:1 to the TypeScript `EffectType` const object.
///
/// Canon: Each variant corresponds to a Thought Layer resonance pattern
/// in the EDU universe.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
#[repr(u8)]
pub enum EffectType {
    Heal = 0,
    Damage = 1,
    Shield = 2,
    HealDamage = 3,
    DamageHeal = 4,
    DamageShield = 5,
    HealShield = 6,
    HealDamageShield = 7,
    AttackReduction = 8,
    SpecialPandict = 9,
}

impl EffectType {
    /// Total number of variants. Useful for exhaustive iteration and FFI.
    pub const COUNT: usize = 10;

    /// All variants in declaration order.
    pub const ALL: [EffectType; Self::COUNT] = [
        Self::Heal,
        Self::Damage,
        Self::Shield,
        Self::HealDamage,
        Self::DamageHeal,
        Self::DamageShield,
        Self::HealShield,
        Self::HealDamageShield,
        Self::AttackReduction,
        Self::SpecialPandict,
    ];

    /// Convert from u8 discriminant. Returns `None` if out of range.
    #[must_use]
    pub const fn from_discriminant(v: u8) -> Option<Self> {
        match v {
            0 => Some(Self::Heal),
            1 => Some(Self::Damage),
            2 => Some(Self::Shield),
            3 => Some(Self::HealDamage),
            4 => Some(Self::DamageHeal),
            5 => Some(Self::DamageShield),
            6 => Some(Self::HealShield),
            7 => Some(Self::HealDamageShield),
            8 => Some(Self::AttackReduction),
            9 => Some(Self::SpecialPandict),
            _ => None,
        }
    }

    /// Whether this effect type includes healing.
    #[must_use]
    pub const fn has_heal(self) -> bool {
        matches!(self, Self::Heal | Self::HealDamage | Self::DamageHeal | Self::HealShield | Self::HealDamageShield)
    }

    /// Whether this effect type includes damage.
    #[must_use]
    pub const fn has_damage(self) -> bool {
        matches!(self, Self::Damage | Self::HealDamage | Self::DamageHeal | Self::DamageShield | Self::HealDamageShield)
    }

    /// Whether this effect type includes shielding.
    #[must_use]
    pub const fn has_shield(self) -> bool {
        matches!(self, Self::Shield | Self::DamageShield | Self::HealShield | Self::HealDamageShield)
    }

    /// Whether this effect type includes attack reduction.
    #[must_use]
    pub fn has_attack_reduction(self) -> bool {
        self == Self::AttackReduction
    }
}

/// Ability type a player can choose.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
#[repr(u8)]
pub enum AbilityType {
    Attack = 0,
    Defense = 1,
    Effect = 2,
    Ultimate = 3,
}

impl AbilityType {
    /// Total number of variants.
    pub const COUNT: usize = 4;

    /// Convert from u8 discriminant.
    #[must_use]
    pub const fn from_u8(v: u8) -> Self {
        match v {
            1 => Self::Defense,
            2 => Self::Effect,
            3 => Self::Ultimate,
            _ => Self::Attack,
        }
    }
}

/// Result of a single damage/effect calculation.
/// Computed values only — no string allocations in no_std.
#[derive(Clone, Debug, Default)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct BattleResult {
    pub damage: i32,
    pub heal: i32,
    pub shield: i32,
    pub attack_reduction: i32,
}

/// Enemy definition including phase thresholds.
#[derive(Clone, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct Enemy {
    pub id: u32,
    pub name_idx: u16,
    pub max_hp: i32,
    pub attack: i32,
    pub phases: [PhaseThreshold; 4],
    pub phase_count: u8,
}

/// Enemy phase transition threshold.
#[derive(Clone, Copy, Debug, Default)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct PhaseThreshold {
    pub hp_percent: i32,
    pub attack_multiplier: u16,  // Fixed-point: divide by 100 for actual (e.g. 150 = 1.5x)
}

impl PhaseThreshold {
    /// Create a new threshold.
    #[must_use]
    pub const fn new(hp_percent: i32, multiplier: u16) -> Self {
        Self {
            hp_percent,
            attack_multiplier: multiplier,
        }
    }

    /// Get the effective multiplier as f64.
    #[must_use]
    pub fn multiplier_f64(self) -> f64 {
        self.attack_multiplier as f64 / 100.0
    }
}

/// Full immutable battle state snapshot.
#[derive(Clone, Copy, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct BattleState {
    pub turn: u32,
    pub enemy_hp: i32,
    pub enemy_max_hp: i32,
    pub enemy_phase: u32,
    pub shield_buffer: i32,
    pub field: [FieldChar; 5],
    pub field_len: u8,
    pub phase: BattlePhase,
    pub poison_active: bool,
    pub enemy_attack_reduction: i32,
}

/// Current phase of battle flow.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
#[repr(u8)]
pub enum BattlePhase {
    PlayerTurn = 0,
    Resolving = 1,
    EnemyTurn = 2,
    Victory = 3,
    Defeat = 4,
}

/// Result of enemy turn execution.
#[derive(Clone, Copy, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct EnemyTurnResult {
    pub updated_field: [FieldChar; 5],
    pub field_len: u8,
    pub new_enemy_hp: i32,
    pub damage_dealt: i32,
}

/// Result of a simulated battle.
#[derive(Clone, Copy, Debug, Default)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct SimResult {
    pub victory: bool,
    pub turns: u32,
    pub final_enemy_hp: i32,
    pub survivors: u8,
}

/// SIMD-friendly damage vector for AoE calculations.
/// Fixed-size array matching `core::simd` lane count.
#[derive(Clone, Copy, Debug, Default)]
pub struct DamageVector {
    pub damages: [i32; 8],
    pub len: u8,
}

impl DamageVector {
    /// Create from a slice. Truncates to 8 elements.
    #[must_use]
    pub fn from_slice(slice: &[i32]) -> Self {
        let mut d = Self::default();
        let end = slice.len().min(8);
        d.damages[..end].copy_from_slice(&slice[..end]);
        d.len = end as u8;
        d
    }

    /// Sum all damages.
    #[must_use]
    pub fn total(&self) -> i32 {
        self.damages[..self.len as usize].iter().sum()
    }

    /// Apply minimum floor of 0 to all elements.
    pub fn clamp_zero(&mut self) {
        for d in self.damages[..self.len as usize].iter_mut() {
            *d = (*d).max(0);
        }
    }
}

/// Valid HP range invariant.
/// Every function that modifies HP must preserve: 0 <= hp <= max_hp.
pub const HP_RANGE: RangeInclusive<i32> = 0..=i32::MAX;

/// Maximum number of characters on the field.
pub const MAX_FIELD_SIZE: usize = 5;

/// Maximum battle turns before timeout.
pub const MAX_TURNS: u32 = 200;

impl Default for FieldChar {
    fn default() -> Self {
        Self {
            id: 0,
            name_idx: 0,
            hp: 0,
            max_hp: 0,
            attack: 0,
            defense: 0,
            is_down: true,
            rarity: Rarity::N,
            ultimate_damage: 0,
            effect_type: EffectType::Damage,
        }
    }
}

impl FieldChar {
    /// Create a placeholder FieldChar for array initialization.
    #[must_use]
    pub const fn default_placeholder() -> Self {
        Self {
            id: 0,
            name_idx: 0,
            hp: 0,
            max_hp: 0,
            attack: 0,
            defense: 0,
            is_down: true,
            rarity: Rarity::N,
            ultimate_damage: 0,
            effect_type: EffectType::Damage,
        }
    }
}
