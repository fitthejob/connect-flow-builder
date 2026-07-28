import type { AuthenticateParticipantCognitoConfiguration } from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";
export declare class AuthenticateParticipantActionBuilder extends BaseActionBuilder<AuthenticateParticipantActionBuilder> {
    constructor(id: string);
    userPoolArn(value: string): this;
    appClientId(value: string): this;
    cognitoConfiguration(value: AuthenticateParticipantCognitoConfiguration): this;
    customerProfilesObjectTypeName(value: string): this;
    timeLimitMinutes(value: number): this;
    whenOptedOut(nextAction: string): this;
    onTimeLimitExceeded(nextAction: string): this;
}
