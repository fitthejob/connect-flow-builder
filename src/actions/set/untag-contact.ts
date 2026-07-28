import { BaseActionBuilder } from "../common.js";

export class UnTagContactActionBuilder extends BaseActionBuilder<UnTagContactActionBuilder> {
  constructor(id: string) {
    super(id, "UnTagContact");
    this.setParameter("TagKeys", []);
  }

  key(value: string): this {
    const keys = this.getParameter<string[]>("TagKeys");
    keys.push(value);
    return this;
  }

  keys(...values: string[]): this {
    for (const value of values) {
      this.key(value);
    }
    return this;
  }
}
