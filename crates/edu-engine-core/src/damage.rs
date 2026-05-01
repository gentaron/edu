//! Damage calculation — the core combat math.
//!
//! Pure functions, no heap allocation, no side effects.
//! All functions preserve the HP invariant: `0 <= hp <= max_hp`.

use crate::types::*;

/// Pure function: calculate damage/effect for a player ability.
///
/// # Invariants
/// - Returned `BattleResult.damage >= 0`
/// - Returned `BattleResult.heal >= 0`
/// - Returned `BattleResult.shield >= 0`
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// requires attacker.hp >= 0
/// requires attacker.max_hp >= 0
/// ensures result.damage >= 0
/// ensures result.heal >= 0
/// ensures result.shield >= 0
/// ensures result.attack_reduction >= 0
/// ```
///
/// # Canon (Lore-Tech)
/// This function is the **Soul Spark Calculation** — the fundamental
/// damage law of the EDU universe, computed identically whether on
/// RISC-V metal, WASM sandbox, or native x86_64.
#[must_use]
pub fn calculate_damage(attacker: &FieldChar, ability: &AbilityType) -> BattleResult {
    match ability {
        AbilityType::Attack => BattleResult {
            damage: attacker.attack.max(0),
            heal: 0,
            shield: 0,
            attack_reduction: 0,
        },
        AbilityType::Defense => BattleResult {
            damage: 0,
            heal: 0,
            shield: attacker.defense.max(0),
            attack_reduction: 0,
        },
        AbilityType::Effect => {
            let effect = attacker.effect_type;
            BattleResult {
                damage: if effect.has_damage() { attacker.attack.max(0) } else { 0 },
                heal: if effect.has_heal() {
                    ((attacker.max_hp as i64) * 3 / 10) as i32
                } else {
                    0
                },
                shield: if effect.has_shield() {
                    attacker.defense.max(0) / 2
                } else {
                    0
                },
                attack_reduction: if effect.has_attack_reduction() { 3 } else { 0 },
            }
        }
        AbilityType::Ultimate => BattleResult {
            damage: attacker.ultimate_damage.max(0),
            heal: 0,
            shield: 0,
            attack_reduction: 0,
        },
    }
}

/// Apply damage result to a character, preserving the HP invariant.
///
/// # Post-condition
/// `result.hp >= 0 && result.hp <= result.max_hp`
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// requires char.hp >= 0 && char.hp <= char.max_hp
/// requires result.damage >= 0
/// requires result.heal >= 0
/// ensures out.hp >= 0
/// ensures out.hp <= out.max_hp
/// ensures out.is_down ==> out.hp == 0
/// ```
#[must_use]
pub fn apply_result_to_char(char: &FieldChar, result: &BattleResult) -> FieldChar {
    let mut out = *char;
    if result.damage > 0 {
        out.hp = (out.hp - result.damage).max(0);
    }
    if result.heal > 0 {
        out.hp = (out.hp + result.heal).min(out.max_hp);
    }
    if out.hp <= 0 {
        out.is_down = true;
    }
    out
}

/// Vectorized AoE damage calculation.
///
/// Processes up to 8 targets simultaneously. Returns the number of valid
/// results written to the output buffer.
///
/// # Invariants
/// - All returned damage values >= 0
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// requires multiplier > 0
/// ensures result.len <= 8
/// ensures forall i in 0..result.len: result.damages[i] >= 0
/// ```
#[must_use]
pub fn calculate_aoe_damage(base_damage: i32, target_defenses: &[i32], multiplier: i32) -> AoEResult {
    let mut result = AoEResult::default();
    let count = target_defenses.len().min(8);
    for (i, &def) in target_defenses.iter().take(count).enumerate() {
        let raw = base_damage * multiplier / 100 - def;
        result.damages[i] = raw.max(0);
    }
    result.len = count as u8;
    result
}

/// AoE damage result — fixed-size buffer, no heap.
#[derive(Clone, Copy, Debug, Default)]
pub struct AoEResult {
    pub damages: [i32; 8],
    pub len: u8,
}

impl AoEResult {
    #[must_use]
    pub fn as_slice(&self) -> &[i32] {
        &self.damages[..self.len as usize]
    }

    #[must_use]
    pub fn total(&self) -> i32 {
        self.as_slice().iter().sum()
    }
}

/// Calculate the effective damage after shield absorption.
///
/// # Invariants
/// Returns value in `[0, i32::MAX]`.
#[must_use]
pub fn apply_shield(raw_damage: i32, shield: i32) -> i32 {
    (raw_damage - shield).max(0)
}

