import { defineActionDefinition } from "../../action-definition.js";
export const startOutboundChatContactDefinition = defineActionDefinition({
    type: "StartOutboundChatContact",
    requiredParameters: [
        "SourceEndpoint",
        "DestinationEndpoint",
        "ContactFlowArn",
        "ContactSubtype",
    ],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "outbound-and-callback-operations",
});
