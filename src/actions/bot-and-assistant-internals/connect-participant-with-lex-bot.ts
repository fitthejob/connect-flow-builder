import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";

export class ConnectParticipantWithLexBotActionBuilder extends BaseActionBuilder<ConnectParticipantWithLexBotActionBuilder> {
  constructor(id: string) {
    super(id, "ConnectParticipantWithLexBot");
  }

  promptId(value: string): this {
    return this.setParameter("PromptId", value);
  }

  text(value: string): this {
    return this.setParameter("Text", value);
  }

  ssml(value: string): this {
    return this.setParameter("SSML", value);
  }

  media(uri: string): this {
    return this.setParameter("Media", {
      Uri: uri,
      SourceType: "S3",
      MediaType: "Audio",
    });
  }

  lexV2BotAliasArn(value: string): this {
    return this.setParameter("LexV2Bot", { AliasArn: value });
  }

  lexBot(name: string, region: string, alias: string): this {
    return this.setParameter("LexBot", {
      Name: name,
      Region: region,
      Alias: alias,
    });
  }

  sessionAttribute(key: string, value: string): this {
    const attributes = this.getParameter<Record<string, string> | undefined>("LexSessionAttributes") ?? {};
    attributes[key] = value;
    return this.setParameter("LexSessionAttributes", attributes);
  }

  initialMessage(value: string): this {
    return this.setParameter("LexInitializationData", {
      InitialMessage: value,
    });
  }

  lexTimeoutTextSeconds(value: number | string): this {
    return this.setParameter("LexTimeoutSeconds", {
      Text: value,
    });
  }

  whenIntentEquals(intent: string, nextAction: string): this {
    this.when(equalsCondition(intent), nextAction);
    return this;
  }

  onInputTimeLimitExceeded(nextAction: string): this {
    this.onError(nextAction, "InputTimeLimitExceeded");
    return this;
  }

  onNoMatchingCondition(nextAction: string): this {
    this.onError(nextAction, "NoMatchingCondition");
    return this;
  }
}
