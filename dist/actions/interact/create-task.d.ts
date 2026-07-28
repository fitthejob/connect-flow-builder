import { BaseActionBuilder } from "../common.js";
export declare class CreateTaskActionBuilder extends BaseActionBuilder<CreateTaskActionBuilder> {
    constructor(id: string);
    contactFlowId(value: string): this;
    name(value: string): this;
    description(value: string): this;
    attribute(key: string, value: string): this;
    reference(key: string, value: string): this;
    delaySeconds(value: number): this;
    scheduledTime(value: string): this;
    taskTemplateId(value: string): this;
}
