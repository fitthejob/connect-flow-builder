import type {
  FlowAction,
  LoadContactContentType,
  PersistentContactRehydrationType,
} from "../types.js";
import {
  AUTHENTICATE_PARTICIPANT_OPERANDS,
  LOAD_CONTACT_CONTENT_TYPES,
  PERSISTENT_CONTACT_REHYDRATION_TYPES,
  isObject,
  requireErrorTypes,
  requireNestedNonEmptyString,
  requireNonEmptyStringParameter,
  requireObjectParameter,
  validatePositiveIntegerOrIntegerString,
  validateStringMapParameter,
} from "./helpers.js";

export function validateCreateTaskAction(action: FlowAction): void {
  requireNonEmptyStringParameter(action, "ContactFlowId");
  requireNonEmptyStringParameter(action, "Name");

  if ("Description" in action.parameters) {
    requireNonEmptyStringParameter(action, "Description");
  }

  validateStringMapParameter(action, "Attributes");
  validateStringMapParameter(action, "References");

  const hasDelaySeconds = "DelaySeconds" in action.parameters;
  const hasScheduledTime = "ScheduledTime" in action.parameters;
  if (hasDelaySeconds && hasScheduledTime) {
    throw new Error(
      `Action "${action.id}" of type "CreateTask" cannot define both DelaySeconds and ScheduledTime.`,
    );
  }

  if (hasDelaySeconds) {
    const value = action.parameters.DelaySeconds;
    if (!Number.isInteger(value) || (value as number) < 1 || (value as number) > 518400) {
      throw new Error(
        `Action "${action.id}" of type "CreateTask" requires DelaySeconds to be an integer between 1 and 518400.`,
      );
    }
  }

  if (hasScheduledTime) {
    requireNonEmptyStringParameter(action, "ScheduledTime");
  }

  if ("TaskTemplateId" in action.parameters) {
    requireNonEmptyStringParameter(action, "TaskTemplateId");
  }
}

export function validateCreatePersistentContactAssociationAction(
  action: FlowAction,
): void {
  const rehydrationType = requireNonEmptyStringParameter(
    action,
    "RehydrationType",
  ) as PersistentContactRehydrationType;

  if (!PERSISTENT_CONTACT_REHYDRATION_TYPES.has(rehydrationType)) {
    throw new Error(
      `Action "${action.id}" of type "CreatePersistentContactAssociation" requires RehydrationType to be ENTIRE_PAST_SESSION or FROM_SEGMENT.`,
    );
  }

  requireNonEmptyStringParameter(action, "SourceContactId");
  requireErrorTypes(action, ["NoMatchingError"]);
}

export function validateLoadContactContentAction(action: FlowAction): void {
  const contentType = requireNonEmptyStringParameter(
    action,
    "ContentType",
  ) as LoadContactContentType;

  if (!LOAD_CONTACT_CONTENT_TYPES.has(contentType)) {
    throw new Error(
      `Action "${action.id}" of type "LoadContactContent" requires ContentType to be EmailMessage.`,
    );
  }

  requireErrorTypes(action, ["NoMatchingError"]);
}

export function validateGetParticipantInputAction(action: FlowAction): void {
  const hasTouchtoneBufferMode = "EnableDTMFBuffer" in action.parameters;
  const isStoreInputMode =
    action.parameters.StoreInput === "True"
    || action.parameters.StoreInput === "true";
  const hasLexBot = "LexV2Bot" in action.parameters;
  const isDtmfMode = "InputTimeLimitSeconds" in action.parameters && !hasLexBot;

  if (hasTouchtoneBufferMode) {
    validateSetTouchtoneBufferBehaviorAction(action);
    return;
  }

  if (isStoreInputMode) {
    validateStoreCustomerInputAction(action);
    return;
  }

  // Pure DTMF mode: has InputTimeLimitSeconds but no LexV2Bot.
  // Connect requires NoMatchingCondition when the block has conditional transitions.
  if (isDtmfMode) {
    if ((action.transitions?.conditions?.length ?? 0) > 0) {
      requireErrorTypes(action, ["NoMatchingCondition"]);
    }
    return;
  }

  if (hasLexBot) {
    validateLexBackedGetParticipantInputAction(action);
    return;
  }

  throw new Error(
    `Action "${action.id}" of type "GetParticipantInput" requires either the Lex-backed mode (Text plus LexV2Bot), the DTMF mode (InputTimeLimitSeconds without LexV2Bot), the stored-input mode (StoreInput with proven DTMF configuration), or the touchtone-buffer mode (EnableDTMFBuffer).`,
  );
}

