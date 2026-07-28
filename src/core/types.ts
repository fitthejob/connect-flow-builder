export type FlowActionType =
  | "AssociateContactToCustomerProfile"
  | "AuthenticateParticipant"
  | "CheckOutboundCallStatus"
  | "CheckVoiceId"
  | "ConnectParticipantWithLexBot"
  | "CompleteOutboundCall"
  | "CreateCase"
  | "CreateCallbackContact"
  | "CreatePersistentContactAssociation"
  | "CreateCustomerProfile"
  | "CreateTask"
  | "CreateWisdomSession"
  | "CheckHoursOfOperation"
  | "CheckMetricData"
  | "Compare"
  | "DequeueContactAndTransferToQueue"
  | "DisconnectParticipant"
  | "DistributeByPercentage"
  | "EndFlowExecution"
  | "EndFlowModuleExecution"
  | "EvaluateDataTableValues"
  | "GetCase"
  | "GetCalculatedAttributesForCustomerProfile"
  | "LoadContactContent"
  | "GetCustomerProfile"
  | "GetCustomerProfileObject"
  | "GetParticipantInput"
  | "GetMetricData"
  | "InvokeLambdaFunction"
  | "InvokeFlowModule"
  | "MessageParticipant"
  | "MessageParticipantIteratively"
  | "Loop"
  | "ResumeContact"
  | "ShowView"
  | "StartOutboundChatContact"
  | "StartVoiceIdStream"
  | "TagContact"
  | "TransferContactToQueue"
  | "TransferToFlow"
  | "TransferContactToAgent"
  | "TransferParticipantToThirdParty"
  | "UnTagContact"
  | "UpsertDataTableValues"
  | "UpdateContactCallbackNumber"
  | "UpdateContactData"
  | "UpdateContactEventHooks"
  | "UpdateContactMediaProcessing"
  | "UpdateContactMediaStreamingBehavior"
  | "UpdatePreviousContactParticipantState"
  | "UpdateContactRecordingAndAnalyticsBehavior"
  | "UpdateContactRoutingBehavior"
  | "UpdateContactTargetQueue"
  | "UpdateContactTextToSpeechVoice"
  | "UpdateCase"
  | "UpdateFlowLoggingBehavior"
  | "UpdateRoutingCriteria"
  | "UpdateContactAttributes"
  | "UpdateFlowAttributes"
  | "UpdateCustomerProfile"
  | "UpdateContactRecordingBehavior"
  | "ListDataTableValues"
  | "Wait";

export type CheckMetricDataMetricType =
  | "NumberOfAgentsAvailable"
  | "NumberOfAgentsStaffed"
  | "NumberOfAgentsOnline"
  | "OldestContactInQueueAgeSeconds"
  | "NumberOfContactsInQueue";

export type WaitEvent = "CustomerReturned" | "BotParticipantDisconnected";

export type FlowLoggingBehavior = "Enabled" | "Disabled";
export type QueueChannel = "Voice" | "Chat";
export type OutboundCallStatusOperand =
  | "CallAnswered"
  | "VoicemailBeep"
  | "VoicemailNoBeep"
  | "NotDetected";
export type CheckVoiceIdOption =
  | "enrollmentStatus"
  | "voiceAuthentication"
  | "fraudDetection";
export type PreviousContactParticipantState =
  | "AgentOnHold"
  | "CustomerOnHold"
  | "OffHold";
export type LoopOperand = "ContinueLooping" | "DoneLooping";
export type LogicalOperator = "AND" | "OR";
export type MediaStreamingState = "Enabled" | "Disabled";
export type MediaDirection = "From" | "To";
export type ContactTarget = "Current" | "Related";
export type VoiceConnectorType = "ChimeConnector";
export type StartOutboundChatSourceEndpointType =
  "CONNECT_PHONENUMBER_ARN";
export type StartOutboundChatDestinationEndpointType =
  "TELEPHONE_NUMBER";
