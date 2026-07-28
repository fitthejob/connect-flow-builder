# Amazon Connect Action Catalog

This file is generated from `src/catalog/connect-action-catalog.ts`.

Do not hand-edit this file.

## Source

- Verified on: `2026-06-13`
- Developer Guide TOC: `https://docs.aws.amazon.com/connect/latest/devguide/toc-contents.json`
- Developer Guide actions overview: `https://docs.aws.amazon.com/connect/latest/devguide/flow-language-actions.html`
- Admin Guide TOC: `https://docs.aws.amazon.com/connect/latest/adminguide/toc-contents.json`
- API Reference base: `https://docs.aws.amazon.com/connect/latest/APIReference/`

## Snapshot

- Total catalog entries: `69`
- Implemented catalog surfaces: `69`
- Implemented action-builder-backed surfaces: `68`
- Implemented composite-backed surfaces: `1`
- Implementable-now package entries: `0`
- Blocked package entries: `0`

## Category Model

The catalog is organized first by the Flow Designer UI categories you supplied:

- `INTERACT`
- `SET`
- `CHECK`
- `ANALYZE`
- `LOGIC`
- `INTEGRATE`
- `TERMINATE`

Entries that exist outside those operator-facing groups are categorized by core function instead.

Coverage status meanings:

- `implemented`: the package already exposes the catalog surface through a portable builder or a proven composite helper
- `implementable-now`: the underlying AWS action contract is already proven strongly enough to add a UI-aligned wrapper safely
- `blocked`: the package still needs exported Flow Designer JSON or stronger AWS evidence before a stable builder contract should be added

## INTERACT

