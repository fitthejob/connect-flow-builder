import { getActionDefinition } from "./registry.js";
import { validateFlowDefinition } from "./validators/index.js";
import { computeLayout, COL_SPACING } from "./layout.js";
export class FlowBuilder {
    name;
    actions = new Map();
    startActionId;
    metadata;
    constructor(name) {
        this.name = name;
    }
    startWith(actionOrId) {
        this.startActionId = typeof actionOrId === "string" ? actionOrId : actionOrId.id;
        if (typeof actionOrId !== "string") {
            this.add(actionOrId);
        }
        return this;
    }
    add(action) {
        this.actions.set(action.id, action);
        return this;
    }
    addMany(actions) {
        for (const action of actions) {
            this.add(action);
        }
        return this;
    }
    use(segment) {
        if (!this.startActionId) {
            this.startActionId = segment.startActionId;
        }
        return this.addMany(segment.actions);
    }
    withMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    build() {
        const definition = {
            version: "2019-10-30",
            startAction: this.startActionId ?? "",
            actions: [...this.actions.values()],
            metadata: this.metadata,
        };
        validateFlowDefinition(definition);
        return new BuiltFlow(this.name, definition);
    }
}
export class BuiltFlow {
    name;
    definition;
    constructor(name, definition) {
        this.name = name;
        this.definition = definition;
    }
    toConnectDefinition() {
        const positions = computeLayout(this.definition.startAction, this.definition.actions);
        const actionMetadata = {};
        for (const [id, pos] of positions) {
            actionMetadata[id] = { position: pos, isFriendlyName: true };
        }
        const startPos = positions.get(this.definition.startAction);
        const entryPointPosition = startPos
            ? { x: startPos.x - COL_SPACING, y: startPos.y }
            : this.definition.metadata?.entryPointPosition;
        const metadata = {
            ...this.definition.metadata,
            entryPointPosition,
            ActionMetadata: actionMetadata,
        };
        return {
            Version: this.definition.version,
            StartAction: this.definition.startAction,
            Metadata: metadata,
            Actions: this.definition.actions.map((action) => this.toConnectAction(action)),
        };
    }
    toJsonString(pretty = true) {
        return JSON.stringify(this.toConnectDefinition(), null, pretty ? 2 : undefined);
    }
    toConnectAction(action) {
        const transitions = action.transitions;
        if (!transitions) {
            return {
                Identifier: action.id,
                Type: action.type,
                Parameters: action.parameters,
                Transitions: undefined,
            };
        }
        // Connect requires NextAction on every Transitions object even when the
        // action type doesn't support a default next (e.g. Compare). Fall back to
        // the NoMatchingCondition error target so the field is always populated.
        const nextAction = transitions.nextAction ??
            transitions.errors?.find((e) => e.errorType === "NoMatchingCondition")?.nextAction ??
            transitions.errors?.[0]?.nextAction ??
            transitions.conditions?.[0]?.nextAction;
        // Connect requires a NoMatchingError entry in Errors for every action that
        // supports errors — except Compare, which only accepts NoMatchingCondition.
        const actionDef = getActionDefinition(action.type);
        const errors = transitions.errors ?? [];
        const hasNoMatchingError = errors.some((e) => e.errorType === "NoMatchingError");
        const needsNoMatchingError = actionDef.supportsErrors &&
            !hasNoMatchingError &&
            nextAction &&
            action.type !== "Compare";
        const effectiveErrors = needsNoMatchingError
            ? [...errors, { nextAction, errorType: "NoMatchingError" }]
            : errors;
        return {
            Identifier: action.id,
            Type: action.type,
            Parameters: action.parameters,
            Transitions: {
                NextAction: nextAction,
                Conditions: transitions.conditions?.map((condition) => ({
                    NextAction: condition.nextAction,
                    Condition: {
                        Operator: condition.condition.operator,
                        Operands: condition.condition.operands,
                    },
                })),
                Errors: effectiveErrors.length > 0
                    ? effectiveErrors.map((error) => ({
                        NextAction: error.nextAction,
                        ErrorType: error.errorType,
                    }))
                    : undefined,
            },
        };
    }
}
