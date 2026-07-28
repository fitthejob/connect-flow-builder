import type { FlowLoggingBehavior } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { FLOW_LOGGING_BEHAVIORS } from "../../core/action-constants.js";

export class UpdateFlowLoggingBehaviorActionBuilder extends BaseActionBuilder<UpdateFlowLoggingBehaviorActionBuilder> {
  constructor(id: string) {
    super(id, "UpdateFlowLoggingBehavior");
  }

  enabled(): this {
    return this.setParameter("FlowLoggingBehavior", "Enabled");
  }

  disabled(): this {
    return this.setParameter("FlowLoggingBehavior", "Disabled");
  }

  behavior(value: FlowLoggingBehavior): this {
    return this.setParameter("FlowLoggingBehavior", value);
  }
}
