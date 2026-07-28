function freezeBindings(bindings) {
    return Object.freeze({ ...(bindings ?? {}) });
}
function requireBinding(category, bindings, key) {
    const value = bindings[key];
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Missing ${category} binding for key "${key}".`);
    }
    return value;
}
export function normalizeFlowBindings(bindings = {}) {
    return Object.freeze({
        queues: freezeBindings(bindings.queues),
        lambdas: freezeBindings(bindings.lambdas),
        lexBotAliases: freezeBindings(bindings.lexBotAliases),
        prompts: freezeBindings(bindings.prompts),
        hoursOfOperation: freezeBindings(bindings.hoursOfOperation),
        flowArns: freezeBindings(bindings.flowArns),
        flowIds: freezeBindings(bindings.flowIds),
        custom: freezeBindings(bindings.custom),
    });
}
export function createFlowBuildContext(environment, bindings = {}) {
    if (typeof environment !== "string" || environment.trim().length === 0) {
        throw new Error("Flow build context requires a non-empty environment.");
    }
    const normalizedBindings = normalizeFlowBindings(bindings);
    return {
        environment,
        bindings: normalizedBindings,
        refs: {
            queueArn: (key) => requireBinding("queues", normalizedBindings.queues, key),
            lambdaArn: (key) => requireBinding("lambdas", normalizedBindings.lambdas, key),
            lexBotAliasArn: (key) => requireBinding("lexBotAliases", normalizedBindings.lexBotAliases, key),
            promptArn: (key) => requireBinding("prompts", normalizedBindings.prompts, key),
            hoursOfOperationArn: (key) => requireBinding("hoursOfOperation", normalizedBindings.hoursOfOperation, key),
            flowArn: (key) => requireBinding("flowArns", normalizedBindings.flowArns, key),
            flowId: (key) => requireBinding("flowIds", normalizedBindings.flowIds, key),
            custom: (key) => requireBinding("custom", normalizedBindings.custom, key),
        },
    };
}
