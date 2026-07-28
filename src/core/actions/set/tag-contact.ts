import { defineActionDefinition } from "../../action-definition.js";

export const tagContactDefinition = defineActionDefinition({
  type: "TagContact",
  requiredParameters: ["Tags"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: false,
  category: "set",
});
