import { BaseActionBuilder } from "../common.js";

export class UpdateContactTargetQueueActionBuilder extends BaseActionBuilder<UpdateContactTargetQueueActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactTargetQueue");
  }

  queueId(value: string): this {
    delete this.parameters.AgentId;
    return this.setParameter("QueueId", value);
  }

  agentId(value: string): this {
    delete this.parameters.QueueId;
    return this.setParameter("AgentId", value);
  }
}
