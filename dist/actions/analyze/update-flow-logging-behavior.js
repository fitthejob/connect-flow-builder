import { BaseActionBuilder } from "../common.js";
export { FLOW_LOGGING_BEHAVIORS } from "../../core/action-constants.js";
export class UpdateFlowLoggingBehaviorActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "UpdateFlowLoggingBehavior");
    }
    enabled() {
        return this.setParameter("FlowLoggingBehavior", "Enabled");
    }
    disabled() {
        return this.setParameter("FlowLoggingBehavior", "Disabled");
    }
    behavior(value) {
        return this.setParameter("FlowLoggingBehavior", value);
    }
}
