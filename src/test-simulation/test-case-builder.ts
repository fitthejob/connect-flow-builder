import type { Observation, TestCaseDefinition } from "./types.js";

export class TestCaseBuilder {
  private readonly observations: Observation[] = [];

  add(observation: Observation): this {
    this.observations.push(observation);
    return this;
  }

  build(): BuiltTestCase {
    const definition: TestCaseDefinition = {
      Version: "2019-10-30",
      Metadata: {},
      Observations: [...this.observations],
    };
    return new BuiltTestCase(definition);
  }
}

export class BuiltTestCase {
  readonly definition: TestCaseDefinition;

  constructor(definition: TestCaseDefinition) {
    this.definition = definition;
  }

  toJsonString(pretty = true): string {
    return JSON.stringify(this.definition, null, pretty ? 2 : undefined);
  }
}
