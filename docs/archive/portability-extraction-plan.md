# Flow Builder Portability And Extraction Plan

This document defines how `flow-builder` should evolve so it can eventually be carved out of `connect-mvp` and reused in other repos.

For the rule set that should govern day-to-day implementation decisions while we move toward that goal, see `flow-builder/docs/package-first-development.md`.

The goal is not just to keep `flow-builder` tidy inside this repo.

The goal is to make it a portable Amazon Connect flow-authoring library with:

- a repo-agnostic core
- a stable public API
- optional reusable patterns
- clean separation from `connect-mvp` deployment concerns

## Design Principle

Treat `flow-builder` as an internal product candidate, not as a local helper folder.

That means every new change should be evaluated with this question:

```text
Would this still belong here if flow-builder lived in its own repo or package?
```

If the answer is no, it probably belongs in a repo-specific consumer layer instead of the portable library.

## Portability Goal

The long-term extraction target is:

```text
portable package
  -> install or vendor into another repo
  -> define Connect flows with typed builders
  -> generate standard Connect Flow JSON
  -> let the consuming repo decide how to bind environment values
  -> let the consuming repo decide how to deploy
```

In that model, `flow-builder` should not care whether the consumer is:

- CDK
- Terraform
- CLI-driven import tooling
- another custom deployment system

## What Must Be Portable

These layers should become portable library material.

### 1. Core Flow Language Layer

Portable:

- `src/core/`

Reason:

- this is the canonical Connect flow language model
- it defines action contracts, transitions, conditions, validation, and JSON emission

### 2. Action Builder Layer

Portable:

- `src/actions/<category>/`

Reason:

- these are typed wrappers around Connect action types
- they should be reusable anywhere Amazon Connect flows are authored

### 3. Condition And Branching DSL

Portable:

- condition helpers and transition authoring APIs in `src/core/`
- conditional authoring support surfaced by builders

Reason:

- branching is part of generic flow authoring, not repo-specific logic

### 4. Generic Validation Layer

Portable:

- structural validation
- action parameter validation
- condition/operator validation

Reason:

- every consuming repo benefits from early local validation

## What Should Become Optional Or Repo-Specific

These areas may live near the library today, but they should not be treated as part of the portable core by default.

### 1. Repo-Specific Flow Factories

Not portable by default:

- `src/consumers/connect-mvp/factories/`

Reason:

- these are actual business flows for `connect-mvp`
- another repo should not inherit `MVPInboundVoice` or similar flow definitions unless it chooses to

Target treatment:

- keep as example or consumer code
- eventually move to a consumer package or repo-local layer

### 2. Repo-Specific Composites

Potentially portable, but not automatically:

- `src/consumers/connect-mvp/composites/`

Reason:

- some composites are generic enough to keep
- others encode business assumptions, queueing assumptions, or integration assumptions specific to this repo

Target treatment:

- split into:
  - generic reusable composites
  - repo-local composites

### 3. Generation Entry Points Tied To This Repo

Not portable in current form:

- `src/consumers/connect-mvp/generate.ts`

Reason:

- it currently writes into this repo's top-level `generated-flows/` folder
- it assumes a particular repository structure and a particular set of flow factories

Target treatment:

- replace with either:
  - a generic generator API
  - a small CLI package entrypoint
  - repo-local generation scripts in the consumer repo

### 4. Placeholder Contracts Tied To One Repo

Potentially portable, but only at the right abstraction level:

- current placeholder objects for queue, Lex, and Lambda references

Reason:

- placeholder replacement itself is portable
- the specific placeholder set in this repo reflects current `connect-mvp` deployment needs

Target treatment:

- portable placeholder mechanism
- repo-defined placeholder bindings

## Recommended Target Architecture

The strongest extraction-friendly shape is:

```text
flow-builder/
  src/
    core/
      action-definition.ts
      conditions.ts
      flow-builder.ts
      ids.ts
      index.ts
      registry.ts
      types.ts
      validators.ts
      actions/
        ...
    actions/
      ...
    composites/
      generic/
        ...
      connect-mvp/
        ...
    examples/
      ...
    consumers/
      connect-mvp/
        generate.ts
        factories/
          ...
```

