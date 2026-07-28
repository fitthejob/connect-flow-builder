import { BaseActionBuilder } from "../common.js";
export { QUEUE_CHANNELS } from "../../core/action-constants.js";
export class GetMetricDataActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetMetricData");
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
    queueChannel(value) {
        return this.setParameter("QueueChannel", value);
    }
    voiceChannel() {
        return this.queueChannel("Voice");
    }
    chatChannel() {
        return this.queueChannel("Chat");
    }
}
