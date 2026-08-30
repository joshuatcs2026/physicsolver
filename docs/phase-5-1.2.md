# PhysicsSolver 1.2 — Phase 5

Phase 5 adds problem-understanding and equation-selection intelligence on top of the Phase 3/4 solver.

## Features
- Domain/context keyword detection across mechanics, energy, momentum, circular motion, fluids, thermal physics, waves, electricity, magnetism, optics, quantum physics, and chemistry.
- Basic natural-language quantity extraction for `variable = value unit` patterns.
- Unknown-variable counter for catalog equations.
- Equation ranking using target relevance, number of unknowns, and detected domain.
- Principle mode that returns a concise set of candidate principles/equations and why they are relevant.
- Diagram-requirement detection for common problem wording.

## Design rule
These detectors are advisory. They do not silently override mathematical solver results. Later language parsing can add richer grammar and unit recognition while retaining these deterministic fallbacks.
