import { BaseActionBuilder } from "../common.js";

export class MessageParticipantActionBuilder extends BaseActionBuilder<MessageParticipantActionBuilder> {
  constructor(id: string) {
    super(id, "MessageParticipant");
  }

  text(value: string): this {
    return this.setParameter("Text", value);
  }
}
