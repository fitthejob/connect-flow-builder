import { BaseActionBuilder } from "../common.js";

export class ResumeContactActionBuilder extends BaseActionBuilder<ResumeContactActionBuilder> {
  constructor(id: string) {
    super(id, "ResumeContact");
  }
}
