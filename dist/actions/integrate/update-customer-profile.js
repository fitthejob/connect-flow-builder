import { BaseActionBuilder } from "../common.js";
export class UpdateCustomerProfileActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateCustomerProfile");
        this.setParameter("ProfileRequestData", {});
    }
    requestField(key, value) {
        const data = this.getParameter("ProfileRequestData");
        data[key] = value;
        return this;
    }
    responseField(key) {
        const data = this.getParameter("ProfileResponseData")
            ?? {};
        data[key] = true;
        return this.setParameter("ProfileResponseData", data);
    }
}
