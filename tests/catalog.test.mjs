import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  AMAZON_CONNECT_ACTION_CATEGORIES,
  FLOW_DESIGNER_UI_CATEGORIES,
  amazonConnectActionCatalog,
  amazonConnectActionCatalogByCategory,
  blockedAmazonConnectActions,
  implementedActionBuilderAmazonConnectActions,
  implementedAmazonConnectActions,
  implementedCompositeAmazonConnectActions,
  implementableNowAmazonConnectActions,
  supportedActionTypes,
} from "../dist/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

test("the unified catalog is unique and grouped by the expected categories", () => {
  const actionNames = amazonConnectActionCatalog.map((entry) => entry.awsAction);

  assert.equal(new Set(actionNames).size, actionNames.length);

  for (const entry of amazonConnectActionCatalog) {
    const docUrls = entry.docs.map((doc) => doc.url);
    assert.equal(new Set(docUrls).size, docUrls.length);
  }

  for (const category of AMAZON_CONNECT_ACTION_CATEGORIES) {
    assert.ok(amazonConnectActionCatalogByCategory[category].length > 0);
    assert.ok(
      amazonConnectActionCatalogByCategory[category].every(
        (entry) => entry.category === category,
      ),
    );
  }
});

test("every Flow Designer UI category from the operator list is represented", () => {
  for (const category of FLOW_DESIGNER_UI_CATEGORIES) {
    assert.ok(
      amazonConnectActionCatalogByCategory[category].some(
        (entry) => entry.categorySource === "ui",
      ),
    );
  }
});

test("implemented action-builder catalog entries stay aligned with the portable package registry", () => {
  const implementedTypes = implementedActionBuilderAmazonConnectActions.map(
    (entry) => entry.packageCoverage.packageActionType ?? entry.awsAction,
  );

  assert.deepEqual(
    [...new Set(implementedTypes)].sort(),
    [...supportedActionTypes].sort(),
  );
});

test("implemented catalog surface counts distinguish builder-backed and composite-backed entries", () => {
  assert.equal(implementedAmazonConnectActions.length, 69);
  assert.equal(implementedActionBuilderAmazonConnectActions.length, 68);
  assert.equal(implementedCompositeAmazonConnectActions.length, 1);
});

test("non-implemented catalog entries distinguish implementable-now gaps from blocked gaps", () => {
  assert.equal(implementableNowAmazonConnectActions.length, 0);
  assert.equal(blockedAmazonConnectActions.length, 0);
});

test("TransferContactToQueue is cataloged under its underlying AWS action name", () => {
  const transferEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "TransferContactToQueue",
  );

  assert.ok(transferEntry);
  assert.equal(transferEntry.category, "TERMINATE");
  assert.deepEqual(transferEntry.uiEquivalents, ["Transfer to queue"]);
  assert.equal(transferEntry.packageCoverage.status, "implemented");
  assert.equal(
    transferEntry.packageCoverage.packageActionType,
    "TransferContactToQueue",
  );
  assert.equal(
    transferEntry.packageCoverage.builderClassName,
    "TransferContactToQueueActionBuilder",
  );
  assert.match(transferEntry.packageCoverage.notes, /Set the working queue first/i);
});

test("TransferParticipantToThirdParty remains mapped to the Transfer to phone number UI block", () => {
  const transferPhoneEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "TransferParticipantToThirdParty",
  );

  assert.ok(transferPhoneEntry);
  assert.equal(transferPhoneEntry.category, "TERMINATE");
  assert.deepEqual(transferPhoneEntry.uiEquivalents, ["Transfer to phone number"]);
  assert.equal(transferPhoneEntry.packageCoverage.status, "implemented");
  assert.equal(
    transferPhoneEntry.packageCoverage.packageActionType,
    "TransferParticipantToThirdParty",
  );
  assert.equal(
    transferPhoneEntry.packageCoverage.builderClassName,
    "TransferParticipantToThirdPartyActionBuilder",
  );
});

test("AuthenticateParticipant remains mapped to the Authenticate Customer UI block", () => {
  const authenticateEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "AuthenticateParticipant",
  );

  assert.ok(authenticateEntry);
  assert.equal(authenticateEntry.category, "INTERACT");
  assert.deepEqual(authenticateEntry.uiEquivalents, ["Authenticate Customer"]);
  assert.equal(authenticateEntry.packageCoverage.status, "implemented");
  assert.equal(
    authenticateEntry.packageCoverage.packageActionType,
    "AuthenticateParticipant",
  );
});

test("CreatePersistentContactAssociation remains mapped to the Flow Designer persistent-chat block", () => {
  const persistentChatEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "CreatePersistentContactAssociation",
  );

  assert.ok(persistentChatEntry);
  assert.equal(persistentChatEntry.category, "INTERACT");
  assert.deepEqual(persistentChatEntry.uiEquivalents, [
    "Create persistent contact association",
  ]);
  assert.equal(persistentChatEntry.packageCoverage.status, "implemented");
  assert.equal(
    persistentChatEntry.packageCoverage.packageActionType,
    "CreatePersistentContactAssociation",
  );
  assert.ok(
    persistentChatEntry.docs.some((doc) => doc.kind === "api-reference"),
  );
});

