export interface FlowResourceReferences {
  agentAssistLambdaArn: string;
  lexBotAliasArn: string;
  queueArn: string;
}

export const flowTemplatePlaceholders: FlowResourceReferences = {
  agentAssistLambdaArn: "__AGENT_ASSIST_LAMBDA_ARN__",
  lexBotAliasArn: "__LEX_BOT_ALIAS_ARN__",
  queueArn: "__QUEUE_ARN__",
};
