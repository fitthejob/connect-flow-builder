import { BaseActionBuilder } from "../common.js";
export class UpdateContactAttributesActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactAttributes");
        this.setParameter("TargetContact", "Current");
        this.setParameter("Attributes", {});
    }
    targetCurrent() {
        return this.setParameter("TargetContact", "Current");
    }
    targetRelated() {
        return this.setParameter("TargetContact", "Related");
    }
    attribute(key, value) {
        const attributes = this.getParameter("Attributes");
        attributes[key] = value;
        return this;
    }
}
