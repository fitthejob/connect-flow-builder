import { defineActionDefinition } from "../../action-definition.js";
export const transferParticipantToThirdPartyDefinition = defineActionDefinition({
    type: "TransferParticipantToThirdParty",
    requiredParameters: [
        "ThirdPartyPhoneNumber",
        "ThirdPartyConnectionTimeLimitSeconds",
        "ContinueFlowExecution",
    ],
    supportsNextAction: true,
    supportsConditions: false,
    supportsErrors: true,
    category: "terminate",
});
