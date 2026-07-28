import type { FlowAction } from "../types.js";
export declare function validateUpdateContactMediaProcessingAction(action: FlowAction): void;
export declare function validateUpdateContactMediaStreamingBehaviorAction(action: FlowAction): void;
export declare function validateUpdateContactRecordingAndAnalyticsBehaviorAction(action: FlowAction): void;
export declare function validateUpdateFlowLoggingBehaviorAction(action: FlowAction): void;
export declare function validateVoiceBehavior(action: FlowAction, voiceBehavior: Record<string, unknown>): void;
export declare function validateChatBehavior(action: FlowAction, chatBehavior: Record<string, unknown>): void;
export declare function validateScreenRecordingBehavior(action: FlowAction, screenRecordingBehavior: Record<string, unknown>): void;
