import type { FlowAction } from "../types.js";
export declare function validateCompleteOutboundCallAction(action: FlowAction): void;
export declare function validateCreateCallbackContactAction(action: FlowAction): void;
export declare function validateStartOutboundChatContactAction(action: FlowAction): void;
export declare function validateCompleteOutboundCallVoiceConnector(action: FlowAction, voiceConnector: Record<string, unknown>): void;
export declare function requireIntegerInRangeParameter(action: FlowAction, key: string, minimum: number, maximum: number, expectedDescription: string): number;