export function validateLexBackedGetParticipantInputAction(action: FlowAction): void {
  requireNonEmptyStringParameter(action, "Text");
  requireNonEmptyStringParameter(action, "LexV2Bot");
}

export function validateSetTouchtoneBufferBehaviorAction(action: FlowAction): void {
  requireErrorTypes(action, ["NoMatchingError"]);

  if ((action.transitions?.conditions?.length ?? 0) > 0) {
    throw new Error(
      `Action "${action.id}" of type "GetParticipantInput" does not support conditional transitions in the currently implemented Set Touchtone Buffer Behavior mode.`,
    );
  }

  const enableDtmfBuffer = requireNonEmptyStringParameter(
    action,
    "EnableDTMFBuffer",
  );
  if (!isConnectTrueFalseString(enableDtmfBuffer)) {
    throw new Error(
      `Action "${action.id}" of type "GetParticipantInput" requires EnableDTMFBuffer to be True, False, true, or false in the currently implemented Set Touchtone Buffer Behavior mode.`,
    );
  }

  for (const unsupportedKey of [
    "Text",
    "LexV2Bot",
    "DTMFConfiguration",
    "InputValidation",
    "InputTimeLimitSeconds",
  ] as const) {
    if (unsupportedKey in action.parameters) {
      throw new Error(
        `Action "${action.id}" of type "GetParticipantInput" does not support ${unsupportedKey} in the currently implemented Set Touchtone Buffer Behavior mode.`,
      );
    }
  }

  if (normalizeConnectTrueFalseString(enableDtmfBuffer) === "True") {
    if ("StoreInput" in action.parameters) {
      throw new Error(
        `Action "${action.id}" of type "GetParticipantInput" only supports StoreInput in Set Touchtone Buffer Behavior stop-and-clear mode.`,
      );
    }

    if ("InputEncryption" in action.parameters) {
      throw new Error(
        `Action "${action.id}" of type "GetParticipantInput" only supports InputEncryption in Set Touchtone Buffer Behavior stop-and-clear mode.`,
      );
    }

    return;
  }

  if ("StoreInput" in action.parameters) {
    const storeInput = requireNonEmptyStringParameter(action, "StoreInput");
    if (!isConnectTrueFalseString(storeInput)) {
      throw new Error(
        `Action "${action.id}" of type "GetParticipantInput" requires StoreInput to be True, False, true, or false in the currently implemented Set Touchtone Buffer Behavior mode.`,
      );
    }

    if (normalizeConnectTrueFalseString(storeInput) !== "True") {
      throw new Error(
        `Action "${action.id}" of type "GetParticipantInput" only supports StoreInput = True in the currently implemented Set Touchtone Buffer Behavior mode.`,
      );
    }
  }

  if ("InputEncryption" in action.parameters) {
    if (!("StoreInput" in action.parameters)) {
      throw new Error(
        `Action "${action.id}" of type "GetParticipantInput" requires StoreInput when InputEncryption is used in the currently implemented Set Touchtone Buffer Behavior mode.`,
      );
    }

    const inputEncryption = requireObjectParameter(action, "InputEncryption");
    requireNestedNonEmptyString(
      action,
      inputEncryption,
      "InputEncryption",
      "EncryptionKeyId",
      "GetParticipantInput",
    );
    requireNestedNonEmptyString(
      action,
      inputEncryption,
      "InputEncryption",
      "Key",
      "GetParticipantInput",
    );
  }
}

