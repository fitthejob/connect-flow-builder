import { defineActionDefinition } from "../../action-definition.js";

export const createTaskDefinition = defineActionDefinition({
  type: "CreateTask",
  requiredParameters: ["ContactFlowId", "Name"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "interact",
});
