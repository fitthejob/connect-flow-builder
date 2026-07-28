# Flow Builder V1 Boundary

This document defines the recommended v1 boundary for using `flow-builder` as a repo-agnostic Amazon Connect flow-design package that can be dropped into a CDK repo without bringing CDK assumptions into the package itself.

The goal of v1 is:

```text
keep flow-builder generic
make staged flow design reviewable
let consumer repos own AWS resource wiring and deployment
```

This is a boundary document, not a full implementation plan.

## V1 Decision

V1 should support this operating model:

```text
flow-builder package
  -> defines flow specs and flow build contracts
  -> renders reviewable staged flow JSON artifacts
  -> stays deployment-tool agnostic

consumer repo
  -> binds real environment values
  -> wires flows to AWS resources
  -> deploys flows with CDK
```

The package should remain usable by:

- a CDK repo
- a Terraform repo
- a CLI-driven import process
- any other deployment layer that can consume Connect flow JSON

## What Belongs In The Package

These concerns belong in `flow-builder` v1 because they are generic flow-authoring or staging concerns that multiple repos could reuse.

### 1. Core Amazon Connect Flow Authoring

Keep in package:

- `FlowBuilder`
- `BuiltFlow`
- action builders
- core types
- validation
- condition helpers
- reusable generic composites

Reason:

- this is the portable authoring engine

### 2. Action Coverage And Action Catalog Governance

Keep in package:

- `src/catalog/connect-action-catalog.ts`
- coverage docs
- action status tracking
- action-level implementation discipline

Reason:

- this is part of the package's source-of-truth model for Connect action support

### 3. Flow Deployment Metadata Model

Keep in package:

- generic flow resource type definitions such as `CONTACT_FLOW`, `CUSTOMER_QUEUE`, `CUSTOMER_HOLD`, and `CUSTOMER_WHISPER`
- generic `FlowSpec` or equivalent deployable-flow metadata contract
- generic `FlowCatalog` or equivalent collection contract

Reason:

- top-level flow resource metadata is not CDK-specific
- consumer repos should not have to reinvent the same flow catalog shape

### 4. Generic Binding Contracts

Keep in package:

- generic binding interfaces
- generic placeholder conventions
- generic reference-resolution contracts

Examples:

- queue ARN bindings
- Lambda ARN bindings
- Lex alias ARN bindings
- flow ID or flow ARN bindings
- prompt ARN bindings
- hours-of-operation bindings
- generic custom binding slots

Reason:

- the concept of "this flow needs a queue ARN" is portable
- the source of that queue ARN is consumer-specific

### 5. Generic Staging And Render APIs

Keep in package:

- render a flow catalog into staged artifacts
- write staged artifacts to disk
- render environment-specific output directories
- generate a manifest of rendered flows
- detect unresolved placeholders
- detect duplicate flow keys
- detect obvious flow-reference cycles

Reason:

- reviewable staged output is not a CDK-only concern
- another repo could use the same rendering/staging layer without using CDK

### 6. Generic Staged Artifact Format

Keep in package:

- rendered flow JSON artifact shape
- manifest file shape
- naming rules for staged outputs

Recommended v1 staged contents:

- one JSON file per flow
- one manifest file per environment

Recommended manifest fields:

- flow key
- flow name
- flow type
- source file or builder name
- referenced flows
- referenced external bindings
- unresolved placeholders
- content hash

Reason:

- this creates a stable review surface across repos

### 7. Generic Scriptable Entry Points

Keep in package:

- importable APIs for staging and rendering
- optional package scripts that operate only on package-local examples

Potential future package CLI is acceptable only if it remains generic and caller-supplied.

Reason:

- a consumer repo should be able to wire the package in via a small local script
- the package should not need to understand one repo's folder layout

## What Belongs In The Consumer Repo

These concerns belong in the consumer repo because they encode infrastructure ownership, environment bindings, deployment decisions, or repo-local architecture.

### 1. CDK Stack Definitions

Keep in consumer repo:

- `ContactFlowsStack`
- Connect instance stack
- queue stack
- prompt stack
- Lambda stack
- Lex stack
- any repo-local integration stack

Reason:

- CDK is a deployment choice, not a package boundary

### 2. Real Resource Binding Assembly

Keep in consumer repo:

