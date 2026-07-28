import type { FlowAction, WaitEvent } from "../types.js";
export declare function validateDistributeByPercentageAction(action: FlowAction): void;
export declare function validateLoopAction(action: FlowAction): void;
export declare function validateWaitAction(action: FlowAction): void;
export declare function validateWaitTimeout(action: FlowAction): void;
export declare function validateWaitEvents(action: FlowAction): WaitEvent[];
