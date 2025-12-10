import { NextResponse } from "next/server";
import { executeQuery } from "../../../../lib/db";
import { logProposalAction } from "../../../../lib/proposal-utils-server";

// GET single proposal
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const proposal = await executeQuery({
      query: "SELECT * FROM proposals WHERE proposal_id = ?",
      values: [id],
    });

    if (!proposal || proposal.length === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const p = proposal[0];
    return NextResponse.json({
      ...p,
      milestones:
        typeof p.milestones === "string"
          ? JSON.parse(p.milestones)
          : p.milestones,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}

// UPDATE proposal
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "draft",
      "sent",
      "viewed",
      "accepted",
      "rejected",
      "paid",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if proposal exists
    const existing = await executeQuery({
      query: "SELECT proposal_id FROM proposals WHERE proposal_id = ?",
      values: [id],
    });

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Update proposal
    await executeQuery({
      query: "UPDATE proposals SET status = ?, updated_at = NOW() WHERE proposal_id = ?",
      values: [status, id],
    });

    // Log action
    await logProposalAction({
      proposal_id: id,
      action: `status_changed_to_${status}`,
      details: `Status updated to ${status}`,
    });

    return NextResponse.json({
      success: true,
      message: `Proposal status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}

// DELETE proposal
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if proposal exists
    const existing = await executeQuery({
      query: "SELECT proposal_id FROM proposals WHERE proposal_id = ?",
      values: [id],
    });

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Delete proposal (cascade deletes payments and audit logs due to foreign keys)
    await executeQuery({
      query: "DELETE FROM proposals WHERE proposal_id = ?",
      values: [id],
    });

    return NextResponse.json({
      success: true,
      message: "Proposal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}
