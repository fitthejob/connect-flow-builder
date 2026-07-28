import { defineActionDefinition } from "../../action-definition.js";

export const loadContactContentDefinition = defineActionDefinition({
  type: "LoadContactContent",
  requiredParameters: ["ContentType"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "interact",
});
