"use server";

import { executeQuery } from "./db";
import { logProposalAction as logAction } from "./proposal-utils";

/**
 * Generate a unique 8-digit proposal ID (PROP0001 format)
 */
export async function generateProposalId() {
  try {
    const result = await executeQuery({
      query: `SELECT MAX(CAST(SUBSTRING(proposal_id, 5) AS UNSIGNED)) as max_id FROM proposals`,
      values: [],
    });

    const maxId = result[0]?.max_id || 0;
    const newId = String(maxId + 1).padStart(4, "0");
    return `PROP${newId}`;
  } catch (error) {
    console.error("Error generating proposal ID:", error);
    throw new Error("Failed to generate proposal ID");
  }
}

/**
 * Log proposal action to audit log
 */
export async function logProposalAction(proposalId, action, userId) {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    await executeQuery({
      query: `
        INSERT INTO proposal_audit_log (proposal_id, action, user_id, timestamp)
        VALUES (?, ?, ?, ?)
      `,
      values: [proposalId, action, userId || null, timestamp],
    });
  } catch (error) {
    console.error("Error logging proposal action:", error);
    // Don't throw - logging errors shouldn't break the main operation
  }
}
