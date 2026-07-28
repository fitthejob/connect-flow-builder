import { BaseActionBuilder } from "../common.js";
export class UpdateContactTargetQueueActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactTargetQueue");
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
