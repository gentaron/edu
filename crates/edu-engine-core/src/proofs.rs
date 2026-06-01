//! Formal verification harnesses for the battle engine core.
//!
//! This module provides:
//! 1. **Kani harnesses** (`#[cfg(kani)]`) — bounded model checking proofs
//! 2. **Property test fallbacks** — for environments without Kani
//!
//! # Kani Installation
//! ```bash
//! cargo install --locked kani-verifier
//! cargo kani setup
//! cargo kani --tests
//! ```
//!
//! # Canon (Lore-Tech)
//! These proofs constitute the **D1–D5 Adversarial Verification Layer**:
//! mechanized defenses against unsafe states in the EDU universe.

#[cfg(test)]
mod property_tests {
    //! Property-based test fallbacks for environments without Kani.
    //! These serve as "weaker but mechanized" verification per the
    //! failure-mode doctrine.

    use crate::damage::*;
    use crate::fsm::*;
    use crate::rng::*;
    use crate::types::*;

    fn make_field(attack: i32) -> [FieldChar; 5] {
        core::array::from_fn(|id| FieldChar {
            id: id as u32, name_idx: 0,
            hp: 50, max_hp: 50, attack,
            defense: 10, is_down: false,
            rarity: Rarity::SR, ultimate_damage: attack * 3,
            effect_type: EffectType::Damage,
        })
    }

    fn make_enemy(max_hp: i32, attack: i32, phase_count: u8) -> Enemy {
        Enemy {
            id: 99, name_idx: 0, max_hp, attack,
            phases: [
                PhaseThreshold::new(50, 150), PhaseThreshold::new(20, 200),
                PhaseThreshold::new(0, 100), PhaseThreshold::new(0, 100),
            ],
            phase_count,
        }
    }

    /// Property: calculate_damage never returns negative values.
    #[test]
    fn prop_damage_never_negative() {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        for _ in 0..10_000 {
            let attack = rng.next_i32_bounded(500) - 250;
            let defense = rng.next_i32_bounded(200);
            let effect = EffectType::from_discriminant(rng.next_u32_bounded(10) as u8)
                .unwrap_or(EffectType::Damage);
            let c = FieldChar {
                id: 1, name_idx: 0, hp: 100, max_hp: 100,
                attack, defense, is_down: false,
                rarity: Rarity::SR, ultimate_damage: attack * 3,
                effect_type: effect,
            };

            let r = calculate_damage(&c, &AbilityType::Attack);
            assert!(r.damage >= 0, "Negative damage: {}", r.damage);
            assert!(r.heal >= 0, "Negative heal: {}", r.heal);

            let r2 = calculate_damage(&c, &AbilityType::Effect);
            assert!(r2.damage >= 0, "Negative effect damage: {}", r2.damage);
            assert!(r2.heal >= 0, "Negative effect heal: {}", r2.heal);
            assert!(r2.shield >= 0, "Negative effect shield: {}", r2.shield);
            assert!(r2.attack_reduction >= 0, "Negative attack_reduction: {}", r2.attack_reduction);

            let r3 = calculate_damage(&c, &AbilityType::Ultimate);
            assert!(r3.damage >= 0, "Negative ultimate damage: {}", r3.damage);
        }
    }

    /// Property: apply_result_to_char preserves HP invariant (0 <= hp <= max_hp).
    #[test]
    fn prop_apply_result_hp_invariant() {
        let mut rng = Xoshiro256pp::seed_from_u64(123);
        for _ in 0..10_000 {
            let hp = rng.next_i32_bounded(500);
            let max_hp = (rng.next_i32_bounded(500) + 1).max(hp.max(1));
            let dmg = rng.next_i32_bounded(1000);
            let heal = rng.next_i32_bounded(1000);

            let c = FieldChar {
                id: 1, name_idx: 0, hp, max_hp,
                attack: 10, defense: 5, is_down: false,
                rarity: Rarity::SR, ultimate_damage: 30,
                effect_type: EffectType::Damage,
            };
            let r = BattleResult { damage: dmg, heal, shield: 0, attack_reduction: 0 };
            let out = apply_result_to_char(&c, &r);
            assert!(
                out.hp >= 0 && out.hp <= out.max_hp,
                "HP invariant violated: hp={}, max_hp={}", out.hp, out.max_hp
            );
        }
    }

