# Phase 6 — Equation and Domain Expansion

Phase 6 expands the solver from a small mechanics starter set into a broader introductory-physics foundation.

## Added domains and relationships
- Constant-acceleration kinematics: position-time, velocity-displacement, average velocity.
- Dynamics: Newton's second law, friction, Hooke's law.
- Energy: kinetic, gravitational potential, work, average power, spring potential.
- Momentum: linear momentum and impulse.
- Waves: frequency-period and wave-speed relations.

## Architecture rule
Every new equation provides an ID, domain, variables, targetMap, keywords, assumptions, and complexity. The explicit solver implementation and rearrangement catalog are updated together, and the equation is covered by regression tests.

## Deliberate limits
This phase does not claim universal physics coverage. It establishes a scalable pattern and focuses on common introductory relationships. Equations with multiple mathematical branches or strong sign/coordinate dependence remain candidates for later specialized handling.

## Validation
The Phase 6 regression suite checks representative solves across every newly added domain and is included in npm test.
