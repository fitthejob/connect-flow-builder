import { edgesOf, type IncomingEdge } from "./edges.js";
import type { ParsedAction, ParseDiagnostic } from "./types.js";

export class ParsedFlow {
  private readonly rawDocument: Record<string, unknown>;
  private readonly rawActionsById: Map<string, Record<string, unknown>>;
  private readonly dirty: Set<string>;
  private readonly added: string[];

  private readonly _startActionId: string;
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
    return Array.from(this._actionsById.values());
  }

  get diagnostics(): readonly ParseDiagnostic[] {
    return this._diagnostics;
  }

  getAction(id: string): ParsedAction | undefined {
    return this._actionsById.get(id);
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

  toConnectDefinition(): Record<string, unknown> {
    const rawActions = this.rawDocument["Actions"];
    const originalOrderIds = Array.isArray(rawActions)
      ? rawActions.map((action) => (action as { Identifier: string }).Identifier)
      : [];

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.rawDocument)) {
      if (key === "Actions") {
        result[key] = originalOrderIds.map((id) => this.rawActionsById.get(id));
      } else if (key === "StartAction") {
        result[key] = this._startActionId;
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  toJsonString(pretty = true): string {
    return pretty
      ? JSON.stringify(this.toConnectDefinition(), null, 2)
      : JSON.stringify(this.toConnectDefinition());
  }
}
