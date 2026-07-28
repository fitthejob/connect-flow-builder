import { BaseActionBuilder } from "../common.js";
export { PREVIOUS_CONTACT_PARTICIPANT_STATES } from "../../core/action-constants.js";
export class UpdatePreviousContactParticipantStateActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdatePreviousContactParticipantState");
    }
    state(value) {
        return this.setParameter("PreviousContactParticipantState", value);
    }
    agentOnHold() {
        return this.state("AgentOnHold");
    }
    customerOnHold() {
        return this.state("CustomerOnHold");
    }
    offHold() {
        return this.state("OffHold");
    }
}
