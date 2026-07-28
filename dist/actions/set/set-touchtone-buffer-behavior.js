import { BaseActionBuilder } from "../common.js";
export class SetTouchtoneBufferBehaviorActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetParticipantInput");
        this.enableBuffering();
    }
    enableBuffering() {
        this.setParameter("EnableDTMFBuffer", "True");
        delete this.parameters.StoreInput;
        delete this.parameters.InputEncryption;
        return this;
    }
    stopAndClear() {
        return this.setParameter("EnableDTMFBuffer", "False");
    }
    storeInput(enabled = true) {
        if (!enabled) {
            delete this.parameters.StoreInput;
            delete this.parameters.InputEncryption;
            return this;
        }
        this.stopAndClear();
        return this.setParameter("StoreInput", "True");
    }
    inputEncryption(encryptionKeyId, key) {
        this.stopAndClear();
        this.setParameter("StoreInput", "True");
        return this.setParameter("InputEncryption", {
            EncryptionKeyId: encryptionKeyId,
            Key: key,
        });
    }
    clearInputEncryption() {
        delete this.parameters.InputEncryption;
        return this;
    }
}
