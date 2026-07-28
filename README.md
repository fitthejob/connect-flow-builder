# connect-flow-builder

`connect-flow-builder` is a standalone TypeScript package for authoring Amazon Connect flows as code.

It is designed to give teams a portable, repo-agnostic source of truth for Connect flow definitions, with local validation, staged artifact review, and deployment-friendly JSON output.

## Why This Package Exists

Amazon Connect flows are often built directly in the Flow Designer UI, exported as JSON, and then hand-managed in downstream repos.

That works at small scale, but it becomes hard to:

- review flow changes like normal code
- reuse proven patterns safely
- keep environment bindings out of authored flow logic
- track which Flow Designer blocks are truly implemented and deployable
- promote the same flow definitions across `dev`, `stage`, and `prod`

`connect-flow-builder` addresses that by moving flow authoring into a typed package with an explicit design and deployment boundary.

## What It Provides

It provides:

- typed Amazon Connect action builders
- a flow DSL and condition helpers
- structural and action-level validation
- JSON emission for Amazon Connect flow definitions
- staged flow artifact rendering and manifest generation
- portable examples and catalog-driven coverage tracking
- file generation for reusable JSON flow templates

In practice, that means a developer can:

- define a flow once in TypeScript
- validate it locally before deployment
- render environment-staged artifacts for review
- hand the same catalog to a CDK or other deployment layer
- keep Connect-specific business logic in source control instead of only in the designer

## Current State

The package includes:

- a canonical action registry under `src/core/`
- typed action builders grouped by category under `src/actions/`
- a unified Amazon Connect action catalog under `src/catalog/`
- a generic staging layer under `src/staging/`
- reusable composites under `src/composites/`
- portable examples under `src/examples/`
- package-level regression tests under `tests/`

This package is intentionally:

- `repo-agnostic`: it does not assume one consumer repo structure
- `deployment-agnostic`: it does not own CDK, Terraform, or pipeline constructs
- `catalog-driven`: the action catalog is the planning source of truth
- `export-disciplined`: new builder contracts are added from proven AWS docs or exported Flow Designer JSON, not guesswork

The package implements action builders across:

- branching and checks
- routing and transfer
- contact state and hook configuration
- operator controls
- channel analytics and media streaming
- outbound call-progress handling
- callback and outbound chat initiation
- case and customer profile integrations
- voice ID and agent-assist support

In addition to those low-level action builders, the package also includes composite helpers for proven multi-action UI blocks such as `Connect assistant`.

Exact implemented-surface counts and per-action coverage status are generated from the source catalog at build time — see `docs/connect-action-catalog.md` and `docs/connect-action-coverage-matrix.md` rather than any hand-maintained list.

For the exact implemented surface, see:

- `src/catalog/connect-action-catalog.ts`
- `docs/connect-action-catalog.md`
- `docs/connect-action-coverage-matrix.md`

## Validation Status

This package is currently being tested and validated against a live Amazon Connect instance.

What that means in practice:

- the package has local TypeScript and regression-test coverage
- implemented action contracts are based on AWS documentation and proven exported Flow Designer JSON
- some important end-to-end patterns have now been deployed successfully in a live Connect environment
- not every implemented flow shape or action surface has been validated yet through full live deployment

The practical interpretation is:

- treat the catalog and tests as strong implementation evidence
- treat live environment validation as still in progress across the full surface area
- prefer the documented proven examples and patterns when adopting the package first

## Why It Matters In A Dev Workflow

For a consuming team, this package creates a cleaner workflow:

```text
author flows in TypeScript
  -> validate locally
  -> stage reviewable JSON artifacts
  -> inspect placeholders and dependencies
  -> deploy from a consumer repo such as CDK
```

That gives teams several concrete benefits:

- safer change review because flow logic is diffable in source control
- better reuse of proven patterns such as inbound queueing and flow-to-flow handoff
- cleaner environment promotion because bindings can change without rewriting flow logic
- less drift between intended design and deployed JSON
- a clearer path to CI/CD because the same catalog can drive staging, synth, and deploy

For teams building Amazon Connect as an internal platform capability, this package acts as the application layer between raw Connect JSON and deployment infrastructure.

If a team already defines flows in TypeScript and deploys them through CDK, this package does not replace that lifecycle.

Instead, it improves the parts that often remain repo-specific or ad hoc:

- flow authoring conventions
- action naming and coverage discipline
- validation before synth or deploy
- reviewable staged artifacts
- proven handling of exported Connect block shapes

The practical value in that case is standardization.

Rather than each repo inventing its own mini flow framework, helper set, JSON assembly rules, and validation habits, a team can share one package-level authoring model and one source of truth for implemented Connect surfaces.

That is especially useful when:

- multiple flows share recurring patterns such as queue handoff, flow-to-flow transfer, or hook configuration
- the same flow definitions need to move cleanly across `dev`, `stage`, and `prod`
- teams want clearer review boundaries before CDK synth and deploy
- Connect flow logic should stay portable instead of being buried inside one infrastructure repo

