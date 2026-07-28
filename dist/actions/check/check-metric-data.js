import { numberGreaterThanCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export { CHECK_METRIC_DATA_METRIC_TYPES } from "../../core/action-constants.js";
export class CheckMetricDataActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CheckMetricData");
    }
    metricType(value) {
        return this.setParameter("MetricType", value);
    }
    numberOfAgentsAvailable() {
        return this.metricType("NumberOfAgentsAvailable");
    }
    numberOfAgentsStaffed() {
        return this.metricType("NumberOfAgentsStaffed");
    }
    numberOfAgentsOnline() {
        return this.metricType("NumberOfAgentsOnline");
    }
    oldestContactInQueueAgeSeconds() {
        return this.metricType("OldestContactInQueueAgeSeconds");
    }
    numberOfContactsInQueue() {
        return this.metricType("NumberOfContactsInQueue");
    }
    queueId(value) {
        delete this.parameters.AgentId;
        return this.setParameter("QueueId", value);
    }
    agentId(value) {
        delete this.parameters.QueueId;
        return this.setParameter("AgentId", value);
    }
    useCurrentTargetQueue() {
        delete this.parameters.QueueId;
        delete this.parameters.AgentId;
        return this;
    }
    whenMetricGreaterThanZero(nextAction) {
        this.when(numberGreaterThanCondition("0"), nextAction);
        return this;
    }
}
