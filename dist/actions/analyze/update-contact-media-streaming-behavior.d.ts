import type { MediaDirection, MediaStreamingState } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { MEDIA_STREAMING_STATES, MEDIA_DIRECTIONS } from "../../core/action-constants.js";
export declare class UpdateContactMediaStreamingBehaviorActionBuilder extends BaseActionBuilder<UpdateContactMediaStreamingBehaviorActionBuilder> {
    constructor(id: string);
    enabled(): this;
    disabled(): this;
    state(value: MediaStreamingState): this;
    participantCustomer(...directions: MediaDirection[]): this;
    audioStream(): this;
}
