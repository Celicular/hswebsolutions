import { NextResponse } from "next/server";
import crypto from "crypto";
import { executeQuery } from "../../../lib/db";
import { logProposalAction } from "../../../lib/proposal-utils-server";

export async function POST(request) {
  try {
    const { orderId, paymentId, signature, proposalId, milestoneId, amount } =
      await request.json();

    // Validate all required inputs
    if (!orderId || !paymentId || !signature || !proposalId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount is positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Signature verification failed for proposal:", proposalId);
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Check if proposal exists and get its details
    const proposals = await executeQuery({
      query: `SELECT proposal_id, total_amount, milestones FROM proposals WHERE proposal_id = ?`,
      values: [proposalId],
    });

    if (proposals.length === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const proposal = proposals[0];
    
    // Parse milestones if needed
    let milestones = proposal.milestones;
    if (typeof milestones === "string") {
      milestones = JSON.parse(milestones);
    }

    // Validate amount matches proposal or milestone
    if (milestoneId) {
      // Milestone payment - validate against milestone amount
      const milestone = milestones.find((m) => m.id == milestoneId);
      if (!milestone) {
        return NextResponse.json(
          { error: "Milestone not found" },
          { status: 404 }
        );
      }
      if (Math.abs(parseFloat(milestone.amount) - parsedAmount) > 0.01) {
        // Allow for floating point precision issues
        return NextResponse.json(
          { error: "Amount mismatch with milestone" },
          { status: 400 }
        );
      }
    } else {
      // Full payment - validate against total amount
      if (Math.abs(parseFloat(proposal.total_amount) - parsedAmount) > 0.01) {
        return NextResponse.json(
          { error: "Amount mismatch with proposal total" },
          { status: 400 }
        );
      }
    }

    // Check for duplicate payment with same razorpay_payment_id
    const existingPayment = await executeQuery({
      query: `SELECT id FROM proposal_payments WHERE razorpay_payment_id = ?`,
      values: [paymentId],
    });

    if (existingPayment.length > 0) {
      console.warn("Duplicate payment attempt detected:", paymentId);
      return NextResponse.json(
        { error: "Payment already processed" },
        { status: 409 }
      );
    }

    // Record payment in database
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    await executeQuery({
      query: `
        INSERT INTO proposal_payments (
          proposal_id, milestone_id, razorpay_order_id, razorpay_payment_id, amount,
          status, payment_method, payment_date, payment_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        proposalId,
        milestoneId || null,
        orderId,
        paymentId,
        parsedAmount,
        "completed",
        "razorpay",
        timestamp,
        milestoneId ? "milestone" : "full",
      ],
    });

    // Update milestones - mark as paid
    const milestonesUpdate = await executeQuery({
      query: `SELECT milestones FROM proposals WHERE proposal_id = ?`,
      values: [proposalId],
    });

    if (milestonesUpdate.length > 0) {
      let updatedMilestones = milestonesUpdate[0].milestones;
      if (typeof updatedMilestones === "string") {
        updatedMilestones = JSON.parse(updatedMilestones);
      }

      if (milestoneId) {
        // Mark specific milestone as paid
        updatedMilestones = updatedMilestones.map((m) => {
          if (m.id == milestoneId) {
            return {
              ...m,
              isPaid: true,
              paymentDate: timestamp,
              razorpayPaymentId: paymentId,
            };
          }
          return m;
        });
      } else {
        // Full payment - mark ALL milestones as paid
        updatedMilestones = updatedMilestones.map((m) => ({
          ...m,
          isPaid: true,
          paymentDate: timestamp,
          razorpayPaymentId: paymentId,
        }));
      }

      // Save updated milestones
      await executeQuery({
        query: `UPDATE proposals SET milestones = ? WHERE proposal_id = ?`,
        values: [JSON.stringify(updatedMilestones), proposalId],
      });
    }

    // Update proposal payment status if all milestones are paid
    const totalQuery = await executeQuery({
      query: `SELECT total_amount FROM proposals WHERE proposal_id = ?`,
      values: [proposalId],
    });

    const paymentsQuery = await executeQuery({
      query: `
        SELECT SUM(amount) as total_paid
        FROM proposal_payments
        WHERE proposal_id = ? AND status = 'completed'
      `,
      values: [proposalId],
    });

    const totalAmount = totalQuery[0]?.total_amount || 0;
    const totalPaid = paymentsQuery[0]?.total_paid || 0;

    let newStatus = "partially_paid";
    if (totalPaid >= totalAmount) {
      newStatus = "fully_paid";
    }

    await executeQuery({
      query: `
        UPDATE proposals
        SET payment_status = ?
        WHERE proposal_id = ?
      `,
      values: [newStatus, proposalId],
    });

    // Log the payment action
    await logProposalAction(
      proposalId,
      `payment_received_${milestoneId || "full"}`,
      null
    );

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and recorded successfully",
        proposal_id: proposalId,
        payment_status: newStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error.message);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
