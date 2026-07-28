import type { ConnectFlowDefinition, FlowAction, FlowDefinition, FlowMetadata, FlowSegment } from "./types.js";
export declare class FlowBuilder {
    private readonly name;
    private readonly actions;
    private startActionId?;
    private metadata?;
    constructor(name: string);
    startWith(actionOrId: FlowAction | string): this;
    add(action: FlowAction): this;
    addMany(actions: FlowAction[]): this;
    use(segment: FlowSegment): this;
    withMetadata(metadata: FlowMetadata): this;
    build(): BuiltFlow;
}
export declare class BuiltFlow {
    readonly name: string;
    readonly definition: FlowDefinition;
    constructor(name: string, definition: FlowDefinition);
    toConnectDefinition(): ConnectFlowDefinition;
    toJsonString(pretty?: boolean): string;
    private toConnectAction;
}
