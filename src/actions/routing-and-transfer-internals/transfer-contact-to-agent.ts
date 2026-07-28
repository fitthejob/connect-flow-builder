import { BaseActionBuilder } from "../common.js";

export class TransferContactToAgentActionBuilder extends BaseActionBuilder<TransferContactToAgentActionBuilder> {
  constructor(id: string) {
    super(id, "TransferContactToAgent");
  }
}
