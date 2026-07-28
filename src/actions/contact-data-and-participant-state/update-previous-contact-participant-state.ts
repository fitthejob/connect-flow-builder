import type { PreviousContactParticipantState } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { PREVIOUS_CONTACT_PARTICIPANT_STATES } from "../../core/action-constants.js";

export class UpdatePreviousContactParticipantStateActionBuilder extends BaseActionBuilder<UpdatePreviousContactParticipantStateActionBuilder> {
  constructor(id: string) {
    super(id, "UpdatePreviousContactParticipantState");
  }

  state(value: PreviousContactParticipantState): this {
    return this.setParameter("PreviousContactParticipantState", value);
  }

  agentOnHold(): this {
    return this.state("AgentOnHold");
  }

  customerOnHold(): this {
    return this.state("CustomerOnHold");
  }

  offHold(): this {
    return this.state("OffHold");
  }
}
