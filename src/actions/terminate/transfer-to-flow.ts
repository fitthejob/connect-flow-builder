import { BaseActionBuilder } from "../common.js";

export class TransferToFlowActionBuilder extends BaseActionBuilder<TransferToFlowActionBuilder> {
  constructor(id: string) {
    super(id, "TransferToFlow");
  }

  contactFlowId(value: string): this {
    return this.setParameter("ContactFlowId", value);
  }
}
