import { BaseActionBuilder } from "../common.js";

export class UpdateContactRoutingBehaviorActionBuilder extends BaseActionBuilder<UpdateContactRoutingBehaviorActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactRoutingBehavior");
  }

  queuePriority(value: number): this {
    delete this.parameters.QueueTimeAdjustmentSeconds;
    return this.setParameter("QueuePriority", value);
  }

  queueTimeAdjustmentSeconds(value: number): this {
    delete this.parameters.QueuePriority;
    return this.setParameter("QueueTimeAdjustmentSeconds", value);
  }
}
