import assert from "node:assert/strict";
import test from "node:test";

import {
  CHECK_METRIC_DATA_METRIC_TYPES,
  actionDefinitions,
  actionRegistry,
  getActionDefinition,
  supportedActionTypes,
} from "../dist/index.js";

test("supported action types are unique and match the registry keys", () => {
  const uniqueTypes = new Set(supportedActionTypes);

  assert.equal(uniqueTypes.size, supportedActionTypes.length);
  assert.deepEqual(
    [...uniqueTypes].sort(),
    Object.keys(actionRegistry).sort(),
  );
});

test("every registry entry is internally consistent", () => {
  for (const definition of actionDefinitions) {
    assert.equal(actionRegistry[definition.type].type, definition.type);
    assert.equal(getActionDefinition(definition.type).type, definition.type);
    assert.ok(Array.isArray(definition.requiredParameters));
    assert.equal(typeof definition.supportsNextAction, "boolean");
    assert.equal(typeof definition.supportsConditions, "boolean");
    assert.equal(typeof definition.supportsErrors, "boolean");
  }
});

test("required parameter rules remain stable for the currently supported actions", () => {
  assert.deepEqual(getActionDefinition("AssociateContactToCustomerProfile").requiredParameters, [
    "ProfileRequestData",
  ]);
  assert.deepEqual(getActionDefinition("AuthenticateParticipant").requiredParameters, [
    "CognitoConfiguration",
    "CustomerProfilesConfiguration",
    "TimeLimitMinutes",
  ]);
  assert.deepEqual(getActionDefinition("CheckOutboundCallStatus").requiredParameters, []);
  assert.deepEqual(getActionDefinition("CheckHoursOfOperation").requiredParameters, []);
  assert.deepEqual(getActionDefinition("CheckMetricData").requiredParameters, ["MetricType"]);
  assert.deepEqual(getActionDefinition("CheckVoiceId").requiredParameters, ["CheckVoiceIdOption"]);
  assert.deepEqual(getActionDefinition("ConnectParticipantWithLexBot").requiredParameters, []);
  assert.deepEqual(getActionDefinition("CompleteOutboundCall").requiredParameters, []);
  assert.deepEqual(getActionDefinition("CreateCase").requiredParameters, [
    "LinkContactToCase",
    "CaseTemplateId",
  ]);
  assert.deepEqual(getActionDefinition("CreateCallbackContact").requiredParameters, [
    "InitialCallDelaySeconds",
    "MaximumConnectionAttempts",
    "RetryDelaySeconds",
  ]);
  assert.deepEqual(getActionDefinition("CreatePersistentContactAssociation").requiredParameters, [
    "RehydrationType",
    "SourceContactId",
  ]);
  assert.deepEqual(getActionDefinition("CreateCustomerProfile").requiredParameters, [
    "ProfileRequestData",
  ]);
  assert.deepEqual(getActionDefinition("CreateTask").requiredParameters, ["ContactFlowId", "Name"]);
  assert.deepEqual(getActionDefinition("CreateWisdomSession").requiredParameters, [
    "WisdomAssistantArn",
  ]);
  assert.deepEqual(getActionDefinition("Compare").requiredParameters, ["ComparisonValue"]);
  assert.deepEqual(getActionDefinition("DequeueContactAndTransferToQueue").requiredParameters, []);
  assert.deepEqual(getActionDefinition("DisconnectParticipant").requiredParameters, []);
  assert.deepEqual(getActionDefinition("DistributeByPercentage").requiredParameters, []);
  assert.deepEqual(getActionDefinition("EndFlowExecution").requiredParameters, []);
  assert.deepEqual(getActionDefinition("EndFlowModuleExecution").requiredParameters, []);
  assert.deepEqual(getActionDefinition("EvaluateDataTableValues").requiredParameters, [
    "DataTableId",
    "Queries",
  ]);
  assert.deepEqual(getActionDefinition("GetCase").requiredParameters, [
    "LinkContactToCase",
    "GetLastUpdatedCase",
    "CustomerId",
  ]);
  assert.deepEqual(getActionDefinition("GetCalculatedAttributesForCustomerProfile").requiredParameters, [
    "ProfileRequestData",
  ]);
  assert.deepEqual(getActionDefinition("LoadContactContent").requiredParameters, [
    "ContentType",
  ]);
  assert.deepEqual(getActionDefinition("ListDataTableValues").requiredParameters, [
    "DataTableId",
    "PrimaryKeyGroups",
  ]);
  assert.deepEqual(getActionDefinition("GetCustomerProfile").requiredParameters, [
    "ProfileRequestData",
  ]);
  assert.deepEqual(getActionDefinition("GetCustomerProfileObject").requiredParameters, [
    "ProfileRequestData",
  ]);
  assert.deepEqual(getActionDefinition("GetParticipantInput").requiredParameters, []);
  assert.deepEqual(getActionDefinition("GetMetricData").requiredParameters, []);
  assert.deepEqual(getActionDefinition("InvokeFlowModule").requiredParameters, [
    "FlowModuleId",
  ]);
  assert.deepEqual(getActionDefinition("InvokeLambdaFunction").requiredParameters, [
    "LambdaFunctionARN",
  ]);
  assert.deepEqual(getActionDefinition("Loop").requiredParameters, ["LoopCount"]);
  assert.deepEqual(getActionDefinition("MessageParticipant").requiredParameters, []);
  assert.deepEqual(getActionDefinition("MessageParticipantIteratively").requiredParameters, [
    "Messages",
  ]);
  assert.deepEqual(getActionDefinition("ResumeContact").requiredParameters, []);
  assert.deepEqual(getActionDefinition("ShowView").requiredParameters, ["ViewResource"]);
  assert.deepEqual(getActionDefinition("StartOutboundChatContact").requiredParameters, [
    "SourceEndpoint",
    "DestinationEndpoint",
    "ContactFlowArn",
    "ContactSubtype",
  ]);
  assert.deepEqual(getActionDefinition("StartVoiceIdStream").requiredParameters, []);
  assert.deepEqual(getActionDefinition("TagContact").requiredParameters, ["Tags"]);
  assert.deepEqual(getActionDefinition("TransferContactToAgent").requiredParameters, []);
  assert.deepEqual(getActionDefinition("TransferParticipantToThirdParty").requiredParameters, [
    "ThirdPartyPhoneNumber",
    "ThirdPartyConnectionTimeLimitSeconds",
    "ContinueFlowExecution",
  ]);
  assert.deepEqual(getActionDefinition("TransferContactToQueue").requiredParameters, []);
  assert.deepEqual(getActionDefinition("TransferToFlow").requiredParameters, ["ContactFlowId"]);
  assert.deepEqual(getActionDefinition("UnTagContact").requiredParameters, ["TagKeys"]);
  assert.deepEqual(getActionDefinition("UpsertDataTableValues").requiredParameters, [
    "LockVersion",
    "DataTableId",
    "DataTableUpsertAttributes",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactCallbackNumber").requiredParameters, [
    "CallbackNumber",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactData").requiredParameters, [
    "TargetContact",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactEventHooks").requiredParameters, [
    "EventHooks",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactMediaProcessing").requiredParameters, [
    "ChatProcessor",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactMediaStreamingBehavior").requiredParameters, [
    "MediaStreamingState",
    "Participants",
    "MediaStreamType",
  ]);
  assert.deepEqual(getActionDefinition("UpdatePreviousContactParticipantState").requiredParameters, [
    "PreviousContactParticipantState",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactRecordingAndAnalyticsBehavior").requiredParameters, []);
  assert.deepEqual(getActionDefinition("UpdateRoutingCriteria").requiredParameters, ["RoutingCriteria"]);
  assert.deepEqual(getActionDefinition("UpdateContactAttributes").requiredParameters, []);
  assert.deepEqual(getActionDefinition("UpdateContactRoutingBehavior").requiredParameters, []);
  assert.deepEqual(getActionDefinition("UpdateContactTargetQueue").requiredParameters, []);
  assert.deepEqual(getActionDefinition("UpdateContactTextToSpeechVoice").requiredParameters, [
    "TextToSpeechVoice",
  ]);
  assert.deepEqual(getActionDefinition("UpdateCase").requiredParameters, [
    "LinkContactToCase",
    "CaseId",
  ]);
  assert.deepEqual(getActionDefinition("UpdateContactRecordingBehavior").requiredParameters, [
    "RecordingBehavior",
    "AnalyticsBehavior",
  ]);
  assert.deepEqual(getActionDefinition("UpdateCustomerProfile").requiredParameters, [
    "ProfileRequestData",
  ]);
  assert.deepEqual(getActionDefinition("UpdateFlowAttributes").requiredParameters, [
    "FlowAttributes",
  ]);
  assert.deepEqual(getActionDefinition("UpdateFlowLoggingBehavior").requiredParameters, [
    "FlowLoggingBehavior",
  ]);
  assert.deepEqual(getActionDefinition("Wait").requiredParameters, ["TimeoutSeconds"]);
});

test("branching support is explicitly scoped in the registry", () => {
  assert.equal(getActionDefinition("AssociateContactToCustomerProfile").supportsConditions, false);
  assert.equal(getActionDefinition("AuthenticateParticipant").supportsConditions, true);
  assert.equal(getActionDefinition("CheckOutboundCallStatus").supportsConditions, true);
  assert.equal(getActionDefinition("CheckHoursOfOperation").supportsConditions, true);
  assert.equal(getActionDefinition("CheckMetricData").supportsConditions, true);
  assert.equal(getActionDefinition("CheckVoiceId").supportsConditions, true);
  assert.equal(getActionDefinition("ConnectParticipantWithLexBot").supportsConditions, true);
  assert.equal(getActionDefinition("CompleteOutboundCall").supportsConditions, false);
  assert.equal(getActionDefinition("CreateCase").supportsConditions, false);
  assert.equal(getActionDefinition("CreateCallbackContact").supportsConditions, false);
  assert.equal(getActionDefinition("CreatePersistentContactAssociation").supportsConditions, false);
  assert.equal(getActionDefinition("CreateCustomerProfile").supportsConditions, false);
  assert.equal(getActionDefinition("CreateTask").supportsConditions, false);
  assert.equal(getActionDefinition("CreateWisdomSession").supportsConditions, false);
  assert.equal(getActionDefinition("Compare").supportsConditions, true);
  assert.equal(getActionDefinition("DequeueContactAndTransferToQueue").supportsConditions, false);
  assert.equal(getActionDefinition("DistributeByPercentage").supportsConditions, true);
  assert.equal(getActionDefinition("EndFlowModuleExecution").supportsConditions, false);
  assert.equal(getActionDefinition("GetCase").supportsConditions, false);
  assert.equal(getActionDefinition("GetCalculatedAttributesForCustomerProfile").supportsConditions, false);
  assert.equal(getActionDefinition("LoadContactContent").supportsConditions, false);
  assert.equal(getActionDefinition("GetCustomerProfile").supportsConditions, false);
  assert.equal(getActionDefinition("GetCustomerProfileObject").supportsConditions, false);
  assert.equal(getActionDefinition("GetParticipantInput").supportsConditions, true);
  assert.equal(getActionDefinition("GetMetricData").supportsConditions, false);
  assert.equal(getActionDefinition("InvokeFlowModule").supportsConditions, false);
  assert.equal(getActionDefinition("Loop").supportsConditions, true);
  assert.equal(getActionDefinition("MessageParticipantIteratively").supportsConditions, true);
  assert.equal(getActionDefinition("ResumeContact").supportsConditions, false);
  assert.equal(getActionDefinition("ShowView").supportsConditions, true);
  assert.equal(getActionDefinition("StartOutboundChatContact").supportsConditions, false);
  assert.equal(getActionDefinition("StartVoiceIdStream").supportsConditions, false);
  assert.equal(getActionDefinition("TagContact").supportsConditions, false);
  assert.equal(getActionDefinition("Wait").supportsConditions, true);
  assert.equal(getActionDefinition("DisconnectParticipant").supportsConditions, false);
  assert.equal(getActionDefinition("EndFlowExecution").supportsConditions, false);
  assert.equal(getActionDefinition("MessageParticipant").supportsConditions, false);
  assert.equal(getActionDefinition("TransferContactToAgent").supportsConditions, false);
  assert.equal(getActionDefinition("TransferToFlow").supportsConditions, false);
  assert.equal(getActionDefinition("UnTagContact").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateContactData").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateContactEventHooks").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateContactMediaProcessing").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateContactMediaStreamingBehavior").supportsConditions, false);
  assert.equal(getActionDefinition("UpdatePreviousContactParticipantState").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateContactRecordingAndAnalyticsBehavior").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateFlowLoggingBehavior").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateRoutingCriteria").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateCase").supportsConditions, false);
  assert.equal(getActionDefinition("UpdateCustomerProfile").supportsConditions, false);
});

test("check metric data types remain stable for the current check coverage set", () => {
  assert.deepEqual(CHECK_METRIC_DATA_METRIC_TYPES, [
    "NumberOfAgentsAvailable",
    "NumberOfAgentsStaffed",
    "NumberOfAgentsOnline",
    "OldestContactInQueueAgeSeconds",
    "NumberOfContactsInQueue",
  ]);
});
