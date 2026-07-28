import { BaseActionBuilder } from "../common.js";

export class UpdateContactTextToSpeechVoiceActionBuilder extends BaseActionBuilder<UpdateContactTextToSpeechVoiceActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactTextToSpeechVoice");
  }

  voice(value: string): this {
    return this.setParameter("TextToSpeechVoice", value);
  }

  engine(value: string): this {
    return this.setParameter("TextToSpeechEngine", value);
  }

  style(value: string): this {
    return this.setParameter("TextToSpeechStyle", value);
  }
}
