import { CONTACT_TARGETS, PREVIOUS_CONTACT_PARTICIPANT_STATES, isObject, requireErrorTypes, requireNonEmptyStringParameter, } from "./helpers.js";
export function validateUpdatePreviousContactParticipantStateAction(action) {
    const state = action.parameters
        .PreviousContactParticipantState;
    if (!state || !PREVIOUS_CONTACT_PARTICIPANT_STATES.has(state)) {
        throw new Error(`Action "${action.id}" of type "UpdatePreviousContactParticipantState" requires PreviousContactParticipantState to be one of ${[...PREVIOUS_CONTACT_PARTICIPANT_STATES].join(", ")}.`);
    }
    requireErrorTypes(action, ["NoMatchingError"]);
}
export function validateUpdateContactDataAction(action) {
    const targetContact = requireNonEmptyStringParameter(action, "TargetContact");
    if (!CONTACT_TARGETS.has(targetContact)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactData" requires TargetContact to be Current or Related.`);
    }
    const parameterKeys = Object.keys(action.parameters).filter((key) => key !== "TargetContact");
    if (parameterKeys.length === 0) {
        throw new Error(`Action "${action.id}" of type "UpdateContactData" requires at least one attribute besides TargetContact.`);
    }
    for (const key of ["Name", "Description", "LanguageCode", "CustomerId", "WatchlistId", "WisdomSessionArn"]) {
        if (key in action.parameters) {
            requireNonEmptyStringParameter(action, key);
        }
    }
    for (const key of [
        "IsVoiceIdStreamingEnabled",
        "IsVoiceAuthenticationEnabled",
        "IsFraudDetectionEnabled",
    ]) {
        if (key in action.parameters) {
            const value = requireNonEmptyStringParameter(action, key);
            if (value !== "TRUE" && value !== "FALSE") {
                throw new Error(`Action "${action.id}" of type "UpdateContactData" requires ${key} to be TRUE or FALSE.`);
            }
        }
    }
    validateRangeStringParameter(action, "VoiceAuthenticationThreshold", 0, 100);
    validateRangeStringParameter(action, "FraudDetectionThreshold", 0, 100);
    validateRangeStringParameter(action, "VoiceAuthenticationResponseTime", 5, 10);
    if ("References" in action.parameters) {
        const references = action.parameters.References;
        if (!isObject(references) || Object.keys(references).length === 0) {
            throw new Error(`Action "${action.id}" of type "UpdateContactData" requires References to be a non-empty object when provided.`);
        }
        for (const [key, value] of Object.entries(references)) {
            if (key.trim().length === 0 || typeof value !== "string" || value.trim().length === 0) {
                throw new Error(`Action "${action.id}" of type "UpdateContactData" requires every References entry to use a non-empty string key and value.`);
            }
        }
    }
}
export function validateRangeStringParameter(action, key, min, max) {
    if (!(key in action.parameters)) {
        return;
    }
    const value = requireNonEmptyStringParameter(action, key);
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < min || numericValue > max) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ${key} to be between ${min} and ${max}.`);
    }
}
