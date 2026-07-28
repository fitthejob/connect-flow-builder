import type {
  FlowAction,
} from "../types.js";
import {
  requireErrorTypes,
  requireNonEmptyStringParameter,
  requireObjectParameter,
} from "./helpers.js";

export function validateCompleteOutboundCallAction(action: FlowAction): void {
  if ("CallerId" in action.parameters) {
    const callerId = requireObjectParameter(action, "CallerId");
    if (typeof callerId.Number !== "string" || callerId.Number.trim().length === 0) {
      throw new Error(
        `Action "${action.id}" of type "CompleteOutboundCall" requires CallerId.Number to be a non-empty string when provided.`,
      );
    }
  }

  if ("VoiceConnector" in action.parameters) {
    const voiceConnector = requireObjectParameter(action, "VoiceConnector");
    validateCompleteOutboundCallVoiceConnector(action, voiceConnector);
  }

  if ("ConnectionTimeLimitSeconds" in action.parameters) {
    requireIntegerInRangeParameter(
      action,
      "ConnectionTimeLimitSeconds",
      1,
      600,
      "an integer between 1 and 600",
    );
  }
}

export function validateCreateCallbackContactAction(action: FlowAction): void {
  const queueId = action.parameters.QueueId;
  const agentId = action.parameters.AgentId;

  if (queueId !== undefined && agentId !== undefined) {
    throw new Error(
      `Action "${action.id}" of type "CreateCallbackContact" cannot define both QueueId and AgentId.`,
    );
  }

  if (queueId !== undefined) {
    requireNonEmptyStringParameter(action, "QueueId");
  }

  if (agentId !== undefined) {
    requireNonEmptyStringParameter(action, "AgentId");
  }

  requireIntegerInRangeParameter(
    action,
    "InitialCallDelaySeconds",
    1,
    259200,
    "an integer between 1 and 259200",
  );
  requireIntegerInRangeParameter(
    action,
    "MaximumConnectionAttempts",
    1,
    Number.MAX_SAFE_INTEGER,
    "a positive integer",
  );
  requireIntegerInRangeParameter(
    action,
    "RetryDelaySeconds",
    1,
    259200,
    "an integer between 1 and 259200",
  );

  for (const key of ["ContactFlowId", "CallerId"]) {
    if (key in action.parameters) {
      requireNonEmptyStringParameter(action, key);
    }
  }

  requireErrorTypes(action, ["NoMatchingError"]);
}

export function validateStartOutboundChatContactAction(action: FlowAction): void {
  const sourceEndpoint = requireObjectParameter(action, "SourceEndpoint");
  const destinationEndpoint = requireObjectParameter(action, "DestinationEndpoint");

  if (
    typeof sourceEndpoint.Address !== "string"
    || sourceEndpoint.Address.trim().length === 0
    || sourceEndpoint.Type !== "CONNECT_PHONENUMBER_ARN"
  ) {
    throw new Error(
      `Action "${action.id}" of type "StartOutboundChatContact" requires SourceEndpoint to use a non-empty Address and Type "CONNECT_PHONENUMBER_ARN".`,
    );
  }

  if (
    typeof destinationEndpoint.Address !== "string"
    || destinationEndpoint.Address.trim().length === 0
    || destinationEndpoint.Type !== "TELEPHONE_NUMBER"
  ) {
    throw new Error(
      `Action "${action.id}" of type "StartOutboundChatContact" requires DestinationEndpoint to use a non-empty Address and Type "TELEPHONE_NUMBER".`,
    );
  }

  requireNonEmptyStringParameter(action, "ContactFlowArn");

  if (action.parameters.ContactSubtype !== "connect:SMS") {
    throw new Error(
      `Action "${action.id}" of type "StartOutboundChatContact" only supports ContactSubtype "connect:SMS".`,
    );
  }

  if ("InitialSystemMessage" in action.parameters) {
    const initialSystemMessage = requireObjectParameter(action, "InitialSystemMessage");
    if (
      typeof initialSystemMessage.Content !== "string"
      || initialSystemMessage.Content.trim().length === 0
    ) {
      throw new Error(
        `Action "${action.id}" of type "StartOutboundChatContact" requires InitialSystemMessage.Content to be a non-empty string when provided.`,
      );
    }
  }

  if (
    "RelatedContact" in action.parameters
    && action.parameters.RelatedContact !== "CURRENT"
  ) {
    throw new Error(
      `Action "${action.id}" of type "StartOutboundChatContact" only supports RelatedContact "CURRENT".`,
    );
  }

  requireErrorTypes(action, ["NoMatchingError"]);
}

export function validateCompleteOutboundCallVoiceConnector(
  action: FlowAction,
  voiceConnector: Record<string, unknown>,
): void {
  if (voiceConnector.VoiceConnectorType !== "ChimeConnector") {
    throw new Error(
      `Action "${action.id}" of type "CompleteOutboundCall" only supports VoiceConnectorType "ChimeConnector".`,
    );
  }

  for (const key of ["VoiceConnectorArn", "FromUser", "ToUser"] as const) {
    if (
      typeof voiceConnector[key] !== "string"
      || voiceConnector[key].trim().length === 0
    ) {
      throw new Error(
        `Action "${action.id}" of type "CompleteOutboundCall" requires VoiceConnector.${key} to be a non-empty string.`,
      );
    }
  }

  if (
    "UserToUserInformation" in voiceConnector
    && voiceConnector.UserToUserInformation !== undefined
    && (
      typeof voiceConnector.UserToUserInformation !== "string"
      || voiceConnector.UserToUserInformation.trim().length === 0
    )
  ) {
    throw new Error(
      `Action "${action.id}" of type "CompleteOutboundCall" requires VoiceConnector.UserToUserInformation to be a non-empty string when provided.`,
    );
  }
}

export function requireIntegerInRangeParameter(
  action: FlowAction,
  key: string,
  minimum: number,
  maximum: number,
  expectedDescription: string,
): number {
  const value = action.parameters[key];
  if (
    typeof value !== "number"
    || !Number.isInteger(value)
    || value < minimum
    || value > maximum
  ) {
    throw new Error(
      `Action "${action.id}" of type "${action.type}" requires "${key}" to be ${expectedDescription}.`,
    );
  }
  return value;
}