- collecting real refs from other stacks
- mapping stack outputs or construct refs into package bindings
- environment-specific binding values

Examples:

- `supportQueue.queueArn`
- `agentAssistLambda.functionArn`
- `salesBotAlias.attrArn`
- `afterHoursWhisperFlow.attrContactFlowArn`

Reason:

- the package should know what values are needed
- the consumer repo should decide where those values come from

### 3. Deployment-Time Substitution

Keep in consumer repo:

- CDK token handling
- `Fn.sub(...)` or equivalent deployment rendering
- CloudFormation resource creation
- deployment order and stack dependencies

Reason:

- this is AWS deployment wiring
- it is not portable package logic

### 4. Repo-Local Flow Definitions

Keep in consumer repo:

- real business flows
- customer-specific routing logic
- tenant-specific naming
- local environment conventions

Reason:

- these are not generic package examples

The package may define the generic `FlowSpec` contract, but the actual production flow catalog for one deployment should live in the consumer repo.

### 5. Staging Directory Policy

Keep in consumer repo:

- exact staging root path
- retention policy
- CI artifact policy
- whether staged output is committed or ignored

Example acceptable consumer choice:

```text
.staging/contact-flows/dev/
.staging/contact-flows/stage/
.staging/contact-flows/prod/
```

Reason:

- output policy is repo-local operational behavior

### 6. CI/CD Integration

Keep in consumer repo:

- synth pipeline
- review gates
- promotion workflow
- deploy workflow
- artifact publishing rules

Reason:

- CI/CD belongs to the delivery system, not the package

## What Is Explicitly Deferred In V1

These are valid future topics, but they should not be part of the first implementation boundary.

### 1. Flow Modules

Deferred:

- flow module deployment model
- separate module catalog
- module-specific resource typing and cross-linking

Reason:

- contact flows are the current target
- modules add a second deployment surface and should be designed separately

### 2. Embedded CDK Constructs In The Package

Deferred:

- package-exported CDK stacks
- package-exported CDK constructs for contact flow deployment
- package-level assumptions about `aws-cdk-lib`

Reason:

- this would reduce portability too early

### 3. Universal Repo Auto-Discovery CLI

Deferred:

- package CLI that auto-discovers local flow catalogs
- package CLI that auto-discovers stack bindings

Reason:

- this tends to create repo-shape assumptions
- a small consumer script is safer for v1

### 4. Full Binding Coverage Helpers For Every Resource Family

Deferred:

- helper ergonomics for every possible Connect resource family on day one
- advanced authoring sugar for resource lookups

Reason:

- the binding model should start small and generic
- the contract can expand once real usage stabilizes

### 5. Advanced Deployment Orchestration

Deferred:

- automatic dependency sorting across multiple stacks
- automated promotion workflows
- drift-management tooling
- auto-rollback orchestration

Reason:

- these are delivery-system concerns, not v1 package concerns

### 6. Rich Design Studio Features

Deferred:

- visual editors
- diff UIs
- approval dashboards
- browser-based review tooling

Reason:

- staged artifacts on disk are sufficient for v1

## Recommended V1 File Boundary

The package should own concepts like:

```text
src/
  core/
  actions/
  composites/
  catalog/
  staging/
    flow-spec.ts
    flow-catalog.ts
    bindings.ts
    render-flow-catalog.ts
    manifest.ts
```

The consumer repo should own concepts like:

```text
src/
  connect/
    flows/
      catalog.ts
      bindings.ts
      inbound-voice.ts
      after-hours.ts
scripts/
  stage-contact-flows.ts
lib/
  contact-flows-stack.ts
```

This is an example boundary only. The important part is the separation of concerns, not the exact folder names.

## V1 Success Criteria

V1 is correctly scoped when all of these are true:

1. another CDK repo can adopt the package without importing package-owned CDK constructs
2. the package can render staged flow JSON for review before deploy
3. the same flow definitions can be reused across `dev`, `stage`, and `prod` with different bindings
4. the consumer repo can deploy flows using real stack refs without modifying package internals
5. the package remains useful even if the consuming repo does not use CDK

## Practical Summary

Use this mental model:

```text
package owns portable flow design and staging
consumer repo owns resource bindings and deployment
anything CDK-specific stays out of the package in v1
anything module-specific stays deferred in v1
```
