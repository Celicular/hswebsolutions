# Database Setup Instructions

This document provides instructions on how to set up the database for the HS Web Solutions estimate form.

## Prerequisites

- MySQL server installed and running
- MySQL command-line client or a GUI tool like MySQL Workbench

## Setup Steps

### Option 1: Using MySQL Command Line

1. Navigate to the project directory
2. Connect to your MySQL server:
   ```
   mysql -u root -p
   ```
   (Replace 'root' with your MySQL username if different)

3. Enter your MySQL password when prompted

4. Execute the SQL script:
   ```
   source app/lib/db-schema.sql
   ```

5. Set up the admin views:
   ```
   source app/lib/admin-view.sql
   ```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to File > Open SQL Script
4. Browse to the project directory and select `app/lib/db-schema.sql`
5. Click on the lightning bolt icon to execute the script
6. Repeat steps 3-5 for the `app/lib/admin-view.sql` file

### Option 3: Copy and Paste

1. Open the `app/lib/db-schema.sql` file
2. Copy all the contents
3. Open your MySQL client
4. Paste the SQL commands and execute them
5. Repeat steps 1-4 for the `app/lib/admin-view.sql` file

## Verifying the Setup

After executing the scripts, you should verify that the database, tables, and views were created successfully:

1. Switch to the hswebsol database:
   ```
   USE hswebsol;
   ```

2. Show all tables:
   ```
   SHOW TABLES;
   ```

3. You should see the following tables and views:
   - estimate_submissions
   - social_handles
   - frontend_technologies
   - submission_frontend
   - integrations
   - submission_integrations
   - payment_gateway_options
   - google_ads_info
   - vw_estimate_submissions_complete
   - vw_estimate_submissions_list

## Accessing the Data via API

The application includes API endpoints to access the submissions data:

1. List all submissions (paginated):
   ```
   GET /api/admin/estimate-submissions?page=1&limit=10
   ```

2. Get a single submission by ID:
   ```
   GET /api/admin/estimate-submissions/123
   ```

3. Update a submission status:
   ```
   PATCH /api/admin/estimate-submissions/123
   ```
   With request body:
   ```json
   {
     "status": "in_review"
   }
   ```

## Admin Panel Integration

The views created in this setup are designed to work seamlessly with an admin panel. The comprehensive view (`vw_estimate_submissions_complete`) contains all information for a submission in a format that's ready to display, with arrays and nested objects properly formatted.

## Troubleshooting

- If you encounter permission errors, ensure that your MySQL user has privileges to create databases, tables, and views.
- If the database already exists, the script will not recreate it, but will attempt to create any missing tables.
- If you want to start from scratch, you can drop the existing database first:
  ```
  DROP DATABASE IF EXISTS hswebsol;
  ```
  And then run the scripts again. 