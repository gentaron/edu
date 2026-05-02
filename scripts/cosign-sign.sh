#!/usr/bin/env bash
# cosign-sign.sh — Cosign keyless signing via GitHub OIDC
# Phase η — Supply chain security for release artifacts
#
# Signs release artifacts with Sigstore/Cosign keyless signing,
# using the GitHub Actions OIDC token as the Fulcio certificate source.
#
# Prerequisites (in CI):
#   - cosign installed (GHCR: ghcr.io/sigstore/cosign/cosign)
#   - GitHub OIDC token available (automatic in Actions with permissions)
#
# Prerequisites (local):
#   - cosign installed
#   - Export COSIGN_PRIVATE_KEY and COSIGN_PASSWORD for key-based signing,
#     or use --yes to accept keyless prompt
#
# Usage:
#   ./scripts/cosign-sign.sh sign <artifact-path> [artifact-path...]
#   ./scripts/cosign-sign.sh verify <artifact-path> [artifact-path...]
#   ./scripts/cosign-sign.sh sign-release <tag>
#   ./scripts/cosign-sign.sh verify-release <tag>

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────
COSIGN_IMAGE="ghcr.io/sigstore/cosign/cosign:v2.4.1"
REPO="gentaron/edu"
# OIDC issuer for GitHub Actions
OIDC_ISSUER="https://token.actions.githubusercontent.com"
FULCIO_URL="https://fulcio.sigstore.dev"
REKOR_URL="https://rekor.sigstore.dev"
TSA_URL="https://timestamp.sigstore.dev"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${GREEN}[cosign]${NC} $*"; }
warn()  { echo -e "${YELLOW}[cosign]${NC} $*"; }
error() { echo -e "${RED}[cosign]${NC} $*"; }
step()  { echo -e "${BLUE}[cosign]${NC} → $*"; }

# ── Cosign helper ──────────────────────────────────────────────
cosign_cmd() {
    if command -v cosign &>/dev/null; then
        cosign "$@"
    elif command -v docker &>/dev/null; then
        docker run --rm \
            -e COSIGN_EXPERIMENTAL=1 \
            -e TUF_ROOT=/tmp/.sigstore-root \
            -v "$(pwd):/workspace" \
            -w /workspace \
            "${COSIGN_IMAGE}" "$@"
    else
        error "Neither cosign CLI nor docker found"
        error "Install cosign: https://docs.sigstore.dev/cosign/installation/"
        exit 1
    fi
}

# ── Sign a single artifact ─────────────────────────────────────
sign_artifact() {
    local artifact="$1"
    if [ ! -f "$artifact" ]; then
        error "Artifact not found: $artifact"
        return 1
    fi

    local digest
    digest=$(sha256sum "$artifact" | awk '{print $1}')

    step "Signing: $artifact (sha256:${digest:0:16}...)"

    # Keyless signing with OIDC (GitHub Actions)
    # The --yes flag skips the interactive prompt
    cosign_cmd sign-blob \
        --yes \
        --output-signature "${artifact}.sig" \
        --output-certificate "${artifact}.pem" \
        "$artifact"

    info "  Signature:  ${artifact}.sig"
    info "  Certificate: ${artifact}.pem"

    # Verify immediately as sanity check
    verify_artifact "$artifact"
}

# ── Verify a single artifact ───────────────────────────────────
verify_artifact() {
    local artifact="$1"
    local sig_file="${artifact}.sig"
    local cert_file="${artifact}.pem"

    if [ ! -f "$sig_file" ]; then
        error "Signature not found: $sig_file"
        return 1
    fi

    step "Verifying: $artifact"

    cosign_cmd verify-blob \
        --certificate "$cert_file" \
        --signature "$sig_file" \
        "$artifact"

    info "  ✓ Signature verified"
}

