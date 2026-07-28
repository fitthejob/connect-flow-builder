import { BaseActionBuilder } from "../common.js";
export declare class CreateCallbackContactActionBuilder extends BaseActionBuilder<CreateCallbackContactActionBuilder> {
    constructor(id: string);
    queueId(value: string): this;
    agentId(value: string): this;
    initialCallDelaySeconds(value: number): this;
    maximumConnectionAttempts(value: number): this;
    retryDelaySeconds(value: number): this;
    contactFlowId(value: string): this;
    callerId(value: string): this;
}
