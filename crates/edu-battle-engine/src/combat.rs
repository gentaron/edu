use crate::types::*;

/// Pure function: calculate damage/effect for a player ability.
/// No side effects. Fully deterministic and testable.
pub fn calculate_damage(attacker: &FieldChar, ability: &AbilityType) -> BattleResult {
    match ability {
        AbilityType::Attack => BattleResult {
            damage: attacker.attack,
            heal: 0,
            shield: 0,
            attack_reduction: 0,
            log: format!(
                "\u{2694}\u{FE0F} {}の攻撃！{}ダメージ！",
                attacker.name, attacker.attack
            ),
        },
        AbilityType::Defense => BattleResult {
            damage: 0,
            heal: 0,
            shield: attacker.defense,
            attack_reduction: 0,
            log: format!(
                "\u{1F6E1}\u{FE0F} {}の防御！シールド+{}",
                attacker.name, attacker.defense
            ),
        },
        AbilityType::Effect => {
            let heal = if attacker.effect.contains("回復") {
                ((attacker.max_hp as f64) * 0.3) as i32
            } else {
                0
            };
            let shield = if attacker.effect.contains("シールド") {
                attacker.defense / 2
            } else {
                0
            };
            let attack_reduction = if attacker.effect.contains("攻撃低下") {
                3
            } else {
                0
            };
            BattleResult {
                damage: 0,
                heal,
                shield,
                attack_reduction,
                log: format!("\u{2728} {}の効果発動！", attacker.name),
            }
        },
        AbilityType::Ultimate => BattleResult {
            damage: attacker.ultimate_damage,
            heal: 0,
            shield: 0,
            attack_reduction: 0,
            log: format!(
                "\u{1F4A5} {}！！{}ダメージ！！",
                attacker.ultimate_name, attacker.ultimate_damage
            ),
        },
    }
}

/// Execute enemy turn: deterministic target selection using turn-based index.
/// Returns updated field characters and log messages.
pub fn execute_enemy_turn(
    state: &BattleState,
    enemy: &Enemy,
) -> EnemyTurnResult {
    let mut logs: Vec<String> = Vec::new();
    let mut field = state.field.clone();

    // Determine current phase multiplier
    let phase_idx = state.enemy_phase.min((enemy.phases.len() - 1) as u32) as usize;
    let multiplier = enemy
        .phases
        .get(phase_idx)
        .map(|p| p.attack_multiplier)
        .unwrap_or(1.0);

    // Apply attack reduction
    let effective_reduction = state.enemy_attack_reduction as f64;
    let base_damage = (enemy.attack as f64 * multiplier * (1.0 - effective_reduction / 10.0)) as i32;
    let effective_damage = (base_damage - state.shield_buffer).max(0);

    // Deterministic target selection: turn-based index into alive list
    let alive: Vec<usize> = field
        .iter()
        .enumerate()
        .filter(|(_, c)| !c.is_down)
        .map(|(i, _)| i)
        .collect();

    if !alive.is_empty() && effective_damage > 0 {
        let target_idx = alive[(state.turn as usize) % alive.len()];
        let target = &mut field[target_idx];
        let new_hp = (target.hp - effective_damage).max(0);
        target.hp = new_hp;
        target.is_down = new_hp <= 0;

        if new_hp <= 0 {
            logs.push(format!(
                "\u{1F4A5} {}の攻撃！{}に{}ダメージ！{}は戦闘不能！",
                enemy.name, target.name, effective_damage, target.name
            ));
        } else {
            logs.push(format!(
                "\u{1F4A5} {}の攻撃！{}に{}ダメージ！",
                enemy.name, target.name, effective_damage
            ));
        }
    }

    // Enemy-specific special abilities
    execute_enemy_specials(state, enemy, &mut field, &mut logs);

    // Poison damage
    if state.poison_active {
        let alive2: Vec<usize> = field
            .iter()
            .enumerate()
            .filter(|(_, c)| !c.is_down)
            .map(|(i, _)| i)
            .collect();
        if !alive2.is_empty() {
            let poison_idx = alive2[(state.turn as usize + 1) % alive2.len()];
            let target = &mut field[poison_idx];
            let new_hp = (target.hp - 1).max(0);
            target.hp = new_hp;
            target.is_down = new_hp <= 0;
            if new_hp <= 0 {
                logs.push(format!(
                    "\u{2620}\u{FE0F} 毒により{}が戦闘不能！",
                    target.name
                ));
            } else {
                logs.push(format!(
                    "\u{2620}\u{FE0F} 毒により{}に1ダメージ！",
                    target.name
                ));
            }
        }
    }

    // Enemy self-heal based on phase
    let hp_pct = if enemy.max_hp > 0 {
        ((state.enemy_hp as f64) / (enemy.max_hp as f64)) * 100.0
    } else {
        0.0
    };
    let mut new_enemy_hp = state.enemy_hp;
    for phase in &enemy.phases {
        if hp_pct <= phase.hp_percent as f64 && phase.attack_multiplier > 1.5 {
            let heal_amt = ((enemy.max_hp as f64) * 0.02) as i32;
            new_enemy_hp = (new_enemy_hp + heal_amt).min(enemy.max_hp);
            logs.push(format!(
                "\u{1F49A} {}が{}HP回復！",
                enemy.name, heal_amt
            ));
        }
    }

    EnemyTurnResult {
        updated_field: field,
        new_enemy_hp,
        logs,
    }
}