That is the architectural destination even if the repo does not move there immediately.

The key point is:

```text
portable authoring engine
+ optional reusable patterns
+ repo-specific consumers
```

## Package Boundary

If `flow-builder` were extracted tomorrow, the public package boundary should eventually look something like this:

### Public API

Should be exported:

- core flow types intended for authors
- action definitions and registry accessors
- condition helpers
- `FlowBuilder`
- `BuiltFlow`
- typed action builders
- generic reusable composites that do not depend on repo-specific assumptions

### Internal API

Should stay internal or semi-internal:

- low-level helper utilities only needed by the library implementation
- repo-specific generation scripts
- repo-specific example flows
- repo-specific composites and factories

## Extraction Risks To Avoid

### 1. Baking `connect-mvp` Assumptions Into The Core

Bad examples:

- assuming a specific queue model
- assuming a Lex + Lambda + agent-assist architecture
- assuming generated files always live at repo root

### 2. Treating Factories As Library Surface

Bad outcome:

- another repo imports your business flows instead of a clean authoring toolkit

### 3. Letting Placeholder Contracts Become The API

Bad outcome:

- the package becomes coupled to one deployment pattern instead of exposing a generic template/binding mechanism

### 4. Mixing Deployment Logic Into The Builder

Bad outcome:

- the library stops being deployment-tool agnostic

## Extraction Plan

The cleanest path is incremental.

### Phase A: Stabilize The Portable Core

Done in progress:

- `core/` exists
- action registry exists
- builders are being normalized
- tests and parity checks exist

Still needed:

- continue broadening action coverage from the AWS flow-language surface
- keep public exports intentional
- avoid introducing repo-local assumptions into `core/`

### Phase B: Classify Composites

Goal:

- decide which composites are generic and which are `connect-mvp` specific

Deliverable:

- a split between reusable composites and repo-local composites

### Phase C: Separate Consumer Flows From The Library Candidate

Goal:

- move repo-local factories out of the conceptual core package boundary

Candidates:

- `src/consumers/connect-mvp/factories/`
- `src/consumers/connect-mvp/generate.ts`

### Phase D: Introduce A Consumer-Oriented Output Interface

Goal:

- remove assumptions that generation always writes to this repo's `generated-flows/`

Possible end states:

- library API returns `BuiltFlow` objects only
- separate CLI writes files
- consumer repo chooses output paths

### Phase E: Package Extraction

Goal:

- make `flow-builder` publishable or vendorable as a standalone unit

Potential outcomes:

- standalone Git repo
- workspace package
- private npm package
- vendored subdirectory with a clearly documented boundary

## What The Consuming Repo Should Own

After extraction, the consuming repo should own:

- concrete flow factories
- environment-specific placeholder bindings
- output file locations
- deployment integration
- repo-specific composites

The portable package should own:

- Connect flow language modeling
- action builders
- branching and condition DSL
- validation
- JSON emission
- generic examples

## Definition Of Portable Enough

`flow-builder` is portable enough when:

- another repo can use the builder without importing `connect-mvp`-specific flow factories
- another repo can choose its own output path and deployment tool
- another repo can use the public API without relying on internal file layout
- the library can be versioned independently from `connect-mvp`
- the library's core behavior is covered by package-level tests

## Near-Term Decisions

For the next implementation phases, this plan implies:

1. keep expanding the action library from the AWS flow-language surface, not from repo-local needs
2. avoid adding repo-specific assumptions to `core/`
3. treat `factories/` and `generate.ts` as consumer-facing code, not as the portable package heart
4. start identifying which current composites are generic versus `connect-mvp`-specific

## Practical Summary

The target architecture is:

```text
portable Connect flow-authoring library
+ optional reusable patterns
+ repo-specific consumer layer
```

The extraction rule is simple:

```text
if it models Amazon Connect flow authoring in a repo-agnostic way, it belongs in the library
if it models connect-mvp business flows or deployment assumptions, it belongs in the consumer layer
```
