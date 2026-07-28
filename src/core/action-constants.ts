import type {
  CheckMetricDataMetricType,
  CheckVoiceIdOption,
  ContactEventHookType,
  FlowLoggingBehavior,
  LoadContactContentType,
  LogicalOperator,
  LoopOperand,
  MediaDirection,
  MediaStreamingState,
  OutboundCallStatusOperand,
  PersistentContactRehydrationType,
  PreviousContactParticipantState,
  QueueChannel,
  WaitEvent,
} from "./types.js";

export const CHECK_METRIC_DATA_METRIC_TYPES = [
  "NumberOfAgentsAvailable",
  "NumberOfAgentsStaffed",
  "NumberOfAgentsOnline",
  "OldestContactInQueueAgeSeconds",
  "NumberOfContactsInQueue",
] as const satisfies readonly CheckMetricDataMetricType[];

export const CHECK_VOICE_ID_OPTIONS = [
  "enrollmentStatus",
  "voiceAuthentication",
  "fraudDetection",
] as const satisfies readonly CheckVoiceIdOption[];

export const CONTACT_EVENT_HOOK_TYPES = [
  "AgentHold",
  "AgentWhisper",
  "CustomerHold",
  "CustomerQueue",
  "CustomerRemaining",
  "CustomerWhisper",
  "DefaultAgentUI",
  "DisconnectAgentUI",
  "PauseContact",
  "ResumeContact",
] as const satisfies readonly ContactEventHookType[];

export const FLOW_LOGGING_BEHAVIORS = [
  "Enabled",
  "Disabled",
] as const satisfies readonly FlowLoggingBehavior[];

export const LOAD_CONTACT_CONTENT_TYPES = [
  "EmailMessage",
] as const satisfies readonly LoadContactContentType[];

export const LOGICAL_OPERATORS = [
  "AND",
  "OR",
] as const satisfies readonly LogicalOperator[];

export const LOOP_OPERANDS = [
  "ContinueLooping",
  "DoneLooping",
] as const satisfies readonly LoopOperand[];

export const MEDIA_DIRECTIONS = [
  "From",
  "To",
] as const satisfies readonly MediaDirection[];

export const MEDIA_STREAMING_STATES = [
  "Enabled",
  "Disabled",
] as const satisfies readonly MediaStreamingState[];

export const OUTBOUND_CALL_STATUS_OPERANDS = [
  "CallAnswered",
  "VoicemailBeep",
  "VoicemailNoBeep",
  "NotDetected",
] as const satisfies readonly OutboundCallStatusOperand[];

export const PERSISTENT_CONTACT_REHYDRATION_TYPES = [
  "ENTIRE_PAST_SESSION",
  "FROM_SEGMENT",
] as const satisfies readonly PersistentContactRehydrationType[];

export const PREVIOUS_CONTACT_PARTICIPANT_STATES = [
  "AgentOnHold",
  "CustomerOnHold",
  "OffHold",
] as const satisfies readonly PreviousContactParticipantState[];

export const QUEUE_CHANNELS = [
  "Voice",
  "Chat",
] as const satisfies readonly QueueChannel[];

export const WAIT_EVENTS = [
  "CustomerReturned",
  "BotParticipantDisconnected",
] as const satisfies readonly WaitEvent[];
