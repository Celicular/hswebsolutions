import { NextResponse } from "next/server";
import { executeQuery } from "../db";
const sendDiscordDM = require("../../utils/sendDiscordDM");

export async function POST(request) {
  let transaction = false;

  try {
    // Parse the request body with error handling
    let formData;
    try {
      formData = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ["name", "email"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Log received data for debugging
    console.log("Estimate form submission received:", {
      name: formData.name,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      oldWebsite: formData.oldWebsite,
      socialHandles: formData.socialHandles,
    });

    // Start a database transaction with retry logic
    try {
      await executeQuery({ query: "START TRANSACTION" });
      transaction = true;
    } catch (error) {
      console.error("Error starting transaction:", error);
      if (error.code === "ETIMEDOUT") {
        return NextResponse.json(
          { error: "Database connection timeout. Please try again." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }

    try {
      // 1. Insert main submission data
      const insertSubmissionResult = await executeQuery({
        query: `
          INSERT INTO estimate_submissions (
            name, business_name, email, phone, old_website,
            website_design_approach, page_count, mobile_first, 
            website_description, convert_old_website,
            backend, database_type, delivery_timeframe,
            budget, timeline, additional_info
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          formData.name,
          formData.businessName || null,
          formData.email,
          formData.phone,
          formData.oldWebsite || null,
          formData.websiteDesignApproach,
          formData.pageCount,
          formData.mobileFirst ? 1 : 0,
          formData.websiteDescription,
          formData.convertOldWebsite ? 1 : 0,
          formData.backend,
          formData.database,
          formData.deliveryTimeframe,
          formData.budget,
          formData.timeline,
          formData.additionalInfo || null,
        ],
      });

      const submissionId = insertSubmissionResult.insertId;

      // 2. Insert social handles with batch insert
      if (formData.socialHandles && Array.isArray(formData.socialHandles)) {
        const validHandles = formData.socialHandles.filter(
          (handle) => handle && handle.platform && handle.handle
        );

        if (validHandles.length > 0) {
          const socialHandleValues = validHandles.map((handle) => [
            submissionId,
            handle.platform,
            handle.handle,
          ]);

          await executeQuery({
            query:
              "INSERT INTO social_handles (estimate_id, platform, handle) VALUES ?",
            values: [socialHandleValues],
          });
        }
      }

      // 3. Insert frontend technologies with validation and better error handling
      if (formData.frontendStack && Array.isArray(formData.frontendStack)) {
        console.log(
          "Processing frontend technologies:",
          formData.frontendStack
        );

        // First, get all technologies in one query
        const allTechnologies = await executeQuery({
          query:
            "SELECT id, tech_name FROM frontend_technologies WHERE tech_name IN (?)",
          values: [formData.frontendStack.filter((t) => t)],
        });
        console.log("Found technologies:", allTechnologies);

        // Create a map for quick lookup
        const techMap = new Map(
          allTechnologies.map((tech) => [tech.tech_name.toLowerCase(), tech.id])
        );

        // Prepare all inserts
        const validTechs = formData.frontendStack
          .filter((tech) => tech && techMap.has(tech.toLowerCase()))
          .map((tech) => [submissionId, techMap.get(tech.toLowerCase())]);

        if (validTechs.length > 0) {
          console.log("Inserting technology relations:", validTechs);

          // Insert all relationships in one query
          await executeQuery({
            query:
              "INSERT INTO submission_frontend (submission_id, tech_id) VALUES ?",
            values: [validTechs],
          });

          console.log(
            "Successfully inserted all frontend technology relations"
          );
        } else {
          console.log("No valid technologies found to insert");
        }
      }

      // 4. Insert integrations with batch insert
      if (formData.integrations && Array.isArray(formData.integrations)) {
        const validIntegrations = formData.integrations.filter(
          (integration) => integration
        );

        if (validIntegrations.length > 0) {
          // Get all integration IDs in a single query
          const integrationResults = await executeQuery({
            query:
              "SELECT id, integration_name FROM integrations WHERE integration_name IN (?)",
            values: [validIntegrations],
          });

          // Create a map for quick lookup
          const integrationMap = new Map(
            integrationResults.map((integ) => [
              integ.integration_name.toLowerCase(),
              integ.id,
            ])
          );

          // Prepare batch insert values
          const integrationValues = validIntegrations
            .filter((integration) =>
              integrationMap.has(integration.toLowerCase())
            )
            .map((integration) => [
              submissionId,
              integrationMap.get(integration.toLowerCase()),
            ]);

          if (integrationValues.length > 0) {
            await executeQuery({
              query:
                "INSERT INTO submission_integrations (submission_id, integration_id) VALUES ?",
              values: [integrationValues],
            });
          }
        }
      }

      // 5. Insert payment gateway options with validation
      if (
        formData.paymentGateway &&
        typeof formData.paymentGateway === "object"
      ) {
        await executeQuery({
          query:
            "INSERT INTO payment_gateway_options (estimate_id, enabled, gateway) VALUES (?, ?, ?)",
          values: [
            submissionId,
            formData.paymentGateway.enabled ? 1 : 0,
            formData.paymentGateway.enabled && formData.paymentGateway.gateway
              ? formData.paymentGateway.gateway
              : null,
          ],
        });
      }

      // 6. Insert Google Ads information with validation
      if (formData.googleAds && typeof formData.googleAds === "object") {
        await executeQuery({
          query: `
            INSERT INTO google_ads_info (
              estimate_id, run_ads, budget, keywords, campaign_type,
              location_targeting, has_account, need_management
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          values: [
            submissionId,
            formData.googleAds.runAds ? 1 : 0,
            formData.googleAds.budget || null,
            formData.googleAds.keywords || null,
            formData.googleAds.campaignType || null,
            formData.googleAds.locationTargeting || null,
            formData.googleAds.hasAccount ? 1 : 0,
            formData.googleAds.needManagement ? 1 : 0,
          ],
        });
      }

      // Commit the transaction
      if (transaction) {
        try {
          await executeQuery({ query: "COMMIT" });
        } catch (commitError) {
          throw commitError;
        }
      }

      // Send Discord DM in the background (don't wait for it)
      sendDiscordDM(
        `New estimate from ${formData.name} (${formData.email})!\nCheck: ${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/admin/`
      )
        .then(() => {
          console.log("DM sent successfully!");
        })
        .catch((err) => {
          console.error("Failed to send DM:", err);
        });

      console.log(
        `Successfully stored estimate submission with ID: ${submissionId}`
      );

      return NextResponse.json({
        success: true,
        message: "Estimate request received successfully",
        submissionId: submissionId,
      });
    } catch (dbError) {
      // Rollback in case of any error
      if (transaction) {
        try {
          await executeQuery({ query: "ROLLBACK" });
        } catch (rollbackError) {
          console.error("Error rolling back transaction:", rollbackError);
        }
      }

      console.error("Database error:", dbError);

      // Handle specific database errors
      if (dbError.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          { error: "This submission already exists." },
          { status: 409 }
        );
      } else if (dbError.code === "ER_NO_REFERENCED_ROW") {
        return NextResponse.json(
          { error: "Invalid reference data in submission." },
          { status: 400 }
        );
      }

      throw dbError;
    }
  } catch (error) {
    console.error("Error processing estimate form submission:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });

    // Return appropriate error message based on environment
    return NextResponse.json(
      {
        success: false,
        message: "There was an error processing your request",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
