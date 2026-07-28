import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactTargetQueueActionBuilder extends BaseActionBuilder<UpdateContactTargetQueueActionBuilder> {
    constructor(id: string);
    queueId(value: string): this;
    agentId(value: string): this;
}
