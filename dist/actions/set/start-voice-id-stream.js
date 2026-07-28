import { BaseActionBuilder } from "../common.js";
export class StartVoiceIdStreamActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "StartVoiceIdStream");
    }
}
