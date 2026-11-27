# EDU Triadic State Model — version 5 (present only)

The Wiki shows only where each contemporary stands **now**. There is no time stepping, burn-in, history, scenario or time slider anywhere. Earlier versions (v1–v4) integrated 180+ days of stochastic dynamics; they are withdrawn.

## What is computed

For the 1,706 E528 contemporaries in the non-numeric edutext registry, the state x = (x_h, x_w, x_a) ∈ (−1, 1)³ is the self-consistent mean-field equilibrium in today's environment:

    −E(x) = Σ_k b_k x_k + Σ_{k<l} J_kl x_k x_l + g·x_h·x_w·x_a + γ Σ_k x_k m_k
    x_k = tanh(∂(−E)/∂x_k)

- health h = (1+x_h)/2, wealth index = (1+x_w)/2, authority/reputation a = (1+x_a)/2
- b_k: today's regional care, pressure and opportunity (canon 197-day planetary and 29-year binary phases at this instant), trait expression, plus one stable individual draw per person seeded only by the registry ID (FNV-1a)
- J (h–w .22, h–a .16, w–a .26): symmetric pairwise coupling
- g = .30: the three-point term. It enters axis k as g × (product of the other two axes), equals the exact gradient of g·x_h·x_w·x_a, is bounded by |g|, and vanishes when either partner axis is neutral
- γ = .20: peers (mean of six social-graph neighbours); regional means feed back into services
- max row sum of J + |g| + γ = 0.98 < 1, so the damped fixed-point iteration is a contraction in the interior and the equilibrium is unique; it is solved to residual < 1e−10 (≈120 iterations, ≈0.2 s for everyone)

Net wealth w = 5·tan(π(wealth index − 1/2)) in annual essential baskets (10M n each, an explicit assumption), giving heavy tails; debt = max(0, −w) + an individual leverage draw scaled by pressure; assets = w + debt.

## Why v5

The v4 dynamics drove many people to exactly 0 or 100 (boundary saturation from unbounded drift and the cubic vertex). In v5 the tanh self-consistency and the bounded three-point term keep about 1% at the extremes (tests require < 3%).

## Guarantees (tests)

Deterministic for a given instant; converged; three-point term equals the finite-difference gradient and is bounded; contraction condition; no boundary pile-up; names, gender identity and sexual orientation never enter.

Values are a synthetic model of the fictional world, not canon figures. Names and aliases come from edutext (identity.json, scripts/sync-edutext-identity.py).
