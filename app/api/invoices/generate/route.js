import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { executeQuery } from "../../../lib/db";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { proposalId, invoiceType, milestoneId } = await request.json();

    // Validate inputs
    if (
      !proposalId ||
      !invoiceType ||
      !["milestone", "full"].includes(invoiceType)
    ) {
      return NextResponse.json(
        { error: "Invalid proposal ID or invoice type" },
        { status: 400 }
      );
    }

    // Fetch proposal details
    const proposals = await executeQuery({
      query: `
        SELECT proposal_id, client_name, client_email, client_phone, 
               company_name, total_amount, milestones
        FROM proposals 
        WHERE proposal_id = ?
      `,
      values: [proposalId],
    });

    if (proposals.length === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const proposal = proposals[0];
    let milestones = proposal.milestones;
    if (typeof milestones === "string") {
      milestones = JSON.parse(milestones);
    }

    // Determine invoice details based on type
    let lineItems = [];
    let amount = 0;

    if (invoiceType === "milestone") {
      if (!milestoneId) {
        return NextResponse.json(
          { error: "Milestone ID required for milestone invoice" },
          { status: 400 }
        );
      }

      const milestone = milestones.find((m) => m.id == milestoneId);
      if (!milestone) {
        return NextResponse.json(
          { error: "Milestone not found" },
          { status: 404 }
        );
      }

      if (!milestone.isPaid) {
        return NextResponse.json(
          { error: "Milestone must be paid before generating invoice" },
          { status: 400 }
        );
      }

      amount = Math.round(milestone.amount * 100); // Convert to paise
      lineItems = [
        {
          name: milestone.title || `Milestone - ${milestone.name || "Unnamed"}`,
          description: milestone.description || "Project Milestone",
          amount: amount,
          currency: "INR",
          quantity: 1,
        },
      ];
    } else {
      // Full payment invoice - only include paid milestones
      const paidMilestones = milestones.filter((m) => m.isPaid);

      if (paidMilestones.length === 0) {
        return NextResponse.json(
          { error: "No paid milestones to invoice" },
          { status: 400 }
        );
      }

      amount = paidMilestones.reduce(
        (sum, m) => sum + Math.round(m.amount * 100),
        0
      );

      lineItems = paidMilestones.map((milestone, idx) => ({
        name:
          milestone.title ||
          `Milestone ${idx + 1} - ${milestone.name || "Unnamed"}`,
        description: milestone.description || "Project Milestone",
        amount: Math.round(milestone.amount * 100),
        currency: "INR",
        quantity: 1,
      }));
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${proposalId}-${Date.now()}`;

    // Create invoice via Razorpay API
    const invoicePayload = {
      description: `Invoice for Proposal ${proposalId}`,
      line_items: lineItems,
      currency: "INR",
      partial_payment: false,
      customer: {
        name: proposal.client_name,
        email: proposal.client_email,
        contact: proposal.client_phone,
      },
      notes: {
        proposal_id: proposalId,
        invoice_type: invoiceType,
        milestone_id: milestoneId || null,
      },
    };

    // Add notification preferences
    if (proposal.client_email) {
      invoicePayload.email_notify = 1;
      invoicePayload.sms_notify = 1;
    }

    const invoiceResponse = await razorpay.invoices.create(invoicePayload);

    // Invoice created successfully - we'll display our custom invoice
    let finalInvoiceResponse = invoiceResponse;

    // Fetch existing payments for this proposal
    const paymentDetails = await executeQuery({
      query: `
        SELECT id, razorpay_payment_id, amount, status, payment_method, payment_date
        FROM proposal_payments 
        WHERE proposal_id = ? AND status = 'completed'
        ORDER BY payment_date DESC
        LIMIT 1
      `,
      values: [proposalId],
    });

    // Store invoice in database
    const invoiceId = `INV-${crypto
      .randomBytes(8)
      .toString("hex")
      .toUpperCase()}`;

    // Calculate amounts from milestones
    const paidAmount = invoiceType === "milestone" 
      ? Math.round(
          milestones.find((m) => m.id == milestoneId)?.amount * 100
        ) / 100
      : milestones
          .filter((m) => m.isPaid)
          .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

    const unpaidAmount = milestones
      .filter((m) => !m.isPaid)
      .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

    await executeQuery({
      query: `
        INSERT INTO invoices (
          invoice_id, proposal_id, invoice_type, milestone_id, 
          razorpay_invoice_id, razorpay_short_url, amount, currency, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        invoiceId,
        proposalId,
        invoiceType,
        milestoneId || null,
        finalInvoiceResponse.id,
        finalInvoiceResponse.short_url || "",
        amount / 100,
        "INR",
        finalInvoiceResponse.status,
      ],
    });

    return NextResponse.json(
      {
        success: true,
        invoice: {
          id: invoiceId,
          razorpay_invoice_id: finalInvoiceResponse.id,
          short_url: finalInvoiceResponse.short_url,
          status: finalInvoiceResponse.status,
          amount: amount / 100,
          invoiceType: invoiceType,
          proposal: {
            proposal_id: proposal.proposal_id,
            client_name: proposal.client_name,
            client_email: proposal.client_email,
            company_name: proposal.company_name,
            total_amount: proposal.total_amount,
          },
          financial: {
            amount_paid: paidAmount,
            amount_due: unpaidAmount,
            total_amount: proposal.total_amount,
          },
          payment: paymentDetails.length > 0 ? paymentDetails[0] : null,
          milestones: invoiceType === "milestone" 
            ? [milestones.find((m) => m.id == milestoneId)]
            : milestones.filter((m) => m.isPaid),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