/// Enemy-specific special ability execution.
fn execute_enemy_specials(
    state: &BattleState,
    enemy: &Enemy,
    field: &mut [FieldChar],
    logs: &mut Vec<String>,
) {
    let hp_pct = if enemy.max_hp > 0 {
        ((state.enemy_hp as f64) / (enemy.max_hp as f64)) * 100.0
    } else {
        0.0
    };

    match enemy.id.as_str() {
        "frost-guardian" if hp_pct <= 50.0 && state.turn.is_multiple_of(2) => {
            apply_damage_to_random(field, state.turn, 3, "\u{2744}\u{FE0F}", "絶対零度の冷気が", logs);
        }
        "flame-spirit" if hp_pct <= 50.0 => {
            apply_damage_to_random(field, state.turn, 2, "\u{1F525}", "業火が", logs);
        }
        "void-spider" if hp_pct <= 40.0 && state.turn % 2 == 1 => {
            apply_damage_to_random(field, state.turn, 2, "\u{1F578}\u{FE0F}", "捕縛糸が", logs);
        }
        "fallen-angel" if hp_pct <= 50.0 => {
            apply_damage_to_random(field, state.turn, 2, "\u{271D}\u{FE0F}", "裁きの光が", logs);
        }
        "void-reaper" if state.enemy_phase >= 2 => {
            apply_damage_to_random(field, state.turn, 3, "\u{1F32A}\u{FE0F}", "時空の刃が", logs);
        }
        "void-reaper" if hp_pct <= 50.0 => {
            apply_damage_to_random(field, state.turn, 2, "\u{1F32A}\u{FE0F}", "虚無の刃が", logs);
        }
        "void-king" => {
            let targets = state.enemy_phase as usize;
            for i in 0..targets {
                apply_damage_to_random(
                    field, state.turn + i as u32,
                    2 + state.enemy_phase as i32,
                    "\u{1F300}", "虚無の波が", logs,
                );
            }
            if hp_pct <= 45.0 {
                apply_damage_to_random(field, state.turn + 10, 3, "\u{1F300}", "存在の侵食が", logs);
            }
        }
        _ => {}
    }
}

/// Apply damage to a deterministic random alive character.
fn apply_damage_to_random(
    field: &mut [FieldChar],
    seed: u32,
    damage: i32,
    emoji: &str,
    prefix: &str,
    logs: &mut Vec<String>,
) {
    let alive: Vec<usize> = field
        .iter()
        .enumerate()
        .filter(|(_, c)| !c.is_down)
        .map(|(i, _)| i)
        .collect();
    if alive.is_empty() {
        return;
    }
    let idx = alive[(seed as usize) % alive.len()];
    let target = &mut field[idx];
    let new_hp = (target.hp - damage).max(0);
    target.hp = new_hp;
    target.is_down = new_hp <= 0;
    if new_hp <= 0 {
        logs.push(format!(
            "{}{}{}を飲み込んだ！ {}は戦闘不能！",
            emoji, prefix, target.name, target.name
        ));
    } else {
        logs.push(format!(
            "{}{}{}に{}ダメージ！",
            emoji, prefix, target.name, damage
        ));
    }
}

