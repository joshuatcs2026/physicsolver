# Phase 7 — Solver Modes and Study Engine

Phase 7 remains engine-only. It adds no final UI layer.

## Modes
- solve: normal answer
- explain: equation, rearrangement, substitution, and steps
- principle: underlying principles and assumptions
- study: hide final answer while exposing learning structure
- practice: practice-oriented prompt structure
- check: return answer checks
- reverse: inspect the equation from answer back toward required inputs
- alternative: expose alternative candidate equations/paths

## Study state
The engine stores attempts, correctness, mistake tags, topic/equation records, history, mastery, weak areas, and study recommendations. State is pure data and can later be persisted by the UI without coupling the engine to browser storage.

## Dependency map
Equation outputs are indexed as producers, while target maps expose prerequisite variables. Difficulty categories are direct, short-chain, multi-step, and long-chain.

## Scope boundary
Interactive diagrams, graphing, vector geometry, coordinate tools, advanced sign-convention reasoning, and final UI integration remain outside Phase 7.
