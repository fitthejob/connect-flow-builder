import type { PreviousContactParticipantState } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { PREVIOUS_CONTACT_PARTICIPANT_STATES } from "../../core/action-constants.js";
export declare class UpdatePreviousContactParticipantStateActionBuilder extends BaseActionBuilder<UpdatePreviousContactParticipantStateActionBuilder> {
    constructor(id: string);
    state(value: PreviousContactParticipantState): this;
    agentOnHold(): this;
    customerOnHold(): this;
    offHold(): this;
}
