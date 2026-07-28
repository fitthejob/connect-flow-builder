import { BaseActionBuilder } from "../common.js";
export class CreateTaskActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "CreateTask");
    }
    contactFlowId(value) {
        return this.setParameter("ContactFlowId", value);
    }
    name(value) {
        return this.setParameter("Name", value);
    }
    description(value) {
        return this.setParameter("Description", value);
    }
    attribute(key, value) {
        const attributes = this.getParameter("Attributes")
            ?? {};
        attributes[key] = value;
        return this.setParameter("Attributes", attributes);
    }
    reference(key, value) {
        const references = this.getParameter("References")
            ?? {};
        references[key] = value;
        return this.setParameter("References", references);
    }
    delaySeconds(value) {
        delete this.parameters.ScheduledTime;
        return this.setParameter("DelaySeconds", value);
    }
    scheduledTime(value) {
        delete this.parameters.DelaySeconds;
        return this.setParameter("ScheduledTime", value);
    }
    taskTemplateId(value) {
        return this.setParameter("TaskTemplateId", value);
    }
}
