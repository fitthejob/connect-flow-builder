import { equalsCondition } from "../../core/conditions.js";
import type {
  AuthenticateParticipantCognitoConfiguration,
  AuthenticateParticipantCustomerProfilesConfiguration,
} from "../../core/types.js";
import { BaseActionBuilder } from "../common.js";

export class AuthenticateParticipantActionBuilder extends BaseActionBuilder<AuthenticateParticipantActionBuilder> {
  constructor(id: string) {
    super(id, "AuthenticateParticipant");
    this.setParameter("CognitoConfiguration", {});
    this.setParameter("CustomerProfilesConfiguration", {
      ObjectTypeName: "Cognito-attributes",
    } satisfies AuthenticateParticipantCustomerProfilesConfiguration);
  }

  userPoolArn(value: string): this {
    const configuration =
      this.getParameter<Record<string, unknown>>("CognitoConfiguration");
    configuration.UserPoolArn = value;
    return this;
  }

  appClientId(value: string): this {
    const configuration =
      this.getParameter<Record<string, unknown>>("CognitoConfiguration");
    configuration.AppClientId = value;
    return this;
  }

  cognitoConfiguration(
    value: AuthenticateParticipantCognitoConfiguration,
  ): this {
    return this.setParameter("CognitoConfiguration", value);
  }

  customerProfilesObjectTypeName(value: string): this {
    return this.setParameter("CustomerProfilesConfiguration", {
      ObjectTypeName: value,
    } satisfies AuthenticateParticipantCustomerProfilesConfiguration);
  }

  timeLimitMinutes(value: number): this {
    return this.setParameter("TimeLimitMinutes", String(value));
  }

  whenOptedOut(nextAction: string): this {
    this.when(equalsCondition("OptedOut"), nextAction);
    return this;
  }

  onTimeLimitExceeded(nextAction: string): this {
    this.onError(nextAction, "TimeLimitExceeded");
    return this;
  }
}
