import { equalsCondition } from "../../core/conditions.js";
import { BaseActionBuilder } from "../common.js";
export class AuthenticateParticipantActionBuilder extends BaseActionBuilder {
    constructor(id) {
        super(id, "AuthenticateParticipant");
        this.setParameter("CognitoConfiguration", {});
        this.setParameter("CustomerProfilesConfiguration", {
            ObjectTypeName: "Cognito-attributes",
        });
    }
    userPoolArn(value) {
        const configuration = this.getParameter("CognitoConfiguration");
        configuration.UserPoolArn = value;
        return this;
    }
    appClientId(value) {
        const configuration = this.getParameter("CognitoConfiguration");
        configuration.AppClientId = value;
        return this;
    }
    cognitoConfiguration(value) {
        return this.setParameter("CognitoConfiguration", value);
    }
    customerProfilesObjectTypeName(value) {
        return this.setParameter("CustomerProfilesConfiguration", {
            ObjectTypeName: value,
        });
    }
    timeLimitMinutes(value) {
        return this.setParameter("TimeLimitMinutes", String(value));
    }
    whenOptedOut(nextAction) {
        this.when(equalsCondition("OptedOut"), nextAction);
        return this;
    }
    onTimeLimitExceeded(nextAction) {
        this.onError(nextAction, "TimeLimitExceeded");
        return this;
    }
}
