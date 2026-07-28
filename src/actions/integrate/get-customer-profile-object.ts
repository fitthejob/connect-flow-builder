import { BaseActionBuilder } from "../common.js";

export class GetCustomerProfileObjectActionBuilder extends BaseActionBuilder<GetCustomerProfileObjectActionBuilder> {
  constructor(id: string) {
    super(id, "GetCustomerProfileObject");
    this.setParameter("ProfileRequestData", {});
  }

  profileId(value: string): this {
    const requestData = this.getParameter<Record<string, unknown>>("ProfileRequestData");
    requestData.ProfileId = value;
    return this;
  }

  objectType(value: string): this {
    const requestData = this.getParameter<Record<string, unknown>>("ProfileRequestData");
    requestData.ObjectType = value;
    return this;
  }

  identifier(name: string, value: string): this {
    const requestData = this.getParameter<Record<string, unknown>>("ProfileRequestData");
    delete requestData.UseLatest;
    requestData.IdentifierName = name;
    requestData.IdentifierValue = value;
    return this;
  }

  useLatest(enabled = true): this {
    const requestData = this.getParameter<Record<string, unknown>>("ProfileRequestData");
    delete requestData.IdentifierName;
    delete requestData.IdentifierValue;
    requestData.UseLatest = enabled;
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
