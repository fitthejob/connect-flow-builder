import { BaseActionBuilder } from "../common.js";

export class SetTouchtoneBufferBehaviorActionBuilder extends BaseActionBuilder<SetTouchtoneBufferBehaviorActionBuilder> {
  constructor(id: string) {
    super(id, "GetParticipantInput");
    this.enableBuffering();
  }

  enableBuffering(): this {
    this.setParameter("EnableDTMFBuffer", "True");
    delete this.parameters.StoreInput;
    delete this.parameters.InputEncryption;
    return this;
  }

  stopAndClear(): this {
    return this.setParameter("EnableDTMFBuffer", "False");
  }

  storeInput(enabled = true): this {
    if (!enabled) {
      delete this.parameters.StoreInput;
      delete this.parameters.InputEncryption;
      return this;
    }

    this.stopAndClear();
    return this.setParameter("StoreInput", "True");
  }

  inputEncryption(encryptionKeyId: string, key: string): this {
    this.stopAndClear();
    this.setParameter("StoreInput", "True");
    return this.setParameter("InputEncryption", {
      EncryptionKeyId: encryptionKeyId,
      Key: key,
    });
  }

  clearInputEncryption(): this {
    delete this.parameters.InputEncryption;
    return this;
  }
}
