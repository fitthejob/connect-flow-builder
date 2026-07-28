import type { FlowAction } from "../core/types.js";

export interface PassthroughAction {
  readonly id: string;
  readonly type: string;          // NOT FlowActionType — unknown to the registry
  readonly raw: Record<string, unknown>; // the original ConnectFlowAction-shaped object
  readonly passthrough: true;
}

export type ParsedAction = FlowAction | PassthroughAction;

export function isPassthroughAction(action: ParsedAction): action is PassthroughAction {
  return (action as PassthroughAction).passthrough === true;
}

export type ParseDiagnosticCode =
  | "unknown-action"
  | "nonconforming"
  | "dangling-transition"
  | "unknown-version";

export interface ParseDiagnostic {
  readonly actionId: string | null;  // null for document-level (unknown-version)
  readonly actionType: string | null;
  readonly code: ParseDiagnosticCode;
  readonly message: string;
}

export class FlowParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FlowParseError";
  }
}
