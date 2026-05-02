/* @ts-self-types="./edu_battle_engine.d.ts" */

/**
 * Ability type a player can choose.
 * @enum {0 | 1 | 2 | 3}
 */
export const AbilityType = Object.freeze({
    Attack: 0, "0": "Attack",
    Defense: 1, "1": "Defense",
    Effect: 2, "2": "Effect",
    Ultimate: 3, "3": "Ultimate",
});

/**
 * Current phase of battle flow.
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const BattlePhase = Object.freeze({
    PlayerTurn: 0, "0": "PlayerTurn",
    Resolving: 1, "1": "Resolving",
    EnemyTurn: 2, "2": "EnemyTurn",
    Victory: 3, "3": "Victory",
    Defeat: 4, "4": "Defeat",
});

/**
 * Result of a single damage/effect calculation.
 */
export class BattleResult {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BattleResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_battleresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get attack_reduction() {
        const ret = wasm.__wbg_get_battleresult_attack_reduction(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get damage() {
        const ret = wasm.__wbg_get_battleresult_damage(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get heal() {
        const ret = wasm.__wbg_get_battleresult_heal(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get log() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_battleresult_log(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get shield() {
        const ret = wasm.__wbg_get_battleresult_shield(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set attack_reduction(arg0) {
        wasm.__wbg_set_battleresult_attack_reduction(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set damage(arg0) {
        wasm.__wbg_set_battleresult_damage(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set heal(arg0) {
        wasm.__wbg_set_battleresult_heal(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set log(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_battleresult_log(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set shield(arg0) {
        wasm.__wbg_set_battleresult_shield(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) BattleResult.prototype[Symbol.dispose] = BattleResult.prototype.free;

/**
 * Full immutable battle state snapshot.
 */
export class BattleState {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BattleStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_battlestate_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get enemy_attack_reduction() {
        const ret = wasm.__wbg_get_battlestate_enemy_attack_reduction(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get enemy_hp() {
        const ret = wasm.__wbg_get_battlestate_enemy_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get enemy_max_hp() {
        const ret = wasm.__wbg_get_battlestate_enemy_max_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get enemy_phase() {
        const ret = wasm.__wbg_get_battlestate_enemy_phase(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {FieldChar[]}
     */
    get field() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_battlestate_field(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string[]}
     */
    get log() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_battlestate_log(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {BattlePhase}
     */
    get phase() {
        const ret = wasm.__wbg_get_battlestate_phase(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get poison_active() {
        const ret = wasm.__wbg_get_battlestate_poison_active(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get shield_buffer() {
        const ret = wasm.__wbg_get_battlestate_shield_buffer(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get turn() {
        const ret = wasm.__wbg_get_battlestate_turn(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set enemy_attack_reduction(arg0) {
        wasm.__wbg_set_battlestate_enemy_attack_reduction(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set enemy_hp(arg0) {
        wasm.__wbg_set_battlestate_enemy_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set enemy_max_hp(arg0) {
        wasm.__wbg_set_battlestate_enemy_max_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set enemy_phase(arg0) {
        wasm.__wbg_set_battlestate_enemy_phase(this.__wbg_ptr, arg0);
    }
    /**
     * @param {FieldChar[]} arg0
     */
    set field(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_battlestate_field(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string[]} arg0
     */
    set log(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_battlestate_log(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {BattlePhase} arg0
     */
    set phase(arg0) {
        wasm.__wbg_set_battlestate_phase(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set poison_active(arg0) {
        wasm.__wbg_set_battlestate_poison_active(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set shield_buffer(arg0) {
        wasm.__wbg_set_battlestate_shield_buffer(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set turn(arg0) {
        wasm.__wbg_set_battlestate_turn(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) BattleState.prototype[Symbol.dispose] = BattleState.prototype.free;

/**
 * Enemy definition including phase thresholds.
 */
export class Enemy {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EnemyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_enemy_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get attack() {
        const ret = wasm.__wbg_get_enemy_attack(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_enemy_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get max_hp() {
        const ret = wasm.__wbg_get_enemy_max_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_enemy_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {PhaseThreshold[]}
     */
    get phases() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_enemy_phases(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} arg0
     */
    set attack(arg0) {
        wasm.__wbg_set_enemy_attack(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_enemy_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set max_hp(arg0) {
        wasm.__wbg_set_enemy_max_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_enemy_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {PhaseThreshold[]} arg0
     */
    set phases(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_enemy_phases(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) Enemy.prototype[Symbol.dispose] = Enemy.prototype.free;

/**
 * Result of enemy turn execution.
 */
export class EnemyTurnResult {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EnemyTurnResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_enemyturnresult_free(ptr, 0);
    }
    /**
     * @returns {string[]}
     */
    get logs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_enemyturnresult_logs(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    get new_enemy_hp() {
        const ret = wasm.__wbg_get_enemyturnresult_new_enemy_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {FieldChar[]}
     */
    get updated_field() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_enemyturnresult_updated_field(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string[]} arg0
     */
    set logs(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_enemyturnresult_logs(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set new_enemy_hp(arg0) {
        wasm.__wbg_set_enemyturnresult_new_enemy_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {FieldChar[]} arg0
     */
    set updated_field(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_enemyturnresult_updated_field(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) EnemyTurnResult.prototype[Symbol.dispose] = EnemyTurnResult.prototype.free;

/**
 * Character card on the battle field.
 */
export class FieldChar {
    static __wrap(ptr) {
        const obj = Object.create(FieldChar.prototype);
        obj.__wbg_ptr = ptr;
        FieldCharFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof FieldChar)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FieldCharFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fieldchar_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get attack() {
        const ret = wasm.__wbg_get_fieldchar_attack(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get defense() {
        const ret = wasm.__wbg_get_fieldchar_defense(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get effect() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fieldchar_effect(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get hp() {
        const ret = wasm.__wbg_get_fieldchar_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fieldchar_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get is_down() {
        const ret = wasm.__wbg_get_fieldchar_is_down(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get max_hp() {
        const ret = wasm.__wbg_get_fieldchar_max_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fieldchar_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get rarity() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fieldchar_rarity(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get ultimate_damage() {
        const ret = wasm.__wbg_get_fieldchar_ultimate_damage(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get ultimate_name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fieldchar_ultimate_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} arg0
     */
    set attack(arg0) {
        wasm.__wbg_set_fieldchar_attack(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set defense(arg0) {
        wasm.__wbg_set_fieldchar_defense(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set effect(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fieldchar_effect(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set hp(arg0) {
        wasm.__wbg_set_fieldchar_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fieldchar_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} arg0
     */
    set is_down(arg0) {
        wasm.__wbg_set_fieldchar_is_down(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set max_hp(arg0) {
        wasm.__wbg_set_fieldchar_max_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fieldchar_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} arg0
     */
    set rarity(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fieldchar_rarity(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} arg0
     */
    set ultimate_damage(arg0) {
        wasm.__wbg_set_fieldchar_ultimate_damage(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set ultimate_name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fieldchar_ultimate_name(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) FieldChar.prototype[Symbol.dispose] = FieldChar.prototype.free;

/**
 * Enemy phase transition threshold.
 */
export class PhaseThreshold {
    static __wrap(ptr) {
        const obj = Object.create(PhaseThreshold.prototype);
        obj.__wbg_ptr = ptr;
        PhaseThresholdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof PhaseThreshold)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PhaseThresholdFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_phasethreshold_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get attack_multiplier() {
        const ret = wasm.__wbg_get_phasethreshold_attack_multiplier(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get hp_percent() {
        const ret = wasm.__wbg_get_phasethreshold_hp_percent(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_phasethreshold_message(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} arg0
     */
    set attack_multiplier(arg0) {
        wasm.__wbg_set_phasethreshold_attack_multiplier(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set hp_percent(arg0) {
        wasm.__wbg_set_phasethreshold_hp_percent(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set message(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_phasethreshold_message(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) PhaseThreshold.prototype[Symbol.dispose] = PhaseThreshold.prototype.free;

/**
 * Result of a simulated battle.
 */
export class SimResult {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SimResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_simresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get final_enemy_hp() {
        const ret = wasm.__wbg_get_simresult_final_enemy_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get survivors() {
        const ret = wasm.__wbg_get_simresult_survivors(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get turns() {
        const ret = wasm.__wbg_get_simresult_turns(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    get victory() {
        const ret = wasm.__wbg_get_simresult_victory(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} arg0
     */
    set final_enemy_hp(arg0) {
        wasm.__wbg_set_simresult_final_enemy_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set survivors(arg0) {
        wasm.__wbg_set_simresult_survivors(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set turns(arg0) {
        wasm.__wbg_set_simresult_turns(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set victory(arg0) {
        wasm.__wbg_set_simresult_victory(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) SimResult.prototype[Symbol.dispose] = SimResult.prototype.free;

/**
 * WASM bridge: calculate damage for a player ability.
 * @param {string} id
 * @param {string} name
 * @param {number} hp
 * @param {number} max_hp
 * @param {number} attack
 * @param {number} defense
 * @param {boolean} is_down
 * @param {string} rarity
 * @param {string} ultimate_name
 * @param {number} ultimate_damage
 * @param {string} effect
 * @param {number} ability_idx
 * @returns {any}
 */
export function calculate_damage_wasm(id, name, hp, max_hp, attack, defense, is_down, rarity, ultimate_name, ultimate_damage, effect, ability_idx) {
    const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(name, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(rarity, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(ultimate_name, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(effect, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len4 = WASM_VECTOR_LEN;
    const ret = wasm.calculate_damage_wasm(ptr0, len0, ptr1, len1, hp, max_hp, attack, defense, is_down, ptr2, len2, ptr3, len3, ultimate_damage, ptr4, len4, ability_idx);
    return takeObject(ret);
}

/**
 * WASM bridge: check enemy phase transition.
 * @param {number} enemy_hp
 * @param {number} enemy_max_hp
 * @param {number} enemy_phase
 * @param {string} enemy_json
 * @returns {any}
 */
export function check_phase_transition_wasm(enemy_hp, enemy_max_hp, enemy_phase, enemy_json) {
    const ptr0 = passStringToWasm0(enemy_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.check_phase_transition_wasm(enemy_hp, enemy_max_hp, enemy_phase, ptr0, len0);
    return takeObject(ret);
}

/**
 * WASM bridge: execute enemy turn.
 * @param {number} turn
 * @param {number} enemy_hp
 * @param {number} enemy_max_hp
 * @param {number} enemy_phase
 * @param {number} shield_buffer
 * @param {string} field_json
 * @param {string} enemy_json
 * @param {boolean} poison_active
 * @param {number} enemy_attack_reduction
 * @returns {any}
 */
export function execute_enemy_turn_wasm(turn, enemy_hp, enemy_max_hp, enemy_phase, shield_buffer, field_json, enemy_json, poison_active, enemy_attack_reduction) {
    const ptr0 = passStringToWasm0(field_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(enemy_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.execute_enemy_turn_wasm(turn, enemy_hp, enemy_max_hp, enemy_phase, shield_buffer, ptr0, len0, ptr1, len1, poison_active, enemy_attack_reduction);
    return takeObject(ret);
}

/**
 * WASM bridge: simulate entire battle for benchmarking.
 * @param {string} field_json
 * @param {string} enemy_json
 * @returns {any}
 */
export function simulate_battle_wasm(field_json, enemy_json) {
    const ptr0 = passStringToWasm0(field_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(enemy_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.simulate_battle_wasm(ptr0, len0, ptr1, len1);
    return takeObject(ret);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_3639a60ed15f87e7: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg___wbindgen_string_get_965592073e5d848c: function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_9c75d47bf9e7731e: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_error_48655ee7e4756f8b: function(arg0) {
            console.error(getObject(arg0));
        },
        __wbg_fieldchar_new: function(arg0) {
            const ret = FieldChar.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_fieldchar_unwrap: function(arg0) {
            const ret = FieldChar.__unwrap(getObject(arg0));
            return ret;
        },
        __wbg_new_2fad8ca02fd00684: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_new_3baa8d9866155c79: function() {
            const ret = new Array();
            return addHeapObject(ret);
        },
        __wbg_phasethreshold_new: function(arg0) {
            const ret = PhaseThreshold.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_phasethreshold_unwrap: function(arg0) {
            const ret = PhaseThreshold.__unwrap(getObject(arg0));
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        },
        __wbg_set_f614f6a0608d1d1d: function(arg0, arg1, arg2) {
            getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000003: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./edu_battle_engine_bg.js": import0,
    };
}

const BattleResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_battleresult_free(ptr, 1));
const BattleStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_battlestate_free(ptr, 1));
const EnemyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_enemy_free(ptr, 1));
const EnemyTurnResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_enemyturnresult_free(ptr, 1));
const FieldCharFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fieldchar_free(ptr, 1));
const PhaseThresholdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_phasethreshold_free(ptr, 1));
const SimResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_simresult_free(ptr, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 1028) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

let heap = new Array(1024).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('edu_battle_engine_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
