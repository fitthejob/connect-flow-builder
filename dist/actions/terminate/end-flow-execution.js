import { BaseActionBuilder } from "../common.js";
export class EndFlowExecutionActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "EndFlowExecution");
    }
}
