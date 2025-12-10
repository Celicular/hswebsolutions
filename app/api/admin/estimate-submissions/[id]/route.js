import { NextResponse } from "next/server";
import { executeQuery } from "../../../db.js";

// Fetch a single estimate submission by ID
export async function GET(request, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json(
        { success: false, message: "Invalid submission ID" },
        { status: 400 }
      );
    }

    // Get the submission details from the view
    const submissions = await executeQuery({
      query:
        "SELECT * FROM vw_estimate_submissions_complete WHERE submission_id = ?",
      values: [id],
    });

    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Format the JSON fields properly for the response
    const submission = submissions[0];

    // Parse JSON string arrays to actual JavaScript arrays if not null
    try {
      if (submission.frontend_technologies) {
        submission.frontend_technologies = JSON.parse(
          submission.frontend_technologies
        );
      } else {
        submission.frontend_technologies = [];
      }

      if (submission.integrations) {
        submission.integrations = JSON.parse(submission.integrations);
      } else {
        submission.integrations = [];
      }

      if (submission.social_handles) {
        submission.social_handles = JSON.parse(submission.social_handles);
      } else {
        submission.social_handles = [];
      }
    } catch (jsonError) {
      console.error("Error parsing JSON fields:", jsonError);
      // Continue with empty arrays if parsing fails
      submission.frontend_technologies = [];
      submission.integrations = [];
      submission.social_handles = [];
    }

    // Convert numeric boolean values to actual booleans
    submission.mobile_first = !!submission.mobile_first;
    submission.convert_old_website = !!submission.convert_old_website;
    submission.payment_gateway_enabled = !!submission.payment_gateway_enabled;
    submission.google_ads_enabled = !!submission.google_ads_enabled;
    submission.google_ads_has_account = !!submission.google_ads_has_account;
    submission.google_ads_need_management =
      !!submission.google_ads_need_management;

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Error fetching estimate submission details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch submission details",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Update submission status
export async function PATCH(request, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;
    const data = await request.json();

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json(
        { success: false, message: "Invalid submission ID" },
        { status: 400 }
      );
    }

    // Only allow updating the status field
    if (!data.status) {
      return NextResponse.json(
        { success: false, message: "Status field is required" },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = [
      "pending",
      "in_review",
      "quoted",
      "accepted",
      "rejected",
    ];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Check if the submission exists
    const checkResult = await executeQuery({
      query: "SELECT id FROM estimate_submissions WHERE id = ?",
      values: [id],
    });

    if (checkResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Update the submission status
    await executeQuery({
      query: "UPDATE estimate_submissions SET status = ? WHERE id = ?",
      values: [data.status, id],
    });

    return NextResponse.json({
      success: true,
      message: "Submission status updated successfully",
    });
  } catch (error) {
    console.error("Error updating submission status:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update submission status",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
