import type {
  FlowAction,
  LoopOperand,
  WaitEvent,
} from "../types.js";
import {
  LOOP_OPERANDS,
  WAIT_EVENTS,
} from "./helpers.js";

export function validateDistributeByPercentageAction(action: FlowAction): void {
  if (Object.keys(action.parameters).length > 0) {
    throw new Error(
      `Action "${action.id}" of type "DistributeByPercentage" does not accept parameters.`,
    );
  }

  const conditions = action.transitions?.conditions ?? [];
  if (conditions.length === 0) {
    throw new Error(
      `Action "${action.id}" of type "DistributeByPercentage" requires at least one condition.`,
    );
  }

  let previousThreshold = 0;
  for (const condition of conditions) {
    if (condition.condition.operator !== "NumberLessThan") {
      throw new Error(
        `Action "${action.id}" of type "DistributeByPercentage" only supports NumberLessThan conditions.`,
      );
    }

    const operand = Number(condition.condition.operands[0]);
    if (!Number.isInteger(operand) || operand < 1 || operand > 100) {
      throw new Error(
        `Action "${action.id}" of type "DistributeByPercentage" requires thresholds to be integers between 1 and 100.`,
      );
    }

    if (operand <= previousThreshold) {
      throw new Error(
        `Action "${action.id}" of type "DistributeByPercentage" requires thresholds to increase strictly in ascending order.`,
      );
    }

    previousThreshold = operand;
  }
}

export function validateLoopAction(action: FlowAction): void {
  const loopCount = action.parameters.LoopCount;
  if (typeof loopCount === "number") {
    if (!Number.isInteger(loopCount) || loopCount < 0 || loopCount > 100) {
      throw new Error(
        `Action "${action.id}" of type "Loop" requires LoopCount to be an integer between 0 and 100.`,
      );
    }
  } else if (!(typeof loopCount === "string" && loopCount.trim().length > 0)) {
    throw new Error(
      `Action "${action.id}" of type "Loop" requires LoopCount to be an integer between 0 and 100 or a non-empty JSONPath string.`,
    );
  }

  const conditions = action.transitions?.conditions ?? [];
  if (conditions.length !== 2) {
    throw new Error(
      `Action "${action.id}" of type "Loop" requires exactly two conditions.`,
    );
  }

  const operands = new Set<string>();
  for (const condition of conditions) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(
        `Action "${action.id}" of type "Loop" only supports Equals conditions.`,
      );
    }

    const operand = condition.condition.operands[0] as LoopOperand;
    if (!LOOP_OPERANDS.has(operand)) {
      throw new Error(
        `Action "${action.id}" of type "Loop" only supports ContinueLooping and DoneLooping operands.`,
      );
    }

    operands.add(operand);
  }

  if (!operands.has("ContinueLooping") || !operands.has("DoneLooping")) {
    throw new Error(
      `Action "${action.id}" of type "Loop" requires one ContinueLooping condition and one DoneLooping condition.`,
    );
  }
}

export function validateWaitAction(action: FlowAction): void {
  validateWaitTimeout(action);

  const events = validateWaitEvents(action);
  const conditions = action.transitions?.conditions ?? [];

  if (conditions.length === 0) {
    throw new Error(`Action "${action.id}" of type "Wait" requires conditions for WaitCompleted and configured events.`);
  }

  const requiredOperands = new Set<string>(["WaitCompleted", ...events]);
  const actualOperands = new Set<string>();

  for (const condition of conditions) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(`Action "${action.id}" of type "Wait" only supports Equals conditions.`);
    }

    const operand = condition.condition.operands[0];
    if (!requiredOperands.has(operand)) {
      throw new Error(
        `Action "${action.id}" of type "Wait" uses unsupported condition operand "${operand}".`,
      );
    }

    actualOperands.add(operand);
  }

  for (const operand of requiredOperands) {
    if (!actualOperands.has(operand)) {
      throw new Error(
        `Action "${action.id}" of type "Wait" requires a condition for "${operand}".`,
      );
    }
  }
}

export function validateWaitTimeout(action: FlowAction): void {
  const timeout = action.parameters.TimeoutSeconds;

  if (typeof timeout === "number") {
    if (!Number.isInteger(timeout) || timeout <= 0 || timeout > 604800) {
      throw new Error(
        `Action "${action.id}" of type "Wait" requires TimeoutSeconds to be a positive integer no greater than 604800.`,
      );
    }
    return;
  }

  if (typeof timeout === "string" && timeout.trim().length > 0) {
    return;
  }

  throw new Error(
    `Action "${action.id}" of type "Wait" requires TimeoutSeconds to be a positive integer or a non-empty JSONPath string.`,
  );
}

export function validateWaitEvents(action: FlowAction): WaitEvent[] {
  const events = action.parameters.Events;

  if (events === undefined) {
    return [];
  }

  if (!Array.isArray(events)) {
    throw new Error(`Action "${action.id}" of type "Wait" requires Events to be an array when provided.`);
  }

  for (const event of events) {
    if (typeof event !== "string" || !WAIT_EVENTS.has(event as WaitEvent)) {
      throw new Error(
        `Action "${action.id}" of type "Wait" uses unsupported event "${String(event)}".`,
      );
    }
  }

  return events as WaitEvent[];
}
