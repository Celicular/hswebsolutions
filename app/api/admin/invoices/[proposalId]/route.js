import { NextResponse } from "next/server";
import { executeQuery } from "../../../../lib/db";

export async function GET(request, { params: paramsPromise }) {
  try {
    const { proposalId } = await paramsPromise;

    if (!proposalId) {
      return NextResponse.json(
        { error: "Proposal ID required" },
        { status: 400 }
      );
    }

    // Fetch all invoices for this proposal
    const invoices = await executeQuery({
      query: `
        SELECT id, invoice_id, invoice_type, milestone_id, 
               razorpay_invoice_id, razorpay_short_url, amount, status, generated_at
        FROM invoices
        WHERE proposal_id = ?
        ORDER BY generated_at DESC
      `,
      values: [proposalId],
    });

    return NextResponse.json(
      {
        success: true,
        data: invoices || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
