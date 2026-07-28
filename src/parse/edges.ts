import { isPassthroughAction, type ParsedAction } from "./types.js";

export type EdgeRef =
  | { kind: "start" }
  | { kind: "next" }
  | { kind: "condition"; index: number }
  | { kind: "error"; index: number };

export interface IncomingEdge {
  fromId: string | null; // null for start pointer
  edge: EdgeRef;
}

interface RawTransitionsShape {
  NextAction?: string;
  Conditions?: Array<{ NextAction: string }>;
  Errors?: Array<{ NextAction: string }>;
}

export function edgesOf(action: ParsedAction): { ref: EdgeRef; target: string }[] {
  const edges: { ref: EdgeRef; target: string }[] = [];

  if (isPassthroughAction(action)) {
    const rawTransitions = action.raw["Transitions"] as RawTransitionsShape | undefined;
    if (!rawTransitions) {
      return edges;
    }

    if (rawTransitions.NextAction !== undefined) {
      edges.push({ ref: { kind: "next" }, target: rawTransitions.NextAction });
    }
    (rawTransitions.Conditions ?? []).forEach((condition, index) => {
      edges.push({ ref: { kind: "condition", index }, target: condition.NextAction });
    });
    (rawTransitions.Errors ?? []).forEach((error, index) => {
      edges.push({ ref: { kind: "error", index }, target: error.NextAction });
    });
    return edges;
  }

  const transitions = action.transitions;
  if (!transitions) {
    return edges;
  }

  if (transitions.nextAction !== undefined) {
    edges.push({ ref: { kind: "next" }, target: transitions.nextAction });
  }
  (transitions.conditions ?? []).forEach((condition, index) => {
    edges.push({ ref: { kind: "condition", index }, target: condition.nextAction });
  });
  (transitions.errors ?? []).forEach((error, index) => {
    edges.push({ ref: { kind: "error", index }, target: error.nextAction });
  });

  return edges;
}
