# Flow Library Coverage Roadmap

This document defines the long-term target for the internal Amazon Connect flow-authoring library in this repo.

For the package governance model that should drive future implementation decisions, see `flow-builder/docs/package-first-development.md`.

The goal is not a small helper set for a few MVP flows.

The goal is a comprehensive internal library that can eventually model the full Amazon Connect flow action surface closely enough that an operator can build any flow pattern they need through code, generate JSON, and then validate the final result in Amazon Connect.

## Core Principle

The library should eventually support:

- all Amazon Connect flow action types that matter to this repo
- all major flow authoring patterns an operator is likely to need
- enough typed structure that operators can build flows intentionally instead of hand-editing JSON

Amazon Connect remains the final semantic authority.

That means:

```text
Our library is the authoring platform.
Amazon Connect is the final validation platform.
```

## End-State Vision

The desired end state is:

```text
Operator requirement
  -> choose actions and composites from the internal library
  -> define a flow in TypeScript
  -> generate Connect Flow JSON
  -> inject deployment-specific values
  -> validate and publish in Amazon Connect
```

From an operator perspective, this should eventually feel like:

```text
"If Amazon Connect supports this flow action or block pattern,
the library should have a corresponding way to model it."
```

## What "Complete Enough For Operators" Means

The library is not complete just because it can generate valid JSON for a few examples.

It is only complete enough when an operator can reliably do all of the following without dropping down into hand-edited JSON:

- create inbound voice flows
- create inbound chat flows
- create transfer and queue-routing flows
- branch on conditions and results
- set and read contact state through supported actions
- invoke Lambda and other integration-oriented actions
- configure recording, analytics, and post-contact behavior where supported
- reuse common business patterns through composites
- extend the action set in a predictable way when AWS adds or exposes more functionality

## Scope Layers

The target platform has four layers.

### 1. Core Flow Language Model

This layer defines the underlying flow contract:

- action types
- parameters
- transitions
- validation
- emitted Connect JSON shape

Current home:

- `flow-builder/src/core/`

### 2. Action Library

This layer provides one typed builder per Connect action type.

Current home:

- `flow-builder/src/actions/<category>/`

Target rule:

```text
one canonical action definition
+ one typed builder
+ one validation source
```

### 3. Composite Library

This layer provides reusable multi-step patterns.

Current home:

- `flow-builder/src/composites/`

Examples:

- standard Lex entry
- agent-assist handoff
- full-service voice prelude

Target rule:

```text
composites should model repeated business or routing patterns,
not act as a dumping ground for raw action behavior
```

### 4. Flow Factories

This layer defines real named flows used by the repo.

Typical home in a consumer repo:`r`n`r`n- `src/factories/` or another consumer-owned flow assembly layer

Target rule:

```text
factories assemble actions and composites into real deployable flows
but should not re-implement action semantics
```

## Coverage Model

The library should grow by capability family, not by random block additions.

The authoritative inventory that defines that action surface now lives in:

- `flow-builder/src/catalog/connect-action-catalog.ts`

The supporting docs that explain current status live in:

- `flow-builder/docs/connect-action-catalog.md`
- `flow-builder/docs/connect-action-coverage-matrix.md`

### Family A: Messaging And Interaction Entry

Examples of problems this family solves:

- greetings
- prompt delivery
- message blocks
- participant input collection

Operator outcome:

```text
I can greet the customer, ask for information, and collect input
without hand-crafting raw JSON.
```

### Family B: Routing And Transfer

Examples of problems this family solves:

- queue handoff
- transfer-oriented control flow
- fallback and error routing

Operator outcome:

```text
I can route contacts intentionally through queues and transfer paths.
```

### Family C: Branching And Conditions

Examples of problems this family solves:

- conditional transitions
- compare-style logic
- result-based routing
- explicit decision trees

Operator outcome:

```text
I can build real logic, not just linear flows.
```

### Family D: Contact State And Attributes

