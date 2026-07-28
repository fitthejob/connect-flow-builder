import { BaseActionBuilder } from "../common.js";

export class TransferContactToQueueActionBuilder extends BaseActionBuilder<TransferContactToQueueActionBuilder> {
  constructor(id: string) {
    super(id, "TransferContactToQueue");
  }
}

/**
 * @deprecated Use TransferContactToQueueActionBuilder and set the queue first with UpdateContactTargetQueueActionBuilder.
 */
export class TransferToQueueActionBuilder extends TransferContactToQueueActionBuilder {}
