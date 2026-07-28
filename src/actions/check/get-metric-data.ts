import type { QueueChannel } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { QUEUE_CHANNELS } from "../../core/action-constants.js";

export class GetMetricDataActionBuilder extends BaseActionBuilder<GetMetricDataActionBuilder> {
  constructor(id: string) {
    super(id, "GetMetricData");
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

  queueChannel(value: QueueChannel): this {
    return this.setParameter("QueueChannel", value);
  }

  voiceChannel(): this {
    return this.queueChannel("Voice");
  }

  chatChannel(): this {
    return this.queueChannel("Chat");
  }
}
