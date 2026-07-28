import type { ChatProcessorConfig } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactMediaProcessingActionBuilder extends BaseActionBuilder<UpdateContactMediaProcessingActionBuilder> {
    constructor(id: string);
    chatProcessor(config: ChatProcessorConfig): this;
    lambdaChatProcessor(lambdaProcessorArn: string, deliverUnprocessedMessages?: boolean, processingEnabled?: boolean): this;
}
