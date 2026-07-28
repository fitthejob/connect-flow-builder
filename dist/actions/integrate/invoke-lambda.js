import { BaseActionBuilder } from "../common.js";
export class InvokeLambdaFunctionActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "InvokeLambdaFunction");
        this.setParameter("InvocationTimeLimitSeconds", "8");
    }
    lambdaArn(value) {
        return this.setParameter("LambdaFunctionARN", value);
    }
    timeLimitSeconds(value) {
        return this.setParameter("InvocationTimeLimitSeconds", String(value));
    }
}
