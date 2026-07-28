import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactRoutingBehaviorActionBuilder extends BaseActionBuilder<UpdateContactRoutingBehaviorActionBuilder> {
    constructor(id: string);
    queuePriority(value: number): this;
    queueTimeAdjustmentSeconds(value: number): this;
}
