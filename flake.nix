{
  description = "EDU — Research-grade Apolon card engine with Lean 4 proofs, PQC, and WASM verifier";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, flake-compat, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        # Pin Rust via rust-toolchain.toml in crates/ — the overlay is a fallback
        rustToolchain = pkgs.rust-bin.fromRustupToolchainFile ./crates/rust-toolchain.toml;

        # Lean 4 via elan
        elan = pkgs.elan;

        # Python with Qiskit for quantum simulation
        pythonWithQiskit = pkgs.python312.withPackages (ps: with ps; [
          ps.pip
          ps.qiskit
          ps.qiskit-aer
          ps.numpy
          ps.scipy
        ]);

        # wasm-pack for building WASM modules
        wasm-pack = pkgs.wasm-pack;

        # Bun for the Next.js frontend
        bun = pkgs.bun;

        # Build inputs for the project
        buildInputs = with pkgs; [
          rustToolchain
          elan
          pythonWithQiskit
          wasm-pack
          bun
          pkg-config
          openssl
          cmake
          ninja
          nodejs
          git
          jq
          curl
          cacert
          gcc
          glibcLocales
          qemu
          binutils-unwrapped
        ] ++ lib.optionals stdenv.isDarwin [
          darwin.apple_sdk.frameworks.Security
          darwin.apple_sdk.frameworks.CoreServices
          darwin.apple_sdk.frameworks.SystemConfiguration
          libiconv
        ];

        # Development shell
        devShell = pkgs.mkShell {
          name = "edu-dev";

          inherit buildInputs;

          nativeBuildInputs = with pkgs; [
            pkg-config
            cmake
          ];

          shellHook = ''
            echo "╔══════════════════════════════════════════════════════╗"
            echo "║  EDU Development Environment                        ║"
            echo "║  Phase η — Research-grade uplift                    ║"
            echo "╠══════════════════════════════════════════════════════╣"
            echo "║  Rust:     $(rustc --version 2>/dev/null | head -c 40 || echo 'via rust-toolchain.toml')" 
            echo "║  Lean 4:   $(elan --version 2>/dev/null | head -c 30 || echo 'elan installed')"
            echo "║  Bun:      $(bun --version 2>/dev/null || echo 'N/A')"
            echo "║  Python:   $(python3 --version 2>/dev/null || echo 'N/A')"
            echo "║  wasm-pack: $(wasm-pack --version 2>/dev/null || echo 'N/A')"
            echo "╚══════════════════════════════════════════════════════╝"
            echo ""

            # Rust respects rust-toolchain.toml
            export CARGO_HOME="${toString ./.}/.cargo"
            export RUSTUP_HOME="${toString ./.}/.rustup"
            export PATH="$CARGO_HOME/bin:$PATH"

            # Lean / Lake
            export LAKE_HOME="${toString ./.}/.lake"
            export PATH="$HOME/.elan/bin:$PATH"

            # Bun
            export BUN_INSTALL="${toString ./.}/.bun"
            export PATH="$BUN_INSTALL/bin:$PATH"

            # Python venv hint
            export PYTHONPATH="${pythonWithQiskit}/${pythonWithQiskit.sitePackages}:$PYTHONPATH"

            # WASM
            export WASM_PACK_PROFILE=release
          '';
        };

        # Deterministic build: compile all crates + WASM verifier
        eduPackage = pkgs.stdenv.mkDerivation {
          name = "edu-engine";
          version = "0.1.0";
          src = ./.;

          nativeBuildInputs = with pkgs; [
            rustToolchain
            cmake
            pkg-config
          ] ++ lib.optionals stdenv.isDarwin [
            darwin.apple_sdk.frameworks.Security
            darwin.apple_sdk.frameworks.CoreServices
          ];

          buildInputs = with pkgs; [
            openssl
          ];

          buildPhase = ''
            export CARGO_HOME=$(mktemp -d)
            export CARGO_TARGET_DIR=$TMPDIR/target

            echo "[build] Building all workspace crates..."
            cargo build --locked --release --manifest-path crates/Cargo.toml

            echo "[build] Building WASM verifier..."
            wasm-pack build crates/edu-engine-wasm --release --target web --out-dir $out/wasm

            echo "[build] Copying native binaries..."
            mkdir -p $out/bin
            for bin in $TMPDIR/target/release/edu-engine-*; do
              if [ -f "$bin" ]; then
                cp "$bin" $out/bin/
              fi
            done
          '';

          installPhase = ''
            mkdir -p $out
            cp -r $TMPDIR/target/release/*.rlib $out/ 2>/dev/null || true
            cp -r $TMPDIR/target/release/build $out/build 2>/dev/null || true
          '';

          outputHashMode = "recursive";
          outputHashAlgo = "sha256";
          # Placeholder — update after first successful build with `nix build`
          outputHash = pkgs.lib.fakeSha256;
        };

      in
      {
        devShells = {
          default = devShell;
        };

        packages = {
          default = eduPackage;
        };

        # Formatter
        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
