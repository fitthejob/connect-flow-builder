import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export class CheckHoursOfOperationActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CheckHoursOfOperation");
    }
    hoursOfOperationId(value) {
        return this.setParameter("HoursOfOperationId", value);
    }
    whenInHours(nextAction) {
        this.when(equalsCondition("True"), nextAction);
        return this;
    }
    whenOutOfHours(nextAction) {
        this.when(equalsCondition("False"), nextAction);
        return this;
    }
}
