import { defineActionDefinition } from "../../action-definition.js";
export const loopDefinition = defineActionDefinition({
    type: "Loop",
    requiredParameters: ["LoopCount"],
    supportsNextAction: false,
    supportsConditions: true,
    supportsErrors: false,
    category: "logic",
});
