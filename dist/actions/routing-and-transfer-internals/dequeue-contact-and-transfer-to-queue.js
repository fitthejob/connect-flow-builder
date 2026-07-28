import { BaseActionBuilder } from "../common.js";
export class DequeueContactAndTransferToQueueActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "DequeueContactAndTransferToQueue");
    }
    queueId(value) {
        delete this.parameters.AgentId;
        return this.setParameter("QueueId", value);
    }
    agentId(value) {
        delete this.parameters.QueueId;
        return this.setParameter("AgentId", value);
    }
}
