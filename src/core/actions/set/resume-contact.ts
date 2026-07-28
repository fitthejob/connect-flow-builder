import { defineActionDefinition } from "../../action-definition.js";

export const resumeContactDefinition = defineActionDefinition({
  type: "ResumeContact",
  requiredParameters: [],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "set",
});
