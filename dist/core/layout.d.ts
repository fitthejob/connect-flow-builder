import type { FlowAction } from "./types.js";
export interface Position {
    x: number;
    y: number;
}
export declare const COL_SPACING = 260;
/**
 * Computes (x, y) canvas positions for every action in the flow using a
 * layered BFS layout. The result maps action ID → Position and is suitable
 * for injection into the Connect flow JSON as Metadata.ActionMetadata positions.
 *
 * Algorithm:
 *   1. BFS from startAction assigns each node a column (= depth). Merge-point
 *      nodes keep the column assigned on first visit.
 *   2. Within each column, nodes are ordered by BFS visit sequence — which
 *      naturally preserves branch declaration order (conditions before errors,
 *      earlier branches before later ones).
 *   3. y = ORIGIN_Y + row_within_column * ROW_SPACING  (simple top-down packing)
 *   4. x = ORIGIN_X + col * COL_SPACING, except the start block which is
 *      offset left by COL_SPACING to give the entry arrow clearance.
 */
export declare function computeLayout(startActionId: string, actions: readonly FlowAction[]): Map<string, Position>;
