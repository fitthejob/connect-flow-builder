import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";

export class CheckHoursOfOperationActionBuilder extends BaseActionBuilder<CheckHoursOfOperationActionBuilder> {
  constructor(id: string) {
    super(id, "CheckHoursOfOperation");
  }

  hoursOfOperationId(value: string): this {
    return this.setParameter("HoursOfOperationId", value);
  }

  whenInHours(nextAction: string): this {
    this.when(equalsCondition("True"), nextAction);
    return this;
  }

  whenOutOfHours(nextAction: string): this {
    this.when(equalsCondition("False"), nextAction);
    return this;
  }
}
