import { BaseActionBuilder } from "../common.js";

export class UpdateContactAttributesActionBuilder extends BaseActionBuilder<UpdateContactAttributesActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactAttributes");
    this.setParameter("TargetContact", "Current");
    this.setParameter("Attributes", {});
  }

  targetCurrent(): this {
    return this.setParameter("TargetContact", "Current");
  }

  targetRelated(): this {
    return this.setParameter("TargetContact", "Related");
  }

  attribute(key: string, value: string): this {
    const attributes = this.getParameter<Record<string, string>>("Attributes");
    attributes[key] = value;
    return this;
  }
}