Entries in this category: `7`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AuthenticateParticipant` | `AuthenticateParticipant` | `flow-language-action` | `Authenticate Customer` | `implemented` | `action-builder` | `AuthenticateParticipant` | `AuthenticateParticipantActionBuilder` | [`authenticate-customer.html`](https://docs.aws.amazon.com/connect/latest/adminguide/authenticate-customer.html) | AWS surfaces this through the Flow Designer block 'Authenticate Customer'; the underlying action name is inferred from exported flow JSON because AWS does not currently publish a dedicated Developer Guide action page for it. |
| `CreatePersistentContactAssociation` | `CreatePersistentContactAssociation` | `flow-language-action` | `Create persistent contact association` | `implemented` | `action-builder` | `CreatePersistentContactAssociation` | `CreatePersistentContactAssociationActionBuilder` | [`API_CreatePersistentContactAssociation.html`](https://docs.aws.amazon.com/connect/latest/APIReference/API_CreatePersistentContactAssociation.html)<br>[`create-persistent-contact-association-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/create-persistent-contact-association-block.html)<br>[`chat-persistence.html`](https://docs.aws.amazon.com/connect/latest/adminguide/chat-persistence.html) | The Flow Designer export and AWS API reference both prove the underlying action name. SourceContactId is the portable contract surface; the Flow Designer namespace/key picker is only an authoring convenience for producing that expression. |
| `CreateTask` | `CreateTask` | `flow-language-action` | `Create task` | `implemented` | `action-builder` | `CreateTask` | `CreateTaskActionBuilder` | [`createtask.html`](https://docs.aws.amazon.com/connect/latest/devguide/createtask.html)<br>[`create-task-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/create-task-block.html) |  |
| `GetParticipantInput` | `GetParticipantInput` | `flow-language-action` | `Get customer input` | `implemented` | `action-builder` | `GetParticipantInput` | `GetParticipantInputActionBuilder` | [`participant-actions-getparticipantinput.html`](https://docs.aws.amazon.com/connect/latest/devguide/participant-actions-getparticipantinput.html)<br>[`get-customer-input.html`](https://docs.aws.amazon.com/connect/latest/adminguide/get-customer-input.html) | The core action definition now supports multiple valid modes; the package currently exposes the Lex-backed builder directly and additional UI-aligned wrappers when their exported contracts are proven. |
| `LoadContactContent` | `LoadContactContent` | `flow-language-action` | `Get stored content` | `implemented` | `action-builder` | `LoadContactContent` | `LoadContactContentActionBuilder` | [`get-stored-content.html`](https://docs.aws.amazon.com/connect/latest/adminguide/get-stored-content.html) | AWS documents this block through the Admin Guide and explicitly identifies the underlying flow-language action as LoadContactContent. The live block and Admin Guide currently expose only the EmailMessage content type, so the package intentionally constrains the builder to that proven option. |
| `MessageParticipant` | `MessageParticipant` | `flow-language-action` | `Play prompt`, `Send message` | `implemented` | `action-builder` | `MessageParticipant` | `MessageParticipantActionBuilder` | [`participant-actions-messageparticipant.html`](https://docs.aws.amazon.com/connect/latest/devguide/participant-actions-messageparticipant.html)<br>[`play.html`](https://docs.aws.amazon.com/connect/latest/adminguide/play.html)<br>[`send-message.html`](https://docs.aws.amazon.com/connect/latest/adminguide/send-message.html) | The developer-guide action covers both audio prompt and text-message behavior depending on channel. |
| `Store customer input` | `GetParticipantInput` | `flow-language-action` | `Store customer input` | `implemented` | `ui-wrapper-builder` | `GetParticipantInput` | `StoreCustomerInputActionBuilder` | [`store-customer-input.html`](https://docs.aws.amazon.com/connect/latest/adminguide/store-customer-input.html) | AWS documents Store customer input as a GetParticipantInput-based block that stores digits into the Stored customer input system attribute. The package currently implements the proven custom-digit mode only: StoreInput True, DTMFConfiguration, InputTimeLimitSeconds, and InputValidation.CustomValidation.MaximumLength. Phone-number, encryption, and prompt variants remain intentionally deferred until exported JSON proves their exact contracts. |

## SET

Entries in this category: `16`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `Connect assistant` | `CreateWisdomSession + UpdateContactData` | `designer-block` | `Connect assistant` | `implemented` | `composite-helper` | `CreateWisdomSession` | `buildConnectAssistant` | [`connect-assistant-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/connect-assistant-block.html) | The block expands into two underlying AWS actions rather than a single flow-language action, so the package exposes it as a composite helper instead of a standalone action builder. This UI block is implemented as a composite helper that emits CreateWisdomSession followed by UpdateContactData.WisdomSessionArn = $.Wisdom.SessionArn. |
| `TagContact` | `TagContact` | `flow-language-action` | `Contact tags` | `implemented` | `action-builder` | `TagContact` | `TagContactActionBuilder` | [`contact-actions-tagcontact.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-tagcontact.html)<br>[`contact-tags-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/contact-tags-block.html) |  |
| `UnTagContact` | `UnTagContact` | `flow-language-action` | `Contact tags` | `implemented` | `action-builder` | `UnTagContact` | `UnTagContactActionBuilder` | [`contact-actions-untagcontact.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-untagcontact.html)<br>[`contact-tags-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/contact-tags-block.html) |  |
| `ResumeContact` | `ResumeContact` | `flow-language-action` | `Resume Contact` | `implemented` | `action-builder` | `ResumeContact` | `ResumeContactActionBuilder` | [`contact-actions-updatecontactresumecontact.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactresumecontact.html)<br>[`resume-contact.html`](https://docs.aws.amazon.com/connect/latest/adminguide/resume-contact.html) |  |
| `UpdateContactCallbackNumber` | `UpdateContactCallbackNumber` | `flow-language-action` | `Set callback number` | `implemented` | `action-builder` | `UpdateContactCallbackNumber` | `UpdateContactCallbackNumberActionBuilder` | [`contact-actions-updatecontactcallbacknumber.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactcallbacknumber.html)<br>[`set-callback-number.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-callback-number.html) |  |
| `UpdateContactAttributes` | `UpdateContactAttributes` | `flow-language-action` | `Set contact attributes` | `implemented` | `action-builder` | `UpdateContactAttributes` | `UpdateContactAttributesActionBuilder` | [`contact-actions-updatecontactattributes.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactattributes.html)<br>[`set-contact-attributes.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-contact-attributes.html) |  |
| `Set customer queue flow` | `UpdateContactEventHooks` | `designer-block` | `Set customer queue flow` | `implemented` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetCustomerQueueFlowActionBuilder` | [`set-customer-queue-flow.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-customer-queue-flow.html) | AWS currently documents this as a Flow Designer block in the Admin Guide rather than as a separate flow-language action page. This UI-aligned wrapper emits UpdateContactEventHooks with EventHooks constrained to CustomerQueue. |
| `Set disconnect flow` | `UpdateContactEventHooks` | `designer-block` | `Set disconnect flow` | `implemented` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetDisconnectFlowActionBuilder` | [`set-disconnect-flow.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-disconnect-flow.html) | The admin-guide block and exported JSON align with the UpdateContactEventHooks developer-guide contract, where CustomerRemaining is a valid static event-hook key. This UI-aligned wrapper emits UpdateContactEventHooks with EventHooks constrained to CustomerRemaining. |
| `UpdateContactEventHooks` | `UpdateContactEventHooks` | `flow-language-action` | `Set event flow`, `Set customer queue flow`, `Set disconnect flow`, `Set whisper flow` | `implemented` | `action-builder` | `UpdateContactEventHooks` | `UpdateContactEventHooksActionBuilder` | [`contact-actions-updatecontacteventhooks.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontacteventhooks.html)<br>[`set-event-flow.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-event-flow.html) | This low-level action underpins Set event flow and the implemented customer queue, disconnect, and whisper hook wrappers. |
| `UpdateRoutingCriteria` | `UpdateRoutingCriteria` | `flow-language-action` | `Set routing criteria` | `implemented` | `action-builder` | `UpdateRoutingCriteria` | `UpdateRoutingCriteriaActionBuilder` | [`flow-control-actions-updateroutingcriteria.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-updateroutingcriteria.html)<br>[`set-routing-criteria.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-routing-criteria.html) |  |
| `Set Touchtone Buffer Behavior` | `GetParticipantInput` | `designer-block` | `Set Touchtone Buffer Behavior` | `implemented` | `ui-wrapper-builder` | `GetParticipantInput` | `SetTouchtoneBufferBehaviorActionBuilder` | [`set-touchtone-buffer-behavior.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-touchtone-buffer-behavior.html) | AWS explicitly documents this block as a GetParticipantInput-based Flow Designer surface using the EnableDTMFBuffer parameter. The package implements the proven Enable and Stop and Clear forms, including the documented optional StoreInput and InputEncryption parameters for Stop and Clear. |
| `UpdateContactTextToSpeechVoice` | `UpdateContactTextToSpeechVoice` | `flow-language-action` | `Set voice` | `implemented` | `action-builder` | `UpdateContactTextToSpeechVoice` | `UpdateContactTextToSpeechVoiceActionBuilder` | [`contact-actions-updatecontacttexttospeechvoice.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontacttexttospeechvoice.html)<br>[`set-voice.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-voice.html) |  |
| `StartVoiceIdStream` | `StartVoiceIdStream` | `flow-language-action` | `Set voice ID` | `implemented` | `action-builder` | `StartVoiceIdStream` | `StartVoiceIdStreamActionBuilder` | [`flow-control-actions-startvoiceidstream.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-startvoiceidstream.html)<br>[`set-voice-id.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-voice-id.html) |  |
| `Set whisper flow` | `UpdateContactEventHooks` | `designer-block` | `Set whisper flow` | `implemented` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetWhisperFlowActionBuilder` | [`set-whisper-flow.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-whisper-flow.html) | AWS currently documents this as a Flow Designer block in the Admin Guide rather than as a separate flow-language action page. This UI-aligned wrapper emits UpdateContactEventHooks with EventHooks constrained to CustomerWhisper. |
| `UpdateContactTargetQueue` | `UpdateContactTargetQueue` | `flow-language-action` | `Set working queue` | `implemented` | `action-builder` | `UpdateContactTargetQueue` | `UpdateContactTargetQueueActionBuilder` | [`contact-actions-updatecontacttargetqueue.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontacttargetqueue.html)<br>[`set-working-queue.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-working-queue.html) |  |
| `UpdateContactRoutingBehavior` | `UpdateContactRoutingBehavior` | `flow-language-action` | `Change routing priority / age` | `implemented` | `action-builder` | `UpdateContactRoutingBehavior` | `UpdateContactRoutingBehaviorActionBuilder` | [`contact-actions-updatecontactroutingbehavior.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactroutingbehavior.html)<br>[`change-routing-priority.html`](https://docs.aws.amazon.com/connect/latest/adminguide/change-routing-priority.html) |  |

## CHECK

Entries in this category: `6`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CheckOutboundCallStatus` | `CheckOutboundCallStatus` | `flow-language-action` | `Check call progress` | `implemented` | `action-builder` | `CheckOutboundCallStatus` | `CheckOutboundCallStatusActionBuilder` | [`flow-control-actions-checkoutboundcallstatus.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-checkoutboundcallstatus.html)<br>[`check-call-progress.html`](https://docs.aws.amazon.com/connect/latest/adminguide/check-call-progress.html) |  |
| `Compare` | `Compare` | `flow-language-action` | `Check contact attributes` | `implemented` | `action-builder` | `Compare` | `CompareActionBuilder` | [`flow-control-actions-compare.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-compare.html)<br>[`check-contact-attributes.html`](https://docs.aws.amazon.com/connect/latest/adminguide/check-contact-attributes.html) |  |
| `CheckHoursOfOperation` | `CheckHoursOfOperation` | `flow-language-action` | `Check hours of operation` | `implemented` | `action-builder` | `CheckHoursOfOperation` | `CheckHoursOfOperationActionBuilder` | [`flow-control-actions-checkhoursofoperation.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-checkhoursofoperation.html)<br>[`check-hours-of-operation.html`](https://docs.aws.amazon.com/connect/latest/adminguide/check-hours-of-operation.html) |  |
| `CheckMetricData` | `CheckMetricData` | `flow-language-action` | `Check queue status`, `Check staffing` | `implemented` | `action-builder` | `CheckMetricData` | `CheckMetricDataActionBuilder` | [`flow-control-actions-checkmetricdata.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-checkmetricdata.html)<br>[`check-queue-status.html`](https://docs.aws.amazon.com/connect/latest/adminguide/check-queue-status.html)<br>[`check-staffing.html`](https://docs.aws.amazon.com/connect/latest/adminguide/check-staffing.html) |  |
| `CheckVoiceId` | `CheckVoiceId` | `flow-language-action` | `Check voice ID` | `implemented` | `action-builder` | `CheckVoiceId` | `CheckVoiceIdActionBuilder` | [`flow-control-actions-checkvoiceid.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-checkvoiceid.html)<br>[`check-voice-id.html`](https://docs.aws.amazon.com/connect/latest/adminguide/check-voice-id.html) |  |
| `GetMetricData` | `GetMetricData` | `flow-language-action` | `Get metrics` | `implemented` | `action-builder` | `GetMetricData` | `GetMetricDataActionBuilder` | [`flow-control-actions-getmetricdata.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-getmetricdata.html)<br>[`get-queue-metrics.html`](https://docs.aws.amazon.com/connect/latest/adminguide/get-queue-metrics.html) |  |

## ANALYZE

Entries in this category: `5`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UpdateFlowLoggingBehavior` | `UpdateFlowLoggingBehavior` | `flow-language-action` | `Set logging behavior` | `implemented` | `action-builder` | `UpdateFlowLoggingBehavior` | `UpdateFlowLoggingBehaviorActionBuilder` | [`flow-control-actions-updateflowloggingbehavior.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-updateflowloggingbehavior.html)<br>[`set-logging-behavior.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-logging-behavior.html) |  |
| `UpdateContactRecordingBehavior` | `UpdateContactRecordingBehavior` | `flow-language-action` | `Set recording, analytics, and processing behavior` | `implemented` | `action-builder` | `UpdateContactRecordingBehavior` | `UpdateContactRecordingBehaviorActionBuilder` | [`contact-actions-updatecontactrecordingbehavior.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactrecordingbehavior.html)<br>[`set-recording-behavior.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-recording-behavior.html)<br>[`set-recording-analytics-processing-behavior.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-recording-analytics-processing-behavior.html) |  |
| `UpdateContactRecordingAndAnalyticsBehavior` | `UpdateContactRecordingAndAnalyticsBehavior` | `flow-language-action` | `Set recording, analytics, and processing behavior` | `implemented` | `action-builder` | `UpdateContactRecordingAndAnalyticsBehavior` | `UpdateContactRecordingAndAnalyticsBehaviorActionBuilder` | [`contact-actions-updatecontactrecordingandanalyticsbehavior.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactrecordingandanalyticsbehavior.html)<br>[`set-recording-analytics-processing-behavior.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-recording-analytics-processing-behavior.html) |  |
| `UpdateContactMediaProcessing` | `UpdateContactMediaProcessing` | `flow-language-action` | `Set recording, analytics, and processing behavior` | `implemented` | `action-builder` | `UpdateContactMediaProcessing` | `UpdateContactMediaProcessingActionBuilder` | [`contact-actions-updatecontactmediaprocessing.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactmediaprocessing.html)<br>[`set-recording-analytics-processing-behavior.html`](https://docs.aws.amazon.com/connect/latest/adminguide/set-recording-analytics-processing-behavior.html) |  |
| `UpdateContactMediaStreamingBehavior` | `UpdateContactMediaStreamingBehavior` | `flow-language-action` | `Start media streaming`, `Stop media streaming` | `implemented` | `action-builder` | `UpdateContactMediaStreamingBehavior` | `UpdateContactMediaStreamingBehaviorActionBuilder` | [`contact-actions-updatecontactmediastreamingbehavior.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactmediastreamingbehavior.html)<br>[`start-media-streaming.html`](https://docs.aws.amazon.com/connect/latest/adminguide/start-media-streaming.html)<br>[`stop-media-streaming.html`](https://docs.aws.amazon.com/connect/latest/adminguide/stop-media-streaming.html) |  |

## LOGIC

Entries in this category: `3`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DistributeByPercentage` | `DistributeByPercentage` | `flow-language-action` | `Distribute by Percentage` | `implemented` | `action-builder` | `DistributeByPercentage` | `DistributeByPercentageActionBuilder` | [`flow-control-actions-distributebypercentage.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-distributebypercentage.html)<br>[`distribute-by-percentage.html`](https://docs.aws.amazon.com/connect/latest/adminguide/distribute-by-percentage.html) |  |
| `Loop` | `Loop` | `flow-language-action` | `Loop` | `implemented` | `action-builder` | `Loop` | `LoopActionBuilder` | [`flow-control-actions-loop.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-loop.html)<br>[`loop.html`](https://docs.aws.amazon.com/connect/latest/adminguide/loop.html) |  |
| `Wait` | `Wait` | `flow-language-action` | `Wait` | `implemented` | `action-builder` | `Wait` | `WaitActionBuilder` | [`flow-control-actions-wait.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-wait.html)<br>[`wait.html`](https://docs.aws.amazon.com/connect/latest/adminguide/wait.html) |  |

## INTEGRATE

Entries in this category: `14`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `InvokeLambdaFunction` | `InvokeLambdaFunction` | `flow-language-action` | `AWS Lambda function` | `implemented` | `action-builder` | `InvokeLambdaFunction` | `InvokeLambdaFunctionActionBuilder` | [`interactions-invokelambdafunction.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-invokelambdafunction.html)<br>[`invoke-lambda-function-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/invoke-lambda-function-block.html) |  |
| `CreateCase` | `CreateCase` | `flow-language-action` | `Cases` | `implemented` | `action-builder` | `CreateCase` | `CreateCaseActionBuilder` | [`createcase.html`](https://docs.aws.amazon.com/connect/latest/devguide/createcase.html)<br>[`cases-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/cases-block.html) |  |
| `GetCase` | `GetCase` | `flow-language-action` | `Cases` | `implemented` | `action-builder` | `GetCase` | `GetCaseActionBuilder` | [`getcase.html`](https://docs.aws.amazon.com/connect/latest/devguide/getcase.html)<br>[`cases-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/cases-block.html) |  |
| `UpdateCase` | `UpdateCase` | `flow-language-action` | `Cases` | `implemented` | `action-builder` | `UpdateCase` | `UpdateCaseActionBuilder` | [`updatecase.html`](https://docs.aws.amazon.com/connect/latest/devguide/updatecase.html)<br>[`cases-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/cases-block.html) |  |
| `CreateCustomerProfile` | `CreateCustomerProfile` | `flow-language-action` | `Customer profiles` | `implemented` | `action-builder` | `CreateCustomerProfile` | `CreateCustomerProfileActionBuilder` | [`interactions-createcustomerprofile.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-createcustomerprofile.html)<br>[`customer-profiles-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/customer-profiles-block.html) |  |
| `GetCustomerProfile` | `GetCustomerProfile` | `flow-language-action` | `Customer profiles` | `implemented` | `action-builder` | `GetCustomerProfile` | `GetCustomerProfileActionBuilder` | [`interactions-getcustomerprofile.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-getcustomerprofile.html)<br>[`customer-profiles-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/customer-profiles-block.html) |  |
| `GetCustomerProfileObject` | `GetCustomerProfileObject` | `flow-language-action` | `Customer profiles` | `implemented` | `action-builder` | `GetCustomerProfileObject` | `GetCustomerProfileObjectActionBuilder` | [`interactions-getcustomerprofileobject.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-getcustomerprofileobject.html)<br>[`customer-profiles-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/customer-profiles-block.html) |  |
| `GetCalculatedAttributesForCustomerProfile` | `GetCalculatedAttributesForCustomerProfile` | `flow-language-action` | `Customer profiles` | `implemented` | `action-builder` | `GetCalculatedAttributesForCustomerProfile` | `GetCalculatedAttributesForCustomerProfileActionBuilder` | [`interactions-getcalculatedattributesforcustomerprofile.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-getcalculatedattributesforcustomerprofile.html)<br>[`customer-profiles-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/customer-profiles-block.html) |  |
| `UpdateCustomerProfile` | `UpdateCustomerProfile` | `flow-language-action` | `Customer profiles` | `implemented` | `action-builder` | `UpdateCustomerProfile` | `UpdateCustomerProfileActionBuilder` | [`interactions-updatecustomerprofile.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-updatecustomerprofile.html)<br>[`customer-profiles-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/customer-profiles-block.html) |  |
| `EvaluateDataTableValues` | `EvaluateDataTableValues` | `flow-language-action` | `Data Table` | `implemented` | `action-builder` | `EvaluateDataTableValues` | `EvaluateDataTableValuesActionBuilder` | [`data-table-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/data-table-block.html) | AWS documents Data Table through the Admin Guide; the underlying EvaluateDataTableValues action name and parameter shape are proven by exported Flow Designer JSON. The package implements the proven evaluate mode with DataTableId and Queries, including QueryName, Attributes, and PrimaryValues.AttributeName/Value entries. |
| `ListDataTableValues` | `ListDataTableValues` | `flow-language-action` | `Data Table` | `implemented` | `action-builder` | `ListDataTableValues` | `ListDataTableValuesActionBuilder` | [`data-table-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/data-table-block.html) | AWS documents Data Table through the Admin Guide; the underlying ListDataTableValues action name and parameter shape are proven by exported Flow Designer JSON. The package implements the proven list mode with DataTableId and PrimaryKeyGroups, including PrimaryKeyGroupName and PrimaryValues.Name/Value entries. |
| `UpsertDataTableValues` | `UpsertDataTableValues` | `flow-language-action` | `Data Table` | `implemented` | `action-builder` | `UpsertDataTableValues` | `UpsertDataTableValuesActionBuilder` | [`data-table-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/data-table-block.html) | AWS documents Data Table through the Admin Guide; the underlying UpsertDataTableValues action name and structured-input parameter shape are proven by exported Flow Designer JSON. The alternate raw-JSON authoring mode remains intentionally deferred until its export shape is captured. The package implements the proven structured-input upsert mode with LockVersion, DataTableId, DataTableUpsertAttributes, PrimaryValues.Name/Value, and Attributes.Name/Value plus optional UseDefaultValue boolean. |
| `InvokeFlowModule` | `InvokeFlowModule` | `flow-language-action` | `Invoke module` | `implemented` | `action-builder` | `InvokeFlowModule` | `InvokeFlowModuleActionBuilder` | [`flow-language-actions-invoke-flow-module.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-language-actions-invoke-flow-module.html)<br>[`invoke-module-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/invoke-module-block.html) |  |
| `ShowView` | `ShowView` | `flow-language-action` | `Show View` | `implemented` | `action-builder` | `ShowView` | `ShowViewActionBuilder` | [`participant-actions-showview.html`](https://docs.aws.amazon.com/connect/latest/devguide/participant-actions-showview.html)<br>[`show-view-block.html`](https://docs.aws.amazon.com/connect/latest/adminguide/show-view-block.html) |  |

## TERMINATE

Entries in this category: `6`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DisconnectParticipant` | `DisconnectParticipant` | `flow-language-action` | `Disconnect` | `implemented` | `action-builder` | `DisconnectParticipant` | `DisconnectParticipantActionBuilder` | [`participant-actions-disconnectparticipant.html`](https://docs.aws.amazon.com/connect/latest/devguide/participant-actions-disconnectparticipant.html)<br>[`disconnect-hang-up.html`](https://docs.aws.amazon.com/connect/latest/adminguide/disconnect-hang-up.html) |  |
| `EndFlowExecution` | `EndFlowExecution` | `flow-language-action` | `End flow / Resume` | `implemented` | `action-builder` | `EndFlowExecution` | `EndFlowExecutionActionBuilder` | [`flow-control-actions-endflowexecution.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-endflowexecution.html)<br>[`end-flow-resume.html`](https://docs.aws.amazon.com/connect/latest/adminguide/end-flow-resume.html) |  |
| `EndFlowModuleExecution` | `EndFlowModuleExecution` | `flow-language-action` | `End flow / Resume` | `implemented` | `action-builder` | `EndFlowModuleExecution` | `EndFlowModuleExecutionActionBuilder` | [`endflowmoduleexecution.html`](https://docs.aws.amazon.com/connect/latest/devguide/endflowmoduleexecution.html)<br>[`end-flow-resume.html`](https://docs.aws.amazon.com/connect/latest/adminguide/end-flow-resume.html) |  |
| `TransferToFlow` | `TransferToFlow` | `flow-language-action` | `Transfer to flow` | `implemented` | `action-builder` | `TransferToFlow` | `TransferToFlowActionBuilder` | [`flow-control-actions-transfertoflow.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-transfertoflow.html)<br>[`transfer-to-flow.html`](https://docs.aws.amazon.com/connect/latest/adminguide/transfer-to-flow.html) |  |
| `TransferParticipantToThirdParty` | `TransferParticipantToThirdParty` | `flow-language-action` | `Transfer to phone number` | `implemented` | `action-builder` | `TransferParticipantToThirdParty` | `TransferParticipantToThirdPartyActionBuilder` | [`transfer-to-phone-number.html`](https://docs.aws.amazon.com/connect/latest/adminguide/transfer-to-phone-number.html) | AWS documents this block through the Admin Guide; the underlying TransferParticipantToThirdParty action name and parameter shape are proven by exported Flow Designer JSON. The package implements the proven transfer contract with ThirdPartyPhoneNumber, ThirdPartyConnectionTimeLimitSeconds, ContinueFlowExecution, optional ThirdPartyDTMFDigits, and optional CallerId.Name/Number. |
| `TransferContactToQueue` | `TransferContactToQueue` | `flow-language-action` | `Transfer to queue` | `implemented` | `action-builder` | `TransferContactToQueue` | `TransferContactToQueueActionBuilder` | [`contact-actions-transfercontacttoqueue.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-transfercontacttoqueue.html)<br>[`transfer-to-queue.html`](https://docs.aws.amazon.com/connect/latest/adminguide/transfer-to-queue.html) | The Transfer to queue Flow Designer block maps to multiple underlying AWS actions by context. This catalog entry covers the TransferContactToQueue mode documented for contacts not already in a queue. This entry covers the not-yet-queued inbound and transfer-flow mode of the Transfer to queue block. Set the working queue first with UpdateContactTargetQueue. |

## Bot and assistant internals

Entries in this category: `2`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ConnectParticipantWithLexBot` | `ConnectParticipantWithLexBot` | `flow-language-action` | `Get customer input` | `implemented` | `action-builder` | `ConnectParticipantWithLexBot` | `ConnectParticipantWithLexBotActionBuilder` | [`participant-actions-connectparticipantwithlexbot.html`](https://docs.aws.amazon.com/connect/latest/devguide/participant-actions-connectparticipantwithlexbot.html) | This is the lower-level AWS action behind Lex-backed customer input handling and is cataloged under core function because the Flow Designer exposes it through higher-level input blocks. |
| `CreateWisdomSession` | `CreateWisdomSession` | `flow-language-action` |  | `implemented` | `action-builder` | `CreateWisdomSession` | `CreateWisdomSessionActionBuilder` | [`createwisdomsession.html`](https://docs.aws.amazon.com/connect/latest/devguide/createwisdomsession.html) |  |

## Contact data and participant state

Entries in this category: `2`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UpdateContactData` | `UpdateContactData` | `flow-language-action` | `Set contact attributes` | `implemented` | `action-builder` | `UpdateContactData` | `UpdateContactDataActionBuilder` | [`contact-actions-updatecontactdata.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatecontactdata.html) | This action addresses Connect-managed contact fields rather than freeform contact attributes, so it remains in the core contact-data category even though operators may encounter it near Set contact attributes patterns. |
| `UpdatePreviousContactParticipantState` | `UpdatePreviousContactParticipantState` | `flow-language-action` |  | `implemented` | `action-builder` | `UpdatePreviousContactParticipantState` | `UpdatePreviousContactParticipantStateActionBuilder` | [`contact-actions-updatepreviouscontactparticipantstate.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-updatepreviouscontactparticipantstate.html) |  |

## Flow state and execution internals

Entries in this category: `1`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `UpdateFlowAttributes` | `UpdateFlowAttributes` | `flow-language-action` | `Set contact attributes` | `implemented` | `action-builder` | `UpdateFlowAttributes` | `UpdateFlowAttributesActionBuilder` | [`flow-control-actions-updateflowattributes.html`](https://docs.aws.amazon.com/connect/latest/devguide/flow-control-actions-updateflowattributes.html) | This action updates flow-scoped state rather than contact attributes, but operators will often encounter it alongside Set contact attributes patterns. |

## Outbound and callback operations

Entries in this category: `3`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CompleteOutboundCall` | `CompleteOutboundCall` | `flow-language-action` |  | `implemented` | `action-builder` | `CompleteOutboundCall` | `CompleteOutboundCallActionBuilder` | [`contact-actions-completeoutboundcall.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-completeoutboundcall.html) |  |
| `CreateCallbackContact` | `CreateCallbackContact` | `flow-language-action` |  | `implemented` | `action-builder` | `CreateCallbackContact` | `CreateCallbackContactActionBuilder` | [`interactions-createcallbackcontact.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-createcallbackcontact.html) |  |
| `StartOutboundChatContact` | `StartOutboundChatContact` | `flow-language-action` |  | `implemented` | `action-builder` | `StartOutboundChatContact` | `StartOutboundChatContactActionBuilder` | [`contact-actions-startoutboundchatcontact.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-startoutboundchatcontact.html) |  |

## Queue and hold messaging

Entries in this category: `1`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `MessageParticipantIteratively` | `MessageParticipantIteratively` | `flow-language-action` | `Play prompt` | `implemented` | `action-builder` | `MessageParticipantIteratively` | `MessageParticipantIterativelyActionBuilder` | [`participant-actions-messageparticipantiteratively.html`](https://docs.aws.amazon.com/connect/latest/devguide/participant-actions-messageparticipantiteratively.html) | This looping prompt action is exposed here as a core AWS action because the Flow Designer UI describes the behavior rather than naming the underlying action directly. |

## Routing and transfer internals

Entries in this category: `3`

| Catalog surface | Underlying AWS action | Kind | Flow Designer block(s) | Status | Package surface kind | Package type | Package export | Docs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DequeueContactAndTransferToQueue` | `DequeueContactAndTransferToQueue` | `flow-language-action` |  | `implemented` | `action-builder` | `DequeueContactAndTransferToQueue` | `DequeueContactAndTransferToQueueActionBuilder` | [`contact-actions-dequeuecontactandtransfertoqueue.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-dequeuecontactandtransfertoqueue.html) |  |
| `TransferContactToAgent` | `TransferContactToAgent` | `flow-language-action` | `Transfer to queue` | `implemented` | `action-builder` | `TransferContactToAgent` | `TransferContactToAgentActionBuilder` | [`contact-actions-transfercontacttoagent.html`](https://docs.aws.amazon.com/connect/latest/devguide/contact-actions-transfercontacttoagent.html) | This agent-targeted transfer is cataloged as a routing internal because the current UI categories surface transfer operations primarily through broader queue- or flow-oriented blocks. |
| `AssociateContactToCustomerProfile` | `AssociateContactToCustomerProfile` | `flow-language-action` |  | `implemented` | `action-builder` | `AssociateContactToCustomerProfile` | `AssociateContactToCustomerProfileActionBuilder` | [`interactions-associatecontacttocustomerprofile.html`](https://docs.aws.amazon.com/connect/latest/devguide/interactions-associatecontacttocustomerprofile.html) | This remains separate from CreatePersistentContactAssociation, which handles persistent chat rehydration rather than customer-profile association. |

## Implemented Package Surface

| AWS surface | UI equivalent | Package surface kind | Package type | Package export |
| --- | --- | --- | --- | --- |
| `AuthenticateParticipant` | `Authenticate Customer` | `action-builder` | `AuthenticateParticipant` | `AuthenticateParticipantActionBuilder` |
| `CreatePersistentContactAssociation` | `Create persistent contact association` | `action-builder` | `CreatePersistentContactAssociation` | `CreatePersistentContactAssociationActionBuilder` |
| `CreateTask` | `Create task` | `action-builder` | `CreateTask` | `CreateTaskActionBuilder` |
| `GetParticipantInput` | `Get customer input` | `action-builder` | `GetParticipantInput` | `GetParticipantInputActionBuilder` |
| `LoadContactContent` | `Get stored content` | `action-builder` | `LoadContactContent` | `LoadContactContentActionBuilder` |
| `MessageParticipant` | `Play prompt`, `Send message` | `action-builder` | `MessageParticipant` | `MessageParticipantActionBuilder` |
| `Store customer input` | `Store customer input` | `ui-wrapper-builder` | `GetParticipantInput` | `StoreCustomerInputActionBuilder` |
| `Connect assistant` | `Connect assistant` | `composite-helper` | `CreateWisdomSession` | `buildConnectAssistant` |
| `TagContact` | `Contact tags` | `action-builder` | `TagContact` | `TagContactActionBuilder` |
| `UnTagContact` | `Contact tags` | `action-builder` | `UnTagContact` | `UnTagContactActionBuilder` |
| `ResumeContact` | `Resume Contact` | `action-builder` | `ResumeContact` | `ResumeContactActionBuilder` |
| `UpdateContactCallbackNumber` | `Set callback number` | `action-builder` | `UpdateContactCallbackNumber` | `UpdateContactCallbackNumberActionBuilder` |
| `UpdateContactAttributes` | `Set contact attributes` | `action-builder` | `UpdateContactAttributes` | `UpdateContactAttributesActionBuilder` |
| `Set customer queue flow` | `Set customer queue flow` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetCustomerQueueFlowActionBuilder` |
| `Set disconnect flow` | `Set disconnect flow` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetDisconnectFlowActionBuilder` |
| `UpdateContactEventHooks` | `Set event flow`, `Set customer queue flow`, `Set disconnect flow`, `Set whisper flow` | `action-builder` | `UpdateContactEventHooks` | `UpdateContactEventHooksActionBuilder` |
| `UpdateRoutingCriteria` | `Set routing criteria` | `action-builder` | `UpdateRoutingCriteria` | `UpdateRoutingCriteriaActionBuilder` |
| `Set Touchtone Buffer Behavior` | `Set Touchtone Buffer Behavior` | `ui-wrapper-builder` | `GetParticipantInput` | `SetTouchtoneBufferBehaviorActionBuilder` |
| `UpdateContactTextToSpeechVoice` | `Set voice` | `action-builder` | `UpdateContactTextToSpeechVoice` | `UpdateContactTextToSpeechVoiceActionBuilder` |
| `StartVoiceIdStream` | `Set voice ID` | `action-builder` | `StartVoiceIdStream` | `StartVoiceIdStreamActionBuilder` |
| `Set whisper flow` | `Set whisper flow` | `ui-wrapper-builder` | `UpdateContactEventHooks` | `SetWhisperFlowActionBuilder` |
| `UpdateContactTargetQueue` | `Set working queue` | `action-builder` | `UpdateContactTargetQueue` | `UpdateContactTargetQueueActionBuilder` |
| `UpdateContactRoutingBehavior` | `Change routing priority / age` | `action-builder` | `UpdateContactRoutingBehavior` | `UpdateContactRoutingBehaviorActionBuilder` |
| `CheckOutboundCallStatus` | `Check call progress` | `action-builder` | `CheckOutboundCallStatus` | `CheckOutboundCallStatusActionBuilder` |
| `Compare` | `Check contact attributes` | `action-builder` | `Compare` | `CompareActionBuilder` |
| `CheckHoursOfOperation` | `Check hours of operation` | `action-builder` | `CheckHoursOfOperation` | `CheckHoursOfOperationActionBuilder` |
| `CheckMetricData` | `Check queue status`, `Check staffing` | `action-builder` | `CheckMetricData` | `CheckMetricDataActionBuilder` |
| `CheckVoiceId` | `Check voice ID` | `action-builder` | `CheckVoiceId` | `CheckVoiceIdActionBuilder` |
| `GetMetricData` | `Get metrics` | `action-builder` | `GetMetricData` | `GetMetricDataActionBuilder` |
| `UpdateFlowLoggingBehavior` | `Set logging behavior` | `action-builder` | `UpdateFlowLoggingBehavior` | `UpdateFlowLoggingBehaviorActionBuilder` |
| `UpdateContactRecordingBehavior` | `Set recording, analytics, and processing behavior` | `action-builder` | `UpdateContactRecordingBehavior` | `UpdateContactRecordingBehaviorActionBuilder` |
| `UpdateContactRecordingAndAnalyticsBehavior` | `Set recording, analytics, and processing behavior` | `action-builder` | `UpdateContactRecordingAndAnalyticsBehavior` | `UpdateContactRecordingAndAnalyticsBehaviorActionBuilder` |
| `UpdateContactMediaProcessing` | `Set recording, analytics, and processing behavior` | `action-builder` | `UpdateContactMediaProcessing` | `UpdateContactMediaProcessingActionBuilder` |
| `UpdateContactMediaStreamingBehavior` | `Start media streaming`, `Stop media streaming` | `action-builder` | `UpdateContactMediaStreamingBehavior` | `UpdateContactMediaStreamingBehaviorActionBuilder` |
| `DistributeByPercentage` | `Distribute by Percentage` | `action-builder` | `DistributeByPercentage` | `DistributeByPercentageActionBuilder` |
| `Loop` | `Loop` | `action-builder` | `Loop` | `LoopActionBuilder` |
| `Wait` | `Wait` | `action-builder` | `Wait` | `WaitActionBuilder` |
| `InvokeLambdaFunction` | `AWS Lambda function` | `action-builder` | `InvokeLambdaFunction` | `InvokeLambdaFunctionActionBuilder` |
| `CreateCase` | `Cases` | `action-builder` | `CreateCase` | `CreateCaseActionBuilder` |
| `GetCase` | `Cases` | `action-builder` | `GetCase` | `GetCaseActionBuilder` |
| `UpdateCase` | `Cases` | `action-builder` | `UpdateCase` | `UpdateCaseActionBuilder` |
| `CreateCustomerProfile` | `Customer profiles` | `action-builder` | `CreateCustomerProfile` | `CreateCustomerProfileActionBuilder` |
| `GetCustomerProfile` | `Customer profiles` | `action-builder` | `GetCustomerProfile` | `GetCustomerProfileActionBuilder` |
| `GetCustomerProfileObject` | `Customer profiles` | `action-builder` | `GetCustomerProfileObject` | `GetCustomerProfileObjectActionBuilder` |
| `GetCalculatedAttributesForCustomerProfile` | `Customer profiles` | `action-builder` | `GetCalculatedAttributesForCustomerProfile` | `GetCalculatedAttributesForCustomerProfileActionBuilder` |
| `UpdateCustomerProfile` | `Customer profiles` | `action-builder` | `UpdateCustomerProfile` | `UpdateCustomerProfileActionBuilder` |
| `EvaluateDataTableValues` | `Data Table` | `action-builder` | `EvaluateDataTableValues` | `EvaluateDataTableValuesActionBuilder` |
| `ListDataTableValues` | `Data Table` | `action-builder` | `ListDataTableValues` | `ListDataTableValuesActionBuilder` |
| `UpsertDataTableValues` | `Data Table` | `action-builder` | `UpsertDataTableValues` | `UpsertDataTableValuesActionBuilder` |
| `InvokeFlowModule` | `Invoke module` | `action-builder` | `InvokeFlowModule` | `InvokeFlowModuleActionBuilder` |
| `ShowView` | `Show View` | `action-builder` | `ShowView` | `ShowViewActionBuilder` |
| `DisconnectParticipant` | `Disconnect` | `action-builder` | `DisconnectParticipant` | `DisconnectParticipantActionBuilder` |
| `EndFlowExecution` | `End flow / Resume` | `action-builder` | `EndFlowExecution` | `EndFlowExecutionActionBuilder` |
| `EndFlowModuleExecution` | `End flow / Resume` | `action-builder` | `EndFlowModuleExecution` | `EndFlowModuleExecutionActionBuilder` |
| `TransferToFlow` | `Transfer to flow` | `action-builder` | `TransferToFlow` | `TransferToFlowActionBuilder` |
| `TransferParticipantToThirdParty` | `Transfer to phone number` | `action-builder` | `TransferParticipantToThirdParty` | `TransferParticipantToThirdPartyActionBuilder` |
| `TransferContactToQueue` | `Transfer to queue` | `action-builder` | `TransferContactToQueue` | `TransferContactToQueueActionBuilder` |
| `ConnectParticipantWithLexBot` | `Get customer input` | `action-builder` | `ConnectParticipantWithLexBot` | `ConnectParticipantWithLexBotActionBuilder` |
| `CreateWisdomSession` |  | `action-builder` | `CreateWisdomSession` | `CreateWisdomSessionActionBuilder` |
| `UpdateContactData` | `Set contact attributes` | `action-builder` | `UpdateContactData` | `UpdateContactDataActionBuilder` |
| `UpdatePreviousContactParticipantState` |  | `action-builder` | `UpdatePreviousContactParticipantState` | `UpdatePreviousContactParticipantStateActionBuilder` |
| `UpdateFlowAttributes` | `Set contact attributes` | `action-builder` | `UpdateFlowAttributes` | `UpdateFlowAttributesActionBuilder` |
| `CompleteOutboundCall` |  | `action-builder` | `CompleteOutboundCall` | `CompleteOutboundCallActionBuilder` |
| `CreateCallbackContact` |  | `action-builder` | `CreateCallbackContact` | `CreateCallbackContactActionBuilder` |
| `StartOutboundChatContact` |  | `action-builder` | `StartOutboundChatContact` | `StartOutboundChatContactActionBuilder` |
| `MessageParticipantIteratively` | `Play prompt` | `action-builder` | `MessageParticipantIteratively` | `MessageParticipantIterativelyActionBuilder` |
| `DequeueContactAndTransferToQueue` |  | `action-builder` | `DequeueContactAndTransferToQueue` | `DequeueContactAndTransferToQueueActionBuilder` |
| `TransferContactToAgent` | `Transfer to queue` | `action-builder` | `TransferContactToAgent` | `TransferContactToAgentActionBuilder` |
| `AssociateContactToCustomerProfile` |  | `action-builder` | `AssociateContactToCustomerProfile` | `AssociateContactToCustomerProfileActionBuilder` |

