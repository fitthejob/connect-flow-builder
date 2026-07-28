import { defineActionDefinition } from "../../action-definition.js";

export const connectParticipantWithLexBotDefinition = defineActionDefinition({
  type: "ConnectParticipantWithLexBot",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: true,
  supportsErrors: true,
  category: "bot-and-assistant-internals",
});
