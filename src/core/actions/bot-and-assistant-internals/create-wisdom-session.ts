import { defineActionDefinition } from "../../action-definition.js";

export const createWisdomSessionDefinition = defineActionDefinition({
  type: "CreateWisdomSession",
  requiredParameters: ["WisdomAssistantArn"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "bot-and-assistant-internals",
});
