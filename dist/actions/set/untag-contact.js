import { BaseActionBuilder } from "../common.js";
export class UnTagContactActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UnTagContact");
        this.setParameter("TagKeys", []);
    }
    key(value) {
        const keys = this.getParameter("TagKeys");
        keys.push(value);
        return this;
    }
    keys(...values) {
        for (const value of values) {
            this.key(value);
        }
        return this;
    }
}
