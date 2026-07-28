import { defineActionDefinition } from "../../action-definition.js";

export const updateRoutingCriteriaDefinition = defineActionDefinition({
  type: "UpdateRoutingCriteria",
  requiredParameters: ["RoutingCriteria"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "set",
});
