# Flow Builder Package Development Rules

This document defines how `flow-builder` should be developed as a standalone package.

The key decision is:

```text
build the package for Amazon Connect first
let consumer repos use it second
```

That means future implementation work should be driven primarily by:

- Amazon Connect flow-language coverage
- package design quality
- portability across repos
- testability and validation strength

Not primarily by:

- one downstream consumer's short-term needs
- one deployment tool's preferred shape
- one team's local naming or file-output conventions

## Development Posture

Treat this repo like a reusable product, not like a scratch helper.

When deciding whether to add, change, or export something, ask:

```text
Would this still make sense if another team used this package in a different repo?
```

If the answer is no, the work probably belongs in a consumer repo instead of this package.

## Primary Rule

Package-first means:

```text
the package evolves against the Amazon Connect action surface
consumer repos prove and exercise the package
consumer repos do not define the package boundary
```

## What Drives Package Work

The package should now be driven by these priorities, in this order:

1. complete and accurate modeling of Amazon Connect flow actions
2. strong and stable package boundaries
3. repo-agnostic authoring ergonomics
4. testable validation and JSON emission behavior
5. reusable patterns that are truly generic

## What Does Not Drive Package Work

These are not valid primary reasons to change the package:

- one consumer wants a narrow convenience wrapper
- one consumer's deployment assumptions are easier to hardcode
- one consumer's business flow shape is too specific to be generally useful
- one repo wants the package to emit files in a special local layout

Those concerns belong in a consumer repo unless they clearly improve the portable package itself.

## Package Surface Rules

The root package surface should contain only repo-agnostic exports.

That includes:

- core flow types
- action registry and definitions
- condition helpers
- `FlowBuilder`
- `BuiltFlow`
- generic action builders
- generic reusable composites

That does not include:

- deployment-tool-specific generators
- consumer-specific flow factories
- consumer-specific composites that encode local assumptions

## Implementation Decision Rules

Use these rules when deciding where new work goes.

### If the change models an Amazon Connect action or transition concept

It belongs in the package.

Examples:

- new action definitions
- new action builders
- new condition operators
- validation improvements
- JSON emission behavior

### If the change models a reusable flow pattern that could apply across repos

It may belong in the package.

Only keep it in the package if it is clearly generic.

Examples:

- generic prompt-and-fallback patterns
- generic queue handoff patterns
- generic input-and-branch patterns

### If the change encodes one consumer's architecture assumptions

It does not belong in the package.

Examples:

- local pipeline attributes
- one repo's naming conventions
- one repo's deployment placeholders
- one repo's special output directory layout

## How To Evaluate A Proposed Change

Before implementing a new feature, classify it into one of these buckets.

### Bucket A: Core Connect Modeling

Question:

```text
Does this help represent Amazon Connect flow language more completely or correctly?
```

If yes:

- implement it in the package

### Bucket B: Generic Authoring Ergonomics

Question:

```text
Would multiple repos plausibly benefit from this same authoring abstraction?
```

If yes:

- consider implementing it in the package

If unsure:

- prefer the narrower package design first

### Bucket C: Consumer-Specific Composition

Question:

```text
Does this mostly help one consumer repo express its own flows?
```

If yes:

- keep it out of this package

## Coverage Work Rules

Future package implementation should stay coverage-led.

That means:

1. maintain the Connect action catalog in `src/catalog/connect-action-catalog.ts`
2. track implementation status against that catalog
3. add actions by capability family
4. keep the package roadmap tied to Connect coverage, not one repo's immediate backlog

The human-readable companion docs are:

- `docs/connect-action-catalog.md`
- `docs/connect-action-coverage-matrix.md`
- `docs/library-coverage-roadmap.md`

## Composite Rules

Composites should be evaluated strictly.

Keep a composite in the package only if:

- it is broadly reusable
- it does not encode local business assumptions
- it does not require local deployment knowledge

Otherwise:

- leave it to a consumer repo

## Example Rules

Examples in this repo should:

- demonstrate generic package capabilities
- stay readable for new contributors
- avoid pretending to be one team's production architecture

Examples are here to teach and validate the package.

They are not the package boundary.

## Documentation Rules

Package docs should describe:

- the package API
- the package architecture
- the package validation model
- the package coverage roadmap

They should not assume:

- one deployment tool
- one infrastructure repo
- one downstream consumer shape

## Definition Of Success

This standalone package posture is working when:

- new package work is justified by Connect coverage or portability
- the public export surface remains repo-agnostic
- another repo can adopt the package without learning hidden local conventions
- tests protect the package behavior directly

## Practical Summary

Use this mental model:

```text
build a strong Amazon Connect authoring package
keep the package generic
let consumer repos own their own deployment and business-flow specifics
```