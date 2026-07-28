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
      this.getParameter<string[] | undefined>("ProfileResponseData")
      ?? [];
    if (!responseData.includes(name)) {
      responseData.push(name);
    }
    return this.setParameter("ProfileResponseData", responseData);
  }
}
