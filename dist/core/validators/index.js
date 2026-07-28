import { SUPPORTED_CONDITION_OPERATORS } from "../conditions.js";
import { getActionDefinition } from "../registry.js";
import { validateUpdateContactMediaProcessingAction, validateUpdateContactMediaStreamingBehaviorAction, validateUpdateContactRecordingAndAnalyticsBehaviorAction, validateUpdateFlowLoggingBehaviorAction, } from "./analyze.js";
import { validateConnectParticipantWithLexBotAction, validateCreateWisdomSessionAction, } from "./bot-and-assistant-internals.js";
import { validateCheckHoursOfOperationAction, validateCheckMetricDataAction, validateCheckOutboundCallStatusAction, validateCheckVoiceIdAction, validateCompareAction, validateGetMetricDataAction, } from "./check.js";
import { validateUpdateContactDataAction, validateUpdatePreviousContactParticipantStateAction, } from "./contact-data-and-participant-state.js";
import { validateUpdateFlowAttributesAction, } from "./flow-state-and-execution-internals.js";
import { validateCreateCaseAction, validateCreateCustomerProfileAction, validateEvaluateDataTableValuesAction, validateGetCalculatedAttributesForCustomerProfileAction, validateGetCaseAction, validateGetCustomerProfileAction, validateGetCustomerProfileObjectAction, validateInvokeFlowModuleAction, validateListDataTableValuesAction, validateShowViewAction, validateUpdateCaseAction, validateUpdateCustomerProfileAction, validateUpsertDataTableValuesAction, } from "./integrate.js";
import { validateAuthenticateParticipantAction, validateCreatePersistentContactAssociationAction, validateCreateTaskAction, validateGetParticipantInputAction, validateLoadContactContentAction, } from "./interact.js";
import { validateDistributeByPercentageAction, validateLoopAction, validateWaitAction, } from "./logic.js";
import { validateCompleteOutboundCallAction, validateCreateCallbackContactAction, validateStartOutboundChatContactAction, } from "./outbound-and-callback-operations.js";
import { validateMessageParticipantIterativelyAction, } from "./queue-and-hold-messaging.js";
import { validateAssociateContactToCustomerProfileAction, validateDequeueContactAndTransferToQueueAction, validateTransferContactToAgentAction, } from "./routing-and-transfer-internals.js";
import { validateResumeContactAction, validateStartVoiceIdStreamAction, validateTagContactAction, validateUnTagContactAction, validateUpdateContactCallbackNumberAction, validateUpdateContactEventHooksAction, validateUpdateContactRoutingBehaviorAction, validateUpdateContactTargetQueueAction, validateUpdateContactTextToSpeechVoiceAction, validateUpdateRoutingCriteriaAction, } from "./set.js";
import { validateEndFlowExecutionAction, validateEndFlowModuleExecutionAction, validateTransferContactToQueueAction, validateTransferParticipantToThirdPartyAction, validateTransferToFlowAction, } from "./terminate.js";
export function validateFlowDefinition(flow) {
    const actionIds = new Set(flow.actions.map((action) => action.id));
    if (!flow.startAction) {
        throw new Error("Flow definition must include a start action.");
    }
    if (!actionIds.has(flow.startAction)) {
        throw new Error(`Start action "${flow.startAction}" does not exist in the flow.`);
    }
    validateDuplicateIds(flow.actions);
    validateTransitions(flow.actions, actionIds);
    validateActionParameters(flow.actions);
}
function validateDuplicateIds(actions) {
    const seen = new Set();
    for (const action of actions) {
        if (seen.has(action.id)) {
            throw new Error(`Duplicate action id "${action.id}" detected.`);
        }
        seen.add(action.id);
    }
}
function validateTransitions(actions, actionIds) {
    for (const action of actions) {
        if (action.transitions?.nextAction && !actionIds.has(action.transitions.nextAction)) {
            throw new Error(`Action "${action.id}" references missing next action "${action.transitions.nextAction}".`);
        }
        for (const error of action.transitions?.errors ?? []) {
            if (!actionIds.has(error.nextAction)) {
                throw new Error(`Action "${action.id}" references missing error action "${error.nextAction}".`);
            }
        }
        for (const condition of action.transitions?.conditions ?? []) {
            if (!actionIds.has(condition.nextAction)) {
                throw new Error(`Action "${action.id}" references missing conditional action "${condition.nextAction}".`);
            }
            validateConditionExpression(action.id, condition.condition.operator, condition.condition.operands);
        }
    }
}
function validateActionParameters(actions) {
    for (const action of actions) {
        const definition = getActionDefinition(action.type);
        for (const parameter of definition.requiredParameters) {
            requireParameter(action, parameter);
        }
        validateActionSpecificConstraints(action);
    }
}
function requireParameter(action, key) {
    if (!(key in action.parameters)) {
        throw new Error(`Action "${action.id}" of type "${action.type}" requires parameter "${key}".`);
    }
}
function validateConditionExpression(actionId, operator, operands) {
    if (!SUPPORTED_CONDITION_OPERATORS.includes(operator)) {
        throw new Error(`Action "${actionId}" uses unsupported condition operator "${operator}".`);
    }
    if (operands.length !== 1) {
        throw new Error(`Action "${actionId}" condition operator "${operator}" requires exactly one operand.`);
    }
}
function validateActionSpecificConstraints(action) {
    switch (action.type) {
        case "AuthenticateParticipant":
            validateAuthenticateParticipantAction(action);
            break;
        case "AssociateContactToCustomerProfile":
            validateAssociateContactToCustomerProfileAction(action);
            break;
        case "CheckOutboundCallStatus":
            validateCheckOutboundCallStatusAction(action);
            break;
        case "CheckVoiceId":
            validateCheckVoiceIdAction(action);
            break;
        case "ConnectParticipantWithLexBot":
            validateConnectParticipantWithLexBotAction(action);
            break;
        case "CompleteOutboundCall":
            validateCompleteOutboundCallAction(action);
            break;
        case "CreateCase":
            validateCreateCaseAction(action);
            break;
        case "CreateCallbackContact":
            validateCreateCallbackContactAction(action);
            break;
        case "CreatePersistentContactAssociation":
            validateCreatePersistentContactAssociationAction(action);
            break;
        case "CreateCustomerProfile":
            validateCreateCustomerProfileAction(action);
            break;
        case "CreateTask":
            validateCreateTaskAction(action);
            break;
        case "CreateWisdomSession":
            validateCreateWisdomSessionAction(action);
            break;
        case "Compare":
            validateCompareAction(action);
            break;
        case "CheckHoursOfOperation":
            validateCheckHoursOfOperationAction(action);
            break;
        case "CheckMetricData":
            validateCheckMetricDataAction(action);
            break;
        case "DistributeByPercentage":
            validateDistributeByPercentageAction(action);
            break;
        case "DequeueContactAndTransferToQueue":
            validateDequeueContactAndTransferToQueueAction(action);
            break;
        case "EndFlowExecution":
            validateEndFlowExecutionAction(action);
            break;
        case "EndFlowModuleExecution":
            validateEndFlowModuleExecutionAction(action);
            break;
        case "EvaluateDataTableValues":
            validateEvaluateDataTableValuesAction(action);
            break;
        case "GetCase":
            validateGetCaseAction(action);
            break;
        case "GetCalculatedAttributesForCustomerProfile":
            validateGetCalculatedAttributesForCustomerProfileAction(action);
            break;
        case "GetParticipantInput":
            validateGetParticipantInputAction(action);
            break;
        case "LoadContactContent":
            validateLoadContactContentAction(action);
            break;
        case "GetCustomerProfile":
            validateGetCustomerProfileAction(action);
            break;
        case "GetCustomerProfileObject":
            validateGetCustomerProfileObjectAction(action);
            break;
        case "ListDataTableValues":
            validateListDataTableValuesAction(action);
            break;
        case "GetMetricData":
            validateGetMetricDataAction(action);
            break;
        case "InvokeFlowModule":
            validateInvokeFlowModuleAction(action);
            break;
        case "Loop":
            validateLoopAction(action);
            break;
        case "MessageParticipantIteratively":
            validateMessageParticipantIterativelyAction(action);
            break;
        case "ResumeContact":
            validateResumeContactAction(action);
            break;
        case "ShowView":
            validateShowViewAction(action);
            break;
        case "StartOutboundChatContact":
            validateStartOutboundChatContactAction(action);
            break;
        case "StartVoiceIdStream":
            validateStartVoiceIdStreamAction(action);
            break;
        case "TagContact":
            validateTagContactAction(action);
            break;
        case "TransferContactToAgent":
            validateTransferContactToAgentAction(action);
            break;
        case "TransferContactToQueue":
            validateTransferContactToQueueAction(action);
            break;
        case "TransferParticipantToThirdParty":
            validateTransferParticipantToThirdPartyAction(action);
            break;
        case "TransferToFlow":
            validateTransferToFlowAction(action);
            break;
        case "UnTagContact":
            validateUnTagContactAction(action);
            break;
        case "UpsertDataTableValues":
            validateUpsertDataTableValuesAction(action);
            break;
        case "UpdateContactCallbackNumber":
            validateUpdateContactCallbackNumberAction(action);
            break;
        case "UpdateContactData":
            validateUpdateContactDataAction(action);
            break;
        case "UpdateContactEventHooks":
            validateUpdateContactEventHooksAction(action);
            break;
        case "UpdateContactMediaProcessing":
            validateUpdateContactMediaProcessingAction(action);
            break;
        case "UpdateContactMediaStreamingBehavior":
            validateUpdateContactMediaStreamingBehaviorAction(action);
            break;
        case "UpdatePreviousContactParticipantState":
            validateUpdatePreviousContactParticipantStateAction(action);
            break;
        case "UpdateContactRecordingAndAnalyticsBehavior":
            validateUpdateContactRecordingAndAnalyticsBehaviorAction(action);
            break;
        case "UpdateContactRoutingBehavior":
            validateUpdateContactRoutingBehaviorAction(action);
            break;
        case "UpdateContactTargetQueue":
            validateUpdateContactTargetQueueAction(action);
            break;
        case "UpdateContactTextToSpeechVoice":
            validateUpdateContactTextToSpeechVoiceAction(action);
            break;
        case "UpdateCase":
            validateUpdateCaseAction(action);
            break;
        case "UpdateFlowAttributes":
            validateUpdateFlowAttributesAction(action);
            break;
        case "UpdateFlowLoggingBehavior":
            validateUpdateFlowLoggingBehaviorAction(action);
            break;
        case "UpdateRoutingCriteria":
            validateUpdateRoutingCriteriaAction(action);
            break;
        case "UpdateCustomerProfile":
            validateUpdateCustomerProfileAction(action);
            break;
        case "Wait":
            validateWaitAction(action);
            break;
        default:
            break;
    }
}