/// Check if enemy should transition to a new phase.
/// Returns Some(message) if phase changed, None otherwise.
pub fn check_phase_transition(state: &BattleState, enemy: &Enemy) -> Option<String> {
    let hp_pct = if enemy.max_hp > 0 {
        ((state.enemy_hp as f64) / (enemy.max_hp as f64)) * 100.0
    } else {
        0.0
    };

    let mut new_phase: u32 = 0;
    for (i, threshold) in enemy.phases.iter().enumerate() {
        if hp_pct <= threshold.hp_percent as f64 {
            new_phase = (i as u32) + 1;
        }
    }

    if new_phase > state.enemy_phase {
        let msg = enemy
            .phases
            .get((new_phase - 1) as usize)
            .map(|p| p.message.clone())
            .unwrap_or_default();
        Some(msg)
    } else {
        None
    }
}

/// Simulate an entire battle to completion and return the result.
/// Useful for benchmarking the engine.
pub fn simulate_battle(
    field: Vec<FieldChar>,
    enemy: &Enemy,
) -> SimResult {
    let mut state = BattleState {
        turn: 1,
        enemy_hp: enemy.max_hp,
        enemy_max_hp: enemy.max_hp,
        enemy_phase: 0,
        shield_buffer: 0,
        field,
        phase: BattlePhase::PlayerTurn,
        log: Vec::new(),
        poison_active: enemy.id == "venom-hydra",
        enemy_attack_reduction: 0,
    };
    let max_turns = 200u32;

    for _ in 0..max_turns {
        // Player turn: each alive character attacks once
        let alive_indices: Vec<usize> = state
            .field
            .iter()
            .enumerate()
            .filter(|(_, c)| !c.is_down)
            .map(|(i, _)| i)
            .collect();

        for &char_idx in &alive_indices {
            if state.enemy_hp <= 0 {
                state.phase = BattlePhase::Victory;
                return SimResult {
                    victory: true,
                    turns: state.turn,
                    final_enemy_hp: 0,
                    survivors: state.field.iter().filter(|c| !c.is_down).count(),
                };
            }

            let character = state.field[char_idx].clone();
            let result = calculate_damage(&character, &AbilityType::Attack);
            state.enemy_hp = (state.enemy_hp - result.damage).max(0);

            if let Some(phase_msg) = check_phase_transition(&state, enemy) {
                state.enemy_phase += 1;
                state.log.push(phase_msg);
            }
        }

        if state.enemy_hp <= 0 {
            state.phase = BattlePhase::Victory;
            return SimResult {
                victory: true,
                turns: state.turn,
                final_enemy_hp: 0,
                survivors: state.field.iter().filter(|c| !c.is_down).count(),
            };
        }

        // Enemy turn
        let enemy_result = execute_enemy_turn(&state, enemy);
        state.field = enemy_result.updated_field;
        state.enemy_hp = enemy_result.new_enemy_hp;
        state.shield_buffer = 0;
        state.enemy_attack_reduction = 0;

        let all_down = state.field.iter().all(|c| c.is_down);
        if all_down {
            state.phase = BattlePhase::Defeat;
            return SimResult {
                victory: false,
                turns: state.turn,
                final_enemy_hp: state.enemy_hp,
                survivors: 0,
            };
        }

        state.turn += 1;
    }

    SimResult {
        victory: false,
        turns: max_turns,
        final_enemy_hp: state.enemy_hp,
        survivors: state.field.iter().filter(|c| !c.is_down).count(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_char(id: &str, name: &str, attack: i32) -> FieldChar {
        FieldChar {
            id: id.to_string(),
            name: name.to_string(),
            hp: 50,
            max_hp: 50,
            attack,
            defense: 10,
            is_down: false,
            rarity: "SR".to_string(),
            ultimate_name: format!("{}必殺", name),
            ultimate_damage: attack * 3,
            effect: String::new(),
        }
    }

    fn sample_enemy() -> Enemy {
        Enemy {
            id: "test-enemy".to_string(),
            name: "Test Enemy".to_string(),
            max_hp: 100,
            attack: 8,
            phases: vec![
                PhaseThreshold {
                    hp_percent: 50,
                    message: "Phase 2!".to_string(),
                    attack_multiplier: 1.5,
                },
                PhaseThreshold {
                    hp_percent: 20,
                    message: "Final Phase!".to_string(),
                    attack_multiplier: 2.0,
                },
            ],
        }
    }

    #[test]
    fn test_calculate_damage_attack() {
        let char = sample_char("c1", "Test", 15);
        let result = calculate_damage(&char, &AbilityType::Attack);
        assert_eq!(result.damage, 15);
        assert_eq!(result.heal, 0);
        assert_eq!(result.shield, 0);
        assert!(result.log.contains("15ダメージ"));
    }

    #[test]
    fn test_calculate_damage_defense() {
        let char = sample_char("c1", "Test", 15);
        let result = calculate_damage(&char, &AbilityType::Defense);
        assert_eq!(result.damage, 0);
        assert_eq!(result.shield, 10);
    }

    #[test]
    fn test_calculate_damage_effect_with_heal() {
        let mut char = sample_char("c1", "Test", 15);
        char.effect = "回復シールド攻撃低下".to_string();
        let result = calculate_damage(&char, &AbilityType::Effect);
        assert_eq!(result.heal, 15); // 50 * 0.3 = 15
        assert_eq!(result.shield, 5); // 10 / 2 = 5
        assert_eq!(result.attack_reduction, 3);
    }

    #[test]
    fn test_calculate_damage_ultimate() {
        let char = sample_char("c1", "Test", 15);
        let result = calculate_damage(&char, &AbilityType::Ultimate);
        assert_eq!(result.damage, 45); // 15 * 3
    }

    #[test]
    fn test_enemy_turn_hits_alive_character() {
        let field = vec![
            sample_char("c1", "Alice", 10),
            sample_char("c2", "Bob", 12),
        ];
        let state = BattleState {
            turn: 1,
            enemy_hp: 100,
            enemy_max_hp: 100,
            enemy_phase: 0,
            shield_buffer: 0,
            field,
            phase: BattlePhase::PlayerTurn,
            log: Vec::new(),
            poison_active: false,
            enemy_attack_reduction: 0,
        };
        let enemy = sample_enemy();
        let result = execute_enemy_turn(&state, &enemy);
        let total_damage: i32 = state.field.iter()
            .zip(result.updated_field.iter())
            .map(|(before, after)| before.hp - after.hp)
            .sum();
        assert!(total_damage >= 8);
    }

    #[test]
    fn test_phase_transition_detected() {
        let state = BattleState {
            turn: 5,
            enemy_hp: 45,
            enemy_max_hp: 100,
            enemy_phase: 0,
            shield_buffer: 0,
            field: vec![],
            phase: BattlePhase::PlayerTurn,
            log: Vec::new(),
            poison_active: false,
            enemy_attack_reduction: 0,
        };
        let enemy = sample_enemy();
        let result = check_phase_transition(&state, &enemy);
        assert!(result.is_some());
        assert_eq!(result.unwrap(), "Phase 2!");
    }

    #[test]
    fn test_simulate_battle_victory() {
        let field = vec![
            sample_char("c1", "Alice", 30),
            sample_char("c2", "Bob", 30),
            sample_char("c3", "Carol", 30),
            sample_char("c4", "Dave", 30),
            sample_char("c5", "Eve", 30),
        ];
        let enemy = sample_enemy();
        let result = simulate_battle(field, &enemy);
        assert!(result.victory);
        assert!(result.turns < 20);
    }

    #[test]
    fn test_simulate_battle_defeat() {
        let field = vec![sample_char("c1", "Weak", 2)];
        let enemy = Enemy {
            id: "strong".to_string(),
            name: "Strong Enemy".to_string(),
            max_hp: 1000,
            attack: 100,
            phases: vec![PhaseThreshold {
                hp_percent: 50,
                message: "Enrage!".to_string(),
                attack_multiplier: 2.0,
            }],
        };
        let result = simulate_battle(field, &enemy);
        assert!(!result.victory);
        assert_eq!(result.survivors, 0);
    }

    #[test]
    fn test_hp_never_goes_negative() {
        let mut char = sample_char("c1", "Test", 100);
        char.hp = 1;
        let field = vec![char];
        let state = BattleState {
            turn: 1,
            enemy_hp: 100,
            enemy_max_hp: 100,
            enemy_phase: 0,
            shield_buffer: 0,
            field,
            phase: BattlePhase::PlayerTurn,
            log: Vec::new(),
            poison_active: false,
            enemy_attack_reduction: 0,
        };
        let enemy = Enemy {
            id: "strong".to_string(),
            name: "Strong".to_string(),
            max_hp: 100,
            attack: 999,
            phases: vec![PhaseThreshold {
                hp_percent: 50,
                message: "Phase 2".to_string(),
                attack_multiplier: 1.0,
            }],
        };
        let result = execute_enemy_turn(&state, &enemy);
        for c in &result.updated_field {
            assert!(c.hp >= 0);
        }
    }
}
