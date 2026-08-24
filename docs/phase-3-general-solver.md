# Phase 3 — General Equation Solver

Phase 3 adds a safe tokenizer, parser, expression tree evaluator, variable discovery, and bounded numeric equation solver. It does not use eval or execute equation strings as JavaScript. Existing direct solvers remain trusted compatibility paths.

## Current supported syntax
Numbers, variables, parentheses, + - * / ^, sqrt, trig/inverse trig, ln, log, and abs.

## Solve flow
1. Parse both sides.
2. Verify all non-target variables are known.
3. Numerically search for sign changes.
4. Refine roots by bounded bisection.
5. Return all distinct roots for later physical filtering.

Phase 3 is intentionally conservative: unsupported syntax or invalid domains produce explicit errors rather than guessed answers.
