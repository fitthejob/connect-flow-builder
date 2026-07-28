import type { FlowActionType } from "./types.js";
export interface ActionDefinition {
    readonly type: FlowActionType;
    readonly requiredParameters: readonly string[];
    readonly supportsNextAction: boolean;
    readonly supportsConditions: boolean;
    readonly supportsErrors: boolean;
    readonly category: "interact" | "set" | "check" | "analyze" | "integrate" | "logic" | "terminate" | "bot-and-assistant-internals" | "contact-data-and-participant-state" | "queue-and-hold-messaging" | "flow-state-and-execution-internals" | "outbound-and-callback-operations" | "routing-and-transfer-internals";
}
export declare function defineActionDefinition(definition: ActionDefinition): ActionDefinition;
