import { BaseActionBuilder } from "../common.js";

export class StartVoiceIdStreamActionBuilder extends BaseActionBuilder<StartVoiceIdStreamActionBuilder> {
  constructor(id: string) {
    super(id, "StartVoiceIdStream");
  }
}
