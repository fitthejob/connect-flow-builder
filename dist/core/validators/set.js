import { CONTACT_EVENT_HOOK_TYPES, isObject, requireErrorTypes, requireNonEmptyStringParameter, } from "./helpers.js";
export function validateStartVoiceIdStreamAction(action) {
    if (Object.keys(action.parameters).length > 0) {
        throw new Error(`Action "${action.id}" of type "StartVoiceIdStream" does not accept parameters.`);
    }
    requireErrorTypes(action, ["NoMatchingError"]);
}
export function validateResumeContactAction(action) {
    if (Object.keys(action.parameters).length > 0) {
        throw new Error(`Action "${action.id}" of type "ResumeContact" does not accept parameters.`);
    }
}
export function validateTagContactAction(action) {
    const tags = action.parameters.Tags;
    if (!isObject(tags) || Object.keys(tags).length === 0) {
        throw new Error(`Action "${action.id}" of type "TagContact" requires Tags to contain at least one entry.`);
    }
    for (const [key, value] of Object.entries(tags)) {
        validateUserDefinedTagEntry(action, key, value, "TagContact");
    }
}
export function validateUpdateContactEventHooksAction(action) {
    const eventHooks = action.parameters.EventHooks;
    if (!isObject(eventHooks)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactEventHooks" requires EventHooks to be an object.`);
    }
    const entries = Object.entries(eventHooks);
    if (entries.length !== 1) {
        throw new Error(`Action "${action.id}" of type "UpdateContactEventHooks" requires EventHooks to define exactly one hook.`);
    }
    const [hookType, flowIdOrArn] = entries[0];
    if (!CONTACT_EVENT_HOOK_TYPES.has(hookType)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactEventHooks" uses unsupported hook type "${hookType}".`);
    }
    if (typeof flowIdOrArn !== "string" || flowIdOrArn.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "UpdateContactEventHooks" requires the configured hook target to be a non-empty string.`);
    }
}
export function validateUnTagContactAction(action) {
    const tagKeys = action.parameters.TagKeys;
    if (!Array.isArray(tagKeys) || tagKeys.length === 0) {
        throw new Error(`Action "${action.id}" of type "UnTagContact" requires TagKeys to contain at least one entry.`);
    }
    for (const key of tagKeys) {
        if (typeof key !== "string" || key.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "UnTagContact" requires every TagKeys entry to be a non-empty string.`);
        }
        if (key.startsWith("aws:")) {
            throw new Error(`Action "${action.id}" of type "UnTagContact" cannot remove system tag keys prefixed with aws:.`);
        }
        if (isLikelyJsonPath(key)) {
            throw new Error(`Action "${action.id}" of type "UnTagContact" requires static TagKeys values, not JSONPath references.`);
        }
    }
}
export function validateUpdateContactCallbackNumberAction(action) {
    const callbackNumber = requireNonEmptyStringParameter(action, "CallbackNumber");
    if (!isLikelyJsonPath(callbackNumber)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactCallbackNumber" requires CallbackNumber to be a JSONPath reference.`);
    }
}
export function validateUpdateContactRoutingBehaviorAction(action) {
    const priority = action.parameters.QueuePriority;
    const timeAdjustment = action.parameters.QueueTimeAdjustmentSeconds;
    if ((priority === undefined) === (timeAdjustment === undefined)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactRoutingBehavior" requires exactly one of QueuePriority or QueueTimeAdjustmentSeconds.`);
    }
    if (priority !== undefined
        && (!Number.isInteger(priority) || priority < 1 || priority > 99)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactRoutingBehavior" requires QueuePriority to be an integer between 1 and 99.`);
    }
    if (timeAdjustment !== undefined && !Number.isInteger(timeAdjustment)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactRoutingBehavior" requires QueueTimeAdjustmentSeconds to be an integer.`);
    }
}
export function validateUpdateContactTargetQueueAction(action) {
    const queueId = action.parameters.QueueId;
    const agentId = action.parameters.AgentId;
    if ((queueId === undefined) === (agentId === undefined)) {
        throw new Error(`Action "${action.id}" of type "UpdateContactTargetQueue" requires exactly one of QueueId or AgentId.`);
    }
    if (queueId !== undefined) {
        requireNonEmptyStringParameter(action, "QueueId");
    }
    if (agentId !== undefined) {
        requireNonEmptyStringParameter(action, "AgentId");
    }
}
export function validateUpdateContactTextToSpeechVoiceAction(action) {
    requireNonEmptyStringParameter(action, "TextToSpeechVoice");
    for (const key of ["TextToSpeechEngine", "TextToSpeechStyle"]) {
        if (key in action.parameters) {
            requireNonEmptyStringParameter(action, key);
        }
    }
}
export function validateUserDefinedTagEntry(action, key, value, actionType) {
    if (key.trim().length === 0 || key.startsWith("aws:")) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires every tag key to be a non-empty user-defined tag key.`);
    }
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires every tag value to be a non-empty string.`);
    }
}
export function isLikelyJsonPath(value) {
    return /^\$(\.|\[)/.test(value);
}
export function validateUpdateRoutingCriteriaAction(action) {
    const routingCriteria = action.parameters.RoutingCriteria;
    if (typeof routingCriteria === "string") {
        if (routingCriteria.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires a non-empty RoutingCriteria JSONPath string.`);
        }
        return;
    }
    if (!isObject(routingCriteria)) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires RoutingCriteria to be an object or a JSONPath string.`);
    }
    const criteria = routingCriteria;
    if (!Array.isArray(criteria.Steps) || criteria.Steps.length === 0) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires RoutingCriteria.Steps to contain at least one step.`);
    }
    for (const step of criteria.Steps) {
        validateRoutingCriteriaStep(action, step);
    }
}
export function validateRoutingCriteriaStep(action, step) {
    if (!isObject(step.Expression)) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires every step to include an Expression.`);
    }
    const hasAttributeCondition = isObject(step.Expression.AttributeCondition);
    const hasAndExpression = Array.isArray(step.Expression.AndExpression);
    if (hasAttributeCondition === hasAndExpression) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires each step Expression to define exactly one of AttributeCondition or AndExpression.`);
    }
    if (hasAttributeCondition) {
        validateRoutingCriteriaAttributeCondition(action, step.Expression.AttributeCondition);
    }
    if (hasAndExpression) {
        const andConditions = step.Expression.AndExpression;
        if (andConditions.length === 0) {
            throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires AndExpression to contain at least one attribute condition.`);
        }
        for (const condition of andConditions) {
            validateRoutingCriteriaAttributeCondition(action, condition);
        }
    }
    const duration = step.Expiry?.DurationInSeconds;
    if (!Number.isInteger(duration) || (duration ?? 0) <= 0) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires every step expiry duration to be a positive integer.`);
    }
}
export function validateRoutingCriteriaAttributeCondition(action, condition) {
    if (typeof condition.Name !== "string" || condition.Name.length < 1 || condition.Name.length > 64) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires attribute condition Name to be 1-64 characters.`);
    }
    if (typeof condition.Value !== "string" || condition.Value.length < 1 || condition.Value.length > 64) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires attribute condition Value to be 1-64 characters.`);
    }
    if (![1, 2, 3, 4, 5].includes(condition.ProficiencyLevel)) {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" requires ProficiencyLevel to be between 1 and 5.`);
    }
    if (condition.ComparisonOperator !== "NumberGreaterOrEqualTo") {
        throw new Error(`Action "${action.id}" of type "UpdateRoutingCriteria" only supports ComparisonOperator "NumberGreaterOrEqualTo".`);
    }
}
