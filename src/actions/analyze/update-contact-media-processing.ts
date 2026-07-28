import type { ChatProcessorConfig } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class UpdateContactMediaProcessingActionBuilder extends BaseActionBuilder<UpdateContactMediaProcessingActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactMediaProcessing");
  }

  chatProcessor(config: ChatProcessorConfig): this {
    return this.setParameter("ChatProcessor", config);
  }

  lambdaChatProcessor(
    lambdaProcessorArn: string,
    deliverUnprocessedMessages = true,
    processingEnabled = true,
  ): this {
    return this.chatProcessor({
      ProcessingEnabled: processingEnabled ? "True" : "False",
      LambdaProcessorARN: lambdaProcessorArn,
      ChatProcessorSettings: {
        DeliverUnprocessedMessages: deliverUnprocessedMessages ? "True" : "False",
      },
    });
  }
}
