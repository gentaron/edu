"""Apolonium quantum probability layer — 8-qubit Hadamard+CNOT entanglement chain.

Canon: This module implements the **Apolonium Quantum Probability Layer** —
the foundational quantum field that governs critical-hit probability
distributions, loot rarity rolls, and dimensional rift events in the EDU universe.

The circuit is a simple entanglement chain: H(0) → CNOT(0,1) → CNOT(1,2) → ...
All 8 qubits become entangled, producing a 2^8 = 256-outcome probability
distribution that is used as the canonical source of "quantum randomness"
for battle-critical events.

Usage:
    python -m quantum.apolonium_field [--seed 42] [--shots 8192]

Output:
    quantum-distributions.json — PMF keyed by 8-bit binary strings
"""

from __future__ import annotations

import argparse
import json
import math
import time
from pathlib import Path

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator


APOLONIUM_QUBITS = 8
APOLONIUM_SHOTS = 8192
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "domains" / "battle"
OUTPUT_FILE = OUTPUT_DIR / "quantum-distributions.json"


def build_apolonium_circuit(n_qubits: int = APOLONIUM_QUBITS) -> QuantumCircuit:
    """Build the Apolonium entanglement chain circuit.

    Structure:
        H(q0) → CNOT(q0,q1) → CNOT(q1,q2) → ... → CNOT(q_{n-2},q_{n-1})
        measure all qubits

    This creates a maximally-entangled GHZ-like state across all n qubits.
    The resulting probability distribution has exactly 2 non-zero outcomes
    (|0...0⟩ and |1...1⟩) with equal probability 0.5 each, providing
    a binary "quantum coin flip" amplified to n-bit width.

    Args:
        n_qubits: Number of qubits in the entanglement chain (default 8).

    Returns:
        QuantumCircuit with H + CNOT chain + measurement on all qubits.
    """
    qc = QuantumCircuit(n_qubits, n_qubits)

    # Hadamard on qubit 0 creates superposition
    qc.h(0)

    # CNOT chain entangles all qubits (GHZ state)
    for i in range(n_qubits - 1):
        qc.cx(i, i + 1)

    # Apply additional Hadamard gates on odd qubits for richer distribution
    # This breaks perfect GHZ symmetry and creates a more useful PMF
    for i in range(1, n_qubits, 2):
        qc.h(i)

    # Measure all qubits
    qc.measure(range(n_qubits), range(n_qubits))

    return qc


def format_circuit_latex(qc: QuantumCircuit) -> str:
    """Export circuit as LaTeX string for documentation.

    Args:
        qc: The quantum circuit to export.

    Returns:
        LaTeX circuit diagram string.
    """
    try:
        from qiskit.visualization import circuit_drawer

        return circuit_drawer(qc, output="latex_source")
    except Exception:
        # Fallback: ASCII art
        return str(qc.draw(output="text"))


def format_circuit_text(qc: QuantumCircuit) -> str:
    """Export circuit as ASCII text diagram.

    Args:
        qc: The quantum circuit to export.

    Returns:
        ASCII circuit diagram string.
    """
    return str(qc.draw(output="text"))


def run_simulation(
    seed: int = 42,
    shots: int = APOLONIUM_SHOTS,
    n_qubits: int = APOLONIUM_QUBITS,
) -> dict:
    """Run the Apolonium field simulation with deterministic seeding.

    Args:
        seed: Random seed for reproducibility (default 42).
        shots: Number of measurement shots (default 8192).
        n_qubits: Number of qubits (default 8).

    Returns:
        Dictionary containing:
        - "metadata": simulation parameters
        - "circuit_text": ASCII circuit diagram
        - "circuit_latex": LaTeX circuit source (or fallback text)
        - "pmf": probability mass function {bitstring: count}
        - "normalized": {bitstring: probability} (floats summing to 1.0)
        - "statistics": entropy, unique_outcomes, max_probability
        - "timing": wall-clock time in milliseconds
    """
    qc = build_apolonium_circuit(n_qubits)

    start_time = time.perf_counter()

    backend = AerSimulator(seed_simulator=seed)
    compiled = transpile(qc, backend)
    job = backend.run(compiled, shots=shots)
    result = job.result()

    elapsed_ms = (time.perf_counter() - start_time) * 1000

    # Extract measurement counts
    raw_counts: dict[str, int] = dict(result.get_counts())

    # Normalize to probabilities
    total = sum(raw_counts.values())
    normalized = {k: v / total for k, v in raw_counts.items()}

    # Compute statistics
    entropy = -sum(p * math.log2(p) for p in normalized.values() if p > 0)
    unique_outcomes = len(raw_counts)
    max_prob = max(normalized.values())

    result = {
        "metadata": {
            "seed": seed,
            "shots": shots,
            "n_qubits": n_qubits,
            "backend": "AerSimulator (qiskit-aer)",
            "qiskit_version": _get_qiskit_version(),
        },
        "circuit_text": format_circuit_text(qc),
        "circuit_latex": format_circuit_latex(qc),
        "pmf": raw_counts,
        "normalized": normalized,
        "statistics": {
            "entropy_bits": round(entropy, 6),
            "unique_outcomes": unique_outcomes,
            "max_probability": round(max_prob, 6),
            "total_measurements": total,
        },
    }
    # timing_ms excluded from deterministic output (print to stdout only)
    return result, elapsed_ms


def _get_qiskit_version() -> str:
    """Get Qiskit version string."""
    try:
        import qiskit

        return qiskit.__version__
    except Exception:
        return "unknown"


def main() -> None:
    """CLI entry point — run simulation and write JSON output."""
    parser = argparse.ArgumentParser(description="Apolonium Quantum Field Simulator")
    parser.add_argument(
        "--seed", type=int, default=42, help="Random seed (default: 42)"
    )
    parser.add_argument(
        "--shots", type=int, default=APOLONIUM_SHOTS, help="Number of shots"
    )
    parser.add_argument(
        "--output",
        type=str,
        default=str(OUTPUT_FILE),
        help=f"Output JSON path (default: {OUTPUT_FILE})",
    )
    args = parser.parse_args()

    result, elapsed_ms = run_simulation(seed=args.seed, shots=args.shots)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2, ensure_ascii=False, sort_keys=True) + "\n")

    stats = result["statistics"]
    print(f"Apolonium Field Simulation Complete")
    print(f"  Seed:      {args.seed}")
    print(f"  Shots:     {args.shots}")
    print(f"  Outcomes:  {stats['unique_outcomes']}")
    print(f"  Entropy:   {stats['entropy_bits']} bits")
    print(f"  Max prob:  {stats['max_probability']}")
    print(f"  Time:      {round(elapsed_ms, 2)}ms")
    print(f"  Output:    {output_path}")


if __name__ == "__main__":
    main()