test("LoadContactContent remains mapped to the Get stored content UI block", () => {
  const storedContentEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "LoadContactContent",
  );

  assert.ok(storedContentEntry);
  assert.equal(storedContentEntry.category, "INTERACT");
  assert.deepEqual(storedContentEntry.uiEquivalents, ["Get stored content"]);
  assert.equal(storedContentEntry.packageCoverage.status, "implemented");
  assert.equal(
    storedContentEntry.packageCoverage.packageActionType,
    "LoadContactContent",
  );
});

test("Store customer input remains mapped to GetParticipantInput through the custom-digit wrapper", () => {
  const storeCustomerInputEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Store customer input",
  );

  assert.ok(storeCustomerInputEntry);
  assert.equal(storeCustomerInputEntry.category, "INTERACT");
  assert.equal(storeCustomerInputEntry.underlyingAwsAction, "GetParticipantInput");
  assert.equal(storeCustomerInputEntry.packageCoverage.status, "implemented");
  assert.equal(
    storeCustomerInputEntry.packageCoverage.builderClassName,
    "StoreCustomerInputActionBuilder",
  );
});

test("Set Touchtone Buffer Behavior remains mapped to GetParticipantInput through the touchtone-buffer wrapper", () => {
  const touchtoneBufferEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Set Touchtone Buffer Behavior",
  );

  assert.ok(touchtoneBufferEntry);
  assert.equal(touchtoneBufferEntry.category, "SET");
  assert.equal(touchtoneBufferEntry.underlyingAwsAction, "GetParticipantInput");
  assert.equal(touchtoneBufferEntry.packageCoverage.status, "implemented");
  assert.equal(
    touchtoneBufferEntry.packageCoverage.builderClassName,
    "SetTouchtoneBufferBehaviorActionBuilder",
  );
});

test("data table actions remain mapped to the proven exported underlying action names", () => {
  const evaluateEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "EvaluateDataTableValues",
  );
  const listEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "ListDataTableValues",
  );
  const upsertEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "UpsertDataTableValues",
  );

  assert.ok(evaluateEntry);
  assert.equal(evaluateEntry.category, "INTEGRATE");
  assert.deepEqual(evaluateEntry.uiEquivalents, ["Data Table"]);
  assert.equal(evaluateEntry.packageCoverage.status, "implemented");
  assert.equal(
    evaluateEntry.packageCoverage.builderClassName,
    "EvaluateDataTableValuesActionBuilder",
  );

  assert.ok(listEntry);
  assert.equal(listEntry.category, "INTEGRATE");
  assert.deepEqual(listEntry.uiEquivalents, ["Data Table"]);
  assert.equal(listEntry.packageCoverage.status, "implemented");
  assert.equal(
    listEntry.packageCoverage.builderClassName,
    "ListDataTableValuesActionBuilder",
  );

  assert.ok(upsertEntry);
  assert.equal(upsertEntry.category, "INTEGRATE");
  assert.deepEqual(upsertEntry.uiEquivalents, ["Data Table"]);
  assert.equal(upsertEntry.packageCoverage.status, "implemented");
  assert.equal(
    upsertEntry.packageCoverage.builderClassName,
    "UpsertDataTableValuesActionBuilder",
  );
});

test("Connect assistant remains mapped to the CreateWisdomSession plus UpdateContactData composite", () => {
  const connectAssistantEntry = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Connect assistant",
  );

  assert.ok(connectAssistantEntry);
  assert.equal(
    connectAssistantEntry.underlyingAwsAction,
    "CreateWisdomSession + UpdateContactData",
  );
  assert.equal(connectAssistantEntry.packageCoverage.status, "implemented");
  assert.equal(
    connectAssistantEntry.packageCoverage.packageSurfaceKind,
    "composite-helper",
  );
  assert.equal(
    connectAssistantEntry.packageCoverage.packageExportName,
    "buildConnectAssistant",
  );
});

test("admin-guide-only surfaces are surfaced in the unified catalog", () => {
  const missingFromOldCatalog = [
    "Set customer queue flow",
    "Set disconnect flow",
    "Set whisper flow",
    "EvaluateDataTableValues",
    "ListDataTableValues",
    "UpsertDataTableValues",
    "TransferParticipantToThirdParty",
  ];

  for (const actionName of missingFromOldCatalog) {
    const entry = amazonConnectActionCatalog.find(
      (candidate) => candidate.awsAction === actionName,
    );

    assert.ok(entry, `${actionName} should exist in the unified catalog`);
    assert.ok(entry.docs.some((doc) => doc.kind === "admin-guide"));
  }
});

