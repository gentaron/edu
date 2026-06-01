//! # edu-pqc
//!
//! Post-quantum cryptography wrappers for the EDU universe.
//!
//! Provides CRYSTALS-Kyber-768 (ML-KEM) for save-state encryption
//! and CRYSTALS-Dilithium (ML-DSA) for replay signature.
//!
//! ## Canon (Lore-Tech)
//! This crate implements the **Dimensional Cryptographic Seal** — the
//! post-quantum barrier that ensures save-state integrity.
//!
//! ## Safety Note
//! The underlying `pqcrypto-*` crates wrap C implementations via FFI.
//! Kani cannot model-check across FFI boundaries. Mitigated with PBT.

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(unexpected_cfgs)]

pub use pqcrypto_mlkem::mlkem768;
pub use pqcrypto_mldsa::mldsa44;

/// Kyber-768 keypair generation.
pub fn kyber_keypair() -> (
    pqcrypto_mlkem::mlkem768::PublicKey,
    pqcrypto_mlkem::mlkem768::SecretKey,
) {
    mlkem768::keypair()
}

/// Kyber-768 encapsulation.
pub fn kyber_encapsulate(
    pk: &pqcrypto_mlkem::mlkem768::PublicKey,
) -> (
    pqcrypto_mlkem::mlkem768::SharedSecret,
    pqcrypto_mlkem::mlkem768::Ciphertext,
) {
    mlkem768::encapsulate(pk)
}

/// Kyber-768 decapsulation.
pub fn kyber_decapsulate(
    ct: &pqcrypto_mlkem::mlkem768::Ciphertext,
    sk: &pqcrypto_mlkem::mlkem768::SecretKey,
) -> pqcrypto_mlkem::mlkem768::SharedSecret {
    mlkem768::decapsulate(ct, sk)
}

/// Dilithium keypair generation.
pub fn dilithium_keypair() -> (
    pqcrypto_mldsa::mldsa44::PublicKey,
    pqcrypto_mldsa::mldsa44::SecretKey,
) {
    mldsa44::keypair()
}

/// Dilithium detached signature.
pub fn dilithium_sign(
    msg: &[u8],
    sk: &pqcrypto_mldsa::mldsa44::SecretKey,
) -> pqcrypto_mldsa::mldsa44::DetachedSignature {
    mldsa44::detached_sign(msg, sk)
}

/// Dilithium detached verification.
pub fn dilithium_verify(
    sig: &pqcrypto_mldsa::mldsa44::DetachedSignature,
    msg: &[u8],
    pk: &pqcrypto_mldsa::mldsa44::PublicKey,
) -> bool {
    mldsa44::verify_detached_signature(sig, msg, pk).is_ok()
}

#[cfg(test)]
mod tests {
    use super::*;
    use pqcrypto_traits::kem::{Ciphertext as _, PublicKey as KemPk, SecretKey as KemSk, SharedSecret as _};
    use pqcrypto_traits::sign::{PublicKey as _, SecretKey as _};

    #[test]
    fn test_kyber_keypair_valid() {
        let (pk, sk) = kyber_keypair();
        assert_eq!(pk.as_bytes().len(), mlkem768::public_key_bytes());
        assert_eq!(sk.as_bytes().len(), mlkem768::secret_key_bytes());
    }

    #[test]
    fn test_kyber_roundtrip() {
        let (pk, sk) = kyber_keypair();
        let (ss_enc, ct) = kyber_encapsulate(&pk);
        let ss_dec = kyber_decapsulate(&ct, &sk);
        assert_eq!(ss_enc.as_bytes(), ss_dec.as_bytes());
    }

    #[test]
    fn test_kyber_different_keys_different_secrets() {
        let (pk1, _) = kyber_keypair();
        let (pk2, _) = kyber_keypair();
        let (ss1, _) = kyber_encapsulate(&pk1);
        let (ss2, _) = kyber_encapsulate(&pk2);
        assert_ne!(ss1.as_bytes(), ss2.as_bytes());
    }

