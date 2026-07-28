import { BaseActionBuilder } from "../common.js";

export class CreateWisdomSessionActionBuilder extends BaseActionBuilder<CreateWisdomSessionActionBuilder> {
  constructor(id: string) {
    super(id, "CreateWisdomSession");
  }

  wisdomAssistantArn(value: string): this {
    return this.setParameter("WisdomAssistantArn", value);
  }
}
