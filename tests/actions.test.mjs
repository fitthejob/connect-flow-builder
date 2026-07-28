import assert from "node:assert/strict";
import test from "node:test";

import {
  AssociateContactToCustomerProfileActionBuilder,
  AuthenticateParticipantActionBuilder,
  CHECK_VOICE_ID_OPTIONS,
  SUPPORTED_CONDITION_OPERATORS,
  CHECK_METRIC_DATA_METRIC_TYPES,
  CheckOutboundCallStatusActionBuilder,
  CheckVoiceIdActionBuilder,
  CheckHoursOfOperationActionBuilder,
  CheckMetricDataActionBuilder,
  ConnectParticipantWithLexBotActionBuilder,
  CompleteOutboundCallActionBuilder,
  CreateCaseActionBuilder,
  CreateCallbackContactActionBuilder,
  CreateCustomerProfileActionBuilder,
  CreatePersistentContactAssociationActionBuilder,
  CreateTaskActionBuilder,
  CreateWisdomSessionActionBuilder,
  CompareActionBuilder,
  DequeueContactAndTransferToQueueActionBuilder,
  DisconnectParticipantActionBuilder,
  DistributeByPercentageActionBuilder,
  EndFlowExecutionActionBuilder,
  EndFlowModuleExecutionActionBuilder,
  EvaluateDataTableValuesActionBuilder,
  FlowBuilder,
  GetCaseActionBuilder,
  GetCalculatedAttributesForCustomerProfileActionBuilder,
  GetCustomerProfileActionBuilder,
  GetCustomerProfileObjectActionBuilder,
  GetParticipantInputActionBuilder,
  FLOW_LOGGING_BEHAVIORS,
  GetMetricDataActionBuilder,
  InvokeLambdaFunctionActionBuilder,
  InvokeFlowModuleActionBuilder,
  LOAD_CONTACT_CONTENT_TYPES,
  LoadContactContentActionBuilder,
  ListDataTableValuesActionBuilder,
  LOOP_OPERANDS,
  LoopActionBuilder,
  MessageParticipantActionBuilder,
  MessageParticipantIterativelyActionBuilder,
  PERSISTENT_CONTACT_REHYDRATION_TYPES,
  PREVIOUS_CONTACT_PARTICIPANT_STATES,
  ResumeContactActionBuilder,
  SetCustomerQueueFlowActionBuilder,
  SetDisconnectFlowActionBuilder,
  SetTouchtoneBufferBehaviorActionBuilder,
  StoreCustomerInputActionBuilder,
  SetWhisperFlowActionBuilder,
  ShowViewActionBuilder,
  StartOutboundChatContactActionBuilder,
  StartVoiceIdStreamActionBuilder,
  TagContactActionBuilder,
  TransferContactToAgentActionBuilder,
  TransferContactToQueueActionBuilder,
  TransferParticipantToThirdPartyActionBuilder,
  TransferToFlowActionBuilder,
  UnTagContactActionBuilder,
  UpdateContactCallbackNumberActionBuilder,
  UpdateContactDataActionBuilder,
  UpdateContactEventHooksActionBuilder,
  UpdateContactMediaProcessingActionBuilder,
  UpdateContactMediaStreamingBehaviorActionBuilder,
  UpdatePreviousContactParticipantStateActionBuilder,
  UpdateContactRecordingAndAnalyticsBehaviorActionBuilder,
  UpdateRoutingCriteriaActionBuilder,
  UpdateContactAttributesActionBuilder,
  UpdateContactRoutingBehaviorActionBuilder,
  UpdateContactRecordingBehaviorActionBuilder,
  UpdateContactTargetQueueActionBuilder,
  UpdateContactTextToSpeechVoiceActionBuilder,
  UpdateCaseActionBuilder,
  UpdateCustomerProfileActionBuilder,
  UpdateFlowAttributesActionBuilder,
  UpdateFlowLoggingBehaviorActionBuilder,
  UpsertDataTableValuesActionBuilder,
  WAIT_EVENTS,
  WaitActionBuilder,
  buildConnectAssistant,
  equalsCondition,
  numberGreaterThanCondition,
  textStartsWithCondition,
} from "../dist/index.js";

test("CompareActionBuilder emits the expected comparison block", () => {
  const action = new CompareActionBuilder("CheckTier")
    .comparisonValue("$.Attributes.customerTier")
    .when(equalsCondition("VIP"), "VipRoute")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "Compare");
  assert.deepEqual(action.parameters, {
    ComparisonValue: "$.Attributes.customerTier",
  });
  assert.deepEqual(action.transitions, {
    conditions: [
      {
        nextAction: "VipRoute",
        condition: {
          operator: "Equals",
          operands: ["VIP"],
        },
      },
    ],
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingCondition",
      },
    ],
  });
});

test("CheckHoursOfOperationActionBuilder emits the expected business-hours check block", () => {
  const action = new CheckHoursOfOperationActionBuilder("CheckHours")
    .hoursOfOperationId("arn:aws:connect:hours/example")
    .whenInHours("OpenRoute")
    .whenOutOfHours("ClosedRoute")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CheckHoursOfOperation");
  assert.deepEqual(action.parameters, {
    HoursOfOperationId: "arn:aws:connect:hours/example",
  });
  assert.deepEqual(action.transitions?.conditions, [
    {
      nextAction: "OpenRoute",
      condition: {
        operator: "Equals",
        operands: ["True"],
      },
    },
    {
      nextAction: "ClosedRoute",
      condition: {
        operator: "Equals",
        operands: ["False"],
      },
    },
  ]);
});

test("CheckMetricDataActionBuilder emits the expected queue metric check block", () => {
  const action = new CheckMetricDataActionBuilder("CheckQueueDepth")
    .numberOfContactsInQueue()
    .queueId("arn:aws:connect:queue/example")
    .when(numberGreaterThanCondition("10"), "Overflow")
    .onError("TransferToQueue", "NoMatchingCondition")
    .build();

  assert.equal(action.type, "CheckMetricData");
  assert.deepEqual(action.parameters, {
    MetricType: "NumberOfContactsInQueue",
    QueueId: "arn:aws:connect:queue/example",
  });
  assert.deepEqual(action.transitions, {
    conditions: [
      {
        nextAction: "Overflow",
        condition: {
          operator: "NumberGreaterThan",
          operands: ["10"],
        },
      },
    ],
    errors: [
      {
        nextAction: "TransferToQueue",
        errorType: "NoMatchingCondition",
      },
    ],
  });
});

