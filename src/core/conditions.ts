import type {
  FlowCondition,
  FlowConditionExpression,
  FlowConditionOperator,
} from "./types.js";

export const SUPPORTED_CONDITION_OPERATORS = [
  "Equals",
  "TextStartsWith",
  "TextEndsWith",
  "TextContains",
  "NumberGreaterThan",
  "NumberGreaterOrEqualTo",
  "NumberLessThan",
  "NumberLessOrEqualTo",
] as const satisfies readonly FlowConditionOperator[];

export function createCondition(
  operator: FlowConditionOperator,
  operand: string,
): FlowConditionExpression {
  return {
    operator,
    operands: [operand],
  };
}

export function whenCondition(
  condition: FlowConditionExpression,
  nextAction: string,
): FlowCondition {
  return {
    nextAction,
    condition,
  };
}

export function equalsCondition(operand: string): FlowConditionExpression {
  return createCondition("Equals", operand);
}

export function textStartsWithCondition(operand: string): FlowConditionExpression {
  return createCondition("TextStartsWith", operand);
}

export function textEndsWithCondition(operand: string): FlowConditionExpression {
  return createCondition("TextEndsWith", operand);
}

export function textContainsCondition(operand: string): FlowConditionExpression {
  return createCondition("TextContains", operand);
}

export function numberGreaterThanCondition(operand: string): FlowConditionExpression {
  return createCondition("NumberGreaterThan", operand);
}

export function numberGreaterOrEqualToCondition(operand: string): FlowConditionExpression {
  return createCondition("NumberGreaterOrEqualTo", operand);
}

export function numberLessThanCondition(operand: string): FlowConditionExpression {
  return createCondition("NumberLessThan", operand);
}

export function numberLessOrEqualToCondition(operand: string): FlowConditionExpression {
  return createCondition("NumberLessOrEqualTo", operand);
}
