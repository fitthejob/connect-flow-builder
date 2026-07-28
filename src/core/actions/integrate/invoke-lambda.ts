import { defineActionDefinition } from "../../action-definition.js";

export const invokeLambdaFunctionDefinition = defineActionDefinition({
  type: "InvokeLambdaFunction",
  requiredParameters: ["LambdaFunctionARN"],
  supportsNextAction: true,
  supportsConditions: false,
  supportsErrors: true,
  category: "integrate",
});
