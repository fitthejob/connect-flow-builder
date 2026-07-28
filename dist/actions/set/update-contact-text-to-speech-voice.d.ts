import { BaseActionBuilder } from "../common.js";
export declare class UpdateContactTextToSpeechVoiceActionBuilder extends BaseActionBuilder<UpdateContactTextToSpeechVoiceActionBuilder> {
    constructor(id: string);
    voice(value: string): this;
    engine(value: string): this;
    style(value: string): this;
}
