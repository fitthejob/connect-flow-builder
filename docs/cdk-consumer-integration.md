# Flow Builder CDK Consumer Integration

This document shows the recommended v1 integration pattern for using `flow-builder` inside a CDK repo without pulling CDK assumptions into the package itself.

Use this document together with:

- `docs/v1-boundary.md`
- `src/examples/staged-flow-catalog.ts`

## Core Pattern

The package should be used in two phases:

```text
design and stage flows first
deploy flows second
```

That means:

1. a flow catalog defines deployable flows and their top-level flow types
2. staged artifacts are written to disk for review
3. a consumer CDK stack uses the same flow catalog and real bindings to deploy

## Package Example

This repo includes a runnable example at:

- `src/examples/staged-flow-catalog.ts`

It demonstrates:

- one `CONTACT_FLOW`
- one `CUSTOMER_QUEUE` flow
- one inter-flow customer queue binding via `flowArn`
- one external queue ARN binding supplied as a placeholder
- the proven inbound queue handoff sequence:
  `Set customer queue flow` -> `Set working queue` -> `TransferContactToQueue`
- staged artifact output plus `manifest.json`

Run it with:

```bash
npm run example:staging
```

Optional arguments:

```bash
npm run build
node ./dist/examples/staged-flow-catalog.js dev
node ./dist/examples/staged-flow-catalog.js stage ./my-staging-dir/stage
```

By default it writes to:

```text
generated-flow-staging/<environment>/
```

## Consumer Repo Shape

A CDK repo should keep its production flow definitions and deployment wiring local.

Recommended shape:

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

## Step 1: Define The Flow Catalog In The Consumer Repo

The package may provide the generic `FlowSpec` contract, but the actual production flow catalog should live in the consumer repo.

A consumer catalog should look conceptually like:

```ts
import type { FlowCatalog } from "connect-flow-builder";

export const flowCatalog: FlowCatalog = [
  {
    key: "supportQueueExperience",
    name: "SupportQueueExperience",
    type: "CUSTOMER_QUEUE",
    filename: "support-queue-experience.json",
    build: (ctx) => buildSupportQueueExperience(ctx),
  },
  {
    key: "mainInbound",
    name: "MainInbound",
    type: "CONTACT_FLOW",
    filename: "main-inbound.json",
    dependsOnFlows: ["supportQueueExperience"],
    build: (ctx) => buildMainInbound(ctx),
  },
];
```

The important rule is:

```text
stable flow keys are the source of truth for cross-flow references
```

## Step 2: Define Staging Bindings

During staging, use readable placeholders rather than final environment values.

Example:

```ts
import type { FlowBindings } from "connect-flow-builder";

export const devStagingBindings: FlowBindings = {
  queues: {
    support: "${Queue.support.Arn}",
  },
  flowArns: {
    supportQueueExperience: "${Flow.supportQueueExperience.Arn}",
  },
};
```

This keeps staged JSON reviewable and environment-safe.

## Step 3: Add A Small Consumer Script

The consumer repo should own the exact staging location and review workflow.

Example:

```ts
import path from "node:path";

import {
  renderFlowCatalog,
  writeRenderedFlowCatalog,
} from "connect-flow-builder";

import { flowCatalog } from "../src/connect/flows/catalog.js";
import { devStagingBindings } from "../src/connect/flows/bindings.js";

const environment = process.argv[2] ?? "dev";
const outputDir = path.resolve(
  ".staging",
  "contact-flows",
  environment,
);

const result = renderFlowCatalog({
  catalog: flowCatalog,
  environment,
  bindings: devStagingBindings,
});

writeRenderedFlowCatalog(outputDir, result);
console.log(`Staged flows into ${outputDir}`);
```

## Step 4: Deploy From CDK

The package should not own CDK constructs.

The consumer repo should:

1. collect real stack refs from queues, Lambdas, Lex aliases, prompts, and other Connect resources
2. build a deploy-time substitution map
3. create `aws_connect.CfnContactFlow` resources from the same catalog

The CDK stack should use the same flow catalog, but bind real values instead of review placeholders.

Conceptually:

```ts
import { Fn, Stack } from "aws-cdk-lib";
import { aws_connect as connect } from "aws-cdk-lib";

import { renderFlowCatalog } from "connect-flow-builder";

const result = renderFlowCatalog({
  catalog: flowCatalog,
  environment: "dev",
  bindings: {
    queues: {
      support: "${Queue.support.Arn}",
    },
    flowArns: {
      supportQueueExperience: "${Flow.supportQueueExperience.Arn}",
    },
  },
});

for (const artifact of result.artifacts) {
  new connect.CfnContactFlow(this, artifact.key, {
    instanceArn: props.instanceArn,
    name: artifact.name,
    type: artifact.type,
    description: artifact.description,
    state: artifact.state,
    content: Fn.sub(artifact.content, {
      "Queue.support.Arn": props.supportQueue.queueArn,
      "Flow.supportQueueExperience.Arn":
        props.supportQueueExperienceFlowArn,
    }),
    tags: Object.entries(artifact.tags).map(([key, value]) => ({
      key,
      value,
    })),
  });
}
```

Exact deployment wiring will vary by repo.

The package should stay neutral about:

- stack names
- stack topology
- CI/CD workflow
- output directory retention policy

## Recommended Review Boundary

The cleanest review flow is:

```text
author flow definitions
  -> render staged artifacts to disk
  -> review JSON and manifest
  -> synth CDK
  -> deploy from the consumer repo
```

Recommended staged layout:

```text
.staging/contact-flows/
  dev/
    manifest.json
    main-inbound.json
    support-queue-experience.json
  stage/
  prod/
```

## Why This Pattern Is Recommended

This pattern is the current best fit because it preserves all of the following:

- the package remains repo agnostic
- the package remains deployment-tool agnostic
- staged artifacts are reviewable before deploy
- the same flow definitions can be used across `dev`, `stage`, and `prod`
- a CDK repo can wire real refs without modifying package internals

## Practical Summary

Use this mental model:

```text
flow-builder defines and stages flows
the consumer repo binds real values
the consumer repo deploys with CDK
the same flow catalog drives both review and deployment
```

## Proven Inbound Queue Pattern

For an inbound flow that needs live queueing, the current export-backed pattern is:

1. `SetCustomerQueueFlowActionBuilder`
2. `UpdateContactTargetQueueActionBuilder`
3. `TransferContactToQueueActionBuilder`

Important details:

- bind the customer queue flow by ARN, not flow ID
- set the working queue before `TransferContactToQueue`
- keep explicit error branches on the setup actions
- keep both `QueueAtCapacity` and default error branches on `TransferContactToQueue`
- the package example in `src/examples/staged-flow-catalog.ts` is the current reference shape
