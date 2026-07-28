import { BaseActionBuilder } from "../common.js";
export { LOOP_OPERANDS } from "../../core/action-constants.js";
export declare class LoopActionBuilder extends BaseActionBuilder<LoopActionBuilder> {
    constructor(id: string);
    loopCount(value: number | string): this;
    whenContinueLooping(nextAction: string): this;
    whenDoneLooping(nextAction: string): this;
}
