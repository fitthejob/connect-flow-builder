import type {
  FlowAction,
} from "../types.js";
import {
  requireErrorTypes,
  requireNestedNonEmptyString,
  requireNonEmptyStringParameter,
  requireObjectParameter,
  validatePositiveIntegerOrIntegerString,
  validateTrueFalseField,
} from "./helpers.js";

export function validateEndFlowExecutionAction(action: FlowAction): void {
  if (Object.keys(action.parameters).length > 0) {
    throw new Error(
      `Action "${action.id}" of type "EndFlowExecution" does not accept parameters.`,
    );
  }
}

export function validateEndFlowModuleExecutionAction(action: FlowAction): void {
  if (Object.keys(action.parameters).length > 0) {
    throw new Error(
      `Action "${action.id}" of type "EndFlowModuleExecution" does not accept parameters.`,
    );
  }
}

export function validateTransferToFlowAction(action: FlowAction): void {
  requireNonEmptyStringParameter(action, "ContactFlowId");
}

export function validateTransferContactToQueueAction(action: FlowAction): void {
  if (Object.keys(action.parameters).length > 0) {
    throw new Error(
      `Action "${action.id}" of type "TransferContactToQueue" does not accept parameters.`,
    );
  }

  requireErrorTypes(action, [
    "QueueAtCapacity",
    "NoMatchingError",
  ]);
}

export function validateTransferParticipantToThirdPartyAction(action: FlowAction): void {
  requireNonEmptyStringParameter(action, "ThirdPartyPhoneNumber");
  const connectionTimeLimit = requireNonEmptyStringParameter(
    action,
    "ThirdPartyConnectionTimeLimitSeconds",
  );
  validatePositiveIntegerOrIntegerString(
    action,
    connectionTimeLimit,
    "ThirdPartyConnectionTimeLimitSeconds",
    "TransferParticipantToThirdParty",
  );

  validateTrueFalseField(
    action,
    requireNonEmptyStringParameter(action, "ContinueFlowExecution"),
    "ContinueFlowExecution",
  );

  if ("ThirdPartyDTMFDigits" in action.parameters) {
    requireNonEmptyStringParameter(action, "ThirdPartyDTMFDigits");
  }

  if ("CallerId" in action.parameters) {
    const callerId = requireObjectParameter(action, "CallerId");
    requireNestedNonEmptyString(
      action,
      callerId,
      "CallerId",
      "Name",
      "TransferParticipantToThirdParty",
    );
    requireNestedNonEmptyString(
      action,
      callerId,
      "CallerId",
      "Number",
      "TransferParticipantToThirdParty",
    );
  }

  requireErrorTypes(action, [
    "CallFailed",
    "ConnectionTimeLimitExceeded",
    "NoMatchingError",
  ]);
}
