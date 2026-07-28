import { BaseActionBuilder } from "../common.js";
export declare class CheckHoursOfOperationActionBuilder extends BaseActionBuilder<CheckHoursOfOperationActionBuilder> {
    constructor(id: string);
    hoursOfOperationId(value: string): this;
    whenInHours(nextAction: string): this;
    whenOutOfHours(nextAction: string): this;
}
