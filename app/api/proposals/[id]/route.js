import { NextResponse } from "next/server";
import { executeQuery } from "../../../lib/db";
import { logProposalAction } from "../../../lib/proposal-utils-server";

export async function GET(request, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;

    // Validate proposal ID format
    if (!id || !/^PROP\d{4}$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid proposal ID format" },
        { status: 400 }
      );
    }

    // Fetch proposal
    const proposals = await executeQuery({
      query: `
        SELECT * FROM proposals
        WHERE proposal_id = ?
        LIMIT 1
      `,
      values: [id],
    });

    if (proposals.length === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const proposal = proposals[0];

    // Parse JSON fields
    if (proposal.milestones && typeof proposal.milestones === "string") {
      proposal.milestones = JSON.parse(proposal.milestones);
    }

    // Update viewed timestamp if not already set
    if (!proposal.viewed_at) {
      await executeQuery({
        query: `
          UPDATE proposals
          SET viewed_at = NOW(), status = 'viewed'
          WHERE proposal_id = ?
        `,
        values: [id],
      });

      // Log the view action
      await logProposalAction(id, "viewed_by_client", null);
    }

    // Fetch payment history
    const payments = await executeQuery({
      query: `
        SELECT * FROM proposal_payments
        WHERE proposal_id = ?
        ORDER BY created_at DESC
      `,
      values: [id],
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...proposal,
          payments: payments || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;

    // Validate proposal ID format
    if (!id || !/^PROP\d{4}$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid proposal ID format" },
        { status: 400 }
      );
    }

    // Delete proposal (cascade deletes payments and audit logs due to foreign keys)
    await executeQuery({
      query: `DELETE FROM proposals WHERE proposal_id = ?`,
      values: [id],
    });

    // Log the deletion action
    await logProposalAction(id, "deleted_by_admin", null);

    return NextResponse.json(
      {
        success: true,
        message: "Proposal deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}

