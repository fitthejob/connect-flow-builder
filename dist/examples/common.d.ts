import type { BuiltFlow } from "../core/flow-builder.js";
export interface GeneratedExampleFlow {
    filename: string;
    flow: BuiltFlow;
}
export declare function printFlowWhenRunDirectly(metaUrl: string, flow: BuiltFlow): void;
