import { BaseActionBuilder } from "../common.js";
export class UpdateContactCallbackNumberActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactCallbackNumber");
    }
    callbackNumberJsonPath(value) {
        return this.setParameter("CallbackNumber", value);
    }
}
