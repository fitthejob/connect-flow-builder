import { supportedActionTypes } from "../core/registry.js";
import type {
  FlowAction,
  FlowActionType,
  FlowCondition,
  FlowConditionOperator,
  FlowErrorTransition,
  FlowTransitions,
} from "../core/types.js";
import { validateSingleAction } from "../index.js";
import { ParsedFlow } from "./parsed-flow.js";
import {
  FlowParseError,
  isPassthroughAction,
  type ParsedAction,
  type ParseDiagnostic,
  type PassthroughAction,
} from "./types.js";

const SUPPORTED_VERSION = "2019-10-30";

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

function buildPassthroughAction(raw: Record<string, unknown>): PassthroughAction {
  return {
    id: raw["Identifier"] as string,
    type: raw["Type"] as string,
    raw: structuredClone(raw),
    passthrough: true,
  };
}

function collectEdges(action: ParsedAction): string[] {
  if (isPassthroughAction(action)) {
    const rawTransitions = action.raw["Transitions"] as
      | {
          NextAction?: string;
          Conditions?: Array<{ NextAction: string }>;
          Errors?: Array<{ NextAction: string }>;
        }
      | undefined;

    if (!rawTransitions) {
      return [];
    }

    const edges: string[] = [];
    if (rawTransitions.NextAction !== undefined) {
      edges.push(rawTransitions.NextAction);
    }
    for (const condition of rawTransitions.Conditions ?? []) {
      edges.push(condition.NextAction);
    }
    for (const error of rawTransitions.Errors ?? []) {
      edges.push(error.NextAction);
    }
    return edges;
  }

  const transitions = action.transitions;
  if (!transitions) {
    return [];
  }

  const edges: string[] = [];
  if (transitions.nextAction !== undefined) {
    edges.push(transitions.nextAction);
  }
  for (const condition of transitions.conditions ?? []) {
    edges.push(condition.nextAction);
  }
  for (const error of transitions.errors ?? []) {
    edges.push(error.nextAction);
  }
  return edges;
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
      const passthroughAction = buildPassthroughAction(rawAction);
      actions.push(passthroughAction);
      diagnostics.push({
        actionId: identifier,
        actionType: type,
        code: "unknown-action",
        message: `Unknown action type: ${type}`,
      });
      continue;
    }

    const converted = convertKnownAction(rawAction);
    actions.push(converted);

    try {
      validateSingleAction(converted);
    } catch (error) {
      diagnostics.push({
        actionId: identifier,
        actionType: type,
        code: "nonconforming",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const actionIds = new Set(actions.map((action) => action.id));
  for (const action of actions) {
    for (const targetId of collectEdges(action)) {
      if (!actionIds.has(targetId)) {
        diagnostics.push({
          actionId: action.id,
          actionType: action.type,
          code: "dangling-transition",
          message: `Action '${action.id}' transitions to unknown action '${targetId}'`,
        });
      }
    }
  }

  if (rawDocument["Version"] !== SUPPORTED_VERSION) {
    diagnostics.push({
      actionId: null,
      actionType: null,
      code: "unknown-version",
      message: `Unsupported flow Version: ${String(rawDocument["Version"])}`,
    });
  }

  return new ParsedFlow(
    rawDocument,
    rawActionsById,
    rawDocument["StartAction"] as string,
    actions,
    diagnostics,
  );
}
