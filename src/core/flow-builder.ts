import { emitConnectAction } from "./emit-action.js";
import { validateFlowDefinition } from "./validators/index.js";
import { computeLayout, COL_SPACING } from "./layout.js";
import type {
  ConnectFlowDefinition,
  FlowAction,
  FlowDefinition,
  FlowMetadata,
  FlowSegment,
} from "./types.js";

export class FlowBuilder {
  private readonly name: string;
  private readonly actions = new Map<string, FlowAction>();
  private startActionId?: string;
  private metadata?: FlowMetadata;

  constructor(name: string) {
    this.name = name;
  }

  startWith(actionOrId: FlowAction | string): this {
    this.startActionId = typeof actionOrId === "string" ? actionOrId : actionOrId.id;
    if (typeof actionOrId !== "string") {
      this.add(actionOrId);
    }
    return this;
  }

  add(action: FlowAction): this {
    this.actions.set(action.id, action);
    return this;
  }

  addMany(actions: FlowAction[]): this {
    for (const action of actions) {
      this.add(action);
    }
    return this;
  }

  use(segment: FlowSegment): this {
    if (!this.startActionId) {
      this.startActionId = segment.startActionId;
    }
    return this.addMany(segment.actions);
  }

  withMetadata(metadata: FlowMetadata): this {
    this.metadata = metadata;
    return this;
  }

  build(): BuiltFlow {
    const definition: FlowDefinition = {
      version: "2019-10-30",
      startAction: this.startActionId ?? "",
      actions: [...this.actions.values()],
      metadata: this.metadata,
    };
    validateFlowDefinition(definition);
    return new BuiltFlow(this.name, definition);
  }
}

export class BuiltFlow {
  readonly name: string;
  readonly definition: FlowDefinition;

  constructor(name: string, definition: FlowDefinition) {
    this.name = name;
    this.definition = definition;
  }

  toConnectDefinition(): ConnectFlowDefinition {
    const positions = computeLayout(
      this.definition.startAction,
      this.definition.actions,
    );

    const actionMetadata: Record<string, { position: { x: number; y: number }; isFriendlyName: boolean }> = {};
    for (const [id, pos] of positions) {
      actionMetadata[id] = { position: pos, isFriendlyName: true };
    }

    const startPos = positions.get(this.definition.startAction);
    const entryPointPosition = startPos
      ? { x: startPos.x - COL_SPACING, y: startPos.y }
      : this.definition.metadata?.entryPointPosition;

    const metadata: import("./types.js").FlowMetadata = {
      ...this.definition.metadata,
      entryPointPosition,
      ActionMetadata: actionMetadata,
    };

    return {
      Version: this.definition.version,
      StartAction: this.definition.startAction,
      Metadata: metadata,
      Actions: this.definition.actions.map((action) => emitConnectAction(action)),
    };
  }

  toJsonString(pretty = true): string {
    return JSON.stringify(
      this.toConnectDefinition(),
      null,
      pretty ? 2 : undefined,
    );
  }
}
