import { GetParticipantInputActionBuilder } from "../actions/interact/get-participant-input.js";
import { MessageParticipantActionBuilder } from "../actions/interact/message-participant.js";
import type { FlowSegment } from "../core/types.js";

export interface StandardLexEntryProps {
  greetingText: string;
  lexPromptText: string;
  lexBotAliasArn: string;
  nextActionId: string;
  transferActionId: string;
  greetingActionId?: string;
  inputActionId?: string;
}

export function buildStandardLexEntry(props: StandardLexEntryProps): FlowSegment {
  const greetingActionId = props.greetingActionId ?? "PlayGreeting";
  const inputActionId = props.inputActionId ?? "GetCustomerInput";

  const playGreeting = new MessageParticipantActionBuilder(greetingActionId)
    .text(props.greetingText)
    .next(inputActionId)
    .onError(props.transferActionId)
    .build();

  const getCustomerInput = new GetParticipantInputActionBuilder(inputActionId)
    .text(props.lexPromptText)
    .lexBotAliasArn(props.lexBotAliasArn)
    .next(props.nextActionId)
    .onError(props.transferActionId)
    .build();

  return {
    startActionId: playGreeting.id,
    actions: [playGreeting, getCustomerInput],
  };
}
