import { defineActionDefinition } from "../../action-definition.js";
export const updateFlowAttributesDefinition = defineActionDefinition({
    type: "UpdateFlowAttributes",
    requiredParameters: ["FlowAttributes"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: false,
    category: "flow-state-and-execution-internals",
});