    /// Property: FSM transitions are deterministic.
    #[test]
    fn prop_fsm_deterministic() {
        let mut rng = Xoshiro256pp::seed_from_u64(456);
        let phases = [
            BattlePhase::PlayerTurn, BattlePhase::Resolving,
            BattlePhase::EnemyTurn, BattlePhase::Victory, BattlePhase::Defeat,
        ];
        for _ in 0..5000 {
            let phase = phases[rng.next_u32_bounded(5) as usize];
            let event = unsafe { core::mem::transmute::<u8, BattleEvent>(rng.next_u32_bounded(8) as u8) };
            let r1 = transition(phase, event);
            let r2 = transition(phase, event);
            assert_eq!(r1, r2, "Non-deterministic FSM transition");
        }
    }

    /// Property: calculate_enemy_damage never returns negative.
    #[test]
    fn prop_enemy_damage_never_negative() {
        let mut rng = Xoshiro256pp::seed_from_u64(789);
        for _ in 0..10_000 {
            let enemy_attack = rng.next_i32_bounded(500);
            let multiplier = rng.next_u32_bounded(300) as u16;
            let reduction = rng.next_i32_bounded(20);
            let shield = rng.next_i32_bounded(200);
            let dmg = calculate_enemy_damage(enemy_attack, multiplier, reduction, shield);
            assert!(dmg >= 0, "Negative enemy damage: {}", dmg);
        }
    }

    /// Property: AoE damage never has negative entries.
    #[test]
    fn prop_aoe_damage_never_negative() {
        let mut rng = Xoshiro256pp::seed_from_u64(101112);
        for _ in 0..5000 {
            let base = rng.next_i32_bounded(500);
            let mult = rng.next_u32_bounded(300) as i32;
            let count = rng.next_u32_bounded(8) as usize + 1;
            let mut defs = [0i32; 8];
            for (_i, d) in defs.iter_mut().enumerate().take(count) {
                *d = rng.next_i32_bounded(300);
            }
            let results = calculate_aoe_damage(base, &defs[..count], mult);
            for d in results.damages[..results.len as usize].iter() {
                assert!(*d >= 0, "Negative AoE damage: {}", d);
            }
        }
    }

    /// Property: simulate_battle always terminates within MAX_TURNS.
    #[test]
    fn prop_simulate_terminates() {
        let mut rng = Xoshiro256pp::seed_from_u64(131415);
        for _ in 0..1000 {
            let attack = rng.next_i32_bounded(100) + 1;
            let enemy_hp = rng.next_i32_bounded(1000) + 100;
            let field = make_field(attack);
            let enemy = make_enemy(enemy_hp, 8, 2);
            let result = simulate_battle(&field, &enemy);
            assert!(result.turns <= MAX_TURNS, "Battle did not terminate: {} turns", result.turns);
        }
    }

    /// Property: battle result always has valid victory/defeat semantics.
    #[test]
    fn prop_simulate_result_consistent() {
        let mut rng = Xoshiro256pp::seed_from_u64(161718);
        for _ in 0..1000 {
            let attack = rng.next_i32_bounded(100) + 1;
            let field = make_field(attack);
            let enemy = make_enemy(200, 10, 2);
            let result = simulate_battle(&field, &enemy);
            if result.victory {
                assert_eq!(result.final_enemy_hp, 0);
                assert!(result.survivors > 0);
            }
            if !result.victory {
                assert_eq!(result.survivors, 0);
            }
        }
    }

    /// Property: clamp_hp always produces valid values.
    #[test]
    fn prop_clamp_hp_always_valid() {
        let mut rng = Xoshiro256pp::seed_from_u64(192021);
        for _ in 0..10_000 {
            let hp = rng.next_i32_bounded(2000) - 1000;
            let max_hp = rng.next_i32_bounded(1000) + 1;
            let clamped = clamp_hp(hp, max_hp);
            assert!(clamped >= 0 && clamped <= max_hp,
                "clamp_hp invalid: input=({}, {}) -> {}", hp, max_hp, clamped);
        }
    }

    /// Property: RNG produces no collisions in 1000 samples.
    #[test]
    fn prop_rng_no_collisions_in_1k() {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        let mut vals = [0u64; 1000];
        for v in vals.iter_mut() {
            *v = rng.next_u64();
        }
        for i in 0..vals.len() {
            for j in 0..i {
                assert_ne!(vals[j], vals[i], "RNG collision at index {}", i);
            }
        }
    }
}

