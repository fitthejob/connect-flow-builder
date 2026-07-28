import { BaseActionBuilder } from "../common.js";
export class InvokeFlowModuleActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "InvokeFlowModule");
    }
    flowModuleId(value) {
        return this.setParameter("FlowModuleId", value);
    }
}
