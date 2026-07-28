import { BaseActionBuilder } from "../common.js";
export { LOAD_CONTACT_CONTENT_TYPES } from "../../core/action-constants.js";
export class LoadContactContentActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "LoadContactContent");
    }
    contentType(value) {
        return this.setParameter("ContentType", value);
    }
    emailMessage() {
        return this.contentType("EmailMessage");
    }
}
