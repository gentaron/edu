use criterion::{black_box, criterion_group, criterion_main, Criterion, BenchmarkId};
use edu_battle_engine::combat;
use edu_battle_engine::types::*;

fn sample_char(id: &str, name: &str, attack: i32, hp: i32) -> FieldChar {
    FieldChar {
        id: id.to_string(),
        name: name.to_string(),
        hp,
        max_hp: hp,
        attack,
        defense: 10,
        is_down: false,
        rarity: "SR".to_string(),
        ultimate_name: format!("{}必殺技", name),
        ultimate_damage: attack * 3,
        effect: String::new(),
    }
}

fn sample_enemy(id: &str, name: &str, max_hp: i32, attack: i32) -> Enemy {
    Enemy {
        id: id.to_string(),
        name: name.to_string(),
        max_hp,
        attack,
        phases: vec![
            PhaseThreshold {
                hp_percent: 50,
                message: "Phase 2 activated!".to_string(),
                attack_multiplier: 1.5,
            },
            PhaseThreshold {
                hp_percent: 20,
                message: "Final phase!".to_string(),
                attack_multiplier: 2.0,
            },
        ],
    }
}

fn full_battle_state(field: Vec<FieldChar>, enemy: &Enemy) -> BattleState {
    BattleState {
        turn: 1,
        enemy_hp: enemy.max_hp,
        enemy_max_hp: enemy.max_hp,
        enemy_phase: 0,
        shield_buffer: 0,
        field,
        phase: BattlePhase::PlayerTurn,
        log: Vec::new(),
        poison_active: false,
        enemy_attack_reduction: 0,
    }
}

fn bench_calculate_damage(c: &mut Criterion) {
    let char = sample_char("c1", "Alice", 25, 50);

    c.bench_function("calculate_damage::attack", |b| {
        b.iter(|| black_box(combat::calculate_damage(black_box(&char), black_box(&AbilityType::Attack))))
    });

    c.bench_function("calculate_damage::defense", |b| {
        b.iter(|| black_box(combat::calculate_damage(black_box(&char), black_box(&AbilityType::Defense))))
    });

    c.bench_function("calculate_damage::effect_with_heal", |b| {
        let mut char_with_effect = sample_char("c2", "Bob", 20, 60);
        char_with_effect.effect = "回復シールド攻撃低下".to_string();
        b.iter(|| black_box(combat::calculate_damage(black_box(&char_with_effect), black_box(&AbilityType::Effect))))
    });

    c.bench_function("calculate_damage::ultimate", |b| {
        b.iter(|| black_box(combat::calculate_damage(black_box(&char), black_box(&AbilityType::Ultimate))))
    });
}

fn bench_enemy_turn(c: &mut Criterion) {
    let field = vec![
        sample_char("c1", "Alice", 15, 50),
        sample_char("c2", "Bob", 18, 45),
        sample_char("c3", "Carol", 22, 55),
        sample_char("c4", "Dave", 12, 40),
        sample_char("c5", "Eve", 20, 48),
    ];
    let enemy = sample_enemy("void-king", "Void King", 200, 12);
    let state = full_battle_state(field, enemy);

    c.bench_function("execute_enemy_turn::5_chars", |b| {
        b.iter(|| black_box(combat::execute_enemy_turn(black_box(&state), black_box(&enemy))))
    });

    // With shield
    let mut state_shielded = state.clone();
    state_shielded.shield_buffer = 5;

    c.bench_function("execute_enemy_turn::with_shield", |b| {
        b.iter(|| black_box(combat::execute_enemy_turn(black_box(&state_shielded), black_box(&enemy))))
    });
}

fn bench_simulate_battle(c: &mut Criterion) {
    let mut group = c.benchmark_group("simulate_battle");

    let enemy = sample_enemy("boss", "Boss Enemy", 100, 10);

    for team_size in [1usize, 3, 5].iter() {
        let field: Vec<FieldChar> = (0..*team_size)
            .map(|i| sample_char(&format!("c{}", i), &format!("Char{}", i), 20, 50))
            .collect();

        group.bench_with_input(BenchmarkId::new("team_size", team_size), &field, |b, field| {
            b.iter(|| black_box(combat::simulate_battle(black_box(field.clone()), black_box(&enemy))))
        });
    }

    // Boss battle (high HP)
    let boss = sample_enemy("final-boss", "Final Boss", 500, 15);
    let team = vec![
        sample_char("c1", "Alice", 25, 60),
        sample_char("c2", "Bob", 22, 55),
        sample_char("c3", "Carol", 28, 50),
        sample_char("c4", "Dave", 20, 45),
        sample_char("c5", "Eve", 24, 52),
    ];

    group.bench_function("boss_500hp_vs_5chars", |b| {
        b.iter(|| black_box(combat::simulate_battle(black_box(team.clone()), black_box(&boss))))
    });

    group.finish();
}

fn bench_phase_transition(c: &mut Criterion) {
    let enemy = sample_enemy("multi-phase", "Multi Phase", 100, 8);

    c.bench_function("check_phase_transition::above_threshold", |b| {
        let state = BattleState {
            turn: 1, enemy_hp: 80, enemy_max_hp: 100, enemy_phase: 0,
            shield_buffer: 0, field: vec![], phase: BattlePhase::PlayerTurn,
            log: Vec::new(), poison_active: false, enemy_attack_reduction: 0,
        };
        b.iter(|| black_box(combat::check_phase_transition(black_box(&state), black_box(&enemy))))
    });

    c.bench_function("check_phase_transition::at_threshold", |b| {
        let state = BattleState {
            turn: 5, enemy_hp: 50, enemy_max_hp: 100, enemy_phase: 0,
            shield_buffer: 0, field: vec![], phase: BattlePhase::PlayerTurn,
            log: Vec::new(), poison_active: false, enemy_attack_reduction: 0,
        };
        b.iter(|| black_box(combat::check_phase_transition(black_box(&state), black_box(&enemy))))
    });

    c.bench_function("check_phase_transition::below_threshold", |b| {
        let state = BattleState {
            turn: 10, enemy_hp: 15, enemy_max_hp: 100, enemy_phase: 1,
            shield_buffer: 0, field: vec![], phase: BattlePhase::PlayerTurn,
            log: Vec::new(), poison_active: false, enemy_attack_reduction: 0,
        };
        b.iter(|| black_box(combat::check_phase_transition(black_box(&state), black_box(&enemy))))
    });
}

fn bench_serialize_deserialize(c: &mut Criterion) {
    let field = vec![
        sample_char("c1", "セリア", 25, 60),
        sample_char("c2", "ディアナ", 22, 55),
        sample_char("c3", "フィオナ", 28, 50),
    ];
    let enemy = sample_enemy("boss", "Boss", 200, 12);

    let field_json = serde_json::to_string(&field).unwrap();
    let enemy_json = serde_json::to_string(&enemy).unwrap();

    c.bench_function("serde_json::serialize_field_3chars", |b| {
        b.iter(|| black_box(serde_json::to_string(black_box(&field)).unwrap()))
    });

    c.bench_function("serde_json::deserialize_field_3chars", |b| {
        b.iter(|| black_box(serde_json::from_str::<Vec<FieldChar>>(black_box(&field_json)).unwrap()))
    });

    c.bench_function("serde_json::serialize_enemy", |b| {
        b.iter(|| black_box(serde_json::to_string(black_box(&enemy)).unwrap()))
    });
}

criterion_group!(
    benches,
    bench_calculate_damage,
    bench_enemy_turn,
    bench_simulate_battle,
    bench_phase_transition,
    bench_serialize_deserialize,
);
criterion_main!(benches);