    #[test]
    fn test_kyber_shared_secret_32_bytes() {
        let (pk, _) = kyber_keypair();
        let (ss, _) = kyber_encapsulate(&pk);
        assert_eq!(ss.as_bytes().len(), mlkem768::shared_secret_bytes());
    }

    #[test]
    fn test_kyber_ciphertext_size() {
        let (pk, _) = kyber_keypair();
        let (_, ct) = kyber_encapsulate(&pk);
        assert_eq!(ct.as_bytes().len(), mlkem768::ciphertext_bytes());
    }

    #[test]
    fn test_dilithium_sign_verify() {
        let (pk, sk) = dilithium_keypair();
        let sig = dilithium_sign(b"EDU battle replay", &sk);
        assert!(dilithium_verify(&sig, b"EDU battle replay", &pk));
    }

    #[test]
    fn test_dilithium_wrong_message_fails() {
        let (pk, sk) = dilithium_keypair();
        let sig = dilithium_sign(b"original", &sk);
        assert!(!dilithium_verify(&sig, b"tampered", &pk));
    }

    #[test]
    fn test_dilithium_wrong_key_fails() {
        let (_, sk1) = dilithium_keypair();
        let (pk2, _) = dilithium_keypair();
        let sig = dilithium_sign(b"msg", &sk1);
        assert!(!dilithium_verify(&sig, b"msg", &pk2));
    }

    #[test]
    fn test_dilithium_empty_message() {
        let (pk, sk) = dilithium_keypair();
        let sig = dilithium_sign(b"", &sk);
        assert!(dilithium_verify(&sig, b"", &pk));
    }

    #[test]
    fn test_combined_encrypt_sign_roundtrip() {
        let (kpk, ksk) = kyber_keypair();
        let (dpk, dsk) = dilithium_keypair();
        let (ss_enc, ct) = kyber_encapsulate(&kpk);
        let sig = dilithium_sign(ct.as_bytes(), &dsk);
        assert!(dilithium_verify(&sig, ct.as_bytes(), &dpk));
        let ss_dec = kyber_decapsulate(&ct, &ksk);
        assert_eq!(ss_enc.as_bytes(), ss_dec.as_bytes());
    }

    #[test]
    fn test_property_kyber_roundtrip_50() {
        for i in 0..50 {
            let (pk, sk) = kyber_keypair();
            let (ss_enc, ct) = kyber_encapsulate(&pk);
            let ss_dec = kyber_decapsulate(&ct, &sk);
            assert_eq!(ss_enc.as_bytes(), ss_dec.as_bytes(), "failed at {}", i);
        }
    }

    #[test]
    fn test_property_dilithium_roundtrip_50() {
        for i in 0..50 {
            let (pk, sk) = dilithium_keypair();
            let msg = [b'm', b's', b'g', b'-', (b'0' + (i % 10) as u8)];
            let sig = dilithium_sign(&msg, &sk);
            assert!(dilithium_verify(&sig, &msg, &pk), "failed at {}", i);
            assert!(!dilithium_verify(&sig, b"wrong", &pk));
        }
    }

    #[test]
    fn test_property_full_pipeline_30() {
        for i in 0..30 {
            let (kpk, ksk) = kyber_keypair();
            let (dpk, dsk) = dilithium_keypair();
            let (ss_enc, ct) = kyber_encapsulate(&kpk);
            let sig = dilithium_sign(ct.as_bytes(), &dsk);
            assert!(dilithium_verify(&sig, ct.as_bytes(), &dpk), "sig failed at {}", i);
            let ss_dec = kyber_decapsulate(&ct, &ksk);
            assert_eq!(ss_enc.as_bytes(), ss_dec.as_bytes(), "kem failed at {}", i);
        }
    }

    #[test]
    fn test_property_kyber_secret_size_constant() {
        for _ in 0..10 {
            let (pk, _) = kyber_keypair();
            let (ss, _) = kyber_encapsulate(&pk);
            assert_eq!(ss.as_bytes().len(), 32);
        }
    }

    #[test]
    fn test_property_dilithium_pk_size_constant() {
        for _ in 0..10 {
            let (pk, _) = dilithium_keypair();
            assert_eq!(pk.as_bytes().len(), mldsa44::public_key_bytes());
        }
    }
}
