import { BaseActionBuilder } from "../common.js";
export class GetCalculatedAttributesForCustomerProfileActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetCalculatedAttributesForCustomerProfile");
        this.setParameter("ProfileRequestData", {});
    }
    profileId(value) {
        const requestData = this.getParameter("ProfileRequestData");
        requestData.ProfileId = value;
        return this;
    }
    responseField(name) {
        const responseData = this.getParameter("ProfileResponseData")
            ?? {};
        responseData[name] = true;
        return this.setParameter("ProfileResponseData", responseData);
    }
}
