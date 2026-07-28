import { BaseActionBuilder } from "../common.js";

export class InvokeFlowModuleActionBuilder extends BaseActionBuilder<InvokeFlowModuleActionBuilder> {
  constructor(id: string) {
    super(id, "InvokeFlowModule");
  }

  flowModuleId(value: string): this {
    return this.setParameter("FlowModuleId", value);
  }
}
