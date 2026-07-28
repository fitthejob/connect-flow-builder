import { isObject, requireErrorTypes, requireNestedNonEmptyString, requireNonEmptyStringParameter, requireObjectParameter, validateStringMapParameter, } from "./helpers.js";
export function validateCreateCaseAction(action) {
    validateLowercaseBooleanStringParameter(action, "LinkContactToCase");
    requireNonEmptyStringParameter(action, "CaseTemplateId");
    validateStringMapParameter(action, "CaseRequestFields");
    requireErrorTypes(action, ["NoMatchingError"]);
}
export function validateCreateCustomerProfileAction(action) {
    validateProfileRequestDataHasEntries(action);
    validateProfileResponseData(action);
    requireErrorTypes(action, ["NoMatchingError"]);
}
export function validateEvaluateDataTableValuesAction(action) {
    requireNonEmptyStringParameter(action, "DataTableId");
    requireErrorTypes(action, ["NoMatchingError"]);
    const queries = requireArrayParameter(action, "Queries", "EvaluateDataTableValues");
    validateArrayLengthRange(action, queries, "Queries", "EvaluateDataTableValues", 1, 5);
    const seenQueryNames = new Set();
    for (const query of queries) {
        if (!isObject(query)) {
            throw new Error(`Action "${action.id}" of type "EvaluateDataTableValues" requires every Queries entry to be an object.`);
        }
        const queryName = requireNestedNonEmptyString(action, query, "Queries", "QueryName", "EvaluateDataTableValues");
        if (seenQueryNames.has(queryName)) {
            throw new Error(`Action "${action.id}" of type "EvaluateDataTableValues" requires every Queries.QueryName to be unique.`);
        }
        seenQueryNames.add(queryName);
        validateNestedStringArray(action, query, "Attributes", "Queries", "EvaluateDataTableValues");
        validateNamedPrimaryValues(action, query, "PrimaryValues", "AttributeName", "Queries", "EvaluateDataTableValues");
    }
}
export function validateInvokeFlowModuleAction(action) {
    requireNonEmptyStringParameter(action, "FlowModuleId");
}
export function validateGetCaseAction(action) {
    validateLowercaseBooleanStringParameter(action, "LinkContactToCase");
    validateLowercaseBooleanStringParameter(action, "GetLastUpdatedCase");
    requireNonEmptyStringParameter(action, "CustomerId");
    validateStringMapParameter(action, "CaseRequestFields");
    validateStringArrayParameter(action, "CaseResponseFields");
    requireErrorTypes(action, [
        "NoMatchingError",
        "ContactNotLinked",
        "MultipleFound",
        "NoneFound",
    ]);
}
export function validateGetCustomerProfileAction(action) {
    const requestData = requireObjectParameter(action, "ProfileRequestData");
    const hasIdentifierPair = typeof requestData.IdentifierName === "string"
        && requestData.IdentifierName.trim().length > 0
        && typeof requestData.IdentifierValue === "string"
        && requestData.IdentifierValue.trim().length > 0;
    const hasSearchCriteria = Array.isArray(requestData.SearchCriteria);
    if (hasIdentifierPair === hasSearchCriteria) {
        throw new Error(`Action "${action.id}" of type "GetCustomerProfile" requires either IdentifierName and IdentifierValue, or SearchCriteria with LogicalOperator.`);
    }
    if (hasSearchCriteria) {
        if (requestData.SearchCriteria.length === 0) {
            throw new Error(`Action "${action.id}" of type "GetCustomerProfile" requires SearchCriteria to contain at least one entry.`);
        }
        validateCustomerProfileSearchCriteria(action, requestData.SearchCriteria);
        if (requestData.LogicalOperator !== "AND"
            && requestData.LogicalOperator !== "OR") {
            throw new Error(`Action "${action.id}" of type "GetCustomerProfile" requires LogicalOperator to be AND or OR when SearchCriteria is used.`);
        }
    }
    validateProfileResponseData(action);
    requireErrorTypes(action, ["MultipleFoundError", "NoneFoundError", "NoMatchingError"]);
}
export function validateGetCustomerProfileObjectAction(action) {
    const requestData = requireObjectParameter(action, "ProfileRequestData");
    if (typeof requestData.ProfileId !== "string"
        || requestData.ProfileId.trim().length === 0
        || typeof requestData.ObjectType !== "string"
        || requestData.ObjectType.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "GetCustomerProfileObject" requires ProfileId and ObjectType to be non-empty strings.`);
    }
    const hasUseLatest = typeof requestData.UseLatest === "boolean";
    const hasIdentifierPair = typeof requestData.IdentifierName === "string"
        && requestData.IdentifierName.trim().length > 0
        && typeof requestData.IdentifierValue === "string"
        && requestData.IdentifierValue.trim().length > 0;
    if (hasUseLatest === hasIdentifierPair) {
        throw new Error(`Action "${action.id}" of type "GetCustomerProfileObject" requires either UseLatest or IdentifierName and IdentifierValue.`);
    }
    validateProfileResponseData(action);
    requireErrorTypes(action, ["NoneFoundError", "NoMatchingError"]);
}
export function validateListDataTableValuesAction(action) {
    requireNonEmptyStringParameter(action, "DataTableId");
    requireErrorTypes(action, ["NoMatchingError"]);
    const primaryKeyGroups = requireArrayParameter(action, "PrimaryKeyGroups", "ListDataTableValues");
    validateArrayLengthRange(action, primaryKeyGroups, "PrimaryKeyGroups", "ListDataTableValues", 1, 5);
    const seenGroupNames = new Set();
    for (const group of primaryKeyGroups) {
        if (!isObject(group)) {
            throw new Error(`Action "${action.id}" of type "ListDataTableValues" requires every PrimaryKeyGroups entry to be an object.`);
        }
        const groupName = requireNestedNonEmptyString(action, group, "PrimaryKeyGroups", "PrimaryKeyGroupName", "ListDataTableValues");
        if (seenGroupNames.has(groupName)) {
            throw new Error(`Action "${action.id}" of type "ListDataTableValues" requires every PrimaryKeyGroups.PrimaryKeyGroupName to be unique.`);
        }
        seenGroupNames.add(groupName);
        validateNamedPrimaryValues(action, group, "PrimaryValues", "Name", "PrimaryKeyGroups", "ListDataTableValues");
    }
}
export function validateGetCalculatedAttributesForCustomerProfileAction(action) {
    const requestData = requireObjectParameter(action, "ProfileRequestData");
    if (typeof requestData.ProfileId !== "string"
        || requestData.ProfileId.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "GetCalculatedAttributesForCustomerProfile" requires ProfileRequestData.ProfileId to be a non-empty string.`);
    }
    validateProfileResponseData(action);
    requireErrorTypes(action, ["NoneFoundError", "NoMatchingError"]);
}
export function validateUpsertDataTableValuesAction(action) {
    requireNonEmptyStringParameter(action, "LockVersion");
    requireNonEmptyStringParameter(action, "DataTableId");
    requireErrorTypes(action, ["NoMatchingError"]);
    const upsertGroups = requireArrayParameter(action, "DataTableUpsertAttributes", "UpsertDataTableValues");
    validateArrayLengthRange(action, upsertGroups, "DataTableUpsertAttributes", "UpsertDataTableValues", 1, 25);
    const seenGroupNames = new Set();
    let totalAttributeCount = 0;
    for (const group of upsertGroups) {
        if (!isObject(group)) {
            throw new Error(`Action "${action.id}" of type "UpsertDataTableValues" requires every DataTableUpsertAttributes entry to be an object.`);
        }
        const groupName = requireNestedNonEmptyString(action, group, "DataTableUpsertAttributes", "PrimaryKeyGroupName", "UpsertDataTableValues");
        if (seenGroupNames.has(groupName)) {
            throw new Error(`Action "${action.id}" of type "UpsertDataTableValues" requires every DataTableUpsertAttributes.PrimaryKeyGroupName to be unique.`);
        }
        seenGroupNames.add(groupName);
        validateNamedPrimaryValues(action, group, "PrimaryValues", "Name", "DataTableUpsertAttributes", "UpsertDataTableValues");
        const attributes = requireNestedArray(action, group, "DataTableUpsertAttributes", "Attributes", "UpsertDataTableValues");
        validateArrayLengthRange(action, attributes, "DataTableUpsertAttributes.Attributes", "UpsertDataTableValues", 1, 25);
        totalAttributeCount += attributes.length;
        for (const attribute of attributes) {
            if (!isObject(attribute)) {
                throw new Error(`Action "${action.id}" of type "UpsertDataTableValues" requires every DataTableUpsertAttributes.Attributes entry to be an object.`);
            }
            requireNestedNonEmptyString(action, attribute, "DataTableUpsertAttributes.Attributes", "Name", "UpsertDataTableValues");
            requireNestedNonEmptyString(action, attribute, "DataTableUpsertAttributes.Attributes", "Value", "UpsertDataTableValues");
            if ("UseDefaultValue" in attribute
                && typeof attribute.UseDefaultValue !== "boolean") {
                throw new Error(`Action "${action.id}" of type "UpsertDataTableValues" requires DataTableUpsertAttributes.Attributes.UseDefaultValue to be a boolean when provided.`);
            }
        }
    }
    if (totalAttributeCount > 25) {
        throw new Error(`Action "${action.id}" of type "UpsertDataTableValues" supports at most 25 total write attributes across DataTableUpsertAttributes.`);
    }
}
export function validateUpdateCaseAction(action) {
    validateLowercaseBooleanStringParameter(action, "LinkContactToCase");
    requireNonEmptyStringParameter(action, "CaseId");
    validateStringMapParameter(action, "CaseRequestFields");
    requireErrorTypes(action, ["ContactNotLinked", "NoMatchingError"]);
}
export function validateUpdateCustomerProfileAction(action) {
    validateProfileRequestDataHasEntries(action);
    validateProfileResponseData(action);
    requireErrorTypes(action, ["NoMatchingError"]);
}
export function validateStringArrayParameter(action, key) {
    if (!(key in action.parameters)) {
        return;
    }
    const value = action.parameters[key];
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ${key} to be a non-empty array when provided.`);
    }
    for (const entry of value) {
        if (typeof entry !== "string" || entry.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "${action.type}" requires every ${key} entry to be a non-empty string.`);
        }
    }
}
export function requireArrayParameter(action, key, actionType) {
    const value = action.parameters[key];
    if (!Array.isArray(value)) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${key} to be an array.`);
    }
    return value;
}
export function requireNestedArray(action, parent, parentName, key, actionType) {
    const value = parent[key];
    if (!Array.isArray(value)) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${parentName}.${key} to be an array.`);
    }
    return value;
}
export function validateArrayLengthRange(action, value, fieldName, actionType, min, max) {
    if (value.length < min || value.length > max) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${fieldName} to contain between ${min} and ${max} entries.`);
    }
}
export function validateNestedStringArray(action, parent, key, parentName, actionType) {
    const value = requireNestedArray(action, parent, parentName, key, actionType);
    if (value.length === 0) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${parentName}.${key} to contain at least one entry.`);
    }
    for (const entry of value) {
        if (typeof entry !== "string" || entry.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "${actionType}" requires every ${parentName}.${key} entry to be a non-empty string.`);
        }
    }
}
export function validateNamedPrimaryValues(action, parent, key, nameKey, parentName, actionType) {
    const primaryValues = requireNestedArray(action, parent, parentName, key, actionType);
    if (primaryValues.length === 0) {
        throw new Error(`Action "${action.id}" of type "${actionType}" requires ${parentName}.${key} to contain at least one entry.`);
    }
    for (const primaryValue of primaryValues) {
        if (!isObject(primaryValue)) {
            throw new Error(`Action "${action.id}" of type "${actionType}" requires every ${parentName}.${key} entry to be an object.`);
        }
        requireNestedNonEmptyString(action, primaryValue, `${parentName}.${key}`, nameKey, actionType);
        requireNestedNonEmptyString(action, primaryValue, `${parentName}.${key}`, "Value", actionType);
    }
}
export function validateLowercaseBooleanStringParameter(action, key) {
    const value = requireNonEmptyStringParameter(action, key);
    if (value !== "true" && value !== "false") {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ${key} to be "true" or "false".`);
    }
}
export function validateProfileRequestDataHasEntries(action) {
    const requestData = requireObjectParameter(action, "ProfileRequestData");
    if (Object.keys(requestData).length === 0) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ProfileRequestData to contain at least one entry.`);
    }
}
export function validateProfileResponseData(action) {
    if (!("ProfileResponseData" in action.parameters)) {
        return;
    }
    const responseData = action.parameters["ProfileResponseData"];
    // Connect flow API expects ProfileResponseData as an array of field name strings
    if (!Array.isArray(responseData)) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ProfileResponseData to be an array of field name strings.`);
    }
    if (responseData.length === 0) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires ProfileResponseData to contain at least one entry when provided.`);
    }
    for (const entry of responseData) {
        if (typeof entry !== "string" || entry.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "${action.type}" requires every ProfileResponseData entry to be a non-empty string.`);
        }
    }
}
export function validateCustomerProfileSearchCriteria(action, criteria) {
    for (const criterion of criteria) {
        if (!isObject(criterion)) {
            throw new Error(`Action "${action.id}" of type "GetCustomerProfile" requires every SearchCriteria entry to be an object.`);
        }
        if (typeof criterion.IdentifierName !== "string"
            || criterion.IdentifierName.trim().length === 0
            || typeof criterion.IdentifierValue !== "string"
            || criterion.IdentifierValue.trim().length === 0) {
            throw new Error(`Action "${action.id}" of type "GetCustomerProfile" requires every SearchCriteria entry to define non-empty IdentifierName and IdentifierValue fields.`);
        }
    }
}
export function validateShowViewAction(action) {
    const viewResource = action.parameters.ViewResource;
    if (!isObject(viewResource)) {
        throw new Error(`Action "${action.id}" of type "ShowView" requires ViewResource to be an object.`);
    }
    if (typeof viewResource.Id !== "string"
        || viewResource.Id.trim().length === 0
        || typeof viewResource.Version !== "string"
        || viewResource.Version.trim().length === 0) {
        throw new Error(`Action "${action.id}" of type "ShowView" requires ViewResource.Id and ViewResource.Version to be non-empty strings.`);
    }
    if ("InvocationTimeLimitSeconds" in action.parameters) {
        const timeLimit = action.parameters.InvocationTimeLimitSeconds;
        if (!Number.isInteger(timeLimit) || timeLimit <= 0) {
            throw new Error(`Action "${action.id}" of type "ShowView" requires InvocationTimeLimitSeconds to be a positive integer when provided.`);
        }
    }
}