export type StartOutboundChatContactSubtype = "connect:SMS";
export type PersistentContactRehydrationType =
  | "ENTIRE_PAST_SESSION"
  | "FROM_SEGMENT";
export type LoadContactContentType = "EmailMessage";

export interface EvaluateDataTablePrimaryValue {
  AttributeName: string;
  Value: string;
}

export interface EvaluateDataTableQuery {
  QueryName: string;
  Attributes: string[];
  PrimaryValues: EvaluateDataTablePrimaryValue[];
}

export interface DataTablePrimaryValue {
  Name: string;
  Value: string;
}

export interface DataTablePrimaryKeyGroup {
  PrimaryKeyGroupName: string;
  PrimaryValues: DataTablePrimaryValue[];
}

export interface DataTableUpsertAttributeValue {
  Name: string;
  Value: string;
  UseDefaultValue?: boolean;
}

export interface DataTableUpsertAttributeGroup {
  PrimaryKeyGroupName: string;
  PrimaryValues: DataTablePrimaryValue[];
  Attributes: DataTableUpsertAttributeValue[];
}

export interface CustomerProfileSearchCriterion {
  IdentifierName: string;
  IdentifierValue: string;
}

export interface AuthenticateParticipantCognitoConfiguration {
  UserPoolArn: string;
  AppClientId: string;
}

export interface AuthenticateParticipantCustomerProfilesConfiguration {
  ObjectTypeName: string;
}

export interface MediaStreamingParticipant {
  ParticipantType: "Customer";
  MediaDirections: MediaDirection[];
}

export interface VoiceRecordingBehaviorConfig {
  RecordedParticipants: Array<"Agent" | "Customer">;
  IVRRecordingBehavior?: "Enabled" | "Disabled";
}

export interface VoiceAnalyticsBehaviorConfig {
  Enabled?: "True" | "False";
  AnalyticsLanguage?: string;
  AnalyticsModes?: Array<"RealTime" | "PostContact" | "AutomatedInteraction">;
  SentimentConfiguration?: {
    Enabled: "True" | "False";
  };
  SummaryConfiguration?: {
    SummaryModes: Array<"PostContact" | "AutomatedInteraction">;
  };
}

export interface VoiceBehaviorConfig {
  VoiceRecordingBehavior?: VoiceRecordingBehaviorConfig;
  VoiceAnalyticsBehavior?: VoiceAnalyticsBehaviorConfig;
}

export interface ChatAnalyticsBehaviorConfig {
  Enabled?: "True" | "False";
  AnalyticsLanguage?: string;
  AnalyticsModes?: ["ContactLens"];
  SentimentConfiguration?: {
    Enabled: "True" | "False";
  };
  SummaryConfiguration?: {
    SummaryModes: Array<"PostContact" | "AutomatedInteraction">;
  };
  InFlightChatRedactionConfiguration?: {
    Enabled: "True" | "False";
    RedactionMaskMode?: "EntityType" | "PII";
    RedactionEntities?: string[];
    DeliverUnprocessedMessages?: "True" | "False";
  };
}

export interface ChatBehaviorConfig {
  ChatAnalyticsBehavior?: ChatAnalyticsBehaviorConfig;
}

export interface ScreenRecordingBehaviorConfig {
  ScreenRecordedParticipants: Array<"Agent">;
}

export interface ChatProcessorConfig {
  ProcessingEnabled: "True" | "False";
  LambdaProcessorARN: string;
  ChatProcessorSettings?: {
    DeliverUnprocessedMessages: "True" | "False";
  };
}

export type ContactEventHookType =
  | "AgentHold"
  | "AgentWhisper"
  | "CustomerHold"
  | "CustomerQueue"
  | "CustomerRemaining"
  | "CustomerWhisper"
  | "DefaultAgentUI"
  | "DisconnectAgentUI"
  | "PauseContact"
  | "ResumeContact";

