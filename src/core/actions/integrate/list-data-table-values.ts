import { defineActionDefinition } from "../../action-definition.js";

export const listDataTableValuesDefinition = defineActionDefinition({
  type: "ListDataTableValues",
  requiredParameters: ["DataTableId", "PrimaryKeyGroups"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "integrate",
});
