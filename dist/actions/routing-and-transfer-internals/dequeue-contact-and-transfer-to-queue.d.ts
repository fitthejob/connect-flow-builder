import { BaseActionBuilder } from "../common.js";
export declare class DequeueContactAndTransferToQueueActionBuilder extends BaseActionBuilder<DequeueContactAndTransferToQueueActionBuilder> {
    constructor(id: string);
    queueId(value: string): this;
    agentId(value: string): this;
}
