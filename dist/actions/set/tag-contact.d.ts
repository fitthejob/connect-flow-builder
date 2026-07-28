import { BaseActionBuilder } from "../common.js";
export declare class TagContactActionBuilder extends BaseActionBuilder<TagContactActionBuilder> {
    constructor(id: string);
    tag(key: string, value: string): this;
}
