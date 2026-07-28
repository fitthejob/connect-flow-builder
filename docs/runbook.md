# Flow Builder Runbook

This runbook is for anyone onboarding to the package who needs to do two things safely:

1. understand how this package is put together
2. create or change a flow without guessing

This repo is a standalone package.

That means:

- it helps you author Amazon Connect flows in TypeScript
- it validates them locally
- it prints standard Connect flow JSON
- it can render staged flow artifacts for review
- it does not deploy anything by itself

A different repo or tool can consume the JSON later.

## Start Here

If you remember only one thing, remember this:

```text
Write flow code in src/
  -> build the package
  -> either print JSON, generate example JSON files, or stage review artifacts
  -> inspect the output
  -> hand that JSON to a consumer repo or deployment tool
```

## What Is Source Code And What Is Output

Source code lives here:

- `src/core/`
- `src/actions/`
- `src/composites/`
- `src/staging/`
- `src/examples/`
- `src/index.ts`

Output lives here after build:

- `dist/`

Important rule:

- edit `src/`
- do not edit `dist/`

`dist/` is generated output.

## The Package In Plain English

Think of the package as five layers.

### Layer 1: Core

Path:

- `src/core/`

Purpose:

- defines the flow model
- validates flows
- turns flows into Amazon Connect JSON

Mental model:

```text
Core = the engine
```

### Layer 2: Action Builders

Path:

- `src/actions/<category>/`

Purpose:

- each builder creates one kind of Connect block

Examples:

- `MessageParticipantActionBuilder`
- `GetParticipantInputActionBuilder`
- `TransferContactToQueueActionBuilder`
- `DisconnectParticipantActionBuilder`

Mental model:

```text
Action builder = one Connect block
```

### Layer 3: Composites

Path:

- `src/composites/`

Purpose:

- groups multiple actions into a reusable pattern

Example:

- `standard-lex-entry.ts`

Mental model:

```text
Composite = a reusable mini-flow
```

### Layer 4: Staging

Path:

- `src/staging/`

Purpose:

- defines generic deployable-flow metadata contracts
- creates binding-aware render contexts
- renders staged flow artifacts and manifests for review

Mental model:

```text
Staging = the review boundary between design and deployment
```

### Layer 5: Examples

Path:

- `src/examples/`

Purpose:

- shows how to assemble real flows with the package
- gives you runnable starting points

Mental model:

```text
Example = runnable package usage that can print JSON, generate files, or stage artifacts
```

## Architecture Diagram

```text
src/examples/*.ts
  imports from src/index.ts

src/index.ts
  exports the public package API

src/index.ts
  -> src/actions/         single-block builders
  -> src/composites/      reusable multi-block segments
  -> src/staging/         deployable-flow staging and manifest rendering
  -> src/core/            flow engine, types, registry, validators

FlowBuilder.build()
  -> validates the flow
  -> returns BuiltFlow

BuiltFlow.toJsonString()
  -> prints Amazon Connect JSON

renderFlowCatalog(...)
  -> renders staged artifacts and manifest data
```

## What This Repo Does Not Do

This repo does not:

- contain CDK deployment stacks
- contain repo-specific consumer factories
- deploy to AWS by itself

If you need deployment, a separate consumer repo should:

- import this package
- define its own production flow catalog
- bind real environment values
- optionally render staged artifacts for review
- deploy with its own tooling such as CDK

This repo can generate JSON files locally.

It can also render staged flow artifacts locally.

What it does not do is deploy those files or artifacts to AWS.

## Your Normal Workflow

Use this sequence whenever you work in the package.

### Step 1: Install Dependencies

From the repo root:

```bash
npm install
```

### Step 2: Typecheck The Package

```bash
npm run check
```

Success means:

- no TypeScript errors

### Step 3: Run The Full Test Suite

```bash
npm run test
```

Success means:

- action tests pass
- registry tests pass
- catalog tests pass

### Step 4: Run An Example Flow