test("designer-block wrappers only claim an underlying AWS action when it is proven", () => {
  const setCustomerQueueFlow = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Set customer queue flow",
  );
  const connectAssistant = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Connect assistant",
  );
  const setDisconnectFlow = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Set disconnect flow",
  );
  const setWhisperFlow = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Set whisper flow",
  );
  const setTouchtoneBufferBehavior = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "Set Touchtone Buffer Behavior",
  );
  const transferParticipantToThirdParty = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "TransferParticipantToThirdParty",
  );

  assert.ok(setCustomerQueueFlow);
  assert.equal(setCustomerQueueFlow.underlyingAwsAction, "UpdateContactEventHooks");
  assert.equal(setCustomerQueueFlow.packageCoverage.status, "implemented");
  assert.equal(
    setCustomerQueueFlow.packageCoverage.packageSurfaceKind,
    "ui-wrapper-builder",
  );
  assert.equal(
    setCustomerQueueFlow.packageCoverage.packageExportName,
    "SetCustomerQueueFlowActionBuilder",
  );

  assert.ok(connectAssistant);
  assert.equal(
    connectAssistant.underlyingAwsAction,
    "CreateWisdomSession + UpdateContactData",
  );
  assert.equal(connectAssistant.packageCoverage.status, "implemented");
  assert.equal(
    connectAssistant.packageCoverage.packageSurfaceKind,
    "composite-helper",
  );

  assert.ok(setDisconnectFlow);
  assert.equal(setDisconnectFlow.underlyingAwsAction, "UpdateContactEventHooks");
  assert.equal(setDisconnectFlow.packageCoverage.status, "implemented");
  assert.equal(
    setDisconnectFlow.packageCoverage.packageSurfaceKind,
    "ui-wrapper-builder",
  );
  assert.equal(
    setDisconnectFlow.packageCoverage.packageExportName,
    "SetDisconnectFlowActionBuilder",
  );

  assert.ok(setWhisperFlow);
  assert.equal(setWhisperFlow.underlyingAwsAction, "UpdateContactEventHooks");
  assert.equal(setWhisperFlow.packageCoverage.status, "implemented");
  assert.equal(
    setWhisperFlow.packageCoverage.packageSurfaceKind,
    "ui-wrapper-builder",
  );
  assert.equal(
    setWhisperFlow.packageCoverage.packageExportName,
    "SetWhisperFlowActionBuilder",
  );

  assert.ok(setTouchtoneBufferBehavior);
  assert.equal(
    setTouchtoneBufferBehavior.underlyingAwsAction,
    "GetParticipantInput",
  );
  assert.equal(setTouchtoneBufferBehavior.packageCoverage.status, "implemented");
  assert.equal(
    setTouchtoneBufferBehavior.packageCoverage.packageSurfaceKind,
    "ui-wrapper-builder",
  );
  assert.equal(
    setTouchtoneBufferBehavior.packageCoverage.packageExportName,
    "SetTouchtoneBufferBehaviorActionBuilder",
  );

  assert.ok(transferParticipantToThirdParty);
  assert.equal(transferParticipantToThirdParty.underlyingAwsAction, undefined);
  assert.equal(transferParticipantToThirdParty.packageCoverage.status, "implemented");
  assert.equal(
    transferParticipantToThirdParty.packageCoverage.packageExportName,
    "TransferParticipantToThirdPartyActionBuilder",
  );
});

test("UpdateContactEventHooks reflects all implemented hook-setting UI surfaces", () => {
  const updateContactEventHooks = amazonConnectActionCatalog.find(
    (entry) => entry.awsAction === "UpdateContactEventHooks",
  );

  assert.ok(updateContactEventHooks);
  assert.deepEqual(updateContactEventHooks.uiEquivalents, [
    "Set event flow",
    "Set customer queue flow",
    "Set disconnect flow",
    "Set whisper flow",
  ]);
  assert.match(
    updateContactEventHooks.packageCoverage.notes ?? "",
    /customer queue, disconnect, and whisper hook wrappers/i,
  );
});

test("generated catalog artifacts are rendered from the source catalog", () => {
  const generatedJsonPath = path.join(
    packageRoot,
    "dist",
    "catalog",
    "connect-action-catalog.json",
  );
  const generatedDocPath = path.join(
    packageRoot,
    "docs",
    "connect-action-catalog.md",
  );

  assert.equal(existsSync(generatedJsonPath), true);
  assert.equal(existsSync(generatedDocPath), true);

  const generatedJson = JSON.parse(readFileSync(generatedJsonPath, "utf8"));
  const generatedDoc = readFileSync(generatedDocPath, "utf8");

  assert.equal(generatedJson.length, amazonConnectActionCatalog.length);
  assert.match(
    generatedDoc,
    /This file is generated from `src\/catalog\/connect-action-catalog\.ts`\./,
  );
  assert.match(generatedDoc, /## INTERACT/);
  assert.match(generatedDoc, /Authenticate Customer/);
  assert.match(generatedDoc, /CreatePersistentContactAssociation/);
  assert.match(generatedDoc, /LoadContactContent/);
  assert.match(generatedDoc, /Set event flow`, `Set customer queue flow`, `Set disconnect flow`, `Set whisper flow/);
  assert.match(generatedDoc, /TransferContactToQueue/);
  assert.match(generatedDoc, /Implementable-now package entries/);
  assert.match(generatedDoc, /Underlying AWS action/);
  assert.match(generatedDoc, /Implemented action-builder-backed surfaces/);
  assert.match(generatedDoc, /Package surface kind/);
  assert.match(generatedDoc, /Package export/);
});
