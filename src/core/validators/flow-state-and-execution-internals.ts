import type {
  FlowAction,
} from "../types.js";
import {
  isObject,
} from "./helpers.js";

export function validateUpdateFlowAttributesAction(action: FlowAction): void {
  const flowAttributes = action.parameters.FlowAttributes;

  if (!isObject(flowAttributes) || Object.keys(flowAttributes).length === 0) {
    throw new Error(
      `Action "${action.id}" of type "UpdateFlowAttributes" requires FlowAttributes to contain at least one entry.`,
    );
  }

  for (const [key, value] of Object.entries(flowAttributes)) {
    if (key.trim().length === 0 || typeof value !== "string" || value.trim().length === 0) {
      throw new Error(
        `Action "${action.id}" of type "UpdateFlowAttributes" requires every FlowAttributes entry to use a non-empty string key and value.`,
      );
    }
  }
}