export type MessageLoopContent =
  | { Text: string }
  | { PromptId: string }
  | { SSML: string }
  | {
      Media: {
        Uri: string;
        SourceType: "S3";
        MediaType: "Audio";
      };
    };

export interface RoutingCriteriaAttributeCondition {
  Name: string;
  Value: string;
  ProficiencyLevel: 1 | 2 | 3 | 4 | 5;
  ComparisonOperator: "NumberGreaterOrEqualTo";
}

export interface RoutingCriteriaExpression {
  AttributeCondition?: RoutingCriteriaAttributeCondition;
  AndExpression?: RoutingCriteriaAttributeCondition[];
}

export interface RoutingCriteriaStep {
  Expression: RoutingCriteriaExpression;
  Expiry: {
    DurationInSeconds: number;
  };
}

export interface RoutingCriteriaObject {
  Steps: RoutingCriteriaStep[];
}

export interface CompleteOutboundCallCallerId {
  Number: string;
}

export interface TransferParticipantToThirdPartyCallerId {
  Name: string;
  Number: string;
}

export interface CompleteOutboundCallVoiceConnector {
  VoiceConnectorType: VoiceConnectorType;
  VoiceConnectorArn: string;
  FromUser: string;
  ToUser: string;
  UserToUserInformation?: string;
}

export interface StartOutboundChatSourceEndpoint {
  Address: string;
  Type: StartOutboundChatSourceEndpointType;
}

export interface StartOutboundChatDestinationEndpoint {
  Address: string;
  Type: StartOutboundChatDestinationEndpointType;
}

export interface StartOutboundChatInitialSystemMessage {
  Content: string;
}

export type FlowConditionOperator =
  | "Equals"
  | "TextStartsWith"
  | "TextEndsWith"
  | "TextContains"
  | "NumberGreaterThan"
  | "NumberGreaterOrEqualTo"
  | "NumberLessThan"
  | "NumberLessOrEqualTo";

export interface FlowConditionExpression {
  operator: FlowConditionOperator;
  operands: string[];
}

export interface FlowCondition {
  nextAction: string;
  condition: FlowConditionExpression;
}

export interface FlowErrorTransition {
  nextAction: string;
  errorType: string;
}

export interface FlowTransitions {
  nextAction?: string;
  conditions?: FlowCondition[];
  errors?: FlowErrorTransition[];
}

export interface FlowAction {
  id: string;
  type: FlowActionType;
  parameters: Record<string, unknown>;
  transitions?: FlowTransitions;
}

export interface FlowActionMetadataEntry {
  position?: { x: number; y: number };
  isFriendlyName?: boolean;
  [key: string]: unknown;
}

export interface FlowMetadata {
  entryPointPosition?: { x: number; y: number };
  ActionMetadata?: Record<string, FlowActionMetadataEntry>;
  annotations?: Array<{ name: string; value: string }>;
}

export interface FlowDefinition {
  version: "2019-10-30";
  startAction: string;
  actions: FlowAction[];
  metadata?: FlowMetadata;
}

export interface FlowSegment {
  actions: FlowAction[];
  startActionId: string;
}

export interface ConnectFlowAction {
  Identifier: string;
  Type: FlowActionType;
  Parameters: Record<string, unknown>;
  Transitions?: {
    NextAction?: string;
    Conditions?: Array<{
      NextAction: string;
      Condition: {
        Operator: FlowConditionOperator;
        Operands: string[];
      };
    }>;
    Errors?: Array<{
      NextAction: string;
      ErrorType: string;
    }>;
  };
}

export interface ConnectFlowModuleSettings {
  InputParameters: unknown[];
  OutputParameters: unknown[];
  Transitions: Array<{
    DisplayName: string;
    ReferenceName: string;
    Description: string;
  }>;
}

export interface ConnectFlowDefinition {
  Version: "2019-10-30";
  StartAction: string;
  Actions: ConnectFlowAction[];
  Metadata?: FlowMetadata;
  Settings?: ConnectFlowModuleSettings;
}
