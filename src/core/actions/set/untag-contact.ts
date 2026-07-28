import { defineActionDefinition } from "../../action-definition.js";

export const unTagContactDefinition = defineActionDefinition({
  type: "UnTagContact",
  requiredParameters: ["TagKeys"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "set",
});
