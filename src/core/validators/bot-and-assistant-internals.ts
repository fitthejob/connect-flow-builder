import type {
  FlowAction,
} from "../types.js";
import {
  isObject,
  requireErrorTypes,
  requireNonEmptyStringParameter,
  validateMediaObject,
} from "./helpers.js";

export function validateConnectParticipantWithLexBotAction(action: FlowAction): void {
  const hasLexV2Bot = isObject(action.parameters.LexV2Bot);
  const hasLexBot = isObject(action.parameters.LexBot);

  if (hasLexV2Bot === hasLexBot) {
    throw new Error(
      `Action "${action.id}" of type "ConnectParticipantWithLexBot" requires exactly one of LexV2Bot or LexBot.`,
    );
  }

  validateSinglePromptVariant(action, "ConnectParticipantWithLexBot");

  if (hasLexV2Bot) {
    const lexV2Bot = action.parameters.LexV2Bot as Record<string, unknown>;
    if (typeof lexV2Bot.AliasArn !== "string" || lexV2Bot.AliasArn.trim().length === 0) {
      throw new Error(
        `Action "${action.id}" of type "ConnectParticipantWithLexBot" requires LexV2Bot.AliasArn to be a non-empty string.`,
      );
    }
  }

  if (hasLexBot) {
    const lexBot = action.parameters.LexBot as Record<string, unknown>;
    for (const key of ["Name", "Region", "Alias"]) {
      if (typeof lexBot[key] !== "string" || (lexBot[key] as string).trim().length === 0) {
        throw new Error(
          `Action "${action.id}" of type "ConnectParticipantWithLexBot" requires LexBot.${key} to be a non-empty string.`,
        );
      }
    }
  }

  const timeout = action.parameters.LexTimeoutSeconds;
  if (timeout !== undefined) {
    if (!isObject(timeout) || !("Text" in timeout)) {
      throw new Error(
        `Action "${action.id}" of type "ConnectParticipantWithLexBot" requires LexTimeoutSeconds to be an object with Text.`,
      );
    }

    const textValue = timeout.Text;
    if (
      !(
        (typeof textValue === "number" && Number.isInteger(textValue) && textValue > 0)
        || (typeof textValue === "string" && textValue.trim().length > 0)
      )
    ) {
      throw new Error(
        `Action "${action.id}" of type "ConnectParticipantWithLexBot" requires LexTimeoutSeconds.Text to be a positive integer or a non-empty JSONPath string.`,
      );
    }
  }

  for (const condition of action.transitions?.conditions ?? []) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(
        `Action "${action.id}" of type "ConnectParticipantWithLexBot" only supports Equals conditions.`,
      );
    }
  }
}

export function validateCreateWisdomSessionAction(action: FlowAction): void {
  requireNonEmptyStringParameter(action, "WisdomAssistantArn");
  requireErrorTypes(action, ["NoMatchingError"]);
}

export function validateSinglePromptVariant(action: FlowAction, actionType: FlowAction["type"]): void {
  const promptKeys = ["PromptId", "Text", "SSML", "Media"].filter(
    (key) => action.parameters[key] !== undefined,
  );

  if (promptKeys.length !== 1) {
    throw new Error(
      `Action "${action.id}" of type "${actionType}" requires exactly one of PromptId, Text, SSML, or Media.`,
    );
  }

  const [promptKey] = promptKeys;
  if (promptKey === "Media") {
    validateMediaObject(action, action.parameters.Media, actionType);
    return;
  }

  requireNonEmptyStringParameter(action, promptKey);
}
