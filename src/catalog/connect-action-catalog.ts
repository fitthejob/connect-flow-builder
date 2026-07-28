const AMAZON_CONNECT_DEVGUIDE_BASE_URL =
  "https://docs.aws.amazon.com/connect/latest/devguide/";
const AMAZON_CONNECT_ADMINGUIDE_BASE_URL =
  "https://docs.aws.amazon.com/connect/latest/adminguide/";
const AMAZON_CONNECT_APIREFERENCE_BASE_URL =
  "https://docs.aws.amazon.com/connect/latest/APIReference/";

export const amazonConnectActionCatalogSource = Object.freeze({
  verifiedOn: "2026-06-13",
  developerGuideTocUrl: `${AMAZON_CONNECT_DEVGUIDE_BASE_URL}toc-contents.json`,
  developerGuideActionsOverviewUrl: `${AMAZON_CONNECT_DEVGUIDE_BASE_URL}flow-language-actions.html`,
  adminGuideTocUrl: `${AMAZON_CONNECT_ADMINGUIDE_BASE_URL}toc-contents.json`,
  apiReferenceBaseUrl: AMAZON_CONNECT_APIREFERENCE_BASE_URL,
});

export const FLOW_DESIGNER_UI_CATEGORIES = [
  "INTERACT",
  "SET",
  "CHECK",
  "ANALYZE",
  "LOGIC",
  "INTEGRATE",
  "TERMINATE",
] as const;

export const CORE_FUNCTION_CATEGORIES = [
  "Bot and assistant internals",
  "Contact data and participant state",
  "Flow state and execution internals",
  "Outbound and callback operations",
  "Queue and hold messaging",
  "Routing and transfer internals",
] as const;

export const AMAZON_CONNECT_ACTION_CATEGORIES = [
  ...FLOW_DESIGNER_UI_CATEGORIES,
  ...CORE_FUNCTION_CATEGORIES,
] as const;

export type FlowDesignerUiCategory =
  (typeof FLOW_DESIGNER_UI_CATEGORIES)[number];
export type CoreFunctionCategory = (typeof CORE_FUNCTION_CATEGORIES)[number];
export type AmazonConnectActionCategory =
  (typeof AMAZON_CONNECT_ACTION_CATEGORIES)[number];
export type AmazonConnectActionCategorySource = "ui" | "core";
export type AmazonConnectActionSurfaceKind =
  | "flow-language-action"
  | "designer-block";
export type AmazonConnectDocKind =
  | "developer-guide"
  | "admin-guide"
  | "api-reference";
export type PackageCoverageStatus =
  | "implemented"
  | "implementable-now"
  | "blocked";
export type PackageSurfaceKind =
  | "action-builder"
  | "ui-wrapper-builder"
  | "composite-helper";

export interface AmazonConnectCatalogDocReference {
  kind: AmazonConnectDocKind;
  path: string;
  url: string;
}

export interface AmazonConnectActionCatalogEntry {
  awsAction: string;
  underlyingAwsAction?: string;
  surfaceKind: AmazonConnectActionSurfaceKind;
  category: AmazonConnectActionCategory;
  categorySource: AmazonConnectActionCategorySource;
  uiEquivalents: readonly string[];
  docs: readonly AmazonConnectCatalogDocReference[];
  packageCoverage: {
    status: PackageCoverageStatus;
    packageSurfaceKind?: PackageSurfaceKind;
    packageActionType?: string;
    packageExportName?: string;
    builderClassName?: string;
    definitionModule?: string;
    builderModule?: string;
    rootExported?: boolean;
    notes?: string;
  };
  notes?: string;
}

function developerGuideDoc(path: string): AmazonConnectCatalogDocReference {
  return {
    kind: "developer-guide",
    path,
    url: `${AMAZON_CONNECT_DEVGUIDE_BASE_URL}${path}`,
  };
}

function adminGuideDoc(path: string): AmazonConnectCatalogDocReference {
  return {
    kind: "admin-guide",
    path,
    url: `${AMAZON_CONNECT_ADMINGUIDE_BASE_URL}${path}`,
  };
}

function apiReferenceDoc(path: string): AmazonConnectCatalogDocReference {
  return {
    kind: "api-reference",
    path,
    url: `${AMAZON_CONNECT_APIREFERENCE_BASE_URL}${path}`,
  };
}

function catalogEntry({
  awsAction,
  underlyingAwsAction,
  surfaceKind = "flow-language-action",
  category,
  categorySource,
  uiEquivalents = [],
  docs,
  packageCoverage = { status: "blocked" as const },
  notes,
}: {
  awsAction: string;
  underlyingAwsAction?: string;
  surfaceKind?: AmazonConnectActionSurfaceKind;
  category: AmazonConnectActionCategory;
  categorySource: AmazonConnectActionCategorySource;
  uiEquivalents?: readonly string[];
  docs: readonly AmazonConnectCatalogDocReference[];
  packageCoverage?: AmazonConnectActionCatalogEntry["packageCoverage"];
  notes?: string;
}): AmazonConnectActionCatalogEntry {
  const normalizedPackageCoverage =
    packageCoverage.status === "implemented"
      ? {
          ...packageCoverage,
          packageSurfaceKind:
            packageCoverage.packageSurfaceKind ?? "action-builder",
          packageExportName:
            packageCoverage.packageExportName
            ?? packageCoverage.builderClassName,
        }
      : packageCoverage;

  return {
    awsAction,
    underlyingAwsAction,
    surfaceKind,
    category,
    categorySource,
    uiEquivalents,
    docs,
    packageCoverage: normalizedPackageCoverage,
    notes,
  };
}

