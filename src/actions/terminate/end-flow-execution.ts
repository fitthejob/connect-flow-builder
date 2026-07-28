import { BaseActionBuilder } from "../common.js";

export class EndFlowExecutionActionBuilder extends BaseActionBuilder<EndFlowExecutionActionBuilder> {
  constructor(id: string) {
    super(id, "EndFlowExecution");
  }
}
