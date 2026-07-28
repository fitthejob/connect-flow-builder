import { defineActionDefinition } from "../../action-definition.js";
export const transferContactToAgentDefinition = defineActionDefinition({
    type: "TransferContactToAgent",
    requiredParameters: [],
    supportsNextAction: false,
    supportsConditions: false,
    supportsErrors: false,
    category: "routing-and-transfer-internals",
});