export const amazonConnectActionCatalog = [
  catalogEntry({
    awsAction: "AuthenticateParticipant",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Authenticate Customer"],
    docs: [adminGuideDoc("authenticate-customer.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "AuthenticateParticipant",
      builderClassName: "AuthenticateParticipantActionBuilder",
      definitionModule:
        "src/core/actions/interact/authenticate-participant.ts",
      builderModule: "src/actions/interact/authenticate-participant.ts",
      rootExported: true,
    },
    notes:
      "AWS surfaces this through the Flow Designer block 'Authenticate Customer'; the underlying action name is inferred from exported flow JSON because AWS does not currently publish a dedicated Developer Guide action page for it.",
  }),
  catalogEntry({
    awsAction: "CreatePersistentContactAssociation",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Create persistent contact association"],
    docs: [
      apiReferenceDoc("API_CreatePersistentContactAssociation.html"),
      adminGuideDoc("create-persistent-contact-association-block.html"),
      adminGuideDoc("chat-persistence.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CreatePersistentContactAssociation",
      builderClassName: "CreatePersistentContactAssociationActionBuilder",
      definitionModule:
        "src/core/actions/interact/create-persistent-contact-association.ts",
      builderModule:
        "src/actions/interact/create-persistent-contact-association.ts",
      rootExported: true,
    },
    notes:
      "The Flow Designer export and AWS API reference both prove the underlying action name. SourceContactId is the portable contract surface; the Flow Designer namespace/key picker is only an authoring convenience for producing that expression.",
  }),
  catalogEntry({
    awsAction: "CreateTask",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Create task"],
    docs: [
      developerGuideDoc("createtask.html"),
      adminGuideDoc("create-task-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CreateTask",
      builderClassName: "CreateTaskActionBuilder",
      definitionModule: "src/core/actions/interact/create-task.ts",
      builderModule: "src/actions/interact/create-task.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "GetParticipantInput",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Get customer input"],
    docs: [
      developerGuideDoc("participant-actions-getparticipantinput.html"),
      adminGuideDoc("get-customer-input.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "GetParticipantInput",
      builderClassName: "GetParticipantInputActionBuilder",
      definitionModule: "src/core/actions/interact/get-participant-input.ts",
      builderModule: "src/actions/interact/get-participant-input.ts",
      rootExported: true,
      notes:
        "The core action definition now supports multiple valid modes; the package currently exposes the Lex-backed builder directly and additional UI-aligned wrappers when their exported contracts are proven.",
    },
  }),
  catalogEntry({
    awsAction: "LoadContactContent",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Get stored content"],
    docs: [adminGuideDoc("get-stored-content.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "LoadContactContent",
      builderClassName: "LoadContactContentActionBuilder",
      definitionModule: "src/core/actions/interact/load-contact-content.ts",
      builderModule: "src/actions/interact/load-contact-content.ts",
      rootExported: true,
      notes:
        "The live block and Admin Guide currently expose only the EmailMessage content type, so the package intentionally constrains the builder to that proven option.",
    },
    notes:
      "AWS documents this block through the Admin Guide and explicitly identifies the underlying flow-language action as LoadContactContent.",
  }),
  catalogEntry({
    awsAction: "MessageParticipant",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Play prompt", "Send message"],
    docs: [
      developerGuideDoc("participant-actions-messageparticipant.html"),
      adminGuideDoc("play.html"),
      adminGuideDoc("send-message.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "MessageParticipant",
      builderClassName: "MessageParticipantActionBuilder",
      definitionModule: "src/core/actions/interact/message-participant.ts",
      builderModule: "src/actions/interact/message-participant.ts",
      rootExported: true,
    },
    notes:
      "The developer-guide action covers both audio prompt and text-message behavior depending on channel.",
  }),
  catalogEntry({
    awsAction: "Store customer input",
    underlyingAwsAction: "GetParticipantInput",
    category: "INTERACT",
    categorySource: "ui",
    uiEquivalents: ["Store customer input"],
    docs: [adminGuideDoc("store-customer-input.html")],
    packageCoverage: {
      status: "implemented",
      packageSurfaceKind: "ui-wrapper-builder",
      packageActionType: "GetParticipantInput",
      builderClassName: "StoreCustomerInputActionBuilder",
      definitionModule: "src/core/actions/interact/get-participant-input.ts",
      builderModule: "src/actions/interact/store-customer-input.ts",
      rootExported: true,
      notes:
        "The package currently implements the proven custom-digit mode only: StoreInput True, DTMFConfiguration, InputTimeLimitSeconds, and InputValidation.CustomValidation.MaximumLength. Phone-number, encryption, and prompt variants remain intentionally deferred until exported JSON proves their exact contracts.",
    },
    notes:
      "AWS documents Store customer input as a GetParticipantInput-based block that stores digits into the Stored customer input system attribute.",
  }),

  catalogEntry({
    awsAction: "Connect assistant",
    underlyingAwsAction: "CreateWisdomSession + UpdateContactData",
    surfaceKind: "designer-block",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Connect assistant"],
    docs: [adminGuideDoc("connect-assistant-block.html")],
    packageCoverage: {
      status: "implemented",
      packageSurfaceKind: "composite-helper",
      packageActionType: "CreateWisdomSession",
      builderClassName: "buildConnectAssistant",
      builderModule: "src/composites/connect-assistant.ts",
      rootExported: true,
      notes:
        "This UI block is implemented as a composite helper that emits CreateWisdomSession followed by UpdateContactData.WisdomSessionArn = $.Wisdom.SessionArn.",
    },
    notes:
      "The block expands into two underlying AWS actions rather than a single flow-language action, so the package exposes it as a composite helper instead of a standalone action builder.",
  }),
  catalogEntry({
    awsAction: "TagContact",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Contact tags"],
    docs: [
      developerGuideDoc("contact-actions-tagcontact.html"),
      adminGuideDoc("contact-tags-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "TagContact",
      builderClassName: "TagContactActionBuilder",
      definitionModule: "src/core/actions/set/tag-contact.ts",
      builderModule: "src/actions/set/tag-contact.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UnTagContact",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Contact tags"],
    docs: [
      developerGuideDoc("contact-actions-untagcontact.html"),
      adminGuideDoc("contact-tags-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UnTagContact",
      builderClassName: "UnTagContactActionBuilder",
      definitionModule: "src/core/actions/set/untag-contact.ts",
      builderModule: "src/actions/set/untag-contact.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "ResumeContact",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Resume Contact"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactresumecontact.html"),
      adminGuideDoc("resume-contact.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "ResumeContact",
      builderClassName: "ResumeContactActionBuilder",
      definitionModule: "src/core/actions/set/resume-contact.ts",
      builderModule: "src/actions/set/resume-contact.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactCallbackNumber",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set callback number"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactcallbacknumber.html"),
      adminGuideDoc("set-callback-number.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactCallbackNumber",
      builderClassName: "UpdateContactCallbackNumberActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-callback-number.ts",
      builderModule: "src/actions/set/update-contact-callback-number.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactAttributes",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set contact attributes"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactattributes.html"),
      adminGuideDoc("set-contact-attributes.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactAttributes",
      builderClassName: "UpdateContactAttributesActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-attributes.ts",
      builderModule: "src/actions/set/update-contact-attributes.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "Set customer queue flow",
    underlyingAwsAction: "UpdateContactEventHooks",
    surfaceKind: "designer-block",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set customer queue flow"],
    docs: [adminGuideDoc("set-customer-queue-flow.html")],
    packageCoverage: {
      status: "implemented",
      packageSurfaceKind: "ui-wrapper-builder",
      packageActionType: "UpdateContactEventHooks",
      builderClassName: "SetCustomerQueueFlowActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-event-hooks.ts",
      builderModule: "src/actions/set/set-customer-queue-flow.ts",
      rootExported: true,
      notes:
        "This UI-aligned wrapper emits UpdateContactEventHooks with EventHooks constrained to CustomerQueue.",
    },
    notes:
      "AWS currently documents this as a Flow Designer block in the Admin Guide rather than as a separate flow-language action page.",
  }),
  catalogEntry({
    awsAction: "Set disconnect flow",
    underlyingAwsAction: "UpdateContactEventHooks",
    surfaceKind: "designer-block",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set disconnect flow"],
    docs: [adminGuideDoc("set-disconnect-flow.html")],
    packageCoverage: {
      status: "implemented",
      packageSurfaceKind: "ui-wrapper-builder",
      packageActionType: "UpdateContactEventHooks",
      builderClassName: "SetDisconnectFlowActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-event-hooks.ts",
      builderModule: "src/actions/set/set-disconnect-flow.ts",
      rootExported: true,
      notes:
        "This UI-aligned wrapper emits UpdateContactEventHooks with EventHooks constrained to CustomerRemaining.",
    },
    notes:
      "The admin-guide block and exported JSON align with the UpdateContactEventHooks developer-guide contract, where CustomerRemaining is a valid static event-hook key.",
  }),
  catalogEntry({
    awsAction: "UpdateContactEventHooks",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: [
      "Set event flow",
      "Set customer queue flow",
      "Set disconnect flow",
      "Set whisper flow",
    ],
    docs: [
      developerGuideDoc("contact-actions-updatecontacteventhooks.html"),
      adminGuideDoc("set-event-flow.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactEventHooks",
      builderClassName: "UpdateContactEventHooksActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-event-hooks.ts",
      builderModule: "src/actions/set/update-contact-event-hooks.ts",
      rootExported: true,
      notes:
        "This low-level action underpins Set event flow and the implemented customer queue, disconnect, and whisper hook wrappers.",
    },
  }),
  catalogEntry({
    awsAction: "UpdateRoutingCriteria",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set routing criteria"],
    docs: [
      developerGuideDoc("flow-control-actions-updateroutingcriteria.html"),
      adminGuideDoc("set-routing-criteria.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateRoutingCriteria",
      builderClassName: "UpdateRoutingCriteriaActionBuilder",
      definitionModule: "src/core/actions/set/update-routing-criteria.ts",
      builderModule: "src/actions/set/update-routing-criteria.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "Set Touchtone Buffer Behavior",
    underlyingAwsAction: "GetParticipantInput",
    surfaceKind: "designer-block",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set Touchtone Buffer Behavior"],
    docs: [adminGuideDoc("set-touchtone-buffer-behavior.html")],
    packageCoverage: {
      status: "implemented",
      packageSurfaceKind: "ui-wrapper-builder",
      packageActionType: "GetParticipantInput",
      builderClassName: "SetTouchtoneBufferBehaviorActionBuilder",
      definitionModule: "src/core/actions/interact/get-participant-input.ts",
      builderModule: "src/actions/set/set-touchtone-buffer-behavior.ts",
      rootExported: true,
      notes:
        "The package implements the proven Enable and Stop and Clear forms, including the documented optional StoreInput and InputEncryption parameters for Stop and Clear.",
    },
    notes:
      "AWS explicitly documents this block as a GetParticipantInput-based Flow Designer surface using the EnableDTMFBuffer parameter.",
  }),
  catalogEntry({
    awsAction: "UpdateContactTextToSpeechVoice",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set voice"],
    docs: [
      developerGuideDoc("contact-actions-updatecontacttexttospeechvoice.html"),
      adminGuideDoc("set-voice.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactTextToSpeechVoice",
      builderClassName: "UpdateContactTextToSpeechVoiceActionBuilder",
      definitionModule:
        "src/core/actions/set/update-contact-text-to-speech-voice.ts",
      builderModule:
        "src/actions/set/update-contact-text-to-speech-voice.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "StartVoiceIdStream",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set voice ID"],
    docs: [
      developerGuideDoc("flow-control-actions-startvoiceidstream.html"),
      adminGuideDoc("set-voice-id.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "StartVoiceIdStream",
      builderClassName: "StartVoiceIdStreamActionBuilder",
      definitionModule: "src/core/actions/set/start-voice-id-stream.ts",
      builderModule: "src/actions/set/start-voice-id-stream.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "Set whisper flow",
    underlyingAwsAction: "UpdateContactEventHooks",
    surfaceKind: "designer-block",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set whisper flow"],
    docs: [adminGuideDoc("set-whisper-flow.html")],
    packageCoverage: {
      status: "implemented",
      packageSurfaceKind: "ui-wrapper-builder",
      packageActionType: "UpdateContactEventHooks",
      builderClassName: "SetWhisperFlowActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-event-hooks.ts",
      builderModule: "src/actions/set/set-whisper-flow.ts",
      rootExported: true,
      notes:
        "This UI-aligned wrapper emits UpdateContactEventHooks with EventHooks constrained to CustomerWhisper.",
    },
    notes:
      "AWS currently documents this as a Flow Designer block in the Admin Guide rather than as a separate flow-language action page.",
  }),
  catalogEntry({
    awsAction: "UpdateContactTargetQueue",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Set working queue"],
    docs: [
      developerGuideDoc("contact-actions-updatecontacttargetqueue.html"),
      adminGuideDoc("set-working-queue.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactTargetQueue",
      builderClassName: "UpdateContactTargetQueueActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-target-queue.ts",
      builderModule: "src/actions/set/update-contact-target-queue.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactRoutingBehavior",
    category: "SET",
    categorySource: "ui",
    uiEquivalents: ["Change routing priority / age"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactroutingbehavior.html"),
      adminGuideDoc("change-routing-priority.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactRoutingBehavior",
      builderClassName: "UpdateContactRoutingBehaviorActionBuilder",
      definitionModule: "src/core/actions/set/update-contact-routing-behavior.ts",
      builderModule: "src/actions/set/update-contact-routing-behavior.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "CheckOutboundCallStatus",
    category: "CHECK",
    categorySource: "ui",
    uiEquivalents: ["Check call progress"],
    docs: [
      developerGuideDoc("flow-control-actions-checkoutboundcallstatus.html"),
      adminGuideDoc("check-call-progress.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CheckOutboundCallStatus",
      builderClassName: "CheckOutboundCallStatusActionBuilder",
      definitionModule: "src/core/actions/check/check-outbound-call-status.ts",
      builderModule: "src/actions/check/check-outbound-call-status.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "Compare",
    category: "CHECK",
    categorySource: "ui",
    uiEquivalents: ["Check contact attributes"],
    docs: [
      developerGuideDoc("flow-control-actions-compare.html"),
      adminGuideDoc("check-contact-attributes.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "Compare",
      builderClassName: "CompareActionBuilder",
      definitionModule: "src/core/actions/check/compare.ts",
      builderModule: "src/actions/check/compare.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "CheckHoursOfOperation",
    category: "CHECK",
    categorySource: "ui",
    uiEquivalents: ["Check hours of operation"],
    docs: [
      developerGuideDoc("flow-control-actions-checkhoursofoperation.html"),
      adminGuideDoc("check-hours-of-operation.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CheckHoursOfOperation",
      builderClassName: "CheckHoursOfOperationActionBuilder",
      definitionModule: "src/core/actions/check/check-hours-of-operation.ts",
      builderModule: "src/actions/check/check-hours-of-operation.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "CheckMetricData",
    category: "CHECK",
    categorySource: "ui",
    uiEquivalents: ["Check queue status", "Check staffing"],
    docs: [
      developerGuideDoc("flow-control-actions-checkmetricdata.html"),
      adminGuideDoc("check-queue-status.html"),
      adminGuideDoc("check-staffing.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CheckMetricData",
      builderClassName: "CheckMetricDataActionBuilder",
      definitionModule: "src/core/actions/check/check-metric-data.ts",
      builderModule: "src/actions/check/check-metric-data.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "CheckVoiceId",
    category: "CHECK",
    categorySource: "ui",
    uiEquivalents: ["Check voice ID"],
    docs: [
      developerGuideDoc("flow-control-actions-checkvoiceid.html"),
      adminGuideDoc("check-voice-id.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CheckVoiceId",
      builderClassName: "CheckVoiceIdActionBuilder",
      definitionModule: "src/core/actions/check/check-voice-id.ts",
      builderModule: "src/actions/check/check-voice-id.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "GetMetricData",
    category: "CHECK",
    categorySource: "ui",
    uiEquivalents: ["Get metrics"],
    docs: [
      developerGuideDoc("flow-control-actions-getmetricdata.html"),
      adminGuideDoc("get-queue-metrics.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "GetMetricData",
      builderClassName: "GetMetricDataActionBuilder",
      definitionModule: "src/core/actions/check/get-metric-data.ts",
      builderModule: "src/actions/check/get-metric-data.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "UpdateFlowLoggingBehavior",
    category: "ANALYZE",
    categorySource: "ui",
    uiEquivalents: ["Set logging behavior"],
    docs: [
      developerGuideDoc("flow-control-actions-updateflowloggingbehavior.html"),
      adminGuideDoc("set-logging-behavior.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateFlowLoggingBehavior",
      builderClassName: "UpdateFlowLoggingBehaviorActionBuilder",
      definitionModule:
        "src/core/actions/analyze/update-flow-logging-behavior.ts",
      builderModule: "src/actions/analyze/update-flow-logging-behavior.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactRecordingBehavior",
    category: "ANALYZE",
    categorySource: "ui",
    uiEquivalents: ["Set recording, analytics, and processing behavior"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactrecordingbehavior.html"),
      adminGuideDoc("set-recording-behavior.html"),
      adminGuideDoc("set-recording-analytics-processing-behavior.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactRecordingBehavior",
      builderClassName: "UpdateContactRecordingBehaviorActionBuilder",
      definitionModule:
        "src/core/actions/analyze/update-contact-recording-behavior.ts",
      builderModule: "src/actions/analyze/update-contact-recording-behavior.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactRecordingAndAnalyticsBehavior",
    category: "ANALYZE",
    categorySource: "ui",
    uiEquivalents: ["Set recording, analytics, and processing behavior"],
    docs: [
      developerGuideDoc(
        "contact-actions-updatecontactrecordingandanalyticsbehavior.html",
      ),
      adminGuideDoc("set-recording-analytics-processing-behavior.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactRecordingAndAnalyticsBehavior",
      builderClassName: "UpdateContactRecordingAndAnalyticsBehaviorActionBuilder",
      definitionModule:
        "src/core/actions/analyze/update-contact-recording-and-analytics-behavior.ts",
      builderModule:
        "src/actions/analyze/update-contact-recording-and-analytics-behavior.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactMediaProcessing",
    category: "ANALYZE",
    categorySource: "ui",
    uiEquivalents: ["Set recording, analytics, and processing behavior"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactmediaprocessing.html"),
      adminGuideDoc("set-recording-analytics-processing-behavior.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactMediaProcessing",
      builderClassName: "UpdateContactMediaProcessingActionBuilder",
      definitionModule:
        "src/core/actions/analyze/update-contact-media-processing.ts",
      builderModule: "src/actions/analyze/update-contact-media-processing.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateContactMediaStreamingBehavior",
    category: "ANALYZE",
    categorySource: "ui",
    uiEquivalents: ["Start media streaming", "Stop media streaming"],
    docs: [
      developerGuideDoc("contact-actions-updatecontactmediastreamingbehavior.html"),
      adminGuideDoc("start-media-streaming.html"),
      adminGuideDoc("stop-media-streaming.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactMediaStreamingBehavior",
      builderClassName: "UpdateContactMediaStreamingBehaviorActionBuilder",
      definitionModule:
        "src/core/actions/analyze/update-contact-media-streaming-behavior.ts",
      builderModule:
        "src/actions/analyze/update-contact-media-streaming-behavior.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "DistributeByPercentage",
    category: "LOGIC",
    categorySource: "ui",
    uiEquivalents: ["Distribute by Percentage"],
    docs: [
      developerGuideDoc("flow-control-actions-distributebypercentage.html"),
      adminGuideDoc("distribute-by-percentage.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "DistributeByPercentage",
      builderClassName: "DistributeByPercentageActionBuilder",
      definitionModule: "src/core/actions/logic/distribute-by-percentage.ts",
      builderModule: "src/actions/logic/distribute-by-percentage.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "Loop",
    category: "LOGIC",
    categorySource: "ui",
    uiEquivalents: ["Loop"],
    docs: [
      developerGuideDoc("flow-control-actions-loop.html"),
      adminGuideDoc("loop.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "Loop",
      builderClassName: "LoopActionBuilder",
      definitionModule: "src/core/actions/logic/loop.ts",
      builderModule: "src/actions/logic/loop.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "Wait",
    category: "LOGIC",
    categorySource: "ui",
    uiEquivalents: ["Wait"],
    docs: [
      developerGuideDoc("flow-control-actions-wait.html"),
      adminGuideDoc("wait.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "Wait",
      builderClassName: "WaitActionBuilder",
      definitionModule: "src/core/actions/logic/wait.ts",
      builderModule: "src/actions/logic/wait.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "InvokeLambdaFunction",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["AWS Lambda function"],
    docs: [
      developerGuideDoc("interactions-invokelambdafunction.html"),
      adminGuideDoc("invoke-lambda-function-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "InvokeLambdaFunction",
      builderClassName: "InvokeLambdaFunctionActionBuilder",
      definitionModule: "src/core/actions/integrate/invoke-lambda.ts",
      builderModule: "src/actions/integrate/invoke-lambda.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "CreateCase",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Cases"],
    docs: [
      developerGuideDoc("createcase.html"),
      adminGuideDoc("cases-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CreateCase",
      builderClassName: "CreateCaseActionBuilder",
      definitionModule: "src/core/actions/integrate/create-case.ts",
      builderModule: "src/actions/integrate/create-case.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "GetCase",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Cases"],
    docs: [
      developerGuideDoc("getcase.html"),
      adminGuideDoc("cases-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "GetCase",
      builderClassName: "GetCaseActionBuilder",
      definitionModule: "src/core/actions/integrate/get-case.ts",
      builderModule: "src/actions/integrate/get-case.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateCase",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Cases"],
    docs: [
      developerGuideDoc("updatecase.html"),
      adminGuideDoc("cases-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateCase",
      builderClassName: "UpdateCaseActionBuilder",
      definitionModule: "src/core/actions/integrate/update-case.ts",
      builderModule: "src/actions/integrate/update-case.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "CreateCustomerProfile",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Customer profiles"],
    docs: [
      developerGuideDoc("interactions-createcustomerprofile.html"),
      adminGuideDoc("customer-profiles-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CreateCustomerProfile",
      builderClassName: "CreateCustomerProfileActionBuilder",
      definitionModule: "src/core/actions/integrate/create-customer-profile.ts",
      builderModule: "src/actions/integrate/create-customer-profile.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "GetCustomerProfile",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Customer profiles"],
    docs: [
      developerGuideDoc("interactions-getcustomerprofile.html"),
      adminGuideDoc("customer-profiles-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "GetCustomerProfile",
      builderClassName: "GetCustomerProfileActionBuilder",
      definitionModule: "src/core/actions/integrate/get-customer-profile.ts",
      builderModule: "src/actions/integrate/get-customer-profile.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "GetCustomerProfileObject",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Customer profiles"],
    docs: [
      developerGuideDoc("interactions-getcustomerprofileobject.html"),
      adminGuideDoc("customer-profiles-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "GetCustomerProfileObject",
      builderClassName: "GetCustomerProfileObjectActionBuilder",
      definitionModule:
        "src/core/actions/integrate/get-customer-profile-object.ts",
      builderModule: "src/actions/integrate/get-customer-profile-object.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "GetCalculatedAttributesForCustomerProfile",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Customer profiles"],
    docs: [
      developerGuideDoc(
        "interactions-getcalculatedattributesforcustomerprofile.html",
      ),
      adminGuideDoc("customer-profiles-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "GetCalculatedAttributesForCustomerProfile",
      builderClassName: "GetCalculatedAttributesForCustomerProfileActionBuilder",
      definitionModule:
        "src/core/actions/integrate/get-calculated-attributes-for-customer-profile.ts",
      builderModule:
        "src/actions/integrate/get-calculated-attributes-for-customer-profile.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "UpdateCustomerProfile",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Customer profiles"],
    docs: [
      developerGuideDoc("interactions-updatecustomerprofile.html"),
      adminGuideDoc("customer-profiles-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateCustomerProfile",
      builderClassName: "UpdateCustomerProfileActionBuilder",
      definitionModule: "src/core/actions/integrate/update-customer-profile.ts",
      builderModule: "src/actions/integrate/update-customer-profile.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "EvaluateDataTableValues",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Data Table"],
    docs: [adminGuideDoc("data-table-block.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "EvaluateDataTableValues",
      builderClassName: "EvaluateDataTableValuesActionBuilder",
      definitionModule:
        "src/core/actions/integrate/evaluate-data-table-values.ts",
      builderModule: "src/actions/integrate/evaluate-data-table-values.ts",
      rootExported: true,
      notes:
        "The package implements the proven evaluate mode with DataTableId and Queries, including QueryName, Attributes, and PrimaryValues.AttributeName/Value entries.",
    },
    notes:
      "AWS documents Data Table through the Admin Guide; the underlying EvaluateDataTableValues action name and parameter shape are proven by exported Flow Designer JSON.",
  }),
  catalogEntry({
    awsAction: "ListDataTableValues",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Data Table"],
    docs: [adminGuideDoc("data-table-block.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "ListDataTableValues",
      builderClassName: "ListDataTableValuesActionBuilder",
      definitionModule:
        "src/core/actions/integrate/list-data-table-values.ts",
      builderModule: "src/actions/integrate/list-data-table-values.ts",
      rootExported: true,
      notes:
        "The package implements the proven list mode with DataTableId and PrimaryKeyGroups, including PrimaryKeyGroupName and PrimaryValues.Name/Value entries.",
    },
    notes:
      "AWS documents Data Table through the Admin Guide; the underlying ListDataTableValues action name and parameter shape are proven by exported Flow Designer JSON.",
  }),
  catalogEntry({
    awsAction: "UpsertDataTableValues",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Data Table"],
    docs: [adminGuideDoc("data-table-block.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpsertDataTableValues",
      builderClassName: "UpsertDataTableValuesActionBuilder",
      definitionModule:
        "src/core/actions/integrate/upsert-data-table-values.ts",
      builderModule: "src/actions/integrate/upsert-data-table-values.ts",
      rootExported: true,
      notes:
        "The package implements the proven structured-input upsert mode with LockVersion, DataTableId, DataTableUpsertAttributes, PrimaryValues.Name/Value, and Attributes.Name/Value plus optional UseDefaultValue boolean.",
    },
    notes:
      "AWS documents Data Table through the Admin Guide; the underlying UpsertDataTableValues action name and structured-input parameter shape are proven by exported Flow Designer JSON. The alternate raw-JSON authoring mode remains intentionally deferred until its export shape is captured.",
  }),
  catalogEntry({
    awsAction: "InvokeFlowModule",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Invoke module"],
    docs: [
      developerGuideDoc("flow-language-actions-invoke-flow-module.html"),
      adminGuideDoc("invoke-module-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "InvokeFlowModule",
      builderClassName: "InvokeFlowModuleActionBuilder",
      definitionModule: "src/core/actions/integrate/invoke-flow-module.ts",
      builderModule: "src/actions/integrate/invoke-flow-module.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "ShowView",
    category: "INTEGRATE",
    categorySource: "ui",
    uiEquivalents: ["Show View"],
    docs: [
      developerGuideDoc("participant-actions-showview.html"),
      adminGuideDoc("show-view-block.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "ShowView",
      builderClassName: "ShowViewActionBuilder",
      definitionModule: "src/core/actions/integrate/show-view.ts",
      builderModule: "src/actions/integrate/show-view.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "DisconnectParticipant",
    category: "TERMINATE",
    categorySource: "ui",
    uiEquivalents: ["Disconnect"],
    docs: [
      developerGuideDoc("participant-actions-disconnectparticipant.html"),
      adminGuideDoc("disconnect-hang-up.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "DisconnectParticipant",
      builderClassName: "DisconnectParticipantActionBuilder",
      definitionModule: "src/core/actions/terminate/disconnect.ts",
      builderModule: "src/actions/terminate/disconnect.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "EndFlowExecution",
    category: "TERMINATE",
    categorySource: "ui",
    uiEquivalents: ["End flow / Resume"],
    docs: [
      developerGuideDoc("flow-control-actions-endflowexecution.html"),
      adminGuideDoc("end-flow-resume.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "EndFlowExecution",
      builderClassName: "EndFlowExecutionActionBuilder",
      definitionModule: "src/core/actions/terminate/end-flow-execution.ts",
      builderModule: "src/actions/terminate/end-flow-execution.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "EndFlowModuleExecution",
    category: "TERMINATE",
    categorySource: "ui",
    uiEquivalents: ["End flow / Resume"],
    docs: [
      developerGuideDoc("endflowmoduleexecution.html"),
      adminGuideDoc("end-flow-resume.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "EndFlowModuleExecution",
      builderClassName: "EndFlowModuleExecutionActionBuilder",
      definitionModule:
        "src/core/actions/terminate/end-flow-module-execution.ts",
      builderModule: "src/actions/terminate/end-flow-module-execution.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "TransferToFlow",
    category: "TERMINATE",
    categorySource: "ui",
    uiEquivalents: ["Transfer to flow"],
    docs: [
      developerGuideDoc("flow-control-actions-transfertoflow.html"),
      adminGuideDoc("transfer-to-flow.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "TransferToFlow",
      builderClassName: "TransferToFlowActionBuilder",
      definitionModule: "src/core/actions/terminate/transfer-to-flow.ts",
      builderModule: "src/actions/terminate/transfer-to-flow.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "TransferParticipantToThirdParty",
    category: "TERMINATE",
    categorySource: "ui",
    uiEquivalents: ["Transfer to phone number"],
    docs: [adminGuideDoc("transfer-to-phone-number.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "TransferParticipantToThirdParty",
      builderClassName: "TransferParticipantToThirdPartyActionBuilder",
      definitionModule:
        "src/core/actions/terminate/transfer-participant-to-third-party.ts",
      builderModule:
        "src/actions/terminate/transfer-participant-to-third-party.ts",
      rootExported: true,
      notes:
        "The package implements the proven transfer contract with ThirdPartyPhoneNumber, ThirdPartyConnectionTimeLimitSeconds, ContinueFlowExecution, optional ThirdPartyDTMFDigits, and optional CallerId.Name/Number.",
    },
    notes:
      "AWS documents this block through the Admin Guide; the underlying TransferParticipantToThirdParty action name and parameter shape are proven by exported Flow Designer JSON.",
  }),
  catalogEntry({
    awsAction: "TransferContactToQueue",
    category: "TERMINATE",
    categorySource: "ui",
    uiEquivalents: ["Transfer to queue"],
    docs: [
      developerGuideDoc("contact-actions-transfercontacttoqueue.html"),
      adminGuideDoc("transfer-to-queue.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "TransferContactToQueue",
      builderClassName: "TransferContactToQueueActionBuilder",
      definitionModule: "src/core/actions/terminate/transfer-to-queue.ts",
      builderModule: "src/actions/terminate/transfer-to-queue.ts",
      rootExported: true,
      notes:
        "This entry covers the not-yet-queued inbound and transfer-flow mode of the Transfer to queue block. Set the working queue first with UpdateContactTargetQueue.",
    },
    notes:
      "The Transfer to queue Flow Designer block maps to multiple underlying AWS actions by context. This catalog entry covers the TransferContactToQueue mode documented for contacts not already in a queue.",
  }),

  catalogEntry({
    awsAction: "ConnectParticipantWithLexBot",
    category: "Bot and assistant internals",
    categorySource: "core",
    docs: [developerGuideDoc("participant-actions-connectparticipantwithlexbot.html")],
    uiEquivalents: ["Get customer input"],
    packageCoverage: {
      status: "implemented",
      packageActionType: "ConnectParticipantWithLexBot",
      builderClassName: "ConnectParticipantWithLexBotActionBuilder",
      definitionModule:
        "src/core/actions/bot-and-assistant-internals/connect-participant-with-lex-bot.ts",
      builderModule:
        "src/actions/bot-and-assistant-internals/connect-participant-with-lex-bot.ts",
      rootExported: true,
    },
    notes:
      "This is the lower-level AWS action behind Lex-backed customer input handling and is cataloged under core function because the Flow Designer exposes it through higher-level input blocks.",
  }),
  catalogEntry({
    awsAction: "CreateWisdomSession",
    category: "Bot and assistant internals",
    categorySource: "core",
    docs: [developerGuideDoc("createwisdomsession.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CreateWisdomSession",
      builderClassName: "CreateWisdomSessionActionBuilder",
      definitionModule:
        "src/core/actions/bot-and-assistant-internals/create-wisdom-session.ts",
      builderModule:
        "src/actions/bot-and-assistant-internals/create-wisdom-session.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "UpdateContactData",
    category: "Contact data and participant state",
    categorySource: "core",
    docs: [developerGuideDoc("contact-actions-updatecontactdata.html")],
    uiEquivalents: ["Set contact attributes"],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateContactData",
      builderClassName: "UpdateContactDataActionBuilder",
      definitionModule:
        "src/core/actions/contact-data-and-participant-state/update-contact-data.ts",
      builderModule:
        "src/actions/contact-data-and-participant-state/update-contact-data.ts",
      rootExported: true,
    },
    notes:
      "This action addresses Connect-managed contact fields rather than freeform contact attributes, so it remains in the core contact-data category even though operators may encounter it near Set contact attributes patterns.",
  }),
  catalogEntry({
    awsAction: "UpdatePreviousContactParticipantState",
    category: "Contact data and participant state",
    categorySource: "core",
    docs: [
      developerGuideDoc("contact-actions-updatepreviouscontactparticipantstate.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdatePreviousContactParticipantState",
      builderClassName: "UpdatePreviousContactParticipantStateActionBuilder",
      definitionModule:
        "src/core/actions/contact-data-and-participant-state/update-previous-contact-participant-state.ts",
      builderModule:
        "src/actions/contact-data-and-participant-state/update-previous-contact-participant-state.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "UpdateFlowAttributes",
    category: "Flow state and execution internals",
    categorySource: "core",
    docs: [developerGuideDoc("flow-control-actions-updateflowattributes.html")],
    uiEquivalents: ["Set contact attributes"],
    packageCoverage: {
      status: "implemented",
      packageActionType: "UpdateFlowAttributes",
      builderClassName: "UpdateFlowAttributesActionBuilder",
      definitionModule:
        "src/core/actions/flow-state-and-execution-internals/update-flow-attributes.ts",
      builderModule:
        "src/actions/flow-state-and-execution-internals/update-flow-attributes.ts",
      rootExported: true,
    },
    notes:
      "This action updates flow-scoped state rather than contact attributes, but operators will often encounter it alongside Set contact attributes patterns.",
  }),

  catalogEntry({
    awsAction: "CompleteOutboundCall",
    category: "Outbound and callback operations",
    categorySource: "core",
    docs: [developerGuideDoc("contact-actions-completeoutboundcall.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CompleteOutboundCall",
      builderClassName: "CompleteOutboundCallActionBuilder",
      definitionModule:
        "src/core/actions/outbound-and-callback-operations/complete-outbound-call.ts",
      builderModule:
        "src/actions/outbound-and-callback-operations/complete-outbound-call.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "CreateCallbackContact",
    category: "Outbound and callback operations",
    categorySource: "core",
    docs: [developerGuideDoc("interactions-createcallbackcontact.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "CreateCallbackContact",
      builderClassName: "CreateCallbackContactActionBuilder",
      definitionModule:
        "src/core/actions/outbound-and-callback-operations/create-callback-contact.ts",
      builderModule:
        "src/actions/outbound-and-callback-operations/create-callback-contact.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "StartOutboundChatContact",
    category: "Outbound and callback operations",
    categorySource: "core",
    docs: [developerGuideDoc("contact-actions-startoutboundchatcontact.html")],
    packageCoverage: {
      status: "implemented",
      packageActionType: "StartOutboundChatContact",
      builderClassName: "StartOutboundChatContactActionBuilder",
      definitionModule:
        "src/core/actions/outbound-and-callback-operations/start-outbound-chat-contact.ts",
      builderModule:
        "src/actions/outbound-and-callback-operations/start-outbound-chat-contact.ts",
      rootExported: true,
    },
  }),

  catalogEntry({
    awsAction: "MessageParticipantIteratively",
    category: "Queue and hold messaging",
    categorySource: "core",
    uiEquivalents: ["Play prompt"],
    docs: [
      developerGuideDoc("participant-actions-messageparticipantiteratively.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "MessageParticipantIteratively",
      builderClassName: "MessageParticipantIterativelyActionBuilder",
      definitionModule:
        "src/core/actions/queue-and-hold-messaging/message-participant-iteratively.ts",
      builderModule:
        "src/actions/queue-and-hold-messaging/message-participant-iteratively.ts",
      rootExported: true,
    },
    notes:
      "This looping prompt action is exposed here as a core AWS action because the Flow Designer UI describes the behavior rather than naming the underlying action directly.",
  }),

  catalogEntry({
    awsAction: "DequeueContactAndTransferToQueue",
    category: "Routing and transfer internals",
    categorySource: "core",
    docs: [
      developerGuideDoc("contact-actions-dequeuecontactandtransfertoqueue.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "DequeueContactAndTransferToQueue",
      builderClassName: "DequeueContactAndTransferToQueueActionBuilder",
      definitionModule:
        "src/core/actions/routing-and-transfer-internals/dequeue-contact-and-transfer-to-queue.ts",
      builderModule:
        "src/actions/routing-and-transfer-internals/dequeue-contact-and-transfer-to-queue.ts",
      rootExported: true,
    },
  }),
  catalogEntry({
    awsAction: "TransferContactToAgent",
    category: "Routing and transfer internals",
    categorySource: "core",
    docs: [developerGuideDoc("contact-actions-transfercontacttoagent.html")],
    uiEquivalents: ["Transfer to queue"],
    packageCoverage: {
      status: "implemented",
      packageActionType: "TransferContactToAgent",
      builderClassName: "TransferContactToAgentActionBuilder",
      definitionModule:
        "src/core/actions/routing-and-transfer-internals/transfer-contact-to-agent.ts",
      builderModule:
        "src/actions/routing-and-transfer-internals/transfer-contact-to-agent.ts",
      rootExported: true,
    },
    notes:
      "This agent-targeted transfer is cataloged as a routing internal because the current UI categories surface transfer operations primarily through broader queue- or flow-oriented blocks.",
  }),
  catalogEntry({
    awsAction: "AssociateContactToCustomerProfile",
    category: "Routing and transfer internals",
    categorySource: "core",
    docs: [
      developerGuideDoc("interactions-associatecontacttocustomerprofile.html"),
    ],
    packageCoverage: {
      status: "implemented",
      packageActionType: "AssociateContactToCustomerProfile",
      builderClassName: "AssociateContactToCustomerProfileActionBuilder",
      definitionModule:
        "src/core/actions/routing-and-transfer-internals/associate-contact-to-customer-profile.ts",
      builderModule:
        "src/actions/routing-and-transfer-internals/associate-contact-to-customer-profile.ts",
      rootExported: true,
    },
    notes:
      "This remains separate from CreatePersistentContactAssociation, which handles persistent chat rehydration rather than customer-profile association.",
  }),
] as const satisfies readonly AmazonConnectActionCatalogEntry[];

export const amazonConnectActionCatalogByCategory = Object.freeze(
  AMAZON_CONNECT_ACTION_CATEGORIES.reduce(
    (accumulator, category) => {
      accumulator[category] = amazonConnectActionCatalog.filter(
        (entry) => entry.category === category,
      );
      return accumulator;
    },
    {} as Record<
      AmazonConnectActionCategory,
      readonly AmazonConnectActionCatalogEntry[]
    >,
  ),
);

export const implementedAmazonConnectActions = amazonConnectActionCatalog.filter(
  (entry) => entry.packageCoverage.status === "implemented",
);

export const implementedActionBuilderAmazonConnectActions =
  implementedAmazonConnectActions.filter(
    (entry) => entry.packageCoverage.packageSurfaceKind !== "composite-helper",
  );

export const implementedCompositeAmazonConnectActions =
  implementedAmazonConnectActions.filter(
    (entry) => entry.packageCoverage.packageSurfaceKind === "composite-helper",
  );

export const implementableNowAmazonConnectActions =
  amazonConnectActionCatalog.filter(
    (entry) => entry.packageCoverage.status === "implementable-now",
  );

export const blockedAmazonConnectActions = amazonConnectActionCatalog.filter(
  (entry) => entry.packageCoverage.status === "blocked",
);