For very small or highly stable flow estates, that extra structure may not add much.

For teams that expect their Connect implementation to grow, change, or span multiple repos and environments, it can make the lifecycle more consistent and maintainable.

## Package Goals

- model Amazon Connect flow actions as typed TypeScript builders
- validate structural correctness before deployment
- keep the action library portable and repo-agnostic
- support reusable composites without burying raw action semantics inside business-specific factories
- emit standard Amazon Connect flow JSON for downstream deployment tooling

## Recommended Role In An Architecture

The clean v1 architecture is:

```text
connect-flow-builder
  owns flow authoring, validation, staging, examples, and action coverage

consumer repo
  owns environment bindings, deployment stacks, CI/CD, and instance-specific resources
```

This keeps the package broadly reusable while still fitting well into a CDK app that manages Connect resources such as:

- contact flows
- queues
- prompts
- hours of operation
- Lambdas
- Lex bots and aliases

The package is especially useful when those resources live in the same CDK app, but the team still wants a deliberate boundary between flow design and flow deployment.

## Folder Layout

```text
connect-flow-builder/
|- README.md
|- package.json
|- tsconfig.json
|- generated-flows/
|- generated-flow-staging/
|- docs/
|- scripts/
|- src/
|  |- actions/
|  |- catalog/
|  |- composites/
|  |- core/
|  |- staging/
|  |- examples/
|  |- index.ts
|- tests/
   |- actions.test.mjs
   |- catalog.test.mjs
   |- registry.test.mjs
   |- staging.test.mjs
```

## Supported Action Surface

The full list of implemented builders is generated into `docs/connect-action-catalog.md` and `docs/connect-action-coverage-matrix.md` on every build — those files are the authoritative source of truth for the covered surface.

Representative examples include `GetParticipantInput`, `ConnectParticipantWithLexBot`, `TransferContactToQueue`, `InvokeLambdaFunction`, `CreateCase`, `GetCustomerProfile`, `UpdateContactRecordingAndAnalyticsBehavior`, and `Wait`.

## Proven Package Patterns

The package includes export-backed support for several important Connect surfaces and patterns, including:

- `AuthenticateParticipant`
- `CreatePersistentContactAssociation`
- `LoadContactContent`
- `Store customer input` as a proven `GetParticipantInput` wrapper
- `Set customer queue flow`, `Set disconnect flow`, and `Set whisper flow` as `UpdateContactEventHooks` wrappers
- `Connect assistant` as a proven `CreateWisdomSession` plus `UpdateContactData` composite
- inbound queue handoff using:
  `Set customer queue flow` -> `Set working queue` -> `TransferContactToQueue`

Where a Flow Designer block has multiple modes, the package only implements the modes that are proven by AWS documentation or exported flow JSON. Unproven variants are deferred explicitly rather than guessed.

## Install And Run

```bash
npm install
npm run check
npm run test
npm run build
npm run generate
```

## Example Flows

```bash
npm run example:branching
npm run example:checks
npm run example:guided
npm run example:controls
npm run example:analytics
npm run example:outbound
npm run example:cases
npm run example:tasks
npm run example:staging
```

The staging example writes a reviewable staged flow catalog and `manifest.json` to:

```text
generated-flow-staging/dev/
```

## Generate JSON Files

```bash
npm run generate
```

This writes the current packaged example flows into:

```text
generated-flows/
|- branching-on-input.json
|- case-profile-operations.json
|- channel-analytics.json
|- check-routing.json
|- guided-wait-transfer.json
|- operator-controls.json
|- outbound-call-progress.json
|- task-routing-loop.json
```

You can also pass a custom output directory:

```bash
node ./dist/generate.js ./my-output-dir
```

## Parsing Live Flows

In addition to authoring flows from scratch, the package can parse an exported Amazon Connect flow definition and let you edit it programmatically.

```ts
import { parseConnectFlowDefinition } from "@fitthejob/connect-flow-builder/parse";
```

`parseConnectFlowDefinition` accepts either a parsed object or a raw JSON string. It is tolerant of designer-authored quirks — UUID identifiers, `Metadata.ActionMetadata` designer keys, and block types the package does not yet implement. Rather than throwing on anything unexpected, it returns a `ParsedFlow` with a `diagnostics` array describing what it found. Diagnostics use one of four codes:

- `unknown-action` — an action type not recognized by the registry (parsed as a passthrough action)
- `nonconforming` — a recognized action whose parameters fail validation
- `dangling-transition` — a transition that references an action id not present in the flow
- `unknown-version` — a `Version` value other than `"2019-10-30"`

Parsing only throws a `FlowParseError` for structurally invalid input (bad JSON, or a missing `Version`, `StartAction`, or `Actions`).

