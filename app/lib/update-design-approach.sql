-- Update script to modify the website_design_approach column
USE hswebsol;

-- Check if there's data in the table
SELECT COUNT(*) FROM estimate_submissions;

-- First, temporarily modify the column to allow any string value
ALTER TABLE estimate_submissions 
MODIFY COLUMN website_design_approach VARCHAR(50);

-- Now update the enum definition
ALTER TABLE estimate_submissions 
MODIFY COLUMN website_design_approach 
ENUM('portfolio', 'blog', 'ecommerce', 'business', 'saas', 'nonprofit', 'educational', 'other') NOT NULL; 