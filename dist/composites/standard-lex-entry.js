import { GetParticipantInputActionBuilder } from "../actions/interact/get-participant-input.js";
import { MessageParticipantActionBuilder } from "../actions/interact/message-participant.js";
export function buildStandardLexEntry(props) {
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
