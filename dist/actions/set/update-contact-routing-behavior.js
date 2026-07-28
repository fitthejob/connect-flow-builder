import { BaseActionBuilder } from "../common.js";
export class UpdateContactRoutingBehaviorActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactRoutingBehavior");
    }
    queuePriority(value) {
        delete this.parameters.QueueTimeAdjustmentSeconds;
        return this.setParameter("QueuePriority", value);
    }
    queueTimeAdjustmentSeconds(value) {
        delete this.parameters.QueuePriority;
        return this.setParameter("QueueTimeAdjustmentSeconds", value);
    }
}
