import { BaseActionBuilder } from "../common.js";

export class CreateTaskActionBuilder extends BaseActionBuilder<CreateTaskActionBuilder> {
  constructor(id: string) {
    super(id, "CreateTask");
  }

  contactFlowId(value: string): this {
    return this.setParameter("ContactFlowId", value);
  }

  name(value: string): this {
    return this.setParameter("Name", value);
  }

  description(value: string): this {
    return this.setParameter("Description", value);
  }

  attribute(key: string, value: string): this {
    const attributes =
      this.getParameter<Record<string, string> | undefined>("Attributes")
      ?? {};
    attributes[key] = value;
    return this.setParameter("Attributes", attributes);
  }

  reference(key: string, value: string): this {
    const references =
      this.getParameter<Record<string, string> | undefined>("References")
      ?? {};
    references[key] = value;
    return this.setParameter("References", references);
  }

  delaySeconds(value: number): this {
    delete this.parameters.ScheduledTime;
    return this.setParameter("DelaySeconds", value);
  }

  scheduledTime(value: string): this {
    delete this.parameters.DelaySeconds;
    return this.setParameter("ScheduledTime", value);
  }

  taskTemplateId(value: string): this {
    return this.setParameter("TaskTemplateId", value);
  }
}
