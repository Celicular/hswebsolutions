import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount, currency, proposalId, description } = await request.json();

    // Validate inputs
    if (!amount || !proposalId) {
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

    // Validate proposal ID format
    if (!/^PROP\d{4}$/.test(proposalId)) {
      return NextResponse.json(
        { error: "Invalid proposal ID format" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(parsedAmount * 100), // Convert to smallest currency unit (paise)
      currency: currency || "INR",
      receipt: `proposal_${proposalId}_${Date.now()}`,
      description: description || `Payment for Proposal ${proposalId}`,
      notes: {
        proposal_id: proposalId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Razorpay order creation error:", error.message);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
