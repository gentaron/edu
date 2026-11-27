# EDU relational state model v6

The solver computes a fixed point for the supplied instant. The live Wiki caches its first computation per UTC day. The registry supplies identities; the fields below are generated from a fictional model.

## The cubic vertex

Each index of Φ is a person. The symmetric graph starts from the six ID-seeded peer draws per person, removes loops and duplicate edges, and connects consecutive distinct sampled peers. A missing edge and every diagonal entry have value zero. On an edge,

    Φᵢⱼ = wᵢⱼ · (xᵢ + xⱼ)/2
    wᵢⱼ = (.50, .30, .20) for a same-region tie; (.20, .35, .45) otherwise

Here xᵢ = (x_h, x_w, x_a) is the state of person i. Those axes enter the edge projection. The contraction over people is

    V₃ = g Tr(Φ³)/(6D) = (g/D) Σᵢ<ⱼ<ₖ Φᵢⱼ Φⱼₖ Φₖᵢ
    ∂V₃/∂xᵢ = (g/(2D)) Σ_{triangles {i,j,k} containing i} Φⱼₖ (wᵢⱼ Φₖᵢ + wₖᵢ Φᵢⱼ)

D is the largest number of triangles incident on any vertex, floored at 1. The factor 6 counts all rotations and both orientations of an unordered triangle. With x components between −1 and 1, the absolute sum of the three cubic forces on one person is at most |g| = .30. The local scalar shown on the Wiki is g(Φ³)ᵢᵢ/(6D). Summing it across people recovers V₃. A person with no closed triangle has zero local contribution and zero cubic force. The Wiki shows the largest absolute product among that person's triangles, with each of its three signed ties.

## Fixed point and display

Each input to tanh combines the regional and trait fields, the original pairwise within-person terms, the mean peer field and the gradient above. The damped solver measures the undamped residual maxᵢ,ₖ |tanh(fieldsᵢ,ₖ) − xᵢ,ₖ| at the returned state. It exposes iteration count and convergence against 10⁻¹⁰. This is a numerical convergence check, without a general uniqueness result.

Health h and authority a are (1 + x)/2 on their respective coordinates. The wealth coordinate maps to w = 5 tan(π((1 + x_w)/2 − 1/2)) with the existing finite clipping. Debt and gross assets keep the existing balance-sheet transform. Names, identity and roster order do not enter the calculation. Regional services and the canonical planetary and binary phases remain inputs to today's equilibrium.

The edges and their channel weights are modeling assumptions. They do not assert relationships from the source narrative. The finite-dimensional trace is used as a mathematical interaction in the fictional simulation.
