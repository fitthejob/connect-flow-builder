import type { FlowLoggingBehavior } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export { FLOW_LOGGING_BEHAVIORS } from "../../core/action-constants.js";
export declare class UpdateFlowLoggingBehaviorActionBuilder extends BaseActionBuilder<UpdateFlowLoggingBehaviorActionBuilder> {
    constructor(id: string);
    enabled(): this;
    disabled(): this;
    behavior(value: FlowLoggingBehavior): this;
}
