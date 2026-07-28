import { BaseActionBuilder } from "../common.js";
export class UpdateFlowAttributesActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateFlowAttributes");
        this.setParameter("FlowAttributes", {});
    }
    attribute(key, value) {
        const attributes = this.getParameter("FlowAttributes");
        attributes[key] = value;
        return this;
    }
}
