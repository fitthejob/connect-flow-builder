import { flow as branchingOnInputFlow } from "./branching-on-input.js";
import { flow as caseProfileOperationsFlow } from "./case-profile-operations.js";
import { flow as channelAnalyticsFlow } from "./channel-analytics.js";
import { flow as checkRoutingFlow } from "./check-routing.js";
import { flow as guidedWaitTransferFlow } from "./guided-wait-transfer.js";
import { flow as operatorControlsFlow } from "./operator-controls.js";
import { flow as outboundCallProgressFlow } from "./outbound-call-progress.js";
import { flow as taskRoutingLoopFlow } from "./task-routing-loop.js";
export const generatedExampleFlows = [
    {
        filename: "branching-on-input.json",
        flow: branchingOnInputFlow,
    },
    {
        filename: "case-profile-operations.json",
        flow: caseProfileOperationsFlow,
    },
    {
        filename: "channel-analytics.json",
        flow: channelAnalyticsFlow,
    },
    {
        filename: "check-routing.json",
        flow: checkRoutingFlow,
    },
    {
        filename: "guided-wait-transfer.json",
        flow: guidedWaitTransferFlow,
    },
    {
        filename: "operator-controls.json",
        flow: operatorControlsFlow,
    },
    {
        filename: "outbound-call-progress.json",
        flow: outboundCallProgressFlow,
    },
    {
        filename: "task-routing-loop.json",
        flow: taskRoutingLoopFlow,
    },
];
