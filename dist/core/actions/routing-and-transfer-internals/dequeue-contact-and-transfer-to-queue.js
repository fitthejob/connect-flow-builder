import { defineActionDefinition } from "../../action-definition.js";
export const dequeueContactAndTransferToQueueDefinition = defineActionDefinition({
    type: "DequeueContactAndTransferToQueue",
    requiredParameters: [],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "routing-and-transfer-internals",
});
