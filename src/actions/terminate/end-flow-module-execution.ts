import { BaseActionBuilder } from "../common.js";

export class EndFlowModuleExecutionActionBuilder extends BaseActionBuilder<EndFlowModuleExecutionActionBuilder> {
  constructor(id: string) {
    super(id, "EndFlowModuleExecution");
  }
}
