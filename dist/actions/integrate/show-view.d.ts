import { BaseActionBuilder } from "../common.js";
export declare class ShowViewActionBuilder extends BaseActionBuilder<ShowViewActionBuilder> {
    constructor(id: string);
    viewResource(id: string, version: string): this;
    invocationTimeLimitSeconds(value: number): this;
    viewData(name: string, value: string): this;
    hideResponseOnTranscript(): this;
}
