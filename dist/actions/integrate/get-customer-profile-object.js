import { BaseActionBuilder } from "../common.js";
export class GetCustomerProfileObjectActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "GetCustomerProfileObject");
        this.setParameter("ProfileRequestData", {});
    }
    profileId(value) {
        const requestData = this.getParameter("ProfileRequestData");
        requestData.ProfileId = value;
        return this;
    }
    objectType(value) {
        const requestData = this.getParameter("ProfileRequestData");
        requestData.ObjectType = value;
        return this;
    }
    identifier(name, value) {
        const requestData = this.getParameter("ProfileRequestData");
        delete requestData.UseLatest;
        requestData.IdentifierName = name;
        requestData.IdentifierValue = value;
        return this;
    }
    useLatest(enabled = true) {
        const requestData = this.getParameter("ProfileRequestData");
        delete requestData.IdentifierName;
        delete requestData.IdentifierValue;
        requestData.UseLatest = enabled;
        return this;
    }
    responseField(key) {
        const data = this.getParameter("ProfileResponseData")
            ?? {};
        data[key] = true;
        return this.setParameter("ProfileResponseData", data);
    }
}
