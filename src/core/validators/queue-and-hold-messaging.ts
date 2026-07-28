import type {
  FlowAction,
  MessageLoopContent,
} from "../types.js";
import {
  isObject,
  validateMediaObject,
} from "./helpers.js";

export function validateMessageParticipantIterativelyAction(action: FlowAction): void {
  const messages = action.parameters.Messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error(
      `Action "${action.id}" of type "MessageParticipantIteratively" requires Messages to contain at least one entry.`,
    );
  }

  for (const message of messages) {
    validateMessageLoopContent(action, message);
  }

  const interruptFrequency = action.parameters.InterruptFrequencySeconds;
  if (
    interruptFrequency !== undefined
    && (!Number.isInteger(interruptFrequency) || (interruptFrequency as number) <= 0)
  ) {
    throw new Error(
      `Action "${action.id}" of type "MessageParticipantIteratively" requires InterruptFrequencySeconds to be a positive integer when provided.`,
    );
  }

  for (const condition of action.transitions?.conditions ?? []) {
    if (
      condition.condition.operator !== "Equals"
      || condition.condition.operands[0] !== "MessagesInterrupted"
    ) {
      throw new Error(
        `Action "${action.id}" of type "MessageParticipantIteratively" only supports Equals MessagesInterrupted conditions.`,
      );
    }
  }
}

export function validateMessageLoopContent(action: FlowAction, message: unknown): void {
  if (!isObject(message)) {
    throw new Error(
      `Action "${action.id}" of type "MessageParticipantIteratively" requires every message to be an object.`,
    );
  }

  const typedMessage = message as MessageLoopContent & Record<string, unknown>;
  const contentKeys = ["Text", "PromptId", "SSML", "Media"].filter(
    (key) => typedMessage[key] !== undefined,
  );

  if (contentKeys.length !== 1) {
    throw new Error(
      `Action "${action.id}" of type "MessageParticipantIteratively" requires each message to define exactly one of Text, PromptId, SSML, or Media.`,
    );
  }

  const [contentKey] = contentKeys;
  if (contentKey === "Media") {
    validateMediaObject(action, typedMessage.Media, "MessageParticipantIteratively");
    return;
  }

  const value = typedMessage[contentKey];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Action "${action.id}" of type "MessageParticipantIteratively" requires ${contentKey} to be a non-empty string.`,
    );
  }
}
