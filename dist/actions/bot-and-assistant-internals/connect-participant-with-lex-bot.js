import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export class ConnectParticipantWithLexBotActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "ConnectParticipantWithLexBot");
    }
    promptId(value) {
        return this.setParameter("PromptId", value);
    }
    text(value) {
        return this.setParameter("Text", value);
    }
    ssml(value) {
        return this.setParameter("SSML", value);
    }
    media(uri) {
        return this.setParameter("Media", {
            Uri: uri,
            SourceType: "S3",
            MediaType: "Audio",
        });
    }
    lexV2BotAliasArn(value) {
        return this.setParameter("LexV2Bot", { AliasArn: value });
    }
    lexBot(name, region, alias) {
        return this.setParameter("LexBot", {
            Name: name,
            Region: region,
            Alias: alias,
        });
    }
    sessionAttribute(key, value) {
        const attributes = this.getParameter("LexSessionAttributes") ?? {};
        attributes[key] = value;
        return this.setParameter("LexSessionAttributes", attributes);
    }
    initialMessage(value) {
        return this.setParameter("LexInitializationData", {
            InitialMessage: value,
        });
    }
    lexTimeoutTextSeconds(value) {
        return this.setParameter("LexTimeoutSeconds", {
            Text: value,
        });
    }
    whenIntentEquals(intent, nextAction) {
        this.when(equalsCondition(intent), nextAction);
        return this;
    }
    onInputTimeLimitExceeded(nextAction) {
        this.onError(nextAction, "InputTimeLimitExceeded");
        return this;
    }
    onNoMatchingCondition(nextAction) {
        this.onError(nextAction, "NoMatchingCondition");
        return this;
    }
}