#[cfg(kani)]
mod kani_harnesses {
    //! Kani bounded model checker harnesses.
    //! Run with: `cargo kani --tests`

    use crate::damage::*;
    use crate::types::*;

    /// Proof: calculate_damage never returns negative values for any inputs.
    #[kani::proof]
    fn kani_calculate_damage_no_negatives_attack() {
        let attack: i32 = kani::any();
        let c = FieldChar {
            id: 1, name_idx: 0, hp: 100, max_hp: 100,
            attack, defense: 10, is_down: false,
            rarity: crate::types::Rarity::SR, ultimate_damage: attack * 3,
            effect_type: EffectType::Damage,
        };
        let r = calculate_damage(&c, &AbilityType::Attack);
        kani::assert!(r.damage >= 0, "Negative attack damage");
        kani::assert!(r.heal >= 0, "Negative heal");
        kani::assert!(r.shield >= 0, "Negative shield");
    }

    /// Proof: calculate_damage never returns negative values for Effect.
    #[kani::proof]
    fn kani_calculate_damage_no_negatives_effect() {
        let attack: i32 = kani::any();
        let defense: i32 = kani::any();
        let max_hp: i32 = kani::any();
        let effect_byte: u8 = kani::any();
        let effect = EffectType::from_discriminant(effect_byte % 10)
            .unwrap_or(EffectType::Damage);
        let c = FieldChar {
            id: 1, name_idx: 0, hp: 100, max_hp: max_hp.max(1),
            attack, defense, is_down: false,
            rarity: crate::types::Rarity::SR, ultimate_damage: attack * 3,
            effect_type: effect,
        };
        let r = calculate_damage(&c, &AbilityType::Effect);
        kani::assert!(r.damage >= 0, "Negative effect damage");
        kani::assert!(r.heal >= 0, "Negative effect heal");
        kani::assert!(r.shield >= 0, "Negative effect shield");
    }

    /// Proof: HP invariant preserved by apply_result_to_char.
    #[kani::proof]
    fn kani_apply_result_preserves_hp_invariant() {
        let hp: i32 = kani::any();
        let max_hp: i32 = kani::any();
        let damage: i32 = kani::any();
        let heal: i32 = kani::any();
        kani::assume(max_hp > 0 && hp >= 0 && hp <= max_hp);

        let c = FieldChar {
            id: 1, name_idx: 0, hp, max_hp,
            attack: 10, defense: 5, is_down: false,
            rarity: crate::types::Rarity::SR, ultimate_damage: 30,
            effect_type: EffectType::Damage,
        };
        let r = BattleResult { damage, heal, shield: 0, attack_reduction: 0 };
        let out = apply_result_to_char(&c, &r);
        kani::assert!(out.hp >= 0, "HP went negative");
        kani::assert!(out.hp <= out.max_hp, "HP exceeded max");
    }

    /// Proof: calculate_enemy_damage never returns negative.
    #[kani::proof]
    fn kani_enemy_damage_non_negative() {
        let enemy_attack: i32 = kani::any();
        let multiplier: u16 = kani::any();
        let reduction: i32 = kani::any();
        let shield: i32 = kani::any();
        let dmg = calculate_enemy_damage(enemy_attack, multiplier, reduction, shield);
        kani::assert!(dmg >= 0, "Negative enemy damage");
    }

    /// Proof: clamp_hp always produces values in [0, max_hp].
    #[kani::proof]
    fn kani_clamp_hp_invariant() {
        let hp: i32 = kani::any();
        let max_hp: i32 = kani::any();
        kani::assume(max_hp >= 0);
        let clamped = clamp_hp(hp, max_hp);
        kani::assert!(clamped >= 0, "clamped HP went negative");
        kani::assert!(clamped <= max_hp, "clamped HP exceeded max");
    }

    /// Proof: verify_hp_invariant is correct.
    #[kani::proof]
    fn kani_verify_hp_invariant_correct() {
        let hp: i32 = kani::any();
        let max_hp: i32 = kani::any();
        let valid = verify_hp_invariant(hp, max_hp);
        if valid {
            kani::assert!(hp >= 0, "Invalid hp marked as valid");
            kani::assert!(hp <= max_hp, "Invalid hp>max marked as valid");
            kani::assert!(max_hp >= 0, "Invalid max_hp marked as valid");
        }
    }
}
