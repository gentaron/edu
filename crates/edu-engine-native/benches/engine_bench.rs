//! Native benchmarks for edu-engine-core.
//!
//! Run with: `cargo bench -p edu-engine-native`

use criterion::{criterion_group, criterion_main, Criterion, black_box};
use edu_engine_core::types::*;
use edu_engine_core::damage::*;
use edu_engine_core::fsm::*;
use edu_engine_core::rng::*;

fn sample_char(id: u32, attack: i32) -> FieldChar {
    FieldChar {
        id, name_idx: 0, hp: 50, max_hp: 50,
        attack, defense: 10, is_down: false,
        rarity: Rarity::SR, ultimate_damage: attack * 3,
        effect_type: EffectType::Damage,
    }
}

fn sample_enemy() -> Enemy {
    Enemy {
        id: 1, name_idx: 0, max_hp: 100, attack: 8,
        phases: [
            PhaseThreshold::new(50, 150), PhaseThreshold::new(20, 200),
            PhaseThreshold::new(0, 100), PhaseThreshold::new(0, 100),
        ],
        phase_count: 2,
    }
}

fn bench_calculate_damage(c: &mut Criterion) {
    let char = sample_char(1, 30);
    c.bench_function("calculate_damage/attack", |b| {
        b.iter(|| calculate_damage(black_box(&char), black_box(&AbilityType::Attack)))
    });
    let mut char_effect = char.clone();
    char_effect.effect_type = EffectType::HealDamageShield;
    c.bench_function("calculate_damage/effect_composite", |b| {
        b.iter(|| calculate_damage(black_box(&char_effect), black_box(&AbilityType::Effect)))
    });
}

fn bench_enemy_damage(c: &mut Criterion) {
    c.bench_function("calculate_enemy_damage", |b| {
        b.iter(|| calculate_enemy_damage(
            black_box(10), black_box(150), black_box(3), black_box(5)
        ))
    });
}

fn bench_aoe_damage(c: &mut Criterion) {
    let defenses: Vec<i32> = (0..8).map(|i| 5 + i * 3).collect();
    c.bench_function("calculate_aoe_damage/8_targets", |b| {
        b.iter(|| calculate_aoe_damage(black_box(25), black_box(&defenses), black_box(150)))
    });
}

fn bench_simulate_battle(c: &mut Criterion) {
    let field: Vec<FieldChar> = (0..5).map(|i| sample_char(i as u32, 30)).collect();
    let enemy = sample_enemy();
    c.bench_function("simulate_battle/5v1", |b| {
        b.iter(|| simulate_battle(black_box(&field), black_box(&enemy)))
    });
}

fn bench_rng(c: &mut Criterion) {
    c.bench_function("rng/xoshiro256pp_next_u64", |b| {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        b.iter(|| rng.next_u64())
    });
    c.bench_function("rng/xoshiro256pp_next_f64", |b| {
        let mut rng = Xoshiro256pp::seed_from_u64(42);
        b.iter(|| rng.next_f64())
    });
}

fn bench_fsm_transition(c: &mut Criterion) {
    c.bench_function("fsm/transition", |b| {
        b.iter(|| transition(black_box(BattlePhase::PlayerTurn), black_box(BattleEvent::PlayAbility)))
    });
}

criterion_group!(
    benches,
    bench_calculate_damage,
    bench_enemy_damage,
    bench_aoe_damage,
    bench_simulate_battle,
    bench_rng,
    bench_fsm_transition,
);
criterion_main!(benches);
