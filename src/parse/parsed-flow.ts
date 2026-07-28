import { edgesOf, type EdgeRef, type IncomingEdge } from "./edges.js";
import { isPassthroughAction, type ParsedAction, type ParseDiagnostic } from "./types.js";
import { emitConnectAction } from "../core/emit-action.js";
import { validateSingleAction } from "../core/validators/index.js";
import { COL_SPACING, type Position } from "../core/layout.js";
import type { FlowAction } from "../core/types.js";

interface RawTransitionsShape {
  NextAction?: string;
  Conditions?: Array<{ NextAction: string }>;
  Errors?: Array<{ NextAction: string }>;
}

export class ParsedFlow {
  private readonly rawDocument: Record<string, unknown>;
  private readonly rawActionsById: Map<string, Record<string, unknown>>;
  private readonly dirty: Set<string>;
  private readonly added: string[];

  private _startActionId: string;
  private readonly _actionsById: Map<string, ParsedAction>;
  private readonly _diagnostics: readonly ParseDiagnostic[];

  constructor(
    rawDocument: Record<string, unknown>,
    rawActionsById: Map<string, Record<string, unknown>>,
    startActionId: string,
    actions: readonly ParsedAction[],
    diagnostics: readonly ParseDiagnostic[],
  ) {
    this.rawDocument = rawDocument;
    this.rawActionsById = rawActionsById;
    this.dirty = new Set();
    this.added = [];

    this._startActionId = startActionId;
    this._actionsById = new Map(actions.map((action) => [action.id, action]));
    this._diagnostics = diagnostics;
  }

  get startActionId(): string {
    return this._startActionId;
  }

  get actions(): readonly ParsedAction[] {
    return Array.from(this._actionsById.values()).map((action) => this.withLiveRaw(action));
  }

  get diagnostics(): readonly ParseDiagnostic[] {
    return this._diagnostics;
  }

  getAction(id: string): ParsedAction | undefined {
    const action = this._actionsById.get(id);
    return action ? this.withLiveRaw(action) : undefined;
  }

  // Passthrough actions carry their own frozen `raw` clone captured at parse
  // time; live edits from rewireEdge land in rawActionsById instead. Return
  // the current raw source of truth so callers see post-mutation edges
  // rather than the stale snapshot.
  private withLiveRaw(action: ParsedAction): ParsedAction {
    return isPassthroughAction(action)
      ? { ...action, raw: this.rawActionsById.get(action.id) ?? action.raw }
      : action;
  }

  findByType(type: string): readonly ParsedAction[] {
    return this.actions.filter((action) => action.type === type);
  }

  predecessorsOf(id: string): readonly IncomingEdge[] {
    const incoming: IncomingEdge[] = [];

    if (this._startActionId === id) {
      incoming.push({ fromId: null, edge: { kind: "start" } });
    }

    for (const action of this._actionsById.values()) {
      for (const { ref, target } of edgesOf(action)) {
        if (target === id) {
          incoming.push({ fromId: action.id, edge: ref });
        }
      }
    }

    return incoming;
  }

  addAction(action: FlowAction): void {
    if (this._actionsById.has(action.id)) {
      throw new Error(`Action id "${action.id}" already exists`);
    }
    this._actionsById.set(action.id, action);
    this.added.push(action.id);
  }

  rewireEdge(fromId: string | null, edge: EdgeRef, toId: string): void {
    if (edge.kind === "start") {
      this._startActionId = toId;
      return;
    }

    if (fromId === null) {
      throw new Error(`fromId is required for edge kind "${edge.kind}"`);
    }

    const action = this._actionsById.get(fromId);
    if (action && !isPassthroughAction(action)) {
      const transitions = { ...(action.transitions ?? {}) };
      if (edge.kind === "next") {
        transitions.nextAction = toId;
      } else if (edge.kind === "condition") {
        const conditions = [...(transitions.conditions ?? [])];
        conditions[edge.index] = { ...conditions[edge.index], nextAction: toId };
        transitions.conditions = conditions;
      } else if (edge.kind === "error") {
        const errors = [...(transitions.errors ?? [])];
        errors[edge.index] = { ...errors[edge.index], nextAction: toId };
        transitions.errors = errors;
      }
      action.transitions = transitions;
      this.dirty.add(fromId);
      return;
    }

    const raw = this.rawActionsById.get(fromId);
    if (raw) {
      const rawTransitions = raw["Transitions"] as RawTransitionsShape | undefined;
      if (rawTransitions) {
        if (edge.kind === "next") {
          rawTransitions.NextAction = toId;
        } else if (edge.kind === "condition") {
          const condition = rawTransitions.Conditions?.[edge.index];
          if (condition) {
            condition.NextAction = toId;
          }
        } else if (edge.kind === "error") {
          const error = rawTransitions.Errors?.[edge.index];
          if (error) {
            error.NextAction = toId;
          }
        }
      }
      this.dirty.add(fromId);
    }
  }