```bash
npm run example:branching
```

Success means:

- a JSON flow prints to the terminal

### Step 5: Run The Staging Example

```bash
npm run example:staging
```

Success means:

- a staged flow artifact directory is written locally
- a manifest is printed to the terminal
- unresolved placeholders are visible for review

The current default staging example writes to:

```text
generated-flow-staging/dev/
```

### Step 6: Generate JSON Files

```bash
npm run generate
```

Success means:

- a `generated-flows/` folder exists at repo root
- JSON flow files are written into that folder
- each file contains a full Amazon Connect flow definition

Use this when you want example flow JSON files written directly.

Use `npm run example:staging` when you want a reviewable staged flow catalog and manifest instead.

## How To Read A Flow Example

Open one of these files:

- `src/examples/branching-on-input.ts`
- `src/examples/task-routing-loop.ts`
- `src/examples/case-profile-operations.ts`
- `src/examples/staged-flow-catalog.ts`

Most examples follow this pattern:

```text
1. create action builders
2. set parameters on each action
3. connect actions with next/error/condition transitions
4. add the actions to FlowBuilder
5. print flow.toJsonString()
```

That is the main authoring pattern for this package.

The staged catalog example adds a second pattern:

```text
1. define a FlowCatalog
2. provide placeholder-based bindings
3. render staged artifacts
4. write artifacts and manifest to disk
```

That is the main review-before-deploy pattern for this package.

## Proven Inbound Queueing Pattern

For a basic inbound contact flow that hands a caller to a queue, the current proven package shape is:

```text
MessageParticipant
  -> Set customer queue flow
  -> Set working queue
  -> TransferContactToQueue
```

In package terms that means:

1. `SetCustomerQueueFlowActionBuilder`
2. `UpdateContactTargetQueueActionBuilder`
3. `TransferContactToQueueActionBuilder`

Important rules:

- use the customer queue flow ARN for the customer queue hook
- use the queue ARN for `UpdateContactTargetQueue`
- set explicit error branches on both setup actions
- keep `QueueAtCapacity` plus the default error branch on `TransferContactToQueue`
- if you want the package’s current reference implementation, start from `src/examples/staged-flow-catalog.ts`

## Step-By-Step: Create A New Flow Example

This is the safest way to add a new flow in this repo.

### Step 0: Pick A Clear Name

Pick three names before you write code:

1. file name
2. flow name
3. npm script name

Example:

```text
File:       src/examples/customer-returns.ts
Flow name:  CustomerReturns
Script:     example:returns
```

Keep names stable once you choose them.

### Step 1: Create The Example File

Create a new file under:

```text
src/examples/
```

Example:

```text
src/examples/customer-returns.ts
```

### Step 2: Start From A Small Working Template

Use this pattern:

```ts
import {
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  MessageParticipantActionBuilder,
} from "../index.js";

const greeting = new MessageParticipantActionBuilder("Greeting")
  .text("Welcome to customer returns.")
  .next("Disconnect")
  .onError("Disconnect")
  .build();

const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

const flow = new FlowBuilder("CustomerReturns")
  .startWith(greeting)
  .add(disconnect)
  .build();

console.log(flow.toJsonString());
```

What this does:

- creates one prompt block
- creates one disconnect block
- links them together
- validates the flow
- prints JSON

### Step 3: Add More Actions Gradually

Do not try to build a huge flow all at once.

Safer pattern:

1. start with two actions
2. run `npm run check`
3. run the example file
4. add one more action
5. repeat

That keeps mistakes small and easy to find.

### Step 4: Add A Script To `package.json`

Add a new script under `scripts`.

Pattern:

```json
"example:returns": "node ./dist/examples/customer-returns.js"
```

### Step 5: Build The Package

```bash
npm run build
```

What this does:

```text
src/*.ts
  -> compiles into dist/*.js
```

### Step 6: Run The New Example

```bash
npm run example:returns
```

Success means:

- valid Amazon Connect JSON prints to the terminal

### Step 7: Generate The Example As A File

```bash
npm run generate
```

Then inspect the generated file in:

```text
generated-flows/customer-returns.json
```

### Step 8: Inspect The Output

Check these things in the printed JSON or generated file:

1. `Version` exists
2. `StartAction` points to a real action
3. action IDs are readable
4. transitions point to real action IDs
5. parameters look like real Connect parameters

If you are using staged artifacts instead of direct generated example JSON, also check:

1. `manifest.json` exists
2. flow keys and flow types are what you expected
3. referenced flow keys are correct
4. unresolved placeholders are expected and reviewable
5. staged filenames are stable and readable

## How To Create A Reusable Composite

Create a composite only when you see the same multi-step pattern more than once.

Good reasons:

- the same prompt-and-input sequence appears in several flows
- the same queue handoff sequence appears in several flows
- the same fallback pattern appears in several flows

A good composite should:

- accept input through props
- return a reusable flow segment
- hide repetition, not hide important meaning

Mental model:

```text
If you repeat a three-to-six action pattern more than once,
consider a composite.
```

## How To Add A New Action Builder

Only do this when the package does not already support the Connect action you need.

You will usually touch four places:

1. `src/core/types.ts`
2. `src/core/actions/<category>/...`
3. `src/actions/<category>/...`
4. `src/index.ts`

Sometimes you will also update:

- `src/core/validators.ts`
- `src/catalog/connect-action-catalog.ts`
- `tests/actions.test.mjs`
- `tests/registry.test.mjs`

Safe order:

1. add the action definition
2. add the builder
3. export it
4. add validation if needed
5. add tests
6. run `npm run test`

## Common Mistakes

### Mistake 1: Editing `dist/`

Problem:

- your changes disappear on the next build

Correct action:

- edit `src/` instead

### Mistake 2: Adding Too Much At Once

Problem:

- it becomes hard to know what broke

Correct action:

- add one action or one transition at a time

### Mistake 3: Using Vague Action IDs

Problem:

- the flow becomes harder to read and debug

Bad examples:

- `Step1`
- `Node2`
- `Thing`

Better examples:

- `Greeting`
- `GetCustomerInput`
- `TransferContactToQueue`
- `Disconnect`

### Mistake 4: Thinking Local Validation Means AWS Will Always Accept The Flow

This package validates structure very well.

But Amazon Connect is still the final semantic validator.

Mental model:

```text
Package validation = strong local safety check
AWS Connect = final source of truth
```

### Mistake 5: Changing Several Files Without Running Checks

Correct habit:

- run `npm run check` often
- run `npm run test` before you stop

### Mistake 6: Treating Staged Artifacts As The Source Of Truth

Problem:

- the staged JSON becomes a hand-maintained pseudo-source

Correct action:

- treat flow code and flow catalog definitions as the source of truth
- treat staged artifacts as review output

## Quick Checklist

Use this every time.

1. open an existing example similar to what you want
2. copy its structure, not its exact business meaning
3. create your new example in `src/examples/`
4. add actions gradually
5. add a script in `package.json`
6. run `npm run build`
7. run your example script
8. run `npm run example:staging` if you want staged review artifacts
9. run `npm run generate` if you want example JSON files written to disk
10. inspect the output and manifest
11. run `npm run test`

## When You Should Ask For Help

Pause and ask for help if:

- you are unsure whether something belongs in `actions/` or `composites/`
- you are unsure whether something belongs in the package staging layer or in a consumer repo
- you need a brand-new Connect action not yet in the package
- you are changing validation rules and are not sure which tests should move
- AWS Connect rejects a flow even though local tests pass

## Summary

The safe workflow is:

```text
edit src/
  -> run npm run check
  -> run npm run build
  -> run a portable example script, npm run example:staging, or npm run generate
  -> inspect JSON and staged artifacts
  -> run npm run test
```

If you follow that order, you will usually stay out of trouble.
