import { BaseActionBuilder } from "../common.js";

export class GetCalculatedAttributesForCustomerProfileActionBuilder extends BaseActionBuilder<GetCalculatedAttributesForCustomerProfileActionBuilder> {
  constructor(id: string) {
    super(id, "GetCalculatedAttributesForCustomerProfile");
    this.setParameter("ProfileRequestData", {});
  }

  profileId(value: string): this {
    const requestData =
      this.getParameter<Record<string, unknown>>("ProfileRequestData");
    requestData.ProfileId = value;
    return this;
  }

  responseField(name: string): this {
    const responseData =
      this.getParameter<Record<string, boolean> | undefined>("ProfileResponseData")
      ?? {};
    responseData[name] = true;
    return this.setParameter("ProfileResponseData", responseData);
  }
}
