import type { FlowAction, FlowActionType } from "./types.js";

export interface Position {
  x: number;
  y: number;
}

export const COL_SPACING = 260;
const ROW_SPACING = 200;
const ORIGIN_X = 20;
const ORIGIN_Y = 20;

// All blocks are shifted right by one column so the start block lands at
// ORIGIN_X and the entry-point arrow has clearance to its left.
const CANVAS_X_SHIFT = COL_SPACING;

// Block types that render taller in the Connect designer need extra vertical
// clearance below them so the next sibling in the same column doesn't overlap.
// The multiplier scales ROW_SPACING for the gap below that block only.
//   Tall (3×): multi-condition Lex bot blocks
//   Mid  (2×): DTMF input, compare branches, multi-field profile lookups
const BLOCK_HEIGHT_MULTIPLIERS: Partial<Record<FlowActionType, number>> = {
  ConnectParticipantWithLexBot: 3,
  GetParticipantInput: 2,
  Compare: 2,
  GetCustomerProfile: 2,
  ShowView: 2,
};

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
export function computeLayout(
  startActionId: string,
  actions: readonly FlowAction[],
): Map<string, Position> {
  const actionMap = new Map(actions.map((a) => [a.id, a]));

  // BFS — assign columns and record visit order within each column.
  const column = new Map<string, number>();
  const visitOrder = new Map<string, number>(); // global BFS sequence
  const queue: string[] = [startActionId];
  column.set(startActionId, 0);
  let seq = 0;
  visitOrder.set(startActionId, seq++);

  while (queue.length > 0) {
    const id = queue.shift()!;
    const action = actionMap.get(id);
    if (!action?.transitions) continue;
    const nextCol = (column.get(id) ?? 0) + 1;
    for (const neighborId of collectNeighbors(action)) {
      if (!column.has(neighborId)) {
        column.set(neighborId, nextCol);
        visitOrder.set(neighborId, seq++);
        queue.push(neighborId);
      }
    }
  }

  // Any unreachable nodes go into a final column.
  const maxCol = column.size > 0 ? Math.max(...column.values()) : 0;
  for (const action of actions) {
    if (!column.has(action.id)) {
      column.set(action.id, maxCol + 1);
      visitOrder.set(action.id, seq++);
    }
  }

  // Group by column, sorted by BFS visit order within each column.
  const byColumn = new Map<number, string[]>();
  for (const [id, col] of column) {
    if (!byColumn.has(col)) byColumn.set(col, []);
    byColumn.get(col)!.push(id);
  }
  for (const ids of byColumn.values()) {
    ids.sort((a, b) => (visitOrder.get(a) ?? 0) - (visitOrder.get(b) ?? 0));
  }

  // Assign positions. The entire canvas is shifted right by CANVAS_X_SHIFT so
  // the start block (col 0) lands at ORIGIN_X with the entry arrow to its left.
  // y is accumulated rather than computed from row index so tall block types
  // contribute more vertical space below them before the next sibling.
  const positions = new Map<string, Position>();
  for (const [col, ids] of byColumn) {
    let y = ORIGIN_Y;
    for (const id of ids) {
      positions.set(id, {
        x: ORIGIN_X + col * COL_SPACING + CANVAS_X_SHIFT,
        y,
      });
      const action = actionMap.get(id);
      const multiplier = action ? (BLOCK_HEIGHT_MULTIPLIERS[action.type] ?? 1) : 1;
      y += ROW_SPACING * multiplier;
    }
  }

  return positions;
}

function collectNeighbors(action: FlowAction): string[] {
  const t = action.transitions;
  if (!t) return [];
  const neighbors: string[] = [];
  if (t.nextAction) neighbors.push(t.nextAction);
  for (const c of t.conditions ?? []) neighbors.push(c.nextAction);
  for (const e of t.errors ?? []) neighbors.push(e.nextAction);
  return [...new Set(neighbors)];
}
