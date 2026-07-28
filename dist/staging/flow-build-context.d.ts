import type { FlowBindings, FlowBuildContext, NormalizedFlowBindings } from "./types.js";
export declare function normalizeFlowBindings(bindings?: FlowBindings): NormalizedFlowBindings;
export declare function createFlowBuildContext(environment: string, bindings?: FlowBindings): FlowBuildContext;