# ── Sign all release artifacts for a tag ───────────────────────
sign_release() {
    local tag="${1:-}"
    if [ -z "$tag" ]; then
        error "Usage: $0 sign-release <tag>"
        exit 1
    fi

    info "Signing release artifacts for ${REPO}@${tag}"

    # Download release assets
    local download_dir
    download_dir=$(mktemp -d)
    trap "rm -rf $download_dir" EXIT

    step "Downloading release assets..."
    if command -v gh &>/dev/null; then
        gh release download "$tag" \
            --repo "$REPO" \
            --dir "$download_dir" \
            --clobber 2>/dev/null || {
            error "Failed to download release assets for tag '$tag'"
            error "Make sure the release exists and you have access"
            exit 1
        }
    else
        error "gh CLI required for release signing"
        error "Install: https://cli.github.com/"
        exit 1
    fi

    # Sign each binary artifact
    local signed=0
    local failed=0

    for artifact in "$download_dir"/*; do
        [ -f "$artifact" ] || continue
        local ext="${artifact##*.}"
        # Skip signatures and certificates
        case "$ext" in
            sig|pem) continue ;;
        esac

        if sign_artifact "$artifact"; then
            signed=$((signed + 1))
        else
            failed=$((failed + 1))
        fi
    done

    echo ""
    info "Release signing complete"
    info "  Signed:   $signed artifacts"
    if [ "$failed" -gt 0 ]; then
        warn "  Failed:   $failed artifacts"
    fi

    # Upload signatures back to release
    step "Uploading signatures to release..."
    for f in "$download_dir"/*.sig "$download_dir"/*.pem; do
        [ -f "$f" ] || continue
        gh release upload "$tag" "$f" --repo "$REPO" --clobber 2>/dev/null || true
    done
    info "  Signatures uploaded to GitHub release"
}

# ── Verify all release artifacts for a tag ─────────────────────
verify_release() {
    local tag="${1:-}"
    if [ -z "$tag" ]; then
        error "Usage: $0 verify-release <tag>"
        exit 1
    fi

    info "Verifying release artifacts for ${REPO}@${tag}"

    local download_dir
    download_dir=$(mktemp -d)
    trap "rm -rf $download_dir" EXIT

    step "Downloading release assets (including signatures)..."
    if command -v gh &>/dev/null; then
        gh release download "$tag" \
            --repo "$REPO" \
            --dir "$download_dir" \
            --clobber 2>/dev/null || {
            error "Failed to download release for tag '$tag'"
            exit 1
        }
    else
        error "gh CLI required"
        exit 1
    fi

    local verified=0
    local failed=0

    for sig_file in "$download_dir"/*.sig; do
        [ -f "$sig_file" ] || continue
        local artifact="${sig_file%.sig}"

        if [ -f "$artifact" ] && verify_artifact "$artifact"; then
            verified=$((verified + 1))
        else
            error "Failed to verify: $(basename "$artifact")"
            failed=$((failed + 1))
        fi
    done

    echo ""
    if [ "$failed" -eq 0 ] && [ "$verified" -gt 0 ]; then
        info "✓ All $verified release artifacts verified"
    elif [ "$verified" -eq 0 ]; then
        warn "No signed artifacts found in release"
    else
        error "$failed of $(( verified + failed )) artifacts failed verification"
        exit 1
    fi
}

# ── CI mode: sign artifacts from environment ───────────────────
ci_sign() {
    info "CI mode: signing with GitHub OIDC token"

    # In GitHub Actions, the OIDC token is available at this path
    if [ -n "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]; then
        info "OIDC token available ✓"
    else
        warn "OIDC token not available — running outside GitHub Actions"
        warn "Falling back to keyless signing (may require interactive prompt)"
    fi

    local artifacts=("$@")
    if [ "${#artifacts[@]}" -eq 0 ]; then
        error "No artifacts specified"
        exit 1
    fi

    for artifact in "${artifacts[@]}"; do
        sign_artifact "$artifact"
    done
}

# ── Usage ──────────────────────────────────────────────────────
usage() {
    cat <<EOF
cosign-sign.sh — Sigstore keyless signing for EDU release artifacts

Usage:
  $0 sign <path> [path...]       Sign one or more artifacts (keyless)
  $0 verify <path> [path...]     Verify one or more signed artifacts
  $0 sign-release <tag>          Download & sign all release assets
  $0 verify-release <tag>        Download & verify all release assets
  $0 ci-sign <path> [path...]    CI-optimized signing (uses OIDC env)

Environment:
  COSIGN_PRIVATE_KEY    Key file path (for key-based signing)
  COSIGN_PASSWORD       Key passphrase (for key-based signing)
  ACTIONS_ID_TOKEN_*    GitHub OIDC token (automatic in Actions)

Examples:
  # Sign a WASM file
  $0 sign public/wasm/edu_battle_engine_bg.wasm

  # Verify it
  $0 verify public/wasm/edu_battle_engine_bg.wasm

  # Sign an entire release
  $0 sign-release v0.1.0

  # Verify an entire release
  $0 verify-release v0.1.0
EOF
}

# ── Main ───────────────────────────────────────────────────────
main() {
    local command="${1:-}"
    shift || true

    case "$command" in
        sign)
            [ $# -eq 0 ] && { error "No artifacts specified"; usage; exit 1; }
            for artifact in "$@"; do sign_artifact "$artifact"; done
            ;;
        verify)
            [ $# -eq 0 ] && { error "No artifacts specified"; usage; exit 1; }
            for artifact in "$@"; do verify_artifact "$artifact"; done
            ;;
        sign-release)
            sign_release "$@"
            ;;
        verify-release)
            verify_release "$@"
            ;;
        ci-sign)
            ci_sign "$@"
            ;;
        -h|--help|help)
            usage
            ;;
        *)
            error "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

main "$@"
