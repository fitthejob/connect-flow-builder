import { BaseActionBuilder } from "../common.js";
export declare class InvokeLambdaFunctionActionBuilder extends BaseActionBuilder<InvokeLambdaFunctionActionBuilder> {
    constructor(id: string);
    lambdaArn(value: string): this;
    timeLimitSeconds(value: number): this;
}
