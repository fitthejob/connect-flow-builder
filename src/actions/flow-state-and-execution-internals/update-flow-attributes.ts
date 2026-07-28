import { BaseActionBuilder } from "../common.js";

export class UpdateFlowAttributesActionBuilder extends BaseActionBuilder<UpdateFlowAttributesActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateFlowAttributes");
    this.setParameter("FlowAttributes", {});
  }

  attribute(key: string, value: string): this {
    const attributes = this.getParameter<Record<string, string>>("FlowAttributes");
    attributes[key] = value;
    return this;
  }
}
