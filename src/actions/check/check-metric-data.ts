import { numberGreaterThanCondition } from "../../core/conditions.js";
import type { CheckMetricDataMetricType } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { CHECK_METRIC_DATA_METRIC_TYPES } from "../../core/action-constants.js";

export class CheckMetricDataActionBuilder extends BaseActionBuilder<CheckMetricDataActionBuilder> {
  constructor(id: string) {
    super(id, "CheckMetricData");
  }

  metricType(value: CheckMetricDataMetricType): this {
    return this.setParameter("MetricType", value);
  }

  numberOfAgentsAvailable(): this {
    return this.metricType("NumberOfAgentsAvailable");
  }

  numberOfAgentsStaffed(): this {
    return this.metricType("NumberOfAgentsStaffed");
  }

  numberOfAgentsOnline(): this {
    return this.metricType("NumberOfAgentsOnline");
  }

  oldestContactInQueueAgeSeconds(): this {
    return this.metricType("OldestContactInQueueAgeSeconds");
  }

  numberOfContactsInQueue(): this {
    return this.metricType("NumberOfContactsInQueue");
  }

  queueId(value: string): this {
    delete this.parameters.AgentId;
    return this.setParameter("QueueId", value);
  }

  agentId(value: string): this {
    delete this.parameters.QueueId;
    return this.setParameter("AgentId", value);
  }

  useCurrentTargetQueue(): this {
    delete this.parameters.QueueId;
    delete this.parameters.AgentId;
    return this;
  }

  whenMetricGreaterThanZero(nextAction: string): this {
    this.when(numberGreaterThanCondition("0"), nextAction);
    return this;
  }
}
