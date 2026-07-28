import { defineActionDefinition } from "../../action-definition.js";
export const invokeFlowModuleDefinition = defineActionDefinition({
    type: "InvokeFlowModule",
    requiredParameters: ["FlowModuleId"],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "integrate",
});
