# Phase 4 — Problem Understanding

Phase 4 adds an explainable interpretation layer before solving.

## Pipeline

1. Normalize text.
2. Detect equation keywords.
3. Detect registered variable names, aliases, and symbols using token boundaries.
4. Detect number + unit pairs from the registered unit library.
5. Rank likely physics domains from equation keyword hits.
6. Classify broad problem types with transparent rules.
7. Detect a requested target when an explicit question cue is present.
8. Warn about ambiguous concepts such as speed vs. velocity, distance vs. displacement, and weight vs. mass.
9. Optionally perform conservative, low-confidence quantity assignment.
10. Send context to the existing solver while keeping user-entered values authoritative.

## Important limitation

The quantity extractor does not claim to understand arbitrary grammar. Its order-based assignment is deliberately marked `low` confidence. The UI asks the user to review detected information before relying on it.

## Why this design

The parser is deterministic, offline, inspectable, and easy to debug. A later parser can replace or augment individual heuristics without changing the equation registries or dependency solver.

## Next phase

The planned debug/improvement phase should focus on test execution, false positives/negatives, parser edge cases, unit normalization through multi-step paths, GitHub Pages verification, and clearer human-readable solution output.
