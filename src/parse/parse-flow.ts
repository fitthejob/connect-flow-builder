import { supportedActionTypes } from "../core/registry.js";
import type {
  FlowAction,
  FlowActionType,
  FlowCondition,
  FlowConditionOperator,
  FlowErrorTransition,
  FlowTransitions,
} from "../core/types.js";
import { ParsedFlow } from "./parsed-flow.js";
import { FlowParseError, type ParsedAction, type ParseDiagnostic } from "./types.js";

function convertTransitions(raw: Record<string, unknown>): FlowTransitions | undefined {
  const rawTransitions = raw["Transitions"] as
    | {
        NextAction?: string;
        Conditions?: Array<{
          NextAction: string;
          Condition: { Operator: string; Operands: string[] };
        }>;
        Errors?: Array<{ NextAction: string; ErrorType: string }>;
      }
    | undefined;

  if (!rawTransitions || Object.keys(rawTransitions).length === 0) {
    return undefined;
  }

  const transitions: FlowTransitions = {};

  if (rawTransitions.NextAction !== undefined) {
    transitions.nextAction = rawTransitions.NextAction;
  }

  if (rawTransitions.Conditions !== undefined) {
    transitions.conditions = rawTransitions.Conditions.map(
      (condition): FlowCondition => ({
        nextAction: condition.NextAction,
        condition: {
          operator: condition.Condition.Operator as FlowConditionOperator,
          operands: condition.Condition.Operands,
        },
      }),
    );
  }

  if (rawTransitions.Errors !== undefined) {
    transitions.errors = rawTransitions.Errors.map(
      (error): FlowErrorTransition => ({
        nextAction: error.NextAction,
        errorType: error.ErrorType,
      }),
    );
  }

  return transitions;
}

function convertKnownAction(raw: Record<string, unknown>): FlowAction {
  const id = raw["Identifier"] as string;
  const type = raw["Type"] as FlowActionType;
  const parameters = (raw["Parameters"] as Record<string, unknown> | undefined) ?? {};
  const transitions = convertTransitions(raw);

  const action: FlowAction = { id, type, parameters };
  if (transitions !== undefined) {
    action.transitions = transitions;
  }
  return action;
}

export function parseConnectFlowDefinition(json: string | object): ParsedFlow {
  let rawDocument: Record<string, unknown>;

  if (typeof json === "string") {
    try {
      rawDocument = JSON.parse(json) as Record<string, unknown>;
    } catch (error) {
      throw new FlowParseError(
        `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  } else {
    rawDocument = structuredClone(json) as Record<string, unknown>;
  }

  if (typeof rawDocument["Version"] !== "string") {
    throw new FlowParseError("Flow definition is missing a string 'Version' field");
  }
  if (typeof rawDocument["StartAction"] !== "string") {
    throw new FlowParseError("Flow definition is missing a string 'StartAction' field");
  }
  if (!Array.isArray(rawDocument["Actions"])) {
    throw new FlowParseError("Flow definition is missing an 'Actions' array");
  }

  const rawActions = rawDocument["Actions"] as Array<Record<string, unknown>>;
  const rawActionsById = new Map<string, Record<string, unknown>>();
  const actions: ParsedAction[] = [];
  const diagnostics: ParseDiagnostic[] = [];

  for (const rawAction of rawActions) {
    const identifier = rawAction["Identifier"] as string;
    if (rawActionsById.has(identifier)) {
      throw new FlowParseError(`Duplicate action Identifier: ${identifier}`);
    }
    rawActionsById.set(identifier, rawAction);

    const type = rawAction["Type"] as string;
    if (!(supportedActionTypes as readonly string[]).includes(type)) {
      // Task 5 will add passthrough handling for unknown action types.
      throw new FlowParseError(`Unsupported action type: ${type}`);
    }

    actions.push(convertKnownAction(rawAction));
  }

  return new ParsedFlow(
    rawDocument,
    rawActionsById,
    rawDocument["StartAction"] as string,
    actions,
    diagnostics,
  );
}