  insertBefore(targetId: string, action: FlowAction): void {
    const predecessors = this.predecessorsOf(targetId);

    this.addAction(action);
    action.transitions = { ...action.transitions, nextAction: targetId };

    for (const { fromId, edge } of predecessors) {
      this.rewireEdge(fromId, edge, action.id);
    }
  }

  toConnectDefinition(): Record<string, unknown> {
    const rawActions = this.rawDocument["Actions"];
    const originalOrderIds = Array.isArray(rawActions)
      ? rawActions.map((action) => (action as { Identifier: string }).Identifier)
      : [];
    const addedPositions = new Map<string, Position>();

    const emitId = (id: string): unknown => {
      if (this.added.includes(id) || this.dirty.has(id)) {
        const action = this._actionsById.get(id);
        if (action) {
          this.checkIntegrity(action);
          if (!isPassthroughAction(action)) {
            validateSingleAction(action);
            if (this.added.includes(id)) {
              addedPositions.set(id, this.computeAddedPosition(action));
            }
            return emitConnectAction(action);
          }
        }
      }
      return this.rawActionsById.get(id);
    };

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.rawDocument)) {
      if (key === "Actions") {
        result[key] = [
          ...originalOrderIds.map((id) => emitId(id)),
          ...this.added
            .filter((id) => !originalOrderIds.includes(id))
            .map((id) => emitId(id)),
        ];
      } else if (key === "StartAction") {
        result[key] = this._startActionId;
      } else if (key === "Metadata") {
        result[key] = this.mergeMetadata(value, addedPositions);
      } else {
        result[key] = value;
      }
    }
    if (!("Metadata" in this.rawDocument) && addedPositions.size > 0) {
      result["Metadata"] = this.mergeMetadata(undefined, addedPositions);
    }
    return result;
  }

  private checkIntegrity(action: ParsedAction): void {
    const liveAction = this.withLiveRaw(action);

    for (const { target } of edgesOf(liveAction)) {
      if (!this._actionsById.has(target)) {
        throw new Error(
          `Action "${action.id}" references unknown action "${target}"`,
        );
      }
    }
  }

  private computeAddedPosition(action: ParsedAction): Position {
    const targetId = !isPassthroughAction(action) ? action.transitions?.nextAction : undefined;
    const actionMetadata = this.getRawActionMetadata();
    const targetPosition = targetId ? actionMetadata?.[targetId]?.position : undefined;
    if (targetPosition) {
      return { x: targetPosition.x - COL_SPACING, y: targetPosition.y };
    }
    return { x: 0, y: 0 };
  }

  private getRawActionMetadata(): Record<string, { position?: Position }> | undefined {
    const metadata = this.rawDocument["Metadata"] as
      | { ActionMetadata?: Record<string, { position?: Position }> }
      | undefined;
    return metadata?.ActionMetadata;
  }

  private mergeMetadata(
    rawMetadataValue: unknown,
    addedPositions: Map<string, Position>,
  ): unknown {
    if (addedPositions.size === 0) {
      return rawMetadataValue;
    }

    const rawMetadata = (rawMetadataValue as Record<string, unknown> | undefined) ?? {};
    const rawActionMetadata =
      (rawMetadata["ActionMetadata"] as Record<string, unknown> | undefined) ?? {};

    const mergedActionMetadata: Record<string, unknown> = { ...rawActionMetadata };
    for (const [id, position] of addedPositions) {
      mergedActionMetadata[id] = { position };
    }

    return {
      ...rawMetadata,
      ActionMetadata: mergedActionMetadata,
    };
  }

  toJsonString(pretty = true): string {
    return pretty
      ? JSON.stringify(this.toConnectDefinition(), null, 2)
      : JSON.stringify(this.toConnectDefinition());
  }
}
