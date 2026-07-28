# Amazon Connect Action Coverage Matrix

This matrix summarizes package coverage against the unified catalog in `src/catalog/connect-action-catalog.ts`.

## Snapshot

- Total catalog entries currently tracked: `69`
- Implemented catalog surfaces: `69`
- Portable package action builders implemented: `68`
- Proven composite-backed surfaces implemented: `1`
- Coverage posture: broad AWS surface inventory with branching, routing, state, operator control, touchtone buffering, data tables, channel analytics, outbound and callback operations, voice ID, task control, case, customer profile, persistent chat association, external phone transfer, and proven multi-action assistant setup coverage implemented

The catalog now includes:

- documented flow-language actions
- Flow Designer blocks that AWS documents only in the Admin Guide

That means coverage planning is now anchored to what an operator can actually see and use in Connect, not only to the Developer Guide action index.

## Currently Implemented Package Surface

| AWS surface | UI equivalent | Package surface kind | Current package type | Package export |
| --- | --- | --- | --- | --- |
| `Compare` | `Check contact attributes` | `action-builder` | `Compare` | `CompareActionBuilder` |
| `CheckOutboundCallStatus` | `Check call progress` | `action-builder` | `CheckOutboundCallStatus` | `CheckOutboundCallStatusActionBuilder` |
| `CheckHoursOfOperation` | `Check hours of operation` | `action-builder` | `CheckHoursOfOperation` | `CheckHoursOfOperationActionBuilder` |
| `CheckMetricData` | `Check queue status`, `Check staffing` | `action-builder` | `CheckMetricData` | `CheckMetricDataActionBuilder` |
| `Connect assistant` | `Connect assistant` | `composite-helper` | `CreateWisdomSession + UpdateContactData` | `buildConnectAssistant` |
| `CreateCase` | `Cases` | `action-builder` | `CreateCase` | `CreateCaseActionBuilder` |
| `CreateCustomerProfile` | `Customer profiles` | `action-builder` | `CreateCustomerProfile` | `CreateCustomerProfileActionBuilder` |
| `CreatePersistentContactAssociation` | `Create persistent contact association` | `action-builder` | `CreatePersistentContactAssociation` | `CreatePersistentContactAssociationActionBuilder` |
| `CreateTask` | `Create task` | `action-builder` | `CreateTask` | `CreateTaskActionBuilder` |
| `DisconnectParticipant` | `Disconnect` | `action-builder` | `DisconnectParticipant` | `DisconnectParticipantActionBuilder` |
| `DistributeByPercentage` | `Distribute by Percentage` | `action-builder` | `DistributeByPercentage` | `DistributeByPercentageActionBuilder` |
| `EndFlowExecution` | `End flow / Resume` | `action-builder` | `EndFlowExecution` | `EndFlowExecutionActionBuilder` |
| `EvaluateDataTableValues` | `Data Table` | `action-builder` | `EvaluateDataTableValues` | `EvaluateDataTableValuesActionBuilder` |
| `GetCase` | `Cases` | `action-builder` | `GetCase` | `GetCaseActionBuilder` |
| `GetCustomerProfile` | `Customer profiles` | `action-builder` | `GetCustomerProfile` | `GetCustomerProfileActionBuilder` |
| `GetCustomerProfileObject` | `Customer profiles` | `action-builder` | `GetCustomerProfileObject` | `GetCustomerProfileObjectActionBuilder` |
| `GetParticipantInput` | `Get customer input` | `action-builder` | `GetParticipantInput` | `GetParticipantInputActionBuilder` |
| `GetMetricData` | `Get metrics` | `action-builder` | `GetMetricData` | `GetMetricDataActionBuilder` |
| `LoadContactContent` | `Get stored content` | `action-builder` | `LoadContactContent` | `LoadContactContentActionBuilder` |
| `ListDataTableValues` | `Data Table` | `action-builder` | `ListDataTableValues` | `ListDataTableValuesActionBuilder` |
| `InvokeLambdaFunction` | `AWS Lambda function` | `action-builder` | `InvokeLambdaFunction` | `InvokeLambdaFunctionActionBuilder` |
| `InvokeFlowModule` | `Invoke module` | `action-builder` | `InvokeFlowModule` | `InvokeFlowModuleActionBuilder` |
| `Loop` | `Loop` | `action-builder` | `Loop` | `LoopActionBuilder` |
| `MessageParticipant` | `Play prompt`, `Send message` | `action-builder` | `MessageParticipant` | `MessageParticipantActionBuilder` |
| `MessageParticipantIteratively` | `Play prompt` | `action-builder` | `MessageParticipantIteratively` | `MessageParticipantIterativelyActionBuilder` |
| `ResumeContact` | `Resume Contact` | `action-builder` | `ResumeContact` | `ResumeContactActionBuilder` |
| `Set customer queue flow` | `Set customer queue flow` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetCustomerQueueFlowActionBuilder` |
| `Set disconnect flow` | `Set disconnect flow` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetDisconnectFlowActionBuilder` |
| `Set Touchtone Buffer Behavior` | `Set Touchtone Buffer Behavior` | `ui-wrapper-builder` | `GetParticipantInput` | `SetTouchtoneBufferBehaviorActionBuilder` |
| `Set whisper flow` | `Set whisper flow` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetWhisperFlowActionBuilder` |
| `ShowView` | `Show View` | `action-builder` | `ShowView` | `ShowViewActionBuilder` |
| `Store customer input` | `Store customer input` | `ui-wrapper-builder` | `GetParticipantInput` | `StoreCustomerInputActionBuilder` |
| `TagContact` | `Contact tags` | `action-builder` | `TagContact` | `TagContactActionBuilder` |
| `TransferToFlow` | `Transfer to flow` | `action-builder` | `TransferToFlow` | `TransferToFlowActionBuilder` |
| `TransferContactToAgent` | `Transfer to queue` | `action-builder` | `TransferContactToAgent` | `TransferContactToAgentActionBuilder` |
| `TransferParticipantToThirdParty` | `Transfer to phone number` | `action-builder` | `TransferParticipantToThirdParty` | `TransferParticipantToThirdPartyActionBuilder` |
| `TransferContactToQueue` | `Transfer to queue` | `action-builder` | `TransferContactToQueue` | `TransferContactToQueueActionBuilder` |
| `UnTagContact` | `Contact tags` | `action-builder` | `UnTagContact` | `UnTagContactActionBuilder` |
| `UpsertDataTableValues` | `Data Table` | `action-builder` | `UpsertDataTableValues` | `UpsertDataTableValuesActionBuilder` |
| `UpdateContactCallbackNumber` | `Set callback number` | `action-builder` | `UpdateContactCallbackNumber` | `UpdateContactCallbackNumberActionBuilder` |
| `UpdateContactAttributes` | `Set contact attributes` | `action-builder` | `UpdateContactAttributes` | `UpdateContactAttributesActionBuilder` |
| `UpdateContactData` | `Set contact attributes` | `action-builder` | `UpdateContactData` | `UpdateContactDataActionBuilder` |
| `UpdateContactEventHooks` | `Set event flow`, `Set customer queue flow`, `Set disconnect flow`, `Set whisper flow` | `action-builder` | `UpdateContactEventHooks` | `UpdateContactEventHooksActionBuilder` |
| `UpdateContactMediaProcessing` | `Set recording, analytics, and processing behavior` | `action-builder` | `UpdateContactMediaProcessing` | `UpdateContactMediaProcessingActionBuilder` |
| `UpdateContactMediaStreamingBehavior` | `Start media streaming`, `Stop media streaming` | `action-builder` | `UpdateContactMediaStreamingBehavior` | `UpdateContactMediaStreamingBehaviorActionBuilder` |
| `UpdateContactRecordingAndAnalyticsBehavior` | `Set recording, analytics, and processing behavior` | `action-builder` | `UpdateContactRecordingAndAnalyticsBehavior` | `UpdateContactRecordingAndAnalyticsBehaviorActionBuilder` |
| `UpdateContactRecordingBehavior` | `Set recording, analytics, and processing behavior` | `action-builder` | `UpdateContactRecordingBehavior` | `UpdateContactRecordingBehaviorActionBuilder` |
| `UpdateContactRoutingBehavior` | `Change routing priority / age` | `action-builder` | `UpdateContactRoutingBehavior` | `UpdateContactRoutingBehaviorActionBuilder` |
| `UpdateContactTargetQueue` | `Set working queue` | `action-builder` | `UpdateContactTargetQueue` | `UpdateContactTargetQueueActionBuilder` |
| `UpdateContactTextToSpeechVoice` | `Set voice` | `action-builder` | `UpdateContactTextToSpeechVoice` | `UpdateContactTextToSpeechVoiceActionBuilder` |
| `UpdateCase` | `Cases` | `action-builder` | `UpdateCase` | `UpdateCaseActionBuilder` |
| `UpdateCustomerProfile` | `Customer profiles` | `action-builder` | `UpdateCustomerProfile` | `UpdateCustomerProfileActionBuilder` |
| `UpdateFlowAttributes` | `Set contact attributes` | `action-builder` | `UpdateFlowAttributes` | `UpdateFlowAttributesActionBuilder` |
| `UpdateFlowLoggingBehavior` | `Set logging behavior` | `action-builder` | `UpdateFlowLoggingBehavior` | `UpdateFlowLoggingBehaviorActionBuilder` |
| `UpdateRoutingCriteria` | `Set routing criteria` | `action-builder` | `UpdateRoutingCriteria` | `UpdateRoutingCriteriaActionBuilder` |
| `Wait` | `Wait` | `action-builder` | `Wait` | `WaitActionBuilder` |

## Remaining Non-Implemented Catalog Entries

There are currently no separate blocked catalog entries.

Deferred alternate authoring modes, such as the unproven raw-JSON `UpsertDataTableValues` variant, remain tracked in per-entry catalog notes rather than as standalone surfaces.

## Recommended Next Package Wave

The next best implementation wave can now focus on variant-deepening rather than first-pass surface coverage:

1. Expand already-proven surfaces where AWS exposes alternate authoring modes, such as raw-JSON data-table writes

## Design Discipline

- Start from the unified catalog, not from a local flow.
- Prefer current AWS action names for new builders.
- Keep legacy names visible when the package already exposes them.
- Treat UI-only AWS blocks as real catalog entries even when AWS has not published a separate flow-language action page for them.
