import { BaseActionBuilder } from "../common.js";
export class UpdateContactTextToSpeechVoiceActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateContactTextToSpeechVoice");
    }
    voice(value) {
        return this.setParameter("TextToSpeechVoice", value);
    }
    engine(value) {
        return this.setParameter("TextToSpeechEngine", value);
    }
    style(value) {
        return this.setParameter("TextToSpeechStyle", value);
    }
}
