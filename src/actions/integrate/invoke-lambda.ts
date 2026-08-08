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

  // Custom key/value pairs to send to the Lambda alongside the default
  // contact data -- Connect nests these under LambdaInvocationAttributes,
  // not as top-level Parameters keys, and delivers them to the function as
  // event.Details.Parameters. Accumulates across multiple calls the same
  // way ConnectParticipantWithLexBotActionBuilder.sessionAttribute() builds
  // up LexSessionAttributes.
  invocationAttribute(key: string, value: string): this {
    const attributes = this.getParameter<Record<string, string> | undefined>("LambdaInvocationAttributes") ?? {};
    attributes[key] = value;
    return this.setParameter("LambdaInvocationAttributes", attributes);
  }

}
