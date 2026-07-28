import { BaseActionBuilder } from "../common.js";

export class AssociateContactToCustomerProfileActionBuilder extends BaseActionBuilder<AssociateContactToCustomerProfileActionBuilder> {
  constructor(id: string) {
    super(id, "AssociateContactToCustomerProfile");
    this.setParameter("ProfileRequestData", {});
  }

  profileId(value: string): this {
    const requestData =
      this.getParameter<Record<string, unknown>>("ProfileRequestData");
    requestData.ProfileId = value;
    return this;
  }

  contactId(value: string): this {
    const requestData =
      this.getParameter<Record<string, unknown>>("ProfileRequestData");
    requestData.ContactId = value;
    return this;
  }
}