Examples of problems this family solves:

- stage tracking
- contact attributes
- path markers
- downstream handoff state

Operator outcome:

```text
I can mark, persist, and reuse flow state in a controlled way.
```

### Family E: Integrations

Examples of problems this family solves:

- Lambda invocation
- external lookups
- enrichment and side effects

Operator outcome:

```text
I can connect the flow to external systems without leaving the library model.
```

### Family F: Recording, Analytics, And Post-Contact Behavior

Examples of problems this family solves:

- recording behavior
- Contact Lens related configuration
- summarization and analytics-oriented setup

Operator outcome:

```text
I can author flows that intentionally participate in analytics pipelines.
```

### Family G: Advanced Control And Specialized Flow Patterns

Examples of problems this family solves:

- edge-case termination patterns
- special flow types
- advanced control structures needed for niche operator workflows

Operator outcome:

```text
I am not blocked just because the flow is unusual.
```

## Rollout Strategy

The library should not attempt full coverage in one giant implementation wave.

The correct rollout pattern is:

1. choose a capability family
2. identify the AWS action surface for that family
3. add canonical action definitions
4. add typed builders
5. add validator rules if needed
6. add unit tests
7. add composites only where reuse is real
8. validate the resulting flows in Amazon Connect

## Recommended Expansion Order

This is the recommended order from highest leverage to lower leverage.

### Tranche 1: Branching And Conditions

Why first:

- it unlocks non-linear flows
- it makes the library feel like a true flow-authoring platform
- many realistic operator use cases depend on conditional behavior

### Tranche 2: Deeper Routing Primitives

Why second:

- real contact center behavior is heavily routing-driven
- queue and transfer logic usually expands quickly once branching exists

### Tranche 3: Richer Contact State

Why third:

- many business flows need state markers and downstream attribute use
- it improves interoperability between composites and integrations

### Tranche 4: Broader Integration Actions

Why fourth:

- integrations become much easier to model once branching and state are stable

### Tranche 5: Analytics And Specialized Flow Types

Why later:

- these are valuable, but should rest on a stable core action platform

## Definition Of Success Per Tranche

An implementation wave is complete only when:

- each new supported action has a canonical definition in `core/`
- each new supported action has a typed builder in `actions/`
- validation behavior is covered by tests
- generated output remains stable where unchanged
- at least one example or factory demonstrates the new capability
- an operator can use the new family without touching raw JSON

## Operator Design Standard

When deciding whether a new capability belongs in the library, use this rule:

```text
If an operator would reasonably need this flow behavior more than once,
the library should model it explicitly.
```

That does not always mean a composite.

Sometimes the right answer is:

- a new action definition
- a new action builder
- a small extension to transitions or validation

## Boundaries

This roadmap does not mean:

- every conceivable AWS feature must be implemented immediately
- every composite should be created up front
- the library should guess hidden Connect semantics that only the service can validate

This roadmap does mean:

- the architecture should assume broad eventual coverage
- the registry should be treated as the authoritative supported-action inventory
- future work should move toward operator-complete flow authoring, not away from it

## Current Position

At the time of writing, the library has:

- a core flow-language layer
- a canonical action-definition and registry system
- a normalized builder base
- a starter condition and branching DSL
- an AWS-backed action catalog and coverage matrix
- a small supported action set
- regression tests and generated-flow parity checks

That means the foundation is ready.

The next meaningful expansion step is:

```text
catalog-led expansion of the remaining reusable participant,
set, and routing primitives, starting with ConnectParticipantWithLexBot,
MessageParticipantIteratively, UpdateFlowAttributes, and UpdateContactTargetQueue
```

## Practical Summary

The target is clear:

```text
eventually support the full practical Amazon Connect action space
so operators can build any flow they need through the internal library
without hand-maintaining raw JSON
```

The discipline is also clear:

```text
expand by capability family
+ keep the registry canonical
+ keep builders thin
+ keep Connect as the final semantic validator
```
