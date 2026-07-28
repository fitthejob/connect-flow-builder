import { BaseActionBuilder } from "../common.js";
export class AssociateContactToCustomerProfileActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "AssociateContactToCustomerProfile");
        this.setParameter("ProfileRequestData", {});
    }
    profileId(value) {
        const requestData = this.getParameter("ProfileRequestData");
        requestData.ProfileId = value;
        return this;
    }
    contactId(value) {
        const requestData = this.getParameter("ProfileRequestData");
        requestData.ContactId = value;
        return this;
    }
}
