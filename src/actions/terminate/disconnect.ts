import { BaseActionBuilder } from "../common.js";

export class DisconnectParticipantActionBuilder extends BaseActionBuilder<DisconnectParticipantActionBuilder> {
  constructor(id: string) {
    super(id, "DisconnectParticipant");
  }
}