export function validateStoreCustomerInputAction(action: FlowAction): void {
  requireErrorTypes(action, ["NoMatchingError"]);

  if ((action.transitions?.conditions?.length ?? 0) > 0) {
    throw new Error(
      `Action "${action.id}" of type "GetParticipantInput" does not support conditional transitions in the currently implemented Store customer input mode.`,
    );
  }

  const inputTimeLimit = requireNonEmptyStringParameter(
    action,
    "InputTimeLimitSeconds",
  );
  validatePositiveIntegerOrIntegerString(
    action,
    inputTimeLimit,
    "InputTimeLimitSeconds",
    "GetParticipantInput",
  );

  const dtmfConfiguration = requireObjectParameter(action, "DTMFConfiguration");
  const disableCancelKey = requireNestedNonEmptyString(
    action,
    dtmfConfiguration,
    "DTMFConfiguration",
    "DisableCancelKey",
    "GetParticipantInput",
  );
  if (disableCancelKey !== "True" && disableCancelKey !== "False") {
    throw new Error(
      `Action "${action.id}" of type "GetParticipantInput" requires DTMFConfiguration.DisableCancelKey to be True or False in the currently implemented Store customer input mode.`,
    );
  }

  const interdigitTimeLimit = requireNestedNonEmptyString(
    action,
    dtmfConfiguration,
    "DTMFConfiguration",
    "InterdigitTimeLimitSeconds",
    "GetParticipantInput",
  );
  validatePositiveIntegerOrIntegerString(
    action,
    interdigitTimeLimit,
    "DTMFConfiguration.InterdigitTimeLimitSeconds",
    "GetParticipantInput",
  );

  const inputValidation = requireObjectParameter(action, "InputValidation");
  const customValidation = inputValidation.CustomValidation;
  if (!isObject(customValidation)) {
    throw new Error(
      `Action "${action.id}" of type "GetParticipantInput" requires InputValidation.CustomValidation in the currently implemented Store customer input mode.`,
    );
  }

  const maximumLength = requireNestedNonEmptyString(
    action,
    customValidation,
    "InputValidation.CustomValidation",
    "MaximumLength",
    "GetParticipantInput",
  );
  validatePositiveIntegerOrIntegerString(
    action,
    maximumLength,
    "InputValidation.CustomValidation.MaximumLength",
    "GetParticipantInput",
  );
}

export function validateAuthenticateParticipantAction(action: FlowAction): void {
  const cognitoConfiguration = requireObjectParameter(
    action,
    "CognitoConfiguration",
  );
  for (const key of ["UserPoolArn", "AppClientId"] as const) {
    if (
      typeof cognitoConfiguration[key] !== "string"
      || cognitoConfiguration[key].trim().length === 0
    ) {
      throw new Error(
        `Action "${action.id}" of type "AuthenticateParticipant" requires CognitoConfiguration.${key} to be a non-empty string.`,
      );
    }
  }

  const customerProfilesConfiguration = requireObjectParameter(
    action,
    "CustomerProfilesConfiguration",
  );
  if (
    typeof customerProfilesConfiguration.ObjectTypeName !== "string"
    || customerProfilesConfiguration.ObjectTypeName.trim().length === 0
  ) {
    throw new Error(
      `Action "${action.id}" of type "AuthenticateParticipant" requires CustomerProfilesConfiguration.ObjectTypeName to be a non-empty string.`,
    );
  }

  const timeLimitMinutes = action.parameters.TimeLimitMinutes;
  const numericTimeLimit =
    typeof timeLimitMinutes === "number"
      ? timeLimitMinutes
      : typeof timeLimitMinutes === "string"
        ? Number(timeLimitMinutes)
        : NaN;
  if (
    !Number.isInteger(numericTimeLimit)
    || numericTimeLimit <= 0
  ) {
    throw new Error(
      `Action "${action.id}" of type "AuthenticateParticipant" requires TimeLimitMinutes to be a positive integer or integer string.`,
    );
  }

  for (const condition of action.transitions?.conditions ?? []) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(
        `Action "${action.id}" of type "AuthenticateParticipant" only supports Equals conditions.`,
      );
    }

    const operand = condition.condition.operands[0];
    if (!AUTHENTICATE_PARTICIPANT_OPERANDS.has(operand)) {
      throw new Error(
        `Action "${action.id}" of type "AuthenticateParticipant" only supports the OptedOut condition operand.`,
      );
    }
  }

  requireErrorTypes(action, ["TimeLimitExceeded", "NoMatchingError"]);
}

export function isConnectTrueFalseString(value: string): boolean {
  return value === "True"
    || value === "False"
    || value === "true"
    || value === "false";
}

export function normalizeConnectTrueFalseString(value: string): "True" | "False" {
  return value.toLowerCase() === "true" ? "True" : "False";
}
