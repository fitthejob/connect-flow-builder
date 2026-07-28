import { BaseActionBuilder } from "../common.js";

export class DequeueContactAndTransferToQueueActionBuilder extends BaseActionBuilder<DequeueContactAndTransferToQueueActionBuilder> {
  constructor(id: string) {
    super(id, "DequeueContactAndTransferToQueue");
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
