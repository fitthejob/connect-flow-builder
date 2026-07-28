import { BaseActionBuilder } from "../common.js";

export class InvokeLambdaFunctionActionBuilder extends BaseActionBuilder<InvokeLambdaFunctionActionBuilder> {
  constructor(id: string) {
    super(id, "InvokeLambdaFunction");
    this.setParameter("InvocationTimeLimitSeconds", "8");
  }

  lambdaArn(value: string): this {
    return this.setParameter("LambdaFunctionARN", value);
  }

  timeLimitSeconds(value: number): this {
    return this.setParameter("InvocationTimeLimitSeconds", String(value));
  }

}
