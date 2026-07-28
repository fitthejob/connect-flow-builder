import { BaseActionBuilder } from "../common.js";
export class CreateCallbackContactActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CreateCallbackContact");
    }
    queueId(value) {
        delete this.parameters.AgentId;
        return this.setParameter("QueueId", value);
    }
    agentId(value) {
        delete this.parameters.QueueId;
        return this.setParameter("AgentId", value);
    }
    initialCallDelaySeconds(value) {
        return this.setParameter("InitialCallDelaySeconds", value);
    }
    maximumConnectionAttempts(value) {
        return this.setParameter("MaximumConnectionAttempts", value);
    }
    retryDelaySeconds(value) {
        return this.setParameter("RetryDelaySeconds", value);
    }
    contactFlowId(value) {
        return this.setParameter("ContactFlowId", value);
    }
    callerId(value) {
        return this.setParameter("CallerId", value);
    }
}
