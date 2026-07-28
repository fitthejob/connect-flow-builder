import { BaseActionBuilder } from "../common.js";
export declare class SetTouchtoneBufferBehaviorActionBuilder extends BaseActionBuilder<SetTouchtoneBufferBehaviorActionBuilder> {
    constructor(id: string);
    enableBuffering(): this;
    stopAndClear(): this;
    storeInput(enabled?: boolean): this;
    inputEncryption(encryptionKeyId: string, key: string): this;
    clearInputEncryption(): this;
}