An unmodified flow re-emitted with `toConnectDefinition()` or `toJsonString()` is content- and key-order-identical to the source document — parsing never rewrites fields it doesn't need to touch, so a parse-then-emit round trip on an untouched flow is a no-op diff.

```ts
import { parseConnectFlowDefinition } from "@fitthejob/connect-flow-builder/parse";
import { UpdateContactRecordingAndAnalyticsBehaviorActionBuilder } from "@fitthejob/connect-flow-builder";

const flow = parseConnectFlowDefinition(exportedFlowJson);

const [transfer] = flow.findByType("TransferContactToQueue");

const recording = new UpdateContactRecordingAndAnalyticsBehaviorActionBuilder("recording-1")
  .voiceRecording(["Agent", "Customer"])
  .onError(transfer.id, "NoMatchingError")
  .onError(transfer.id, "ChannelMismatch")
  .build();

flow.insertBefore(transfer.id, recording);

console.log(flow.toJsonString());
```

`insertBefore` rewires every existing edge that pointed at `transfer.id` (whatever predecessors targeted it) to point at the new action instead, and gives the new action a `NextAction` of `transfer.id`.

## Staging Artifacts

The package now also supports a generic staging layer for review-before-deploy workflows.

The staging API is intended for consumer repos that want to:

- define a deployable flow catalog
- render environment-specific flow artifacts
- review unresolved placeholders before deployment
- hand the same flow catalog to a deployment layer such as CDK

For the current package example:

```bash
npm run example:staging
```

For the recommended consumer pattern, see:

- `docs/cdk-consumer-integration.md`
- `docs/v1-boundary.md`

## Consumer Workflow

The intended consumer experience is:

1. install `connect-flow-builder` into a CDK or other deployment repo
2. define the repo's own production flow catalog using this package
3. stage environment-specific artifacts to disk for review
4. bind real values from queues, flows, Lambdas, Lex, prompts, and other Connect resources
5. deploy the rendered flow content from the consumer repo

That boundary is deliberate.

This package should stay focused on authoring and emitting correct flow definitions.

The consumer repo should stay focused on environment ownership and deployment.

## Minimal Example

```ts
import {
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  MessageParticipantActionBuilder,
} from "./src/index.js";

const greeting = new MessageParticipantActionBuilder("Greeting")
  .text("Hello from the flow builder.")
  .next("Disconnect")
  .build();

const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

const flow = new FlowBuilder("HelloWorld")
  .startWith(greeting)
  .add(disconnect)
  .build();

console.log(flow.toJsonString());
```

## Documentation Map

- `docs/runbook.md`
  Operator-friendly guide for understanding the package and creating flows safely
- `docs/connect-action-catalog.md`
  Human-readable unified action catalog
- `docs/connect-action-coverage-matrix.md`
  Implemented coverage and next coverage-wave guidance
- `docs/library-coverage-roadmap.md`
  Long-range action-library roadmap
- `docs/package-first-development.md`
  Standalone package development rules
- `docs/cdk-consumer-integration.md`
  Recommended v1 pattern for staging flows in this package and deploying them from a CDK consumer repo
- `docs/v1-boundary.md`
  V1 package-versus-consumer boundary for staging and CDK integration

## Why This Is Worth Showing

As a showcase project, `connect-flow-builder` demonstrates more than raw Amazon Connect familiarity.

It shows the ability to:

- turn UI-authored cloud behavior into a typed reusable package
- separate design-time concerns from deployment-time concerns
- normalize inconsistent platform surfaces into a stable developer API
- use tests, catalogs, and staged artifacts to reduce deployment risk
- build toward a CI/CD-friendly workflow for a service that is often managed manually

In other words, it is not just a flow generator.

It is an attempt to make Amazon Connect flow development feel more like disciplined software delivery.

## Planned `connectPath` Helper

The package does not yet ship a shared `connectPath` helper module, but it is a planned future layer for documented JSONPath references such as system attributes and user-defined attributes.

The reasoning for keeping that helper separate from the action builders is:

- action builders should model the underlying AWS action contract, not the Flow Designer namespace/key picker UI
- many actions accept a string expression syntactically, but only a smaller subset of those expressions are semantically valid for the action at runtime
- a shared helper layer can grow from documented AWS references and proven exported-flow evidence without forcing every action builder to understand every namespace/key pair in Connect

For future helper work, the current primary AWS references are:

- System attributes: `https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#attribs-system-table`
- User-defined attributes: `https://docs.aws.amazon.com/connect/latest/adminguide/connect-attrib-list.html#user-defined-attributes`

## Design Discipline

- The catalog is the planning source of truth.
- The registry is the implemented source of truth.
- New actions should align to AWS action names first.
- Composites should express reusable patterns, not hide raw action behavior.
- Consumer-specific flow factories should live outside this standalone package.
- Staged artifacts are review output, not hand-maintained source.
