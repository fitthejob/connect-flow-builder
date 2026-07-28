import type { MediaDirection, MediaStreamingParticipant, MediaStreamingState } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { MEDIA_STREAMING_STATES, MEDIA_DIRECTIONS } from "../../core/action-constants.js";

export class UpdateContactMediaStreamingBehaviorActionBuilder extends BaseActionBuilder<UpdateContactMediaStreamingBehaviorActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateContactMediaStreamingBehavior");
    this.setParameter("Participants", []);
    this.setParameter("MediaStreamType", "Audio");
  }

  enabled(): this {
    return this.setParameter("MediaStreamingState", "Enabled");
  }

  disabled(): this {
    return this.setParameter("MediaStreamingState", "Disabled");
  }

  state(value: MediaStreamingState): this {
    return this.setParameter("MediaStreamingState", value);
  }

  participantCustomer(...directions: MediaDirection[]): this {
    const participants = this.getParameter<MediaStreamingParticipant[]>("Participants");
    participants.push({
      ParticipantType: "Customer",
      MediaDirections: directions,
    });
    return this;
  }

  audioStream(): this {
    return this.setParameter("MediaStreamType", "Audio");
  }
}
