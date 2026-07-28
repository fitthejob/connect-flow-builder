import { BaseActionBuilder } from "../common.js";

export class TagContactActionBuilder extends BaseActionBuilder<TagContactActionBuilder> {
  constructor(id: string) {
    super(id, "TagContact");
    this.setParameter("Tags", {});
  }

  tag(key: string, value: string): this {
    const tags = this.getParameter<Record<string, string>>("Tags");
    tags[key] = value;
    return this;
  }
}
