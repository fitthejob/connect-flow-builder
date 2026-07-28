import type {
  CheckVoiceIdOption,
  CheckMetricDataMetricType,
  FlowAction,
  FlowCondition,
  OutboundCallStatusOperand,
} from "../types.js";
import {
  CHECK_METRIC_DATA_METRIC_TYPES,
  CHECK_VOICE_ID_OPTIONS,
  ENROLLMENT_STATUS_RESULTS,
  FRAUD_DETECTION_RESULTS,
  OUTBOUND_CALL_STATUS_OPERANDS,
  QUEUE_CHANNELS,
  STAFFING_METRIC_TYPES,
  VOICE_AUTHENTICATION_RESULTS,
  requireErrorTypes,
  requireNonEmptyStringParameter,
} from "./helpers.js";

export function validateCompareAction(action: FlowAction): void {
  requireNonEmptyStringParameter(action, "ComparisonValue");

  if ((action.transitions?.conditions?.length ?? 0) === 0) {
    throw new Error(`Action "${action.id}" of type "Compare" requires at least one condition.`);
  }
}

export function validateCheckOutboundCallStatusAction(action: FlowAction): void {
  if (Object.keys(action.parameters).length > 0) {
    throw new Error(
      `Action "${action.id}" of type "CheckOutboundCallStatus" does not accept parameters.`,
    );
  }

  const conditions = action.transitions?.conditions ?? [];
  if (conditions.length === 0) {
    throw new Error(
      `Action "${action.id}" of type "CheckOutboundCallStatus" requires at least one condition.`,
    );
  }

  for (const condition of conditions) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(
        `Action "${action.id}" of type "CheckOutboundCallStatus" only supports Equals conditions.`,
      );
    }

    const operand = condition.condition.operands[0] as OutboundCallStatusOperand;
    if (!OUTBOUND_CALL_STATUS_OPERANDS.has(operand)) {
      throw new Error(
        `Action "${action.id}" of type "CheckOutboundCallStatus" uses unsupported operand "${operand}".`,
      );
    }
  }

  requireErrorTypes(action, ["NoMatchingError"]);
}

export function validateCheckHoursOfOperationAction(action: FlowAction): void {
  const conditions = action.transitions?.conditions ?? [];

  if (conditions.length !== 2) {
    throw new Error(
      `Action "${action.id}" of type "CheckHoursOfOperation" requires exactly two conditions.`,
    );
  }

  const operandValues = new Set<string>();
  for (const condition of conditions) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(
        `Action "${action.id}" of type "CheckHoursOfOperation" only supports Equals conditions.`,
      );
    }

    const operand = condition.condition.operands[0];
    if (operand !== "True" && operand !== "False") {
      throw new Error(
        `Action "${action.id}" of type "CheckHoursOfOperation" only supports Equals True and Equals False conditions.`,
      );
    }

    operandValues.add(operand);
  }

  if (!operandValues.has("True") || !operandValues.has("False")) {
    throw new Error(
      `Action "${action.id}" of type "CheckHoursOfOperation" requires one True condition and one False condition.`,
    );
  }
}

export function validateCheckMetricDataAction(action: FlowAction): void {
  const metricType = requireMetricTypeParameter(action);
  const hasQueueId = "QueueId" in action.parameters;
  const hasAgentId = "AgentId" in action.parameters;
  const conditions = action.transitions?.conditions ?? [];

  if (hasQueueId && hasAgentId) {
    throw new Error(
      `Action "${action.id}" of type "CheckMetricData" cannot define both QueueId and AgentId.`,
    );
  }

  if (conditions.length === 0) {
    throw new Error(
      `Action "${action.id}" of type "CheckMetricData" requires at least one condition.`,
    );
  }

  if (!STAFFING_METRIC_TYPES.has(metricType)) {
    return;
  }

  for (const condition of conditions) {
    validateStaffingMetricCondition(action, condition);
  }

  for (const error of action.transitions?.errors ?? []) {
    if (error.errorType === "NoMatchingCondition") {
      throw new Error(
        `Action "${action.id}" of type "CheckMetricData" does not support NoMatchingCondition for staffing metrics.`,
      );
    }
  }
}

export function validateStaffingMetricCondition(
  action: FlowAction,
  condition: FlowCondition,
): void {
  if (
    condition.condition.operator !== "NumberGreaterThan"
    || condition.condition.operands[0] !== "0"
  ) {
    throw new Error(
      `Action "${action.id}" of type "CheckMetricData" only supports NumberGreaterThan 0 conditions for staffing metrics.`,
    );
  }
}

export function validateGetMetricDataAction(action: FlowAction): void {
  const hasQueueId = "QueueId" in action.parameters;
  const hasAgentId = "AgentId" in action.parameters;

  if (hasQueueId && hasAgentId) {
    throw new Error(
      `Action "${action.id}" of type "GetMetricData" cannot define both QueueId and AgentId.`,
    );
  }

  if (hasQueueId) {
    requireNonEmptyStringParameter(action, "QueueId");
  }

  if (hasAgentId) {
    requireNonEmptyStringParameter(action, "AgentId");
  }

  if ("QueueChannel" in action.parameters) {
    const queueChannel = requireNonEmptyStringParameter(action, "QueueChannel");
    if (!QUEUE_CHANNELS.has(queueChannel)) {
      throw new Error(
        `Action "${action.id}" of type "GetMetricData" requires QueueChannel to be Voice or Chat.`,
      );
    }
  }
}

export function validateCheckVoiceIdAction(action: FlowAction): void {
  const option = action.parameters.CheckVoiceIdOption as CheckVoiceIdOption | undefined;
  if (!option || !CHECK_VOICE_ID_OPTIONS.has(option)) {
    throw new Error(
      `Action "${action.id}" of type "CheckVoiceId" requires CheckVoiceIdOption to be one of ${[...CHECK_VOICE_ID_OPTIONS].join(", ")}.`,
    );
  }

  const conditions = action.transitions?.conditions ?? [];
  if (conditions.length === 0) {
    throw new Error(
      `Action "${action.id}" of type "CheckVoiceId" requires at least one condition.`,
    );
  }

  const allowedOperands = getAllowedCheckVoiceIdOperands(option);
  for (const condition of conditions) {
    if (condition.condition.operator !== "Equals") {
      throw new Error(
        `Action "${action.id}" of type "CheckVoiceId" only supports Equals conditions.`,
      );
    }

    const operand = condition.condition.operands[0];
    if (!allowedOperands.has(operand)) {
      throw new Error(
        `Action "${action.id}" of type "CheckVoiceId" does not support operand "${operand}" for option "${option}".`,
      );
    }
  }

  requireErrorTypes(action, ["NoMatchingError"]);
}

export function requireMetricTypeParameter(action: FlowAction): CheckMetricDataMetricType {
  const metricType = requireNonEmptyStringParameter(action, "MetricType") as CheckMetricDataMetricType;

  if (!CHECK_METRIC_DATA_METRIC_TYPES.has(metricType)) {
    throw new Error(
      `Action "${action.id}" of type "CheckMetricData" uses unsupported MetricType "${metricType}".`,
    );
  }

  return metricType;
}

export function getAllowedCheckVoiceIdOperands(
  option: CheckVoiceIdOption,
): Set<string> {
  switch (option) {
    case "enrollmentStatus":
      return ENROLLMENT_STATUS_RESULTS;
    case "voiceAuthentication":
      return VOICE_AUTHENTICATION_RESULTS;
    case "fraudDetection":
      return FRAUD_DETECTION_RESULTS;
    default:
      return new Set<string>();
  }
}
