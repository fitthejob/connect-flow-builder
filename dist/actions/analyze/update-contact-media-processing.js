import { BaseActionBuilder } from "../common.js";
export class UpdateContactMediaProcessingActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactMediaProcessing");
    }
    chatProcessor(config) {
        return this.setParameter("ChatProcessor", config);
    }
    lambdaChatProcessor(lambdaProcessorArn, deliverUnprocessedMessages = true, processingEnabled = true) {
        return this.chatProcessor({
            ProcessingEnabled: processingEnabled ? "True" : "False",
            LambdaProcessorARN: lambdaProcessorArn,
            ChatProcessorSettings: {
                DeliverUnprocessedMessages: deliverUnprocessedMessages ? "True" : "False",
            },
        });
    }
}
