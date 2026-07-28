import { equalsCondition } from "../../core/conditions.js";
import type { WaitEvent } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export { WAIT_EVENTS } from "../../core/action-constants.js";

export class WaitActionBuilder extends BaseActionBuilder<WaitActionBuilder> {
  constructor(id: string) {
    super(id, "Wait");
  }

  timeoutSeconds(value: number | string): this {
    return this.setParameter("TimeoutSeconds", value);
  }

  events(...events: WaitEvent[]): this {
    return this.setParameter("Events", events);
  }

  onWaitCompleted(nextAction: string): this {
    this.when(equalsCondition("WaitCompleted"), nextAction);
    return this;
  }

  onEvent(event: WaitEvent, nextAction: string): this {
    this.when(equalsCondition(event), nextAction);
    return this;
  }
}
