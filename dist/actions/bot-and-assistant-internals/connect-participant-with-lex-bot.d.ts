import { BaseActionBuilder } from "../common.js";
export declare class ConnectParticipantWithLexBotActionBuilder extends BaseActionBuilder<ConnectParticipantWithLexBotActionBuilder> {
    constructor(id: string);
    promptId(value: string): this;
    text(value: string): this;
    ssml(value: string): this;
    media(uri: string): this;
    lexV2BotAliasArn(value: string): this;
    lexBot(name: string, region: string, alias: string): this;
    sessionAttribute(key: string, value: string): this;
    initialMessage(value: string): this;
    lexTimeoutTextSeconds(value: number | string): this;
    whenIntentEquals(intent: string, nextAction: string): this;
    onInputTimeLimitExceeded(nextAction: string): this;
    onNoMatchingCondition(nextAction: string): this;
}
