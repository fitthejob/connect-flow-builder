import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  DisconnectParticipantActionBuilder,
  FlowBuilder,
  MessageParticipantActionBuilder,
  SetCustomerQueueFlowActionBuilder,
  TransferContactToQueueActionBuilder,
  UpdateContactTargetQueueActionBuilder,
  renderFlowCatalog,
  writeRenderedFlowCatalog,
  type FlowBindings,
  type FlowCatalog,
} from "../index.js";

export const stagedFlowCatalogExampleBindings: FlowBindings = {
  queues: {
    support: "${Queue.support.Arn}",
  },
  flowArns: {
    supportQueueExperience: "${Flow.supportQueueExperience.Arn}",
  },
  custom: {
    brandName: "ExampleCo",
  },
};

export const stagedFlowCatalogExample: FlowCatalog = [
  {
    key: "supportQueueExperience",
    name: "SupportQueueExperience",
    type: "CUSTOMER_QUEUE",
    filename: "support-queue-experience.json",
    description: "Example customer queue flow used by the staging API example.",
    tags: {
      example: "true",
      surface: "customer-queue",
    },
    build: () => {
      const queuedPrompt = new MessageParticipantActionBuilder("QueuedPrompt")
        .text("Please hold while we connect you to the next available agent.")
        .next("Disconnect")
        .build();

      const disconnect =
        new DisconnectParticipantActionBuilder("Disconnect").build();

      return new FlowBuilder("SupportQueueExperience")
        .startWith(queuedPrompt)
        .add(disconnect)
        .build();
    },
  },
  {
    key: "mainInbound",
    name: "MainInbound",
    type: "CONTACT_FLOW",
    filename: "main-inbound.json",
    description:
      "Example inbound flow that binds a working queue ARN and an inter-flow customer queue flow ARN.",
    dependsOnFlows: ["supportQueueExperience"],
    tags: {
      example: "true",
      surface: "contact-flow",
    },
    build: (context) => {
      const greeting = new MessageParticipantActionBuilder("Greeting")
        .text(`Welcome to ${context.refs.custom("brandName")}.`)
        .next("SetSupportQueueFlow")
        .build();

      const setSupportQueueFlow = new SetCustomerQueueFlowActionBuilder(
        "SetSupportQueueFlow",
      )
        .customerQueueFlowArn(context.refs.flowArn("supportQueueExperience"))
        .next("SetWorkingQueue")
        .onError("Disconnect")
        .build();

      const setWorkingQueue = new UpdateContactTargetQueueActionBuilder(
        "SetWorkingQueue",
      )
        .queueId(context.refs.queueArn("support"))
        .next("TransferToSupport")
        .onError("Disconnect")
        .build();

      const transfer = new TransferContactToQueueActionBuilder(
        "TransferToSupport",
      )
        .next("Disconnect")
        .onError("Disconnect", "QueueAtCapacity")
        .onError("Disconnect")
        .build();

      const disconnect =
        new DisconnectParticipantActionBuilder("Disconnect").build();

      return new FlowBuilder("MainInbound")
        .startWith(greeting)
        .add(setSupportQueueFlow)
        .add(setWorkingQueue)
        .add(transfer)
        .add(disconnect)
        .build();
    },
  },
] as const;

export function stageExampleFlowCatalog(
  environment = "dev",
  outputDir?: string,
): void {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(moduleDir, "..", "..");
  const resolvedOutputDir = outputDir
    ? path.resolve(outputDir)
    : path.join(repositoryRoot, "generated-flow-staging", environment);

  const result = renderFlowCatalog({
    catalog: stagedFlowCatalogExample,
    environment,
    bindings: stagedFlowCatalogExampleBindings,
  });

  writeRenderedFlowCatalog(resolvedOutputDir, result);

  console.log(
    `Wrote ${result.artifacts.length} staged flow artifacts to ${resolvedOutputDir}`,
  );
  console.log(JSON.stringify(result.manifest, null, 2));
}

const invokedPath = process.argv[1];
const currentFilePath = fileURLToPath(import.meta.url);

if (invokedPath && path.resolve(invokedPath) === path.resolve(currentFilePath)) {
  stageExampleFlowCatalog(process.argv[2] ?? "dev", process.argv[3]);
}