test("CheckOutboundCallStatusActionBuilder emits the expected outbound-call branching block", () => {
  const action = new CheckOutboundCallStatusActionBuilder("CheckProgress")
    .whenCallAnswered("Answered")
    .whenVoicemailBeep("Voicemail")
    .whenNotDetected("Unknown")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CheckOutboundCallStatus");
  assert.deepEqual(action.parameters, {});
  assert.deepEqual(action.transitions, {
    conditions: [
      {
        nextAction: "Answered",
        condition: {
          operator: "Equals",
          operands: ["CallAnswered"],
        },
      },
      {
        nextAction: "Voicemail",
        condition: {
          operator: "Equals",
          operands: ["VoicemailBeep"],
        },
      },
      {
        nextAction: "Unknown",
        condition: {
          operator: "Equals",
          operands: ["NotDetected"],
        },
      },
    ],
    errors: [
      {
        nextAction: "Disconnect",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("ConnectParticipantWithLexBotActionBuilder emits the expected Lex handoff block", () => {
  const action = new ConnectParticipantWithLexBotActionBuilder("LexAssist")
    .text("How can I help?")
    .lexV2BotAliasArn("arn:aws:lex:us-east-1:123456789012:bot-alias/example")
    .sessionAttribute("channel", "voice")
    .initialMessage("welcome")
    .lexTimeoutTextSeconds(15)
    .whenIntentEquals("OrderStatus", "RouteOrders")
    .onInputTimeLimitExceeded("Retry")
    .onNoMatchingCondition("Fallback")
    .next("Transfer")
    .build();

  assert.equal(action.type, "ConnectParticipantWithLexBot");
  assert.deepEqual(action.parameters, {
    Text: "How can I help?",
    LexV2Bot: {
      AliasArn: "arn:aws:lex:us-east-1:123456789012:bot-alias/example",
    },
    LexSessionAttributes: {
      channel: "voice",
    },
    LexInitializationData: {
      InitialMessage: "welcome",
    },
    LexTimeoutSeconds: {
      Text: 15,
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Transfer",
    conditions: [
      {
        nextAction: "RouteOrders",
        condition: {
          operator: "Equals",
          operands: ["OrderStatus"],
        },
      },
    ],
    errors: [
      {
        nextAction: "Retry",
        errorType: "InputTimeLimitExceeded",
      },
      {
        nextAction: "Fallback",
        errorType: "NoMatchingCondition",
      },
    ],
  });
});

test("AuthenticateParticipantActionBuilder emits the expected customer-authentication block", () => {
  const action = new AuthenticateParticipantActionBuilder("AuthenticateCustomer")
    .userPoolArn("arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_example")
    .appClientId("37o41q129d529vipi3f1q4b377")
    .customerProfilesObjectTypeName("email")
    .timeLimitMinutes(3)
    .whenOptedOut("OptOutRoute")
    .onTimeLimitExceeded("TimeoutRoute")
    .onError("FallbackRoute")
    .next("SuccessRoute")
    .build();

  assert.equal(action.type, "AuthenticateParticipant");
  assert.deepEqual(action.parameters, {
    CognitoConfiguration: {
      UserPoolArn: "arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_example",
      AppClientId: "37o41q129d529vipi3f1q4b377",
    },
    CustomerProfilesConfiguration: {
      ObjectTypeName: "email",
    },
    TimeLimitMinutes: "3",
  });
  assert.deepEqual(action.transitions, {
    nextAction: "SuccessRoute",
    conditions: [
      {
        nextAction: "OptOutRoute",
        condition: {
          operator: "Equals",
          operands: ["OptedOut"],
        },
      },
    ],
    errors: [
      {
        nextAction: "TimeoutRoute",
        errorType: "TimeLimitExceeded",
      },
      {
        nextAction: "FallbackRoute",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("CreatePersistentContactAssociationActionBuilder emits the expected persistent-chat association block", () => {
  const action = new CreatePersistentContactAssociationActionBuilder("PersistChat")
    .entirePastSession()
    .sourceContactId("$.Attributes.PreviousChatContactId")
    .next("ContinueChat")
    .onError("Fallback")
    .build();

  assert.deepEqual(PERSISTENT_CONTACT_REHYDRATION_TYPES, [
    "ENTIRE_PAST_SESSION",
    "FROM_SEGMENT",
  ]);
  assert.equal(action.type, "CreatePersistentContactAssociation");
  assert.deepEqual(action.parameters, {
    RehydrationType: "ENTIRE_PAST_SESSION",
    SourceContactId: "$.Attributes.PreviousChatContactId",
  });
  assert.deepEqual(action.transitions, {
    nextAction: "ContinueChat",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("SetCustomerQueueFlowActionBuilder emits the expected customer-queue hook block", () => {
  const action = new SetCustomerQueueFlowActionBuilder("SetCustomerQueueFlow")
    .customerQueueFlowId("arn:aws:connect:us-east-1:123456789012:contact-flow/customer-queue")
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "UpdateContactEventHooks");
  assert.deepEqual(action.parameters, {
    EventHooks: {
      CustomerQueue:
        "arn:aws:connect:us-east-1:123456789012:contact-flow/customer-queue",
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("SetCustomerQueueFlowActionBuilder accepts an ARN-specific helper for the same hook", () => {
  const action = new SetCustomerQueueFlowActionBuilder("SetCustomerQueueFlow")
    .customerQueueFlowArn(
      "arn:aws:connect:us-east-1:123456789012:contact-flow/customer-queue",
    )
    .build();

  assert.equal(action.type, "UpdateContactEventHooks");
  assert.deepEqual(action.parameters, {
    EventHooks: {
      CustomerQueue:
        "arn:aws:connect:us-east-1:123456789012:contact-flow/customer-queue",
    },
  });
});

test("SetWhisperFlowActionBuilder emits the expected customer-whisper hook block", () => {
  const action = new SetWhisperFlowActionBuilder("SetWhisperFlow")
    .whisperFlowId("arn:aws:connect:us-east-1:123456789012:contact-flow/customer-whisper")
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "UpdateContactEventHooks");
  assert.deepEqual(action.parameters, {
    EventHooks: {
      CustomerWhisper:
        "arn:aws:connect:us-east-1:123456789012:contact-flow/customer-whisper",
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("SetDisconnectFlowActionBuilder emits the expected customer-remaining hook block", () => {
  const action = new SetDisconnectFlowActionBuilder("SetDisconnectFlow")
    .disconnectFlowId("arn:aws:connect:us-east-1:123456789012:contact-flow/disconnect")
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "UpdateContactEventHooks");
  assert.deepEqual(action.parameters, {
    EventHooks: {
      CustomerRemaining:
        "arn:aws:connect:us-east-1:123456789012:contact-flow/disconnect",
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("LoadContactContentActionBuilder emits the expected stored-email-content block", () => {
  const action = new LoadContactContentActionBuilder("LoadStoredEmail")
    .emailMessage()
    .next("CheckEmailBody")
    .onError("Fallback")
    .build();

  assert.deepEqual(LOAD_CONTACT_CONTENT_TYPES, ["EmailMessage"]);
  assert.equal(action.type, "LoadContactContent");
  assert.deepEqual(action.parameters, {
    ContentType: "EmailMessage",
  });
  assert.deepEqual(action.transitions, {
    nextAction: "CheckEmailBody",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("StoreCustomerInputActionBuilder emits the expected custom-digit stored-input block", () => {
  const action = new StoreCustomerInputActionBuilder("StoreDigits")
    .inputTimeLimitSeconds(5)
    .interdigitTimeLimitSeconds(5)
    .maximumDigits(20)
    .disableCancelKey(false)
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "GetParticipantInput");
  assert.deepEqual(action.parameters, {
    StoreInput: "True",
    InputTimeLimitSeconds: "5",
    DTMFConfiguration: {
      DisableCancelKey: "False",
      InterdigitTimeLimitSeconds: "5",
    },
    InputValidation: {
      CustomValidation: {
        MaximumLength: "20",
      },
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("SetTouchtoneBufferBehaviorActionBuilder emits the expected enable-buffering block", () => {
  const action = new SetTouchtoneBufferBehaviorActionBuilder("EnableBuffer")
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "GetParticipantInput");
  assert.deepEqual(action.parameters, {
    EnableDTMFBuffer: "True",
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("SetTouchtoneBufferBehaviorActionBuilder emits the expected stop-and-clear encrypted block", () => {
  const action = new SetTouchtoneBufferBehaviorActionBuilder("ClearBuffer")
    .inputEncryption("kms-key-id", "plaintext-key")
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "GetParticipantInput");
  assert.deepEqual(action.parameters, {
    EnableDTMFBuffer: "False",
    StoreInput: "True",
    InputEncryption: {
      EncryptionKeyId: "kms-key-id",
      Key: "plaintext-key",
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("buildConnectAssistant emits the expected CreateWisdomSession plus UpdateContactData segment", () => {
  const segment = buildConnectAssistant({
    wisdomAssistantArn: "arn:aws:wisdom:us-east-1:123456789012:assistant/example",
    nextActionId: "Continue",
    errorActionId: "Fallback",
  });

  assert.equal(segment.startActionId, "ConnectAssistant");
  assert.deepEqual(segment.actions, [
    {
      id: "ConnectAssistant",
      type: "CreateWisdomSession",
      parameters: {
        WisdomAssistantArn:
          "arn:aws:wisdom:us-east-1:123456789012:assistant/example",
      },
      transitions: {
        nextAction: "SetContactData",
        errors: [
          {
            nextAction: "Fallback",
            errorType: "NoMatchingError",
          },
        ],
      },
    },
    {
      id: "SetContactData",
      type: "UpdateContactData",
      parameters: {
        TargetContact: "Current",
        WisdomSessionArn: "$.Wisdom.SessionArn",
      },
      transitions: {
        nextAction: "Continue",
        errors: [
          {
            nextAction: "Fallback",
            errorType: "NoMatchingError",
          },
        ],
      },
    },
  ]);
});

test("EvaluateDataTableValuesActionBuilder emits the expected evaluate-data-table block", () => {
  const action = new EvaluateDataTableValuesActionBuilder("ReadFromDataTable")
    .dataTableId("2dcc9707-d408-4729-a2d8-a76f08eca0f2")
    .query(
      "TestQuery",
      ["accountStatus", "routingQueue"],
      [
        {
          AttributeName: "customerId",
          Value: "$.Attributes.customerId",
        },
      ],
    )
    .query(
      "TestQuery2",
      ["loyaltyTier"],
      [
        {
          AttributeName: "customerId",
          Value: "$.Attributes.customerId",
        },
      ],
    )
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "EvaluateDataTableValues");
  assert.deepEqual(action.parameters, {
    DataTableId: "2dcc9707-d408-4729-a2d8-a76f08eca0f2",
    Queries: [
      {
        QueryName: "TestQuery",
        Attributes: ["accountStatus", "routingQueue"],
        PrimaryValues: [
          {
            AttributeName: "customerId",
            Value: "$.Attributes.customerId",
          },
        ],
      },
      {
        QueryName: "TestQuery2",
        Attributes: ["loyaltyTier"],
        PrimaryValues: [
          {
            AttributeName: "customerId",
            Value: "$.Attributes.customerId",
          },
        ],
      },
    ],
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("ListDataTableValuesActionBuilder emits the expected list-data-table block", () => {
  const action = new ListDataTableValuesActionBuilder("ListFromDataTable")
    .dataTableId("2dcc9707-d408-4729-a2d8-a76f08eca0f2")
    .primaryKeyGroup("TestPrimaryValueGroup", [
      {
        Name: "customerId",
        Value: "$.Attributes.customerId",
      },
    ])
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "ListDataTableValues");
  assert.deepEqual(action.parameters, {
    DataTableId: "2dcc9707-d408-4729-a2d8-a76f08eca0f2",
    PrimaryKeyGroups: [
      {
        PrimaryKeyGroupName: "TestPrimaryValueGroup",
        PrimaryValues: [
          {
            Name: "customerId",
            Value: "$.Attributes.customerId",
          },
        ],
      },
    ],
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("UpsertDataTableValuesActionBuilder emits the expected structured-input upsert block", () => {
  const action = new UpsertDataTableValuesActionBuilder("WriteToDataTable")
    .dataTableId("2dcc9707-d408-4729-a2d8-a76f08eca0f2")
    .upsertAttributeGroup(
      "TestPrimaryValueGroup",
      [
        {
          Name: "customerId",
          Value: "$.Attributes.customerId",
        },
      ],
      [
        {
          Name: "routingQueue",
          Value: "$.Attributes.routingQueue",
          UseDefaultValue: false,
        },
      ],
    )
    .next("Continue")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "UpsertDataTableValues");
  assert.deepEqual(action.parameters, {
    LockVersion: "LATEST",
    DataTableId: "2dcc9707-d408-4729-a2d8-a76f08eca0f2",
    DataTableUpsertAttributes: [
      {
        PrimaryKeyGroupName: "TestPrimaryValueGroup",
        PrimaryValues: [
          {
            Name: "customerId",
            Value: "$.Attributes.customerId",
          },
        ],
        Attributes: [
          {
            Name: "routingQueue",
            Value: "$.Attributes.routingQueue",
            UseDefaultValue: false,
          },
        ],
      },
    ],
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("CreateCaseActionBuilder emits the expected case creation block", () => {
  const action = new CreateCaseActionBuilder("CreateCase")
    .linkContactToCase()
    .caseTemplateId("template-123")
    .caseField("customerId", "$.Attributes.customerId")
    .caseField("summary", "Voice follow-up")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CreateCase");
  assert.deepEqual(action.parameters, {
    LinkContactToCase: "true",
    CaseTemplateId: "template-123",
    CaseRequestFields: {
      customerId: "$.Attributes.customerId",
      summary: "Voice follow-up",
    },
  });
});

test("GetCaseActionBuilder emits the expected case retrieval block", () => {
  const action = new GetCaseActionBuilder("GetCase")
    .linkContactToCase()
    .getLastUpdatedCase()
    .customerId("$.Attributes.customerId")
    .caseRequestField("region", "us-east-1")
    .caseResponseField("caseId")
    .caseResponseField("status")
    .next("Disconnect")
    .onError("Disconnect", "NoMatchingError")
    .onError("Disconnect", "ContactNotLinked")
    .onError("Disconnect", "MultipleFound")
    .onError("Disconnect", "NoneFound")
    .build();

  assert.equal(action.type, "GetCase");
  assert.deepEqual(action.parameters, {
    LinkContactToCase: "true",
    GetLastUpdatedCase: "true",
    CustomerId: "$.Attributes.customerId",
    CaseRequestFields: {
      region: "us-east-1",
    },
    CaseResponseFields: ["caseId", "status"],
  });
});

test("UpdateCaseActionBuilder emits the expected case update block", () => {
  const action = new UpdateCaseActionBuilder("UpdateCase")
    .linkContactToCase()
    .caseId("$.External.caseId")
    .caseField("status", "open")
    .caseField("owner", "voice-ops")
    .next("Disconnect")
    .onError("Disconnect", "ContactNotLinked")
    .onError("Disconnect", "NoMatchingError")
    .build();

  assert.equal(action.type, "UpdateCase");
  assert.deepEqual(action.parameters, {
    LinkContactToCase: "true",
    CaseId: "$.External.caseId",
    CaseRequestFields: {
      status: "open",
      owner: "voice-ops",
    },
  });
});

test("CreateCustomerProfileActionBuilder emits the expected customer profile creation block", () => {
  const action = new CreateCustomerProfileActionBuilder("CreateProfile")
    .requestField("FirstName", "Ada")
    .requestField("LastName", "Lovelace")
    .responseField("ProfileId")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CreateCustomerProfile");
  assert.deepEqual(action.parameters, {
    ProfileRequestData: {
      FirstName: "Ada",
      LastName: "Lovelace",
    },
    ProfileResponseData: {
      ProfileId: true,
    },
  });
});

test("GetCustomerProfileActionBuilder emits the expected identifier-based lookup block", () => {
  const action = new GetCustomerProfileActionBuilder("GetProfile")
    .identifier("CustomerId", "$.Attributes.customerId")
    .responseField("ProfileId")
    .responseField("FirstName")
    .next("Disconnect")
    .onError("Disconnect", "MultipleFoundError")
    .onError("Disconnect", "NoneFoundError")
    .onError("Disconnect", "NoMatchingError")
    .build();

  assert.equal(action.type, "GetCustomerProfile");
  assert.deepEqual(action.parameters, {
    ProfileRequestData: {
      IdentifierName: "CustomerId",
      IdentifierValue: "$.Attributes.customerId",
    },
    ProfileResponseData: ["ProfileId", "FirstName"],
  });
});

test("GetCustomerProfileObjectActionBuilder emits the expected profile object lookup block", () => {
  const action = new GetCustomerProfileObjectActionBuilder("GetProfileObject")
    .profileId("$.External.ProfileId")
    .objectType("Customer")
    .useLatest()
    .responseField("ObjectId")
    .next("Disconnect")
    .onError("Disconnect", "NoneFoundError")
    .onError("Disconnect", "NoMatchingError")
    .build();

  assert.equal(action.type, "GetCustomerProfileObject");
  assert.deepEqual(action.parameters, {
    ProfileRequestData: {
      ProfileId: "$.External.ProfileId",
      ObjectType: "Customer",
      UseLatest: true,
    },
    ProfileResponseData: {
      ObjectId: true,
    },
  });
});

test("UpdateCustomerProfileActionBuilder emits the expected profile update block", () => {
  const action = new UpdateCustomerProfileActionBuilder("UpdateProfile")
    .requestField("ProfileId", "$.External.ProfileId")
    .requestField("PreferredChannel", "voice")
    .responseField("ProfileId")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateCustomerProfile");
  assert.deepEqual(action.parameters, {
    ProfileRequestData: {
      ProfileId: "$.External.ProfileId",
      PreferredChannel: "voice",
    },
    ProfileResponseData: {
      ProfileId: true,
    },
  });
});

test("CreateTaskActionBuilder emits the expected task-creation block", () => {
  const action = new CreateTaskActionBuilder("CreateTask")
    .contactFlowId("arn:aws:connect:flow/task")
    .name("Follow-up task")
    .description("Created from the flow.")
    .attribute("priority", "high")
    .reference("ticketId", "$.Attributes.ticketId")
    .delaySeconds(300)
    .taskTemplateId("template-123")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CreateTask");
  assert.deepEqual(action.parameters, {
    ContactFlowId: "arn:aws:connect:flow/task",
    Name: "Follow-up task",
    Description: "Created from the flow.",
    Attributes: {
      priority: "high",
    },
    References: {
      ticketId: "$.Attributes.ticketId",
    },
    DelaySeconds: 300,
    TaskTemplateId: "template-123",
  });
});

test("DistributeByPercentageActionBuilder emits cumulative threshold branches", () => {
  const action = new DistributeByPercentageActionBuilder("Distribute")
    .addDistribution(60, "Primary")
    .addDistribution(30, "Secondary")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "DistributeByPercentage");
  assert.deepEqual(action.parameters, {});
  assert.deepEqual(action.transitions, {
    conditions: [
      {
        nextAction: "Primary",
        condition: {
          operator: "NumberLessThan",
          operands: ["60"],
        },
      },
      {
        nextAction: "Secondary",
        condition: {
          operator: "NumberLessThan",
          operands: ["90"],
        },
      },
    ],
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingCondition",
      },
    ],
  });
});

test("WaitActionBuilder emits the expected wait block", () => {
  const action = new WaitActionBuilder("WaitForReturn")
    .timeoutSeconds(60)
    .events(...WAIT_EVENTS)
    .onWaitCompleted("Timeout")
    .onEvent("CustomerReturned", "Resume")
    .onEvent("BotParticipantDisconnected", "Escalate")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "Wait");
  assert.deepEqual(action.parameters, {
    TimeoutSeconds: 60,
    Events: ["CustomerReturned", "BotParticipantDisconnected"],
  });
  assert.deepEqual(action.transitions?.conditions, [
    {
      nextAction: "Timeout",
      condition: {
        operator: "Equals",
        operands: ["WaitCompleted"],
      },
    },
    {
      nextAction: "Resume",
      condition: {
        operator: "Equals",
        operands: ["CustomerReturned"],
      },
    },
    {
      nextAction: "Escalate",
      condition: {
        operator: "Equals",
        operands: ["BotParticipantDisconnected"],
      },
    },
  ]);
});

test("UpdateRoutingCriteriaActionBuilder emits the expected routing criteria block", () => {
  const action = new UpdateRoutingCriteriaActionBuilder("SetRoutingCriteria")
    .staticRoutingCriteria()
    .addAttributeConditionStep(
      {
        Name: "Skill.Chat",
        Value: "4",
        ProficiencyLevel: 4,
        ComparisonOperator: "NumberGreaterOrEqualTo",
      },
      45,
    )
    .next("ShowGuide")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateRoutingCriteria");
  assert.deepEqual(action.parameters, {
    RoutingCriteria: {
      Steps: [
        {
          Expression: {
            AttributeCondition: {
              Name: "Skill.Chat",
              Value: "4",
              ProficiencyLevel: 4,
              ComparisonOperator: "NumberGreaterOrEqualTo",
            },
          },
          Expiry: {
            DurationInSeconds: 45,
          },
        },
      ],
    },
  });
});

test("ShowViewActionBuilder emits the expected view invocation block", () => {
  const action = new ShowViewActionBuilder("ShowGuide")
    .viewResource("view-id", "1")
    .invocationTimeLimitSeconds(400)
    .viewData("customerTier", "$.Attributes.customerTier")
    .hideResponseOnTranscript()
    .when(equalsCondition("Continue"), "Resume")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "ShowView");
  assert.deepEqual(action.parameters, {
    ViewResource: {
      Id: "view-id",
      Version: "1",
    },
    InvocationTimeLimitSeconds: 400,
    ViewData: {
      customerTier: "$.Attributes.customerTier",
    },
    SensitiveDataConfiguration: {
      HideResponseOn: ["TRANSCRIPT"],
    },
  });
});

test("TransferToFlowActionBuilder emits the expected transfer-to-flow block", () => {
  const action = new TransferToFlowActionBuilder("OverflowTransfer")
    .contactFlowId("arn:aws:connect:flow/example")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "TransferToFlow");
  assert.deepEqual(action.parameters, {
    ContactFlowId: "arn:aws:connect:flow/example",
  });
});

test("TransferParticipantToThirdPartyActionBuilder emits the expected phone-transfer block", () => {
  const action = new TransferParticipantToThirdPartyActionBuilder("TransferToPhoneNumber")
    .thirdPartyPhoneNumber("+16164982290")
    .connectionTimeLimitSeconds(30)
    .continueFlowExecution(true)
    .thirdPartyDtmfDigits("#")
    .callerId("TEST_CALLER_OD", "$.CallbackNumber")
    .next("Continue")
    .onError("CallFailedRoute", "CallFailed")
    .onError("TimeLimitRoute", "ConnectionTimeLimitExceeded")
    .onError("Fallback", "NoMatchingError")
    .build();

  assert.equal(action.type, "TransferParticipantToThirdParty");
  assert.deepEqual(action.parameters, {
    ThirdPartyConnectionTimeLimitSeconds: "30",
    ContinueFlowExecution: "True",
    ThirdPartyPhoneNumber: "+16164982290",
    ThirdPartyDTMFDigits: "#",
    CallerId: {
      Name: "TEST_CALLER_OD",
      Number: "$.CallbackNumber",
    },
  });
  assert.deepEqual(action.transitions, {
    nextAction: "Continue",
    errors: [
      {
        nextAction: "CallFailedRoute",
        errorType: "CallFailed",
      },
      {
        nextAction: "TimeLimitRoute",
        errorType: "ConnectionTimeLimitExceeded",
      },
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("MessageParticipantActionBuilder emits the expected type, parameters, and transitions", () => {
  const action = new MessageParticipantActionBuilder("PlayGreeting")
    .text("Hello there.")
    .next("GetInput")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "MessageParticipant");
  assert.deepEqual(action.parameters, { Text: "Hello there." });
  assert.deepEqual(action.transitions, {
    nextAction: "GetInput",
    errors: [
      {
        nextAction: "Disconnect",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("MessageParticipantIterativelyActionBuilder emits the expected looping prompt block", () => {
  const action = new MessageParticipantIterativelyActionBuilder("LoopPrompt")
    .addText("Still there?")
    .addPromptId("prompt-follow-up")
    .interruptFrequencySeconds(10)
    .onMessagesInterrupted("Resume")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "MessageParticipantIteratively");
  assert.deepEqual(action.parameters, {
    Messages: [
      { Text: "Still there?" },
      { PromptId: "prompt-follow-up" },
    ],
    InterruptFrequencySeconds: 10,
  });
  assert.deepEqual(action.transitions, {
    conditions: [
      {
        nextAction: "Resume",
        condition: {
          operator: "Equals",
          operands: ["MessagesInterrupted"],
        },
      },
    ],
    errors: [
      {
        nextAction: "Disconnect",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("LoopActionBuilder emits the expected loop-control block", () => {
  const action = new LoopActionBuilder("RetryLoop")
    .loopCount(2)
    .whenContinueLooping("RetryTask")
    .whenDoneLooping("Disconnect")
    .build();

  assert.equal(action.type, "Loop");
  assert.deepEqual(action.parameters, {
    LoopCount: 2,
  });
  assert.deepEqual(action.transitions, {
    conditions: [
      {
        nextAction: "RetryTask",
        condition: {
          operator: "Equals",
          operands: ["ContinueLooping"],
        },
      },
      {
        nextAction: "Disconnect",
        condition: {
          operator: "Equals",
          operands: ["DoneLooping"],
        },
      },
    ],
  });
});

test("GetParticipantInputActionBuilder emits the expected Lex-backed input block", () => {
  const action = new GetParticipantInputActionBuilder("GetInput")
    .text("How can we help?")
    .lexBotAliasArn("arn:aws:lex:example")
    .when(equalsCondition("sales"), "RouteSales")
    .when(textStartsWithCondition("bill"), "RouteBilling")
    .next("Transfer")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "GetParticipantInput");
  assert.deepEqual(action.parameters, {
    InputTimeLimitSeconds: "5",
    StoreInput: "False",
    Text: "How can we help?",
    LexV2Bot: "arn:aws:lex:example",
  });
  assert.equal(action.transitions?.nextAction, "Transfer");
  assert.deepEqual(action.transitions?.conditions, [
    {
      nextAction: "RouteSales",
      condition: {
        operator: "Equals",
        operands: ["sales"],
      },
    },
    {
      nextAction: "RouteBilling",
      condition: {
        operator: "TextStartsWith",
        operands: ["bill"],
      },
    },
  ]);
});

test("InvokeLambdaFunctionActionBuilder emits the expected Lambda parameter", () => {
  const action = new InvokeLambdaFunctionActionBuilder("InvokeAssist")
    .lambdaArn("arn:aws:lambda:example")
    .next("Transfer")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "InvokeLambdaFunction");
  assert.deepEqual(action.parameters, {
    InvocationTimeLimitSeconds: "8",
    LambdaFunctionARN: "arn:aws:lambda:example",
  });
});

test("InvokeFlowModuleActionBuilder emits the expected module invocation block", () => {
  const action = new InvokeFlowModuleActionBuilder("InvokeModule")
    .flowModuleId("arn:aws:connect:flow-module/example")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "InvokeFlowModule");
  assert.deepEqual(action.parameters, {
    FlowModuleId: "arn:aws:connect:flow-module/example",
  });
});

test("GetMetricDataActionBuilder emits the expected queue-metrics load block", () => {
  const action = new GetMetricDataActionBuilder("GetMetrics")
    .queueId("arn:aws:connect:queue/example")
    .voiceChannel()
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "GetMetricData");
  assert.deepEqual(action.parameters, {
    QueueId: "arn:aws:connect:queue/example",
    QueueChannel: "Voice",
  });
});

test("TransferContactToQueueActionBuilder emits the expected queue handoff block", () => {
  const action = new TransferContactToQueueActionBuilder("Transfer")
    .onError("QueueFull", "QueueAtCapacity")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "TransferContactToQueue");
  assert.deepEqual(action.parameters, {});
  assert.deepEqual(action.transitions, {
    errors: [
      {
        nextAction: "QueueFull",
        errorType: "QueueAtCapacity",
      },
      {
        nextAction: "Disconnect",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("UpdateContactAttributesActionBuilder emits seeded attribute state", () => {
  const action = new UpdateContactAttributesActionBuilder("MarkStage")
    .targetRelated()
    .attribute("lastInteractiveService", "Lex")
    .attribute("assistPath", "lambda")
    .next("Transfer")
    .build();

  assert.equal(action.type, "UpdateContactAttributes");
  assert.deepEqual(action.parameters, {
    TargetContact: "Related",
    Attributes: {
      lastInteractiveService: "Lex",
      assistPath: "lambda",
    },
  });
});

test("TagContactActionBuilder emits user-defined contact tags", () => {
  const action = new TagContactActionBuilder("TagContact")
    .tag("journeyStage", "callback")
    .tag("operatorProfile", "junior-dev")
    .next("Disconnect")
    .build();

  assert.equal(action.type, "TagContact");
  assert.deepEqual(action.parameters, {
    Tags: {
      journeyStage: "callback",
      operatorProfile: "junior-dev",
    },
  });
});

test("UnTagContactActionBuilder emits tag-key cleanup", () => {
  const action = new UnTagContactActionBuilder("CleanupTags")
    .keys("journeyStage", "operatorProfile")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UnTagContact");
  assert.deepEqual(action.parameters, {
    TagKeys: ["journeyStage", "operatorProfile"],
  });
});

test("UpdateContactCallbackNumberActionBuilder emits a JSONPath callback reference", () => {
  const action = new UpdateContactCallbackNumberActionBuilder("SetCallbackNumber")
    .callbackNumberJsonPath("$.Attributes.callbackNumber")
    .next("Disconnect")
    .onError("Disconnect", "InvalidCallbackNumber")
    .build();

  assert.equal(action.type, "UpdateContactCallbackNumber");
  assert.deepEqual(action.parameters, {
    CallbackNumber: "$.Attributes.callbackNumber",
  });
});

test("UpdateFlowAttributesActionBuilder emits flow attribute state", () => {
  const action = new UpdateFlowAttributesActionBuilder("SetFlowState")
    .attribute("journeyStage", "triage")
    .attribute("selectedLane", "voice")
    .next("Transfer")
    .build();

  assert.equal(action.type, "UpdateFlowAttributes");
  assert.deepEqual(action.parameters, {
    FlowAttributes: {
      journeyStage: "triage",
      selectedLane: "voice",
    },
  });
});

test("UpdateContactDataActionBuilder emits managed contact-data updates", () => {
  const action = new UpdateContactDataActionBuilder("SetContactData")
    .description("Analytics-enabled path")
    .languageCode("en-US")
    .reference("ticketId", "$.Attributes.ticketId")
    .voiceIdStreamingEnabled()
    .targetRelated()
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateContactData");
  assert.deepEqual(action.parameters, {
    TargetContact: "Related",
    Description: "Analytics-enabled path",
    LanguageCode: "en-US",
    References: {
      ticketId: "$.Attributes.ticketId",
    },
    IsVoiceIdStreamingEnabled: "TRUE",
  });
});

test("UpdateContactTextToSpeechVoiceActionBuilder emits TTS configuration", () => {
  const action = new UpdateContactTextToSpeechVoiceActionBuilder("SetVoice")
    .voice("Joanna")
    .engine("Neural")
    .style("None")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateContactTextToSpeechVoice");
  assert.deepEqual(action.parameters, {
    TextToSpeechVoice: "Joanna",
    TextToSpeechEngine: "Neural",
    TextToSpeechStyle: "None",
  });
});

test("UpdateFlowLoggingBehaviorActionBuilder emits logging configuration", () => {
  const action = new UpdateFlowLoggingBehaviorActionBuilder("SetLogging")
    .enabled()
    .next("Disconnect")
    .build();

  assert.equal(action.type, "UpdateFlowLoggingBehavior");
  assert.deepEqual(action.parameters, {
    FlowLoggingBehavior: "Enabled",
  });
});

test("UpdateContactMediaStreamingBehaviorActionBuilder emits media-streaming configuration", () => {
  const action = new UpdateContactMediaStreamingBehaviorActionBuilder("StartStreaming")
    .enabled()
    .participantCustomer("From", "To")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateContactMediaStreamingBehavior");
  assert.deepEqual(action.parameters, {
    Participants: [
      {
        ParticipantType: "Customer",
        MediaDirections: ["From", "To"],
      },
    ],
    MediaStreamType: "Audio",
    MediaStreamingState: "Enabled",
  });
});

test("UpdateContactRecordingAndAnalyticsBehaviorActionBuilder emits voice analytics configuration", () => {
  const action = new UpdateContactRecordingAndAnalyticsBehaviorActionBuilder("SetAnalytics")
    .voiceRecording(["Agent", "Customer"], "Enabled")
    .voiceAnalyticsBehavior({
      Enabled: "True",
      AnalyticsLanguage: "en-US",
      AnalyticsModes: ["RealTime", "AutomatedInteraction"],
      SentimentConfiguration: {
        Enabled: "True",
      },
    })
    .next("Disconnect")
    .onError("Disconnect", "NoMatchingError")
    .onError("Disconnect", "ChannelMismatch")
    .build();

  assert.equal(action.type, "UpdateContactRecordingAndAnalyticsBehavior");
  assert.deepEqual(action.parameters, {
    VoiceBehavior: {
      VoiceRecordingBehavior: {
        RecordedParticipants: ["Agent", "Customer"],
        IVRRecordingBehavior: "Enabled",
      },
      VoiceAnalyticsBehavior: {
        Enabled: "True",
        AnalyticsLanguage: "en-US",
        AnalyticsModes: ["RealTime", "AutomatedInteraction"],
        SentimentConfiguration: {
          Enabled: "True",
        },
      },
    },
  });
});

test("UpdateContactMediaProcessingActionBuilder emits chat processor configuration", () => {
  const action = new UpdateContactMediaProcessingActionBuilder("SetMediaProcessing")
    .lambdaChatProcessor("arn:aws:lambda:us-east-1:123456789012:function:chat-processor")
    .next("Disconnect")
    .onError("Disconnect", "NoMatchingError")
    .onError("Disconnect", "ChannelMismatch")
    .build();

  assert.equal(action.type, "UpdateContactMediaProcessing");
  assert.deepEqual(action.parameters, {
    ChatProcessor: {
      ProcessingEnabled: "True",
      LambdaProcessorARN: "arn:aws:lambda:us-east-1:123456789012:function:chat-processor",
      ChatProcessorSettings: {
        DeliverUnprocessedMessages: "True",
      },
    },
  });
});

test("UpdateContactTargetQueueActionBuilder keeps queue and agent selectors mutually exclusive", () => {
  const action = new UpdateContactTargetQueueActionBuilder("SetTarget")
    .queueId("arn:aws:connect:queue/example")
    .agentId("arn:aws:connect:agent/example")
    .next("Transfer")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateContactTargetQueue");
  assert.deepEqual(action.parameters, {
    AgentId: "arn:aws:connect:agent/example",
  });
});

test("UpdateContactRoutingBehaviorActionBuilder keeps routing modes mutually exclusive", () => {
  const action = new UpdateContactRoutingBehaviorActionBuilder("AdjustPriority")
    .queuePriority(5)
    .queueTimeAdjustmentSeconds(-30)
    .next("Transfer")
    .build();

  assert.equal(action.type, "UpdateContactRoutingBehavior");
  assert.deepEqual(action.parameters, {
    QueueTimeAdjustmentSeconds: -30,
  });
});

test("UpdateContactEventHooksActionBuilder emits a single hook target", () => {
  const action = new UpdateContactEventHooksActionBuilder("SetEventHook")
    .eventHook("PauseContact", "arn:aws:connect:flow/pause")
    .next("Transfer")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "UpdateContactEventHooks");
  assert.deepEqual(action.parameters, {
    EventHooks: {
      PauseContact: "arn:aws:connect:flow/pause",
    },
  });
});

test("UpdateContactRecordingBehaviorActionBuilder emits nested recording configuration", () => {
  const action = new UpdateContactRecordingBehaviorActionBuilder("EnableRecording")
    .recordParticipants("Agent", "Customer")
    .enableIvrRecording()
    .analyticsEnabled("en-US")
    .voiceAnalyticsModes("PostContact")
    .postContactSummaryEnabled()
    .sentimentEnabled()
    .next("GetInput")
    .build();

  assert.equal(action.type, "UpdateContactRecordingBehavior");
  assert.deepEqual(action.parameters, {
    RecordingBehavior: {
      RecordedParticipants: ["Agent", "Customer"],
      IVRRecordingBehavior: "Enabled",
    },
    AnalyticsBehavior: {
      Enabled: "True",
      AnalyticsLanguage: "en-US",
      ChannelConfiguration: {
        Voice: {
          AnalyticsModes: ["PostContact"],
        },
      },
      SummaryConfiguration: {
        SummaryModes: ["PostContact"],
      },
      SentimentConfiguration: {
        Enabled: "True",
      },
    },
  });
});

test("DisconnectParticipantActionBuilder emits a terminal block with no parameters", () => {
  const action = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.equal(action.type, "DisconnectParticipant");
  assert.deepEqual(action.parameters, {});
  assert.equal(action.transitions, undefined);
});

test("TransferContactToAgentActionBuilder emits a terminal agent handoff block", () => {
  const action = new TransferContactToAgentActionBuilder("TransferAgent").build();

  assert.equal(action.type, "TransferContactToAgent");
  assert.deepEqual(action.parameters, {});
  assert.equal(action.transitions, undefined);
});

test("EndFlowExecutionActionBuilder emits a terminal flow-end block", () => {
  const action = new EndFlowExecutionActionBuilder("EndFlow").build();

  assert.equal(action.type, "EndFlowExecution");
  assert.deepEqual(action.parameters, {});
  assert.equal(action.transitions, undefined);
});

test("ResumeContactActionBuilder emits a resumptive contact block", () => {
  const action = new ResumeContactActionBuilder("ResumeContact")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "ResumeContact");
  assert.deepEqual(action.parameters, {});
  assert.deepEqual(action.transitions, {
    nextAction: "Disconnect",
    errors: [
      {
        nextAction: "Disconnect",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("supported condition operators stay aligned with the current branching surface", () => {
  assert.deepEqual(SUPPORTED_CONDITION_OPERATORS, [
    "Equals",
    "TextStartsWith",
    "TextEndsWith",
    "TextContains",
    "NumberGreaterThan",
    "NumberGreaterOrEqualTo",
    "NumberLessThan",
    "NumberLessOrEqualTo",
  ]);
});

test("flow logging behavior constants remain stable", () => {
  assert.deepEqual(FLOW_LOGGING_BEHAVIORS, ["Enabled", "Disabled"]);
});

test("loop operand constants remain stable", () => {
  assert.deepEqual(LOOP_OPERANDS, ["ContinueLooping", "DoneLooping"]);
});

test("check metric data helper methods keep queue and agent selectors mutually exclusive", () => {
  const action = new CheckMetricDataActionBuilder("CheckStaffing")
    .numberOfAgentsAvailable()
    .queueId("arn:aws:connect:queue/example")
    .agentId("arn:aws:connect:agent/example")
    .whenMetricGreaterThanZero("RouteAvailable")
    .build();

  assert.deepEqual(action.parameters, {
    MetricType: "NumberOfAgentsAvailable",
    AgentId: "arn:aws:connect:agent/example",
  });
});

test("conditional branching is rejected on unsupported action types", () => {
  assert.throws(
    () =>
      new MessageParticipantActionBuilder("PlayGreeting")
        .when(equalsCondition("sales"), "RouteSales"),
    /does not support conditional transitions/,
  );
});

test("flow validation fails when Wait is missing WaitCompleted", () => {
  const invalidAction = new WaitActionBuilder("WaitForReturn")
    .timeoutSeconds(60)
    .events("CustomerReturned")
    .onEvent("CustomerReturned", "Resume")
    .build();

  const resume = new MessageParticipantActionBuilder("Resume")
    .text("Welcome back.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("WaitWithoutCompletion")
        .startWith(invalidAction)
        .add(resume)
        .add(disconnect)
        .build(),
    /requires a condition for "WaitCompleted"/,
  );
});

test("flow validation fails when ConnectParticipantWithLexBot does not choose a single bot target", () => {
  const invalidAction = new ConnectParticipantWithLexBotActionBuilder("LexAssist")
    .text("How can I help?")
    .lexV2BotAliasArn("arn:aws:lex:us-east-1:123456789012:bot-alias/example")
    .next("Disconnect")
    .build();

  invalidAction.parameters.LexBot = {
    Name: "LegacyBot",
    Region: "us-east-1",
    Alias: "prod",
  };

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("LexConflict")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires exactly one of LexV2Bot or LexBot/,
  );
});

test("flow validation fails when CreatePersistentContactAssociation uses an unsupported rehydration type", () => {
  const invalidAction = new CreatePersistentContactAssociationActionBuilder("PersistChat")
    .sourceContactId("$.Attributes.PreviousChatContactId")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  invalidAction.parameters.RehydrationType = "SOMETHING_ELSE";

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("InvalidPersistentChatRehydration")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires RehydrationType to be ENTIRE_PAST_SESSION or FROM_SEGMENT/,
  );
});

test("flow validation fails when LoadContactContent uses an unsupported content type", () => {
  const invalidAction = new LoadContactContentActionBuilder("LoadStoredEmail")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  invalidAction.parameters.ContentType = "BinaryBlob";

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("InvalidLoadContactContentType")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires ContentType to be EmailMessage/,
  );
});

test("flow validation fails when Store customer input uses conditional transitions in the proven custom-digit mode", () => {
  const invalidAction = new StoreCustomerInputActionBuilder("StoreDigits")
    .when(equalsCondition("Timeout"), "Retry")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();
  const retry = new MessageParticipantActionBuilder("Retry")
    .text("Try again.")
    .next("Disconnect")
    .build();

  assert.throws(
    () =>
      new FlowBuilder("StoreInputWithConditions")
        .startWith(invalidAction)
        .add(retry)
        .add(disconnect)
        .build(),
    /does not support conditional transitions in the currently implemented Store customer input mode/,
  );
});

test("flow validation fails when Set Touchtone Buffer Behavior uses conditional transitions", () => {
  const invalidAction = new SetTouchtoneBufferBehaviorActionBuilder("EnableBuffer")
    .when(equalsCondition("Pressed"), "Retry")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();
  const retry = new MessageParticipantActionBuilder("Retry")
    .text("Try again.")
    .next("Disconnect")
    .build();

  assert.throws(
    () =>
      new FlowBuilder("TouchtoneBufferWithConditions")
        .startWith(invalidAction)
        .add(retry)
        .add(disconnect)
        .build(),
    /does not support conditional transitions in the currently implemented Set Touchtone Buffer Behavior mode/,
  );
});

test("flow validation fails when EvaluateDataTableValues reuses a query name", () => {
  const invalidAction = new EvaluateDataTableValuesActionBuilder("ReadFromDataTable")
    .dataTableId("table-id")
    .query("TestQuery", ["accountStatus"], [
      {
        AttributeName: "customerId",
        Value: "$.Attributes.customerId",
      },
    ])
    .query("TestQuery", ["routingQueue"], [
      {
        AttributeName: "customerId",
        Value: "$.Attributes.customerId",
      },
    ])
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("DuplicateDataTableQueries")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires every Queries\.QueryName to be unique/,
  );
});

test("flow validation fails when UpsertDataTableValues has no write attributes", () => {
  const invalidAction = new UpsertDataTableValuesActionBuilder("WriteToDataTable")
    .dataTableId("table-id")
    .dataTableUpsertAttributes([
      {
        PrimaryKeyGroupName: "TestPrimaryValueGroup",
        PrimaryValues: [
          {
            Name: "customerId",
            Value: "$.Attributes.customerId",
          },
        ],
        Attributes: [],
      },
    ])
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyDataTableUpsertAttributes")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires DataTableUpsertAttributes\.Attributes to contain between 1 and 25 entries/,
  );
});

test("flow validation fails when CreateTask sets both DelaySeconds and ScheduledTime", () => {
  const invalidAction = new CreateTaskActionBuilder("CreateTask")
    .contactFlowId("arn:aws:connect:flow/task")
    .name("Follow-up task")
    .delaySeconds(300)
    .next("Disconnect")
    .build();

  invalidAction.parameters.ScheduledTime = "2026-01-01T00:00:00Z";

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("TaskScheduleConflict")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /cannot define both DelaySeconds and ScheduledTime/,
  );
});

test("flow validation fails when CreateCase is missing CaseTemplateId", () => {
  const invalidAction = new CreateCaseActionBuilder("CreateCase")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("CreateCaseMissingTemplate")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires parameter "CaseTemplateId"/,
  );
});

test("flow validation fails when GetCase misses a required error branch", () => {
  const invalidAction = new GetCaseActionBuilder("GetCase")
    .customerId("$.Attributes.customerId")
    .onError("Disconnect", "NoMatchingError")
    .onError("Disconnect", "ContactNotLinked")
    .onError("Disconnect", "NoneFound")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("GetCaseMissingError")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires an error transition for MultipleFound/,
  );
});

test("flow validation fails when GetCustomerProfile does not choose a lookup mode", () => {
  const invalidAction = new GetCustomerProfileActionBuilder("GetProfile")
    .responseField("ProfileId")
    .onError("Disconnect", "MultipleFoundError")
    .onError("Disconnect", "NoneFoundError")
    .onError("Disconnect", "NoMatchingError")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("GetProfileMissingLookup")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires either IdentifierName and IdentifierValue, or SearchCriteria with LogicalOperator/,
  );
});

test("flow validation fails when GetCustomerProfileObject is missing ProfileId", () => {
  const invalidAction = new GetCustomerProfileObjectActionBuilder("GetProfileObject")
    .objectType("Customer")
    .useLatest()
    .onError("Disconnect", "NoneFoundError")
    .onError("Disconnect", "NoMatchingError")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("ProfileObjectMissingId")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires ProfileId and ObjectType to be non-empty strings/,
  );
});

test("flow validation fails when UpdateCase is missing CaseId", () => {
  const invalidAction = new UpdateCaseActionBuilder("UpdateCase")
    .onError("Disconnect", "ContactNotLinked")
    .onError("Disconnect", "NoMatchingError")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("UpdateCaseMissingId")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires parameter "CaseId"/,
  );
});

test("flow validation fails when UpdateCustomerProfile has empty request data", () => {
  const invalidAction = new UpdateCustomerProfileActionBuilder("UpdateProfile")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyProfileUpdate")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires ProfileRequestData to contain at least one entry/,
  );
});

test("flow validation fails when DistributeByPercentage uses non-ascending thresholds", () => {
  const invalidAction = new DistributeByPercentageActionBuilder("Distribute")
    .whenLessThan(60, "Primary")
    .whenLessThan(50, "Secondary")
    .build();

  const primary = new MessageParticipantActionBuilder("Primary")
    .text("Primary.")
    .next("Disconnect")
    .build();
  const secondary = new MessageParticipantActionBuilder("Secondary")
    .text("Secondary.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("DistributionOrdering")
        .startWith(invalidAction)
        .add(primary)
        .add(secondary)
        .add(disconnect)
        .build(),
    /requires thresholds to increase strictly in ascending order/,
  );
});

test("flow validation fails when CheckOutboundCallStatus has no conditions", () => {
  const invalidAction = new CheckOutboundCallStatusActionBuilder("CheckProgress")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingOutboundConditions")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires at least one condition/,
  );
});

test("flow validation fails when MessageParticipantIteratively has no messages", () => {
  const invalidAction = new MessageParticipantIterativelyActionBuilder("LoopPrompt")
    .onMessagesInterrupted("Resume")
    .build();

  invalidAction.parameters.Messages = [];

  const resume = new MessageParticipantActionBuilder("Resume")
    .text("Back.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyLoopPrompt")
        .startWith(invalidAction)
        .add(resume)
        .add(disconnect)
        .build(),
    /requires Messages to contain at least one entry/,
  );
});

test("flow validation fails when Loop is missing one required branch", () => {
  const invalidAction = new LoopActionBuilder("RetryLoop")
    .loopCount(2)
    .whenContinueLooping("RetryTask")
    .build();

  const retryTask = new MessageParticipantActionBuilder("RetryTask")
    .text("Retry.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("LoopMissingDone")
        .startWith(invalidAction)
        .add(retryTask)
        .add(disconnect)
        .build(),
    /requires exactly two conditions/,
  );
});

test("flow validation fails when TagContact has no tags", () => {
  const invalidAction = new TagContactActionBuilder("TagContact")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyTags")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires Tags to contain at least one entry/,
  );
});

test("flow validation fails when UnTagContact uses a system tag key", () => {
  const invalidAction = new UnTagContactActionBuilder("CleanupTags")
    .key("aws:system")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("SystemTagRemoval")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /cannot remove system tag keys prefixed with aws:/,
  );
});

test("flow validation fails when UpdateContactCallbackNumber is not a JSONPath reference", () => {
  const invalidAction = new UpdateContactCallbackNumberActionBuilder("SetCallbackNumber")
    .callbackNumberJsonPath("+15551234567")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("StaticCallbackNumber")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires CallbackNumber to be a JSONPath reference/,
  );
});

test("flow validation fails when GetMetricData sets both queue and agent", () => {
  const invalidAction = new GetMetricDataActionBuilder("GetMetrics")
    .queueId("arn:aws:connect:queue/example")
    .next("Disconnect")
    .build();

  invalidAction.parameters.AgentId = "arn:aws:connect:agent/example";

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MetricSelectorConflict2")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /cannot define both QueueId and AgentId/,
  );
});

test("flow validation fails when UpdateContactData only sets TargetContact", () => {
  const invalidAction = new UpdateContactDataActionBuilder("SetContactData")
    .targetCurrent()
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyManagedContactData")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires at least one attribute besides TargetContact/,
  );
});

test("flow validation fails when UpdateFlowAttributes is empty", () => {
  const invalidAction = new UpdateFlowAttributesActionBuilder("SetFlowState")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyFlowAttributes")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires FlowAttributes to contain at least one entry/,
  );
});

test("flow validation fails when UpdateContactTargetQueue sets neither queue nor agent", () => {
  const invalidAction = new UpdateContactTargetQueueActionBuilder("SetTarget")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingTargetQueue")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires exactly one of QueueId or AgentId/,
  );
});

test("flow validation fails when UpdateContactTextToSpeechVoice has no voice", () => {
  const invalidAction = new UpdateContactTextToSpeechVoiceActionBuilder("SetVoice")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingVoice")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires parameter "TextToSpeechVoice"/,
  );
});

test("flow validation fails when UpdateContactMediaStreamingBehavior has no participants", () => {
  const invalidAction = new UpdateContactMediaStreamingBehaviorActionBuilder("StartStreaming")
    .enabled()
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingStreamingParticipants")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires Participants to contain at least one entry/,
  );
});

test("flow validation fails when UpdateContactRoutingBehavior sets both routing modes", () => {
  const invalidAction = new UpdateContactRoutingBehaviorActionBuilder("AdjustPriority")
    .queuePriority(5)
    .next("Disconnect")
    .build();

  invalidAction.parameters.QueueTimeAdjustmentSeconds = 60;

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("RoutingBehaviorConflict")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires exactly one of QueuePriority or QueueTimeAdjustmentSeconds/,
  );
});

test("flow validation fails when UpdateContactEventHooks sets multiple hooks", () => {
  const invalidAction = new UpdateContactEventHooksActionBuilder("SetEventHook")
    .eventHook("PauseContact", "arn:aws:connect:flow/pause")
    .next("Disconnect")
    .build();

  invalidAction.parameters.EventHooks = {
    PauseContact: "arn:aws:connect:flow/pause",
    ResumeContact: "arn:aws:connect:flow/resume",
  };

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MultipleEventHooks")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires EventHooks to define exactly one hook/,
  );
});

test("flow validation fails when UpdateFlowLoggingBehavior uses an unsupported value", () => {
  const invalidAction = new UpdateFlowLoggingBehaviorActionBuilder("SetLogging")
    .next("Disconnect")
    .build();

  invalidAction.parameters.FlowLoggingBehavior = "Verbose";

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("InvalidLoggingBehavior")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires FlowLoggingBehavior to be Enabled or Disabled/,
  );
});

test("flow validation fails when UpdateContactRecordingAndAnalyticsBehavior misses ChannelMismatch", () => {
  const invalidAction = new UpdateContactRecordingAndAnalyticsBehaviorActionBuilder("SetAnalytics")
    .voiceRecording(["Agent", "Customer"], "Enabled")
    .voiceAnalyticsBehavior({
      Enabled: "True",
      AnalyticsLanguage: "en-US",
      AnalyticsModes: ["RealTime"],
    })
    .next("Disconnect")
    .onError("Disconnect", "NoMatchingError")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingChannelMismatch")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires an error transition for ChannelMismatch/,
  );
});

test("flow validation fails when UpdateContactMediaProcessing misses ChatProcessor", () => {
  const invalidAction = new UpdateContactMediaProcessingActionBuilder("SetMediaProcessing")
    .next("Disconnect")
    .onError("Disconnect", "NoMatchingError")
    .onError("Disconnect", "ChannelMismatch")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingChatProcessor")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires parameter "ChatProcessor"/,
  );
});

test("flow validation fails when Wait uses unsupported events", () => {
  const invalidAction = new WaitActionBuilder("WaitForReturn")
    .timeoutSeconds(60)
    .onWaitCompleted("Resume")
    .build();

  invalidAction.parameters.Events = ["NotReal"];

  const resume = new MessageParticipantActionBuilder("Resume")
    .text("Welcome back.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("WaitWithInvalidEvent")
        .startWith(invalidAction)
        .add(resume)
        .add(disconnect)
        .build(),
    /uses unsupported event/,
  );
});

test("flow validation fails when UpdateRoutingCriteria has no steps", () => {
  const invalidAction = new UpdateRoutingCriteriaActionBuilder("SetRoutingCriteria")
    .staticRoutingCriteria()
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("EmptyRoutingCriteria")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /requires RoutingCriteria\.Steps to contain at least one step/,
  );
});

test("flow validation fails when ShowView is missing a valid view resource", () => {
  const invalidAction = new ShowViewActionBuilder("ShowGuide")
    .when(equalsCondition("Continue"), "Resume")
    .build();

  const resume = new MessageParticipantActionBuilder("Resume")
    .text("Continuing.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("ShowViewWithoutResource")
        .startWith(invalidAction)
        .add(resume)
        .add(disconnect)
        .build(),
    /requires parameter "ViewResource"/,
  );
});

test("flow validation fails when TransferToFlow is missing ContactFlowId", () => {
  const invalidAction = new TransferToFlowActionBuilder("OverflowTransfer").build();

  assert.throws(
    () => new FlowBuilder("TransferWithoutTarget").startWith(invalidAction).build(),
    /requires parameter "ContactFlowId"/,
  );
});

test("flow validation fails when TransferParticipantToThirdParty is missing required error branches", () => {
  const invalidAction = new TransferParticipantToThirdPartyActionBuilder("TransferToPhoneNumber")
    .thirdPartyPhoneNumber("+16164982290")
    .connectionTimeLimitSeconds(30)
    .continueFlowExecution(true)
    .next("Continue")
    .onError("Fallback", "NoMatchingError")
    .build();

  const continueAction = new DisconnectParticipantActionBuilder("Continue").build();
  const fallbackAction = new DisconnectParticipantActionBuilder("Fallback").build();

  assert.throws(
    () =>
      new FlowBuilder("TransferToPhoneNumberMissingErrors")
        .startWith(invalidAction)
        .add(continueAction)
        .add(fallbackAction)
        .build(),
    /requires an error transition for CallFailed/,
  );
});

test("flow validation fails when a required action parameter is missing", () => {
  // A Lex-backed GetParticipantInput requires both Text and LexV2Bot.
  // Manually construct an action that has LexV2Bot set but no Text to trigger validation.
  const invalidAction = new GetParticipantInputActionBuilder("GetInput")
    .lexBotAliasArn("arn:aws:lex:us-east-1:123:bot-alias/ABC/XYZ")
    .build();

  assert.throws(
    () => new FlowBuilder("MissingText").startWith(invalidAction).build(),
    /requires "Text" to be a non-empty string/,
  );
});

test("flow validation fails when a conditional transition points at a missing action", () => {
  const invalidAction = new GetParticipantInputActionBuilder("GetInput")
    .text("Describe your request.")
    .lexBotAliasArn("arn:aws:lex:example")
    .when(equalsCondition("sales"), "RouteSales")
    .next("Disconnect")
    .build();

  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingConditionalTarget")
        .startWith(invalidAction)
        .add(disconnect)
        .build(),
    /references missing conditional action "RouteSales"/,
  );
});

test("flow validation fails when Compare is missing conditions", () => {
  const invalidAction = new CompareActionBuilder("CheckTier")
    .comparisonValue("$.Attributes.customerTier")
    .build();

  assert.throws(
    () => new FlowBuilder("CompareWithoutConditions").startWith(invalidAction).build(),
    /requires at least one condition/,
  );
});

test("flow validation fails when CheckHoursOfOperation does not provide both True and False conditions", () => {
  const invalidAction = new CheckHoursOfOperationActionBuilder("CheckHours")
    .whenInHours("OpenRoute")
    .onError("Disconnect")
    .build();

  const openRoute = new MessageParticipantActionBuilder("OpenRoute")
    .text("Open.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MissingClosedBranch")
        .startWith(invalidAction)
        .add(openRoute)
        .add(disconnect)
        .build(),
    /requires exactly two conditions/,
  );
});

test("flow validation fails when CheckMetricData uses both QueueId and AgentId", () => {
  const invalidAction = new CheckMetricDataActionBuilder("CheckStaffing")
    .metricType(CHECK_METRIC_DATA_METRIC_TYPES[0])
    .whenMetricGreaterThanZero("RouteAvailable")
    .build();

  invalidAction.parameters.QueueId = "arn:aws:connect:queue/example";
  invalidAction.parameters.AgentId = "arn:aws:connect:agent/example";

  const routeAvailable = new MessageParticipantActionBuilder("RouteAvailable")
    .text("Available.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("MetricSelectorConflict")
        .startWith(invalidAction)
        .add(routeAvailable)
        .add(disconnect)
        .build(),
    /cannot define both QueueId and AgentId/,
  );
});

test("flow validation fails when staffing metrics use unsupported conditions", () => {
  const invalidAction = new CheckMetricDataActionBuilder("CheckStaffing")
    .numberOfAgentsAvailable()
    .when(numberGreaterThanCondition("2"), "RouteAvailable")
    .build();

  const routeAvailable = new MessageParticipantActionBuilder("RouteAvailable")
    .text("Available.")
    .next("Disconnect")
    .build();
  const disconnect = new DisconnectParticipantActionBuilder("Disconnect").build();

  assert.throws(
    () =>
      new FlowBuilder("InvalidStaffingCheck")
        .startWith(invalidAction)
        .add(routeAvailable)
        .add(disconnect)
        .build(),
    /only supports NumberGreaterThan 0 conditions for staffing metrics/,
  );
});

test("StartVoiceIdStreamActionBuilder emits the expected Voice ID start block", () => {
  const action = new StartVoiceIdStreamActionBuilder("StartVoiceId")
    .next("NextStep")
    .onError("Fallback")
    .build();

  assert.deepEqual(CHECK_VOICE_ID_OPTIONS, [
    "enrollmentStatus",
    "voiceAuthentication",
    "fraudDetection",
  ]);
  assert.equal(action.type, "StartVoiceIdStream");
  assert.deepEqual(action.parameters, {});
  assert.deepEqual(action.transitions, {
    nextAction: "NextStep",
    errors: [
      {
        nextAction: "Fallback",
        errorType: "NoMatchingError",
      },
    ],
  });
});

test("CheckVoiceIdActionBuilder emits the expected Voice ID check block", () => {
  const action = new CheckVoiceIdActionBuilder("CheckVoiceId")
    .voiceAuthentication()
    .whenStatusEquals("Authenticated", "Verified")
    .whenStatusEquals("Not authenticated", "Escalate")
    .onError("Fallback")
    .build();

  assert.equal(action.type, "CheckVoiceId");
  assert.deepEqual(action.parameters, {
    CheckVoiceIdOption: "voiceAuthentication",
  });
  assert.equal(action.transitions?.conditions?.length, 2);
  assert.equal(action.transitions?.errors?.[0]?.errorType, "NoMatchingError");
});

test("GetCalculatedAttributesForCustomerProfileActionBuilder emits the expected profile attribute lookup block", () => {
  const action = new GetCalculatedAttributesForCustomerProfileActionBuilder("GetCalculated")
    .profileId("$.Customer.ProfileId")
    .responseField("CalculatedAttributes._average_hold_time")
    .responseField("CalculatedAttributes._frequent_caller")
    .next("Disconnect")
    .onError("Disconnect", "NoneFoundError")
    .onError("Disconnect", "NoMatchingError")
    .build();

  assert.equal(action.type, "GetCalculatedAttributesForCustomerProfile");
  assert.deepEqual(action.parameters, {
    ProfileRequestData: {
      ProfileId: "$.Customer.ProfileId",
    },
    ProfileResponseData: {
      "CalculatedAttributes._average_hold_time": true,
      "CalculatedAttributes._frequent_caller": true,
    },
  });
});

test("EndFlowModuleExecutionActionBuilder emits the expected module return block", () => {
  const action = new EndFlowModuleExecutionActionBuilder("ReturnFromModule").build();

  assert.equal(action.type, "EndFlowModuleExecution");
  assert.deepEqual(action.parameters, {});
  assert.equal(action.transitions, undefined);
});

test("CreateWisdomSessionActionBuilder emits the expected wisdom-session block", () => {
  const action = new CreateWisdomSessionActionBuilder("CreateWisdom")
    .wisdomAssistantArn("arn:aws:wisdom:us-east-1:123456789012:assistant/example")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CreateWisdomSession");
  assert.deepEqual(action.parameters, {
    WisdomAssistantArn: "arn:aws:wisdom:us-east-1:123456789012:assistant/example",
  });
});

test("UpdatePreviousContactParticipantStateActionBuilder emits the expected prior-participant state block", () => {
  const action = new UpdatePreviousContactParticipantStateActionBuilder("HoldAgent")
    .agentOnHold()
    .next("SecureTransfer")
    .onError("Disconnect")
    .build();

  assert.deepEqual(PREVIOUS_CONTACT_PARTICIPANT_STATES, [
    "AgentOnHold",
    "CustomerOnHold",
    "OffHold",
  ]);
  assert.equal(action.type, "UpdatePreviousContactParticipantState");
  assert.deepEqual(action.parameters, {
    PreviousContactParticipantState: "AgentOnHold",
  });
});

test("CompleteOutboundCallActionBuilder emits the expected outbound call completion block", () => {
  const action = new CompleteOutboundCallActionBuilder("CompleteCall")
    .callerIdNumber("+12065550100")
    .chimeVoiceConnector({
      voiceConnectorArn: "arn:aws:chime:us-east-1:123456789012:vc/example",
      fromUser: "alice",
      toUser: "bob",
      userToUserInformation: "x-connect=test",
    })
    .connectionTimeLimitSeconds(45)
    .next("Disconnect")
    .build();

  assert.equal(action.type, "CompleteOutboundCall");
  assert.deepEqual(action.parameters, {
    CallerId: {
      Number: "+12065550100",
    },
    VoiceConnector: {
      VoiceConnectorType: "ChimeConnector",
      VoiceConnectorArn: "arn:aws:chime:us-east-1:123456789012:vc/example",
      FromUser: "alice",
      ToUser: "bob",
      UserToUserInformation: "x-connect=test",
    },
    ConnectionTimeLimitSeconds: 45,
  });
});

test("CreateCallbackContactActionBuilder emits the expected callback creation block", () => {
  const action = new CreateCallbackContactActionBuilder("CreateCallback")
    .queueId("arn:aws:connect:queue/example")
    .initialCallDelaySeconds(60)
    .maximumConnectionAttempts(3)
    .retryDelaySeconds(300)
    .contactFlowId("arn:aws:connect:contact-flow/example")
    .callerId("+12065550100")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "CreateCallbackContact");
  assert.deepEqual(action.parameters, {
    QueueId: "arn:aws:connect:queue/example",
    InitialCallDelaySeconds: 60,
    MaximumConnectionAttempts: 3,
    RetryDelaySeconds: 300,
    ContactFlowId: "arn:aws:connect:contact-flow/example",
    CallerId: "+12065550100",
  });
});

test("StartOutboundChatContactActionBuilder emits the expected outbound SMS chat block", () => {
  const action = new StartOutboundChatContactActionBuilder("StartSms")
    .sourceConnectPhoneNumberArn("arn:aws:connect:us-east-1:123456789012:phone-number/example")
    .destinationPhoneNumber("+12065550100")
    .contactFlowArn("arn:aws:connect:us-east-1:123456789012:contact-flow/example")
    .initialSystemMessage("Your case has been updated.")
    .relateToCurrentContact()
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "StartOutboundChatContact");
  assert.deepEqual(action.parameters, {
    ContactSubtype: "connect:SMS",
    SourceEndpoint: {
      Address: "arn:aws:connect:us-east-1:123456789012:phone-number/example",
      Type: "CONNECT_PHONENUMBER_ARN",
    },
    DestinationEndpoint: {
      Address: "+12065550100",
      Type: "TELEPHONE_NUMBER",
    },
    ContactFlowArn: "arn:aws:connect:us-east-1:123456789012:contact-flow/example",
    InitialSystemMessage: {
      Content: "Your case has been updated.",
    },
    RelatedContact: "CURRENT",
  });
});

test("DequeueContactAndTransferToQueueActionBuilder emits the expected queue-to-queue transfer block", () => {
  const action = new DequeueContactAndTransferToQueueActionBuilder("Requeue")
    .queueId("arn:aws:connect:queue/overflow")
    .next("Disconnect")
    .onError("QueueFull", "QueueAtCapacity")
    .onError("Disconnect", "NoMatchingError")
    .build();

  assert.equal(action.type, "DequeueContactAndTransferToQueue");
  assert.deepEqual(action.parameters, {
    QueueId: "arn:aws:connect:queue/overflow",
  });
});

test("AssociateContactToCustomerProfileActionBuilder emits the expected contact-profile association block", () => {
  const action = new AssociateContactToCustomerProfileActionBuilder("AssociateProfile")
    .profileId("$.Customer.ProfileId")
    .contactId("$.ContactId")
    .next("Disconnect")
    .onError("Disconnect")
    .build();

  assert.equal(action.type, "AssociateContactToCustomerProfile");
  assert.deepEqual(action.parameters, {
    ProfileRequestData: {
      ProfileId: "$.Customer.ProfileId",
      ContactId: "$.ContactId",
    },
  });
});

test("built actions are detached from later builder mutations", () => {
  const builder = new MessageParticipantActionBuilder("Greeting")
    .text("first")
    .next("Disconnect");
  const action = builder.build();

  builder.text("second").onError("Fallback");

  assert.equal(action.parameters.Text, "first");
  assert.equal(action.transitions.errors, undefined);
});
