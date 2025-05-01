-- Create a comprehensive view for estimate submissions and all related data
-- This will be useful for the admin panel to display complete submissions

USE hswebsol;

-- Drop the view if it already exists
DROP VIEW IF EXISTS vw_estimate_submissions_complete;

CREATE VIEW vw_estimate_submissions_complete AS
SELECT 
    -- Basic submission information
    es.id AS submission_id,
    es.name,
    es.business_name,
    es.email,
    es.phone,
    es.old_website,
    es.website_design_approach,
    es.page_count,
    es.mobile_first,
    es.website_description,
    es.convert_old_website,
    es.backend,
    es.database_type,
    es.delivery_timeframe,
    es.budget,
    es.timeline,
    es.additional_info,
    es.submitted_at,
    es.status,
    
    -- Payment gateway information
    pg.enabled AS payment_gateway_enabled,
    pg.gateway AS payment_gateway_type,
    
    -- Google Ads information
    ga.run_ads AS google_ads_enabled,
    ga.budget AS google_ads_budget,
    ga.keywords AS google_ads_keywords,
    ga.campaign_type AS google_ads_campaign_type,
    ga.location_targeting AS google_ads_location,
    ga.has_account AS google_ads_has_account,
    ga.need_management AS google_ads_need_management,
    
    -- Frontend technologies (as JSON array)
    (
        SELECT JSON_ARRAYAGG(ft.tech_name)
        FROM submission_frontend sf
        JOIN frontend_technologies ft ON sf.tech_id = ft.id
        WHERE sf.submission_id = es.id
    ) AS frontend_technologies,
    
    -- Integrations (as JSON array)
    (
        SELECT JSON_ARRAYAGG(i.integration_name)
        FROM submission_integrations si
        JOIN integrations i ON si.integration_id = i.id
        WHERE si.submission_id = es.id
    ) AS integrations,
    
    -- Social handles (as JSON array)
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'platform', sh.platform, 
                'handle', sh.handle
            )
        )
        FROM social_handles sh
        WHERE sh.estimate_id = es.id
    ) AS social_handles
    
FROM 
    estimate_submissions es
LEFT JOIN 
    payment_gateway_options pg ON es.id = pg.estimate_id
LEFT JOIN 
    google_ads_info ga ON es.id = ga.estimate_id;

-- Create a simplified view for basic info and status (useful for listing)
DROP VIEW IF EXISTS vw_estimate_submissions_list;

CREATE VIEW vw_estimate_submissions_list AS
SELECT 
    es.id,
    es.name,
    es.email,
    es.phone,
    es.website_design_approach,
    es.budget,
    es.timeline,
    es.submitted_at,
    es.status
FROM 
    estimate_submissions es
ORDER BY 
    es.submitted_at DESC;

-- Sample query to fetch a specific submission by ID
-- SELECT * FROM vw_estimate_submissions_complete WHERE submission_id = ?;

-- Sample query to list all submissions with pagination
-- SELECT * FROM vw_estimate_submissions_list LIMIT ?, ?; 