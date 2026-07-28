import { BaseActionBuilder } from "../common.js";

export class UpdateContactCallbackNumberActionBuilder extends BaseActionBuilder<UpdateContactCallbackNumberActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactCallbackNumber");
  }

  callbackNumberJsonPath(value: string): this {
    return this.setParameter("CallbackNumber", value);
  }
}
