import { NextResponse } from "next/server";
import { executeQuery } from "../../../lib/db";
import {
  generateProposalId,
  logProposalAction,
} from "../../../lib/proposal-utils-server";
import {
  validateProposalData,
} from "../../../lib/proposal-utils";

// GET all proposals
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM proposals WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM proposals WHERE 1=1";
    let values = [];

    if (status) {
      query += " AND status = ?";
      countQuery += " AND status = ?";
      values.push(status);
    }

    if (search) {
      query +=
        " AND (client_name LIKE ? OR client_email LIKE ? OR proposal_id LIKE ?)";
      countQuery +=
        " AND (client_name LIKE ? OR client_email LIKE ? OR proposal_id LIKE ?)";
      const searchVal = `%${search}%`;
      values.push(searchVal, searchVal, searchVal);
    }

    // Get total count
    const countResult = await executeQuery({
      query: countQuery,
      values: values,
    });
    const total = countResult[0]?.total || 0;

    // Get paginated results
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const proposals = await executeQuery({
      query: query,
      values: [...values, limit, offset],
    });

    // Parse JSON fields
    const parsedProposals = proposals.map((p) => ({
      ...p,
      milestones:
        typeof p.milestones === "string"
          ? JSON.parse(p.milestones)
          : p.milestones,
    }));

    return NextResponse.json(
      {
        success: true,
        data: parsedProposals,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}

// POST - Create new proposal
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate data
    const validationErrors = validateProposalData(data);
    if (validationErrors) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Generate unique proposal ID
    const proposalId = await generateProposalId();

    // Prepare milestones JSON
    const milestonesJson = JSON.stringify(data.milestones || []);

    // Insert proposal
    const result = await executeQuery({
      query: `
        INSERT INTO proposals (
          proposal_id, client_name, client_phone, client_email,
          company_name, company_phone, company_email, old_website_url,
          pdf_google_drive_link, payment_policies, total_amount,
          advance_payment_count, milestone_count, milestones,
          notes, status, payment_status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        proposalId,
        data.client_name,
        data.client_phone,
        data.client_email,
        data.company_name,
        data.company_phone,
        data.company_email,
        data.old_website_url || null,
        data.pdf_google_drive_link,
        data.payment_policies,
        data.total_amount,
        data.advance_payment_count || 0,
        data.milestone_count || 0,
        milestonesJson,
        data.notes || null,
        "draft",
        "pending",
        data.created_by || null,
      ],
    });

    // Log action
    await logProposalAction(proposalId, "created", data.created_by);

    return NextResponse.json(
      {
        success: true,
        message: "Proposal created successfully",
        proposal_id: proposalId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
