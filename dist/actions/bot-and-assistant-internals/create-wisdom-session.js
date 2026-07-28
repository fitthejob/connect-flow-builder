import { BaseActionBuilder } from "../common.js";
export class CreateWisdomSessionActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CreateWisdomSession");
    }
    wisdomAssistantArn(value) {
        return this.setParameter("WisdomAssistantArn", value);
    }
}
