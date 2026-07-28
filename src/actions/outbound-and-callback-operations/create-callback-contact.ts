import { BaseActionBuilder } from "../common.js";

export class CreateCallbackContactActionBuilder extends BaseActionBuilder<CreateCallbackContactActionBuilder> {
  constructor(id: string) {
    super(id, "CreateCallbackContact");
  }

  queueId(value: string): this {
    delete this.parameters.AgentId;
    return this.setParameter("QueueId", value);
  }

  agentId(value: string): this {
    delete this.parameters.QueueId;
    return this.setParameter("AgentId", value);
  }

  initialCallDelaySeconds(value: number): this {
    return this.setParameter("InitialCallDelaySeconds", value);
  }

  maximumConnectionAttempts(value: number): this {
    return this.setParameter("MaximumConnectionAttempts", value);
  }

  retryDelaySeconds(value: number): this {
    return this.setParameter("RetryDelaySeconds", value);
  }

  contactFlowId(value: string): this {
    return this.setParameter("ContactFlowId", value);
  }

  callerId(value: string): this {
    return this.setParameter("CallerId", value);
  }
}
