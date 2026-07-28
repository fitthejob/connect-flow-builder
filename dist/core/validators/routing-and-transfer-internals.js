import { requireErrorTypes, requireNonEmptyStringParameter, requireObjectParameter, } from "./helpers.js";
export function validateAssociateContactToCustomerProfileAction(action) {
    const requestData = requireObjectParameter(action, "ProfileRequestData");
    if (typeof requestData.ProfileId !== "string"
        || requestData.ProfileId.trim().length === 0
        || typeof requestData.ContactId !== "string"
        || requestData.ContactId.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "AssociateContactToCustomerProfile" requires ProfileId and ContactId to be non-empty strings.`);
    }
    requireErrorTypes(action, ["NoMatchingError"]);
}
export function validateDequeueContactAndTransferToQueueAction(action) {
    const queueId = action.parameters.QueueId;
    const agentId = action.parameters.AgentId;
    if ((queueId === undefined) === (agentId === undefined)) {
        throw new Error(`Action "${action.id}" of type "DequeueContactAndTransferToQueue" requires exactly one of QueueId or AgentId.`);
    }
    if (queueId !== undefined) {
        requireNonEmptyStringParameter(action, "QueueId");
    }
    if (agentId !== undefined) {
        requireNonEmptyStringParameter(action, "AgentId");
    }
    requireErrorTypes(action, ["QueueAtCapacity", "NoMatchingError"]);
}
export function validateTransferContactToAgentAction(action) {
    if (Object.keys(action.parameters).length > 0) {
        throw new Error(`Action "${action.id}" of type "TransferContactToAgent" does not accept parameters.`);
    }
}
