import type { FlowAction, FlowActionType, FlowConditionExpression, FlowTransitions } from "../core/types.js";
export declare abstract class BaseActionBuilder<TBuilder extends BaseActionBuilder<TBuilder>> {
    protected readonly id: string;
    protected readonly type: FlowAction["type"];
    protected readonly definition: import("../index.js").ActionDefinition;
    protected parameters: Record<string, unknown>;
    protected transitions: FlowTransitions;
    protected constructor(id: string, type: FlowActionType);
    next(actionId: string): TBuilder;
    onError(nextAction: string, errorType?: string): TBuilder;
    when(condition: FlowConditionExpression, nextAction: string): TBuilder;
    protected setParameter(key: string, value: unknown): this;
    protected getParameter<TValue>(key: string): TValue;
    build(): FlowAction;
}
