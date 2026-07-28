import { getActionDefinition } from "../core/registry.js";
export class BaseActionBuilder {
    id;
    type;
    definition;
    parameters = {};
    transitions = {};
    constructor(id, type) {
        this.id = id;
        this.definition = getActionDefinition(type);
        this.type = this.definition.type;
    }
    next(actionId) {
        if (!this.definition.supportsNextAction) {
            throw new Error(`Action type "${this.definition.type}" does not support next-action transitions.`);
        }
        this.transitions.nextAction = actionId;
        return this;
    }
    onError(nextAction, errorType = "NoMatchingError") {
        if (!this.definition.supportsErrors) {
            throw new Error(`Action type "${this.definition.type}" does not support error transitions.`);
        }
        const errorTransition = {
            nextAction,
            errorType,
        };
        this.transitions.errors = [...(this.transitions.errors ?? []), errorTransition];
        return this;
    }
    when(condition, nextAction) {
        if (!this.definition.supportsConditions) {
            throw new Error(`Action type "${this.definition.type}" does not support conditional transitions.`);
        }
        this.transitions.conditions = [
            ...(this.transitions.conditions ?? []),
            {
                nextAction,
                condition,
            },
        ];
        return this;
    }
    setParameter(key, value) {
        this.parameters[key] = value;
        return this;
    }
    getParameter(key) {
        return this.parameters[key];
    }
    build() {
        return {
            id: this.id,
            type: this.definition.type,
            parameters: { ...this.parameters },
            transitions: hasTransitions(this.transitions)
                ? copyTransitions(this.transitions)
                : undefined,
        };
    }
}
function copyTransitions(transitions) {
    const copy = {};
    if (transitions.nextAction !== undefined) {
        copy.nextAction = transitions.nextAction;
    }
    if (transitions.conditions) {
        copy.conditions = transitions.conditions.map((condition) => ({ ...condition }));
    }
    if (transitions.errors) {
        copy.errors = transitions.errors.map((error) => ({ ...error }));
    }
    return copy;
}
function hasTransitions(transitions) {
    return Boolean(transitions.nextAction
        || transitions.conditions?.length
        || transitions.errors?.length);
}
