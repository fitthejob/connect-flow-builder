import { BaseActionBuilder } from "../common.js";

export class UpdateCustomerProfileActionBuilder extends BaseActionBuilder<UpdateCustomerProfileActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateCustomerProfile");
    this.setParameter("ProfileRequestData", {});
  }

  requestField(key: string, value: string): this {
    const data = this.getParameter<Record<string, string>>("ProfileRequestData");
    data[key] = value;
    return this;
  }

  responseField(key: string): this {
    const data =
      this.getParameter<Record<string, boolean> | undefined>("ProfileResponseData")
      ?? {};
    data[key] = true;
    return this.setParameter("ProfileResponseData", data);
  }
}
