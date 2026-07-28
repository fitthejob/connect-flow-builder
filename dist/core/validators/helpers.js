import * as ACTION_CONSTANTS from "../action-constants.js";
export const CHECK_METRIC_DATA_METRIC_TYPES = new Set(ACTION_CONSTANTS.CHECK_METRIC_DATA_METRIC_TYPES);
export const STAFFING_METRIC_TYPES = new Set([
    "NumberOfAgentsAvailable",
    "NumberOfAgentsStaffed",
    "NumberOfAgentsOnline",
]);
export const WAIT_EVENTS = new Set(ACTION_CONSTANTS.WAIT_EVENTS);
export const FLOW_LOGGING_BEHAVIORS = new Set(ACTION_CONSTANTS.FLOW_LOGGING_BEHAVIORS);
export const QUEUE_CHANNELS = new Set(ACTION_CONSTANTS.QUEUE_CHANNELS);
export const OUTBOUND_CALL_STATUS_OPERANDS = new Set(ACTION_CONSTANTS.OUTBOUND_CALL_STATUS_OPERANDS);
export const CHECK_VOICE_ID_OPTIONS = new Set(ACTION_CONSTANTS.CHECK_VOICE_ID_OPTIONS);
export const ENROLLMENT_STATUS_RESULTS = new Set([
    "Enrolled",
    "Not enrolled",
    "Opted out",
]);
export const VOICE_AUTHENTICATION_RESULTS = new Set([
    "Authenticated",
    "Not authenticated",
    "Inconclusive",
    "Not enrolled",
    "Opted out",
]);
export const FRAUD_DETECTION_RESULTS = new Set([
    "High risk",
    "Low risk",
    "Inconclusive",
]);
export const PREVIOUS_CONTACT_PARTICIPANT_STATES = new Set(ACTION_CONSTANTS.PREVIOUS_CONTACT_PARTICIPANT_STATES);
export const PERSISTENT_CONTACT_REHYDRATION_TYPES = new Set(ACTION_CONSTANTS.PERSISTENT_CONTACT_REHYDRATION_TYPES);
export const LOAD_CONTACT_CONTENT_TYPES = new Set(ACTION_CONSTANTS.LOAD_CONTACT_CONTENT_TYPES);
export const MEDIA_STREAMING_STATES = new Set(ACTION_CONSTANTS.MEDIA_STREAMING_STATES);
export const MEDIA_DIRECTIONS = new Set(ACTION_CONSTANTS.MEDIA_DIRECTIONS);
export const CONTACT_TARGETS = new Set(["Current", "Related"]);
export const LOOP_OPERANDS = new Set(ACTION_CONSTANTS.LOOP_OPERANDS);
export const CONTACT_EVENT_HOOK_TYPES = new Set(ACTION_CONSTANTS.CONTACT_EVENT_HOOK_TYPES);
export const AUTHENTICATE_PARTICIPANT_OPERANDS = new Set(["OptedOut"]);
export function requireNonEmptyStringParameter(action, key) {
    const value = action.parameters[key];
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires "${key}" to be a non-empty string.`);
    }
    return value;
}
export function validateStringMapParameter(action, key) {
    if (!(key in action.parameters)) {
        return;
    }
    const value = action.parameters[key];
    if (!isObject(value) || Object.keys(value).length === 0) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ${key} to be a non-empty object when provided.`);
    }
    for (const [entryKey, entryValue] of Object.entries(value)) {
        if (entryKey.trim().length === 0
            || typeof entryValue !== "string"
            || entryValue.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "${action.type}" requires every ${key} entry to use a non-empty string key and value.`);
        }
    }
}
export function requireObjectParameter(action, key) {
    const value = action.parameters[key];
    if (!isObject(value)) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ${key} to be an object.`);
    }
    return value;
}
export function requireNestedNonEmptyString(action, parent, parentName, key, actionType) {
    const value = parent[key];
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${parentName}.${key} to be a non-empty string.`);
    }
    return value;
}
export function validatePositiveIntegerOrIntegerString(action, value, fieldName, actionType) {
    const numericValue = typeof value === "number"
        ? value
        : typeof value === "string" && /^\d+$/.test(value.trim())
            ? Number(value)
            : NaN;
    if (!Number.isInteger(numericValue) || numericValue <= 0) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${fieldName} to be a positive integer or integer string.`);
    }
}
export function validateTrueFalseField(action, value, fieldName) {
    if (value !== "True" && value !== "False") {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ${fieldName} to be True or False.`);
    }
}
export function requireErrorTypes(action, errorTypes) {
    const presentErrorTypes = new Set((action.transitions?.errors ?? []).map((error) => error.errorType));
    for (const errorType of errorTypes) {
        if (!presentErrorTypes.has(errorType)) {
            throw new Error(`Action "${action.id}" of type "${action.type}" requires an error transition for ${errorType}.`);
        }
    }
}
export function validateMediaObject(action, media, actionType) {
    if (!isObject(media)) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires Media to be an object.`);
    }
    if (typeof media.Uri !== "string"
        || media.Uri.trim().length === 0
        || media.SourceType !== "S3"
        || media.MediaType !== "Audio") {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires Media to include a non-empty Uri plus SourceType "S3" and MediaType "Audio".`);
    }
}
export function isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
