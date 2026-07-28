import { BaseActionBuilder } from "../common.js";
export class TransferToFlowActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "TransferToFlow");
    }
    contactFlowId(value) {
        return this.setParameter("ContactFlowId", value);
    }
}
