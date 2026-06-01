//! edu-engine-embedded: RISC-V bare-metal demo.

#![no_std]
#![no_main]

extern crate edu_engine_core;

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

/// Prevent dead code elimination via volatile.
#[inline(never)]
fn escape<T: Copy>(val: T) -> T {
    unsafe { core::ptr::write_volatile(core::ptr::null_mut() as *mut T, val) };
    val
}

#[link_section = ".text.entry"]
#[no_mangle]
pub extern "C" fn _start() -> ! {
    let c = edu_engine_core::types::FieldChar {
        id: 1, name_idx: 0, hp: 50, max_hp: 50, attack: 30, defense: 10,
        is_down: false, rarity: edu_engine_core::types::Rarity::SR,
        ultimate_damage: 90, effect_type: edu_engine_core::types::EffectType::Damage,
    };
    let d = edu_engine_core::damage::calculate_damage(&c, &edu_engine_core::types::AbilityType::Attack);
    escape(d.damage);
    escape(edu_engine_core::damage::clamp_hp(-5, 100));
    escape(edu_engine_core::fsm::transition(
        edu_engine_core::types::BattlePhase::PlayerTurn,
        edu_engine_core::fsm::BattleEvent::PlayAbility,
    ));
    let mut rng = edu_engine_core::rng::Xoshiro256pp::seed_from_u64(42);
    escape(rng.next_u64());
    loop {}
}
