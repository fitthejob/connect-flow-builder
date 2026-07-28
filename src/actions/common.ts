import { getActionDefinition } from "../core/registry.js";
import type {
  FlowAction,
  FlowActionType,
  FlowConditionExpression,
  FlowErrorTransition,
  FlowTransitions,
} from "../core/types.js";

export abstract class BaseActionBuilder<TBuilder extends BaseActionBuilder<TBuilder>> {
  protected readonly id: string;
  protected readonly type: FlowAction["type"];
  protected readonly definition;
  protected parameters: Record<string, unknown> = {};
  protected transitions: FlowTransitions = {};

  protected constructor(id: string, type: FlowActionType) {
    this.id = id;
    this.definition = getActionDefinition(type);
    this.type = this.definition.type;
  }

  next(actionId: string): TBuilder {
    if (!this.definition.supportsNextAction) {
      throw new Error(`Action type "${this.definition.type}" does not support next-action transitions.`);
    }
    this.transitions.nextAction = actionId;
    return this as unknown as TBuilder;
  }

  onError(nextAction: string, errorType = "NoMatchingError"): TBuilder {
    if (!this.definition.supportsErrors) {
      throw new Error(`Action type "${this.definition.type}" does not support error transitions.`);
    }
    const errorTransition: FlowErrorTransition = {
      nextAction,
      errorType,
    };
    this.transitions.errors = [...(this.transitions.errors ?? []), errorTransition];
    return this as unknown as TBuilder;
  }

  when(condition: FlowConditionExpression, nextAction: string): TBuilder {
    if (!this.definition.supportsConditions) {
      throw new Error(`Action type "${this.definition.type}" does not support conditional transitions.`);
    }
    this.transitions.conditions = [
      ...(this.transitions.conditions ?? []),
      {
        nextAction,
        condition,
      },
    ];
    return this as unknown as TBuilder;
  }

  protected setParameter(key: string, value: unknown): this {
    this.parameters[key] = value;
    return this;
  }

  protected getParameter<TValue>(key: string): TValue {
    return this.parameters[key] as TValue;
  }

  build(): FlowAction {
    return {
      id: this.id,
      type: this.definition.type,
      parameters: { ...this.parameters },
      transitions: hasTransitions(this.transitions)
        ? copyTransitions(this.transitions)
        : undefined,
    };
  }
}

function copyTransitions(transitions: FlowTransitions): FlowTransitions {
  const copy: FlowTransitions = {};
  if (transitions.nextAction !== undefined) {
    copy.nextAction = transitions.nextAction;
  }
  if (transitions.conditions) {
    copy.conditions = transitions.conditions.map((condition) => ({ ...condition }));
  }
  if (transitions.errors) {
    copy.errors = transitions.errors.map((error) => ({ ...error }));
  }
  return copy;
}

function hasTransitions(transitions: FlowTransitions): boolean {
  return Boolean(
    transitions.nextAction
      || transitions.conditions?.length
      || transitions.errors?.length,
  );
}
