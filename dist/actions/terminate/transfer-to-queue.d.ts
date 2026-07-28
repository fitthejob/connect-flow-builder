import { BaseActionBuilder } from "../common.js";
export declare class TransferContactToQueueActionBuilder extends BaseActionBuilder<TransferContactToQueueActionBuilder> {
    constructor(id: string);
}
/**
 * @deprecated Use TransferContactToQueueActionBuilder and set the queue first with UpdateContactTargetQueueActionBuilder.
 */
export declare class TransferToQueueActionBuilder extends TransferContactToQueueActionBuilder {
}