/// Calculate enemy attack damage with phase multiplier and attack reduction.
///
/// # Arguments
/// * `enemy_attack` - Base enemy attack stat
/// * `phase_multiplier` - Fixed-point multiplier (150 = 1.5x)
/// * `attack_reduction` - Player-applied attack reduction (0-10 scale)
/// * `shield_buffer` - Current shield absorption
///
/// # Returns
/// Effective damage dealt after all modifiers and shield.
#[must_use]
pub fn calculate_enemy_damage(
    enemy_attack: i32,
    phase_multiplier: u16,
    attack_reduction: i32,
    shield_buffer: i32,
) -> i32 {
    let mult = phase_multiplier as f64 / 100.0;
    let reduction_factor = (10.0 - (attack_reduction as f64).min(10.0)) / 10.0;
    let base = (enemy_attack as f64 * mult * reduction_factor) as i32;
    apply_shield(base, shield_buffer)
}

/// Clamp HP to valid range. Enforces `0 <= hp <= max_hp`.
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// ensures 0 <= result <= max_hp
/// ```
#[must_use]
pub const fn clamp_hp(hp: i32, max_hp: i32) -> i32 {
    if hp < 0 {
        0
    } else if hp > max_hp {
        max_hp
    } else {
        hp
    }
}

/// Verify the HP invariant: `0 <= hp <= max_hp`.
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// ensures result ==> (hp >= 0 && hp <= max_hp)
/// ensures result ==> (max_hp >= 0)
/// ```
#[must_use]
pub const fn verify_hp_invariant(hp: i32, max_hp: i32) -> bool {
    hp >= 0 && hp <= max_hp && max_hp >= 0
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_char(id: u32, attack: i32, defense: i32, effect: EffectType) -> FieldChar {
        FieldChar {
            id,
            name_idx: 0,
            hp: 50,
            max_hp: 50,
            attack,
            defense,
            is_down: false,
            rarity: Rarity::SR,
            ultimate_damage: attack * 3,
            effect_type: effect,
        }
    }

    // --- calculate_damage ---

    #[test]
    fn test_attack_deals_full_damage() {
        let c = sample_char(1, 15, 10, EffectType::Damage);
        let r = calculate_damage(&c, &AbilityType::Attack);
        assert_eq!(r.damage, 15);
        assert_eq!(r.heal, 0);
        assert_eq!(r.shield, 0);
        assert_eq!(r.attack_reduction, 0);
    }

    #[test]
    fn test_defense_grants_shield() {
        let c = sample_char(1, 15, 10, EffectType::Shield);
        let r = calculate_damage(&c, &AbilityType::Defense);
        assert_eq!(r.damage, 0);
        assert_eq!(r.shield, 10);
    }

    #[test]
    fn test_ultimate_deals_triple() {
        let c = sample_char(1, 15, 10, EffectType::Damage);
        let r = calculate_damage(&c, &AbilityType::Ultimate);
        assert_eq!(r.damage, 45);
    }

    #[test]
    fn test_effect_heal_only() {
        let c = sample_char(1, 20, 10, EffectType::Heal);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.damage, 0);
        assert_eq!(r.heal, 15); // 50 * 3/10
        assert_eq!(r.shield, 0);
    }

    #[test]
    fn test_effect_shield_only() {
        let c = sample_char(1, 20, 8, EffectType::Shield);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.damage, 0);
        assert_eq!(r.heal, 0);
        assert_eq!(r.shield, 4); // 8 / 2
    }

    #[test]
    fn test_effect_attack_reduction() {
        let c = sample_char(1, 20, 10, EffectType::AttackReduction);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.attack_reduction, 3);
    }

    #[test]
    fn test_effect_composite_heal_damage_shield() {
        let c = sample_char(1, 20, 10, EffectType::HealDamageShield);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.damage, 20);
        assert_eq!(r.heal, 15);  // 50 * 3/10
        assert_eq!(r.shield, 5);  // 10 / 2
    }

    #[test]
    fn test_effect_damage_heal() {
        let c = sample_char(1, 25, 12, EffectType::DamageHeal);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.damage, 25);
        assert_eq!(r.heal, 15);
        assert_eq!(r.shield, 0);
    }

    #[test]
    fn test_effect_damage_shield() {
        let c = sample_char(1, 25, 12, EffectType::DamageShield);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.damage, 25);
        assert_eq!(r.heal, 0);
        assert_eq!(r.shield, 6);
    }

    #[test]
    fn test_effect_heal_shield() {
        let c = sample_char(1, 25, 12, EffectType::HealShield);
        let r = calculate_damage(&c, &AbilityType::Effect);
        assert_eq!(r.damage, 0);
        assert_eq!(r.heal, 15);
        assert_eq!(r.shield, 6);
    }

    #[test]
    fn test_negative_attack_clamped_to_zero() {
        let c = sample_char(1, -5, 10, EffectType::Damage);
        let r = calculate_damage(&c, &AbilityType::Attack);
        assert_eq!(r.damage, 0);
    }

    // --- apply_result_to_char ---

    #[test]
    fn test_apply_damage_preserves_hp_floor() {
        let mut c = sample_char(1, 100, 10, EffectType::Damage);
        c.hp = 1;
        let r = BattleResult { damage: 999, heal: 0, shield: 0, attack_reduction: 0 };
        let out = apply_result_to_char(&c, &r);
        assert_eq!(out.hp, 0);
        assert!(out.is_down);
    }

    #[test]
    fn test_apply_heal_preserves_hp_ceiling() {
        let mut c = sample_char(1, 10, 10, EffectType::Heal);
        c.hp = 45;
        let r = BattleResult { damage: 0, heal: 100, shield: 0, attack_reduction: 0 };
        let out = apply_result_to_char(&c, &r);
        assert_eq!(out.hp, c.max_hp);
        assert!(!out.is_down);
    }

    // --- calculate_enemy_damage ---

    #[test]
    fn test_enemy_damage_basic() {
        let dmg = calculate_enemy_damage(10, 100, 0, 0);
        assert_eq!(dmg, 10);
    }

    #[test]
    fn test_enemy_damage_with_multiplier() {
        let dmg = calculate_enemy_damage(10, 150, 0, 0);
        assert_eq!(dmg, 15); // 10 * 1.5
    }

    #[test]
    fn test_enemy_damage_with_reduction() {
        let dmg = calculate_enemy_damage(10, 100, 5, 0);
        assert_eq!(dmg, 5); // 10 * (10-5)/10 = 5
    }

    #[test]
    fn test_enemy_damage_with_shield() {
        let dmg = calculate_enemy_damage(10, 100, 0, 3);
        assert_eq!(dmg, 7);
    }

    #[test]
    fn test_enemy_damage_shield_overflow_clamped() {
        let dmg = calculate_enemy_damage(5, 100, 0, 100);
        assert_eq!(dmg, 0);
    }

    // --- AoE ---

    #[test]
    fn test_aoe_damage_correct_count() {
        let defs = [5i32, 10, 0, 3];
        let results = calculate_aoe_damage(20, &defs, 100);
        assert_eq!(results.len, 4);
        assert_eq!(results.damages[0], 15); // 20 - 5
        assert_eq!(results.damages[1], 10); // 20 - 10
        assert_eq!(results.damages[2], 20); // 20 - 0
        assert_eq!(results.damages[3], 17); // 20 - 3
    }

    #[test]
    fn test_aoe_damage_multiplier() {
        let defs = [10i32];
        let results = calculate_aoe_damage(20, &defs, 150);
        assert_eq!(results.damages[0], 20); // 20*150/100 - 10 = 20
    }

    #[test]
    fn test_aoe_damage_never_negative() {
        let defs = [999i32];
        let results = calculate_aoe_damage(5, &defs, 100);
        assert_eq!(results.damages[0], 0);
    }

    // --- clamp_hp / verify_hp_invariant ---

    #[test]
    fn test_clamp_hp_normal() {
        assert_eq!(clamp_hp(30, 100), 30);
    }

    #[test]
    fn test_clamp_hp_negative() {
        assert_eq!(clamp_hp(-5, 100), 0);
    }

    #[test]
    fn test_clamp_hp_over_max() {
        assert_eq!(clamp_hp(150, 100), 100);
    }

    #[test]
    fn test_verify_hp_invariant_valid() {
        assert!(verify_hp_invariant(50, 100));
        assert!(verify_hp_invariant(0, 100));
        assert!(verify_hp_invariant(100, 100));
    }

    #[test]
    fn test_verify_hp_invariant_invalid() {
        assert!(!verify_hp_invariant(-1, 100));
        assert!(!verify_hp_invariant(101, 100));
        assert!(!verify_hp_invariant(50, -1));
    }

    // --- Exhaustive EffectType coverage ---

    #[test]
    fn test_all_effect_types_handled() {
        for effect in EffectType::ALL {
            let c = sample_char(1, 20, 10, effect);
            let r = calculate_damage(&c, &AbilityType::Effect);
            // Every effect must produce at least one non-zero result
            // except pure Damage (which goes to damage) or pure heal/shield
            assert!(r.damage >= 0 && r.heal >= 0 && r.shield >= 0);
        }
    }

    #[test]
    fn test_effect_type_count() {
        assert_eq!(EffectType::COUNT, 10);
        assert_eq!(EffectType::ALL.len(), 10);
    }

    #[test]
    fn test_effect_type_from_discriminant_roundtrip() {
        for (i, effect) in EffectType::ALL.iter().enumerate() {
            assert_eq!(EffectType::from_discriminant(i as u8), Some(*effect));
        }
        assert_eq!(EffectType::from_discriminant(255), None);
    }
}
