import { CreateWisdomSessionActionBuilder } from "../actions/bot-and-assistant-internals/create-wisdom-session.js";
import { UpdateContactDataActionBuilder } from "../actions/contact-data-and-participant-state/update-contact-data.js";
export function buildConnectAssistant(props) {
    const createWisdomSessionActionId = props.createWisdomSessionActionId ?? "ConnectAssistant";
    const setContactDataActionId = props.setContactDataActionId ?? "SetContactData";
    const createWisdomSession = new CreateWisdomSessionActionBuilder(createWisdomSessionActionId)
        .wisdomAssistantArn(props.wisdomAssistantArn)
        .next(setContactDataActionId)
        .onError(props.errorActionId)
        .build();
    const setContactData = new UpdateContactDataActionBuilder(setContactDataActionId)
        .wisdomSessionArn("$.Wisdom.SessionArn")
        .next(props.nextActionId)
        .onError(props.errorActionId)
        .build();
    return {
        startActionId: createWisdomSession.id,
        actions: [createWisdomSession, setContactData],
    };
}
