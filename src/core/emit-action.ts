import { getActionDefinition } from "./registry.js";
import type { ConnectFlowAction, FlowAction } from "./types.js";

export function emitConnectAction(action: FlowAction): ConnectFlowAction {
  const transitions = action.transitions;
  if (!transitions) {
    return {
      Identifier: action.id,
      Type: action.type,
      Parameters: action.parameters,
      Transitions: undefined,
    };
  }

  // Connect requires NextAction on every Transitions object even when the
  // action type doesn't support a default next (e.g. Compare). Fall back to
  // the NoMatchingCondition error target so the field is always populated.
  const nextAction =
    transitions.nextAction ??
    transitions.errors?.find((e) => e.errorType === "NoMatchingCondition")?.nextAction ??
    transitions.errors?.[0]?.nextAction ??
    transitions.conditions?.[0]?.nextAction;

  // Connect requires a NoMatchingError entry in Errors for every action that
  // supports errors — except Compare, which only accepts NoMatchingCondition.
  const actionDef = getActionDefinition(action.type);
  const errors = transitions.errors ?? [];
  const hasNoMatchingError = errors.some((e) => e.errorType === "NoMatchingError");
  const needsNoMatchingError =
    actionDef.supportsErrors &&
    !hasNoMatchingError &&
    nextAction &&
    action.type !== "Compare";
  const effectiveErrors = needsNoMatchingError
    ? [...errors, { nextAction, errorType: "NoMatchingError" as const }]
    : errors;

  return {
    Identifier: action.id,
    Type: action.type,
    Parameters: action.parameters,
    Transitions: {
      NextAction: nextAction,
      Conditions: transitions.conditions?.map((condition) => ({
        NextAction: condition.nextAction,
        Condition: {
          Operator: condition.condition.operator,
          Operands: condition.condition.operands,
        },
      })),
      Errors: effectiveErrors.length > 0
        ? effectiveErrors.map((error) => ({
            NextAction: error.nextAction,
            ErrorType: error.errorType,
          }))
        : undefined,
    },
  };
}
