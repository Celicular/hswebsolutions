import { NextResponse } from 'next/server';
import { executeQuery } from '../db';

export async function POST(request) {
  try {
    // Parse the request body
    const formData = await request.json();
    
    // Log received data for debugging
    console.log('Estimate form submission received:');
    console.log('Basic Info:', {
      name: formData.name,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      oldWebsite: formData.oldWebsite,
      socialHandles: formData.socialHandles
    });
    
    // Start a database transaction
    const conn = await executeQuery({ query: 'START TRANSACTION' });
    
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
          formData.additionalInfo || null
        ]
      });
      
      const submissionId = insertSubmissionResult.insertId;
      
      // 2. Insert social handles
      if (formData.socialHandles && formData.socialHandles.length > 0) {
        for (const handle of formData.socialHandles) {
          if (handle.platform && handle.handle) {
            await executeQuery({
              query: 'INSERT INTO social_handles (estimate_id, platform, handle) VALUES (?, ?, ?)',
              values: [submissionId, handle.platform, handle.handle]
            });
          }
        }
      }
      
      // 3. Insert frontend technologies
      if (formData.frontendStack && formData.frontendStack.length > 0) {
        for (const tech of formData.frontendStack) {
          // Get tech ID from name
          const techResult = await executeQuery({
            query: 'SELECT id FROM frontend_technologies WHERE tech_name = ?',
            values: [tech]
          });
          
          if (techResult.length > 0) {
            await executeQuery({
              query: 'INSERT INTO submission_frontend (submission_id, tech_id) VALUES (?, ?)',
              values: [submissionId, techResult[0].id]
            });
          }
        }
      }
      
      // 4. Insert integrations
      if (formData.integrations && formData.integrations.length > 0) {
        for (const integration of formData.integrations) {
          // Get integration ID from name
          const integrationResult = await executeQuery({
            query: 'SELECT id FROM integrations WHERE integration_name = ?',
            values: [integration]
          });
          
          if (integrationResult.length > 0) {
            await executeQuery({
              query: 'INSERT INTO submission_integrations (submission_id, integration_id) VALUES (?, ?)',
              values: [submissionId, integrationResult[0].id]
            });
          }
        }
      }
      
      // 5. Insert payment gateway options
      if (formData.paymentGateway) {
        await executeQuery({
          query: 'INSERT INTO payment_gateway_options (estimate_id, enabled, gateway) VALUES (?, ?, ?)',
          values: [
            submissionId, 
            formData.paymentGateway.enabled ? 1 : 0,
            formData.paymentGateway.enabled ? formData.paymentGateway.gateway : null
          ]
        });
      }
      
      // 6. Insert Google Ads information
      if (formData.googleAds) {
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
            formData.googleAds.needManagement ? 1 : 0
          ]
        });
      }
      
      // Commit the transaction
      await executeQuery({ query: 'COMMIT' });
      
      console.log(`Successfully stored estimate submission with ID: ${submissionId}`);
      
      // Simulate a short delay to make the loading state visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({ 
        success: true,
        message: 'Estimate request received successfully',
        submissionId: submissionId
      });
      
    } catch (dbError) {
      // Rollback in case of any error
      await executeQuery({ query: 'ROLLBACK' });
      console.error('Database error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('Error processing estimate form submission:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    return NextResponse.json(
      { 
        success: false,
        message: 'There was an error processing your request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 