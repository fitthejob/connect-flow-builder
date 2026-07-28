import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createFlowBuildContext,
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  MessageParticipantActionBuilder,
  TransferToFlowActionBuilder,
  renderFlowCatalog,
  writeRenderedFlowCatalog,
} from "../dist/index.js";
import {
  stagedFlowCatalogExample,
  stagedFlowCatalogExampleBindings,
} from "../dist/examples/staged-flow-catalog.js";

function buildAfterHoursFlow() {
  const greeting = new MessageParticipantActionBuilder("AfterHoursGreeting")
    .text("We are currently closed.")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  return new FlowBuilder("AfterHoursQueue")
    .startWith(greeting)
    .add(disconnect)
    .build();
}

test("createFlowBuildContext resolves typed bindings and fails clearly on missing keys", () => {
  const context = createFlowBuildContext("dev", {
    queues: { support: "arn:aws:connect:queue/support" },
    flowIds: { afterHours: "${Flow.afterHours.Id}" },
    custom: { brandName: "ExampleCo" },
  });

  assert.equal(context.environment, "dev");
  assert.equal(
    context.refs.queueArn("support"),
    "arn:aws:connect:queue/support",
  );
  assert.equal(
    context.refs.flowId("afterHours"),
    "${Flow.afterHours.Id}",
  );
  assert.equal(context.refs.custom("brandName"), "ExampleCo");
  assert.throws(
    () => context.refs.lambdaArn("agentAssist"),
    /Missing lambdas binding for key "agentAssist"\./,
  );
});

test("renderFlowCatalog produces staged artifacts and a manifest with unresolved placeholder tracking", () => {
  const catalog = [
    {
      key: "afterHours",
      name: "AfterHoursQueue",
      type: "CUSTOMER_QUEUE",
      filename: "after-hours-queue.json",
      tags: { tier: "shared" },
      build: () => buildAfterHoursFlow(),
    },
    {
      key: "mainInbound",
      name: "MainInbound",
      type: "CONTACT_FLOW",
      filename: "main-inbound.json",
      dependsOnFlows: ["afterHours"],
      build: (context) => {
        const greeting = new MessageParticipantActionBuilder("Greeting")
          .text(`Welcome to ${context.refs.custom("brandName")}.`)
          .next("AfterHoursTransfer")
          .build();

        const transfer = new TransferToFlowActionBuilder("AfterHoursTransfer")
          .contactFlowId(context.refs.flowId("afterHours"))
          .build();

        return new FlowBuilder("MainInbound")
          .startWith(greeting)
          .add(transfer)
          .build();
      },
    },
  ];

  const result = renderFlowCatalog({
    catalog,
    environment: "dev",
    bindings: {
      custom: {
        brandName: "ExampleCo",
      },
      flowIds: {
        afterHours: "${Flow.afterHours.Id}",
      },
    },
  });

  assert.equal(result.artifacts.length, 2);
  assert.equal(result.manifest.environment, "dev");
  assert.equal(result.manifest.flowCount, 2);

  const inboundArtifact = result.artifacts.find(
    (artifact) => artifact.key === "mainInbound",
  );

  assert.ok(inboundArtifact);
  assert.equal(inboundArtifact.type, "CONTACT_FLOW");
  assert.deepEqual(inboundArtifact.referencedFlowKeys, ["afterHours"]);
  assert.deepEqual(inboundArtifact.unresolvedPlaceholders, [
    "${Flow.afterHours.Id}",
  ]);
  assert.match(inboundArtifact.content, /Welcome to ExampleCo\./);
  assert.match(inboundArtifact.content, /\$\{Flow\.afterHours\.Id\}/);

  const tempDir = mkdtempSync(path.join(os.tmpdir(), "flow-builder-stage-"));
  writeRenderedFlowCatalog(tempDir, result);

  assert.equal(existsSync(path.join(tempDir, "manifest.json")), true);
  assert.equal(
    existsSync(path.join(tempDir, "main-inbound.json")),
    true,
  );
  assert.equal(
    existsSync(path.join(tempDir, "after-hours-queue.json")),
    true,
  );

  const manifest = JSON.parse(
    readFileSync(path.join(tempDir, "manifest.json"), "utf8"),
  );

  assert.equal(manifest.environment, "dev");
  assert.equal(manifest.flowCount, 2);
  assert.deepEqual(
    manifest.flows.find((flow) => flow.key === "mainInbound")
      .unresolvedPlaceholders,
    ["${Flow.afterHours.Id}"],
  );
});

test("renderFlowCatalog rejects flow dependency cycles", () => {
  assert.throws(
    () =>
      renderFlowCatalog({
        catalog: [
          {
            key: "a",
            name: "FlowA",
            type: "CONTACT_FLOW",
            filename: "a.json",
            dependsOnFlows: ["b"],
            build: () => buildAfterHoursFlow(),
          },
          {
            key: "b",
            name: "FlowB",
            type: "CONTACT_FLOW",
            filename: "b.json",
            dependsOnFlows: ["a"],
            build: () => buildAfterHoursFlow(),
          },
        ],
        environment: "dev",
      }),
    /Flow dependency cycle detected: a -> b -> a\./,
  );
});

test("staged flow catalog example preserves the proven inbound queueing pattern", () => {
  const result = renderFlowCatalog({
    catalog: stagedFlowCatalogExample,
    environment: "dev",
    bindings: stagedFlowCatalogExampleBindings,
  });

  const inboundArtifact = result.artifacts.find(
    (artifact) => artifact.key === "mainInbound",
  );

  assert.ok(inboundArtifact);
  assert.deepEqual(inboundArtifact.referencedFlowKeys, [
    "supportQueueExperience",
  ]);
  assert.deepEqual(
    [...inboundArtifact.unresolvedPlaceholders].sort(),
    ["${Flow.supportQueueExperience.Arn}", "${Queue.support.Arn}"].sort(),
  );

  const flowDefinition = JSON.parse(inboundArtifact.content);
  const actionsById = Object.fromEntries(
    flowDefinition.Actions.map((action) => [action.Identifier, action]),
  );

  assert.deepEqual(actionsById.SetSupportQueueFlow, {
    Identifier: "SetSupportQueueFlow",
    Type: "UpdateContactEventHooks",
    Parameters: {
      EventHooks: {
        CustomerQueue: "${Flow.supportQueueExperience.Arn}",
      },
    },
    Transitions: {
      NextAction: "SetWorkingQueue",
      Errors: [
        {
          NextAction: "Disconnect",
          ErrorType: "NoMatchingError",
        },
      ],
    },
  });

  assert.deepEqual(actionsById.SetWorkingQueue, {
    Identifier: "SetWorkingQueue",
    Type: "UpdateContactTargetQueue",
    Parameters: {
      QueueId: "${Queue.support.Arn}",
    },
    Transitions: {
      NextAction: "TransferToSupport",
      Errors: [
        {
          NextAction: "Disconnect",
          ErrorType: "NoMatchingError",
        },
      ],
    },
  });

  assert.deepEqual(actionsById.TransferToSupport, {
    Identifier: "TransferToSupport",
    Type: "TransferContactToQueue",
    Parameters: {},
    Transitions: {
      NextAction: "Disconnect",
      Errors: [
        {
          NextAction: "Disconnect",
          ErrorType: "QueueAtCapacity",
        },
        {
          NextAction: "Disconnect",
          ErrorType: "NoMatchingError",
        },
      ],
    },
  });
});
