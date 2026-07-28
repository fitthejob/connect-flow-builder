export const SUPPORTED_CONDITION_OPERATORS = [
    "Equals",
    "TextStartsWith",
    "TextEndsWith",
    "TextContains",
    "NumberGreaterThan",
    "NumberGreaterOrEqualTo",
    "NumberLessThan",
    "NumberLessOrEqualTo",
];
export function createCondition(operator, operand) {
    return {
        operator,
        operands: [operand],
    };
}
export function whenCondition(condition, nextAction) {
    return {
        nextAction,
        condition,
    };
}
export function equalsCondition(operand) {
    return createCondition("Equals", operand);
}
export function textStartsWithCondition(operand) {
    return createCondition("TextStartsWith", operand);
}
export function textEndsWithCondition(operand) {
    return createCondition("TextEndsWith", operand);
}
export function textContainsCondition(operand) {
    return createCondition("TextContains", operand);
}
export function numberGreaterThanCondition(operand) {
    return createCondition("NumberGreaterThan", operand);
}
export function numberGreaterOrEqualToCondition(operand) {
    return createCondition("NumberGreaterOrEqualTo", operand);
}
export function numberLessThanCondition(operand) {
    return createCondition("NumberLessThan", operand);
}
export function numberLessOrEqualToCondition(operand) {
    return createCondition("NumberLessOrEqualTo", operand);
}
