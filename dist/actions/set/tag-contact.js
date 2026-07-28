import { BaseActionBuilder } from "../common.js";
export class TagContactActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "TagContact");
        this.setParameter("Tags", {});
    }
    tag(key, value) {
        const tags = this.getParameter("Tags");
        tags[key] = value;
        return this;
    }
}
