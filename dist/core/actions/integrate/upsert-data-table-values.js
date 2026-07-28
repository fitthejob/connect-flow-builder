import { defineActionDefinition } from "../../action-definition.js";
export const upsertDataTableValuesDefinition = defineActionDefinition({
    type: "UpsertDataTableValues",
    requiredParameters: ["LockVersion", "DataTableId", "DataTableUpsertAttributes"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
