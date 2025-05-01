-- Database Schema for HS Web Solutions Estimate Form

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hswebsol;
USE hswebsol;

-- Basic estimate submissions table
CREATE TABLE IF NOT EXISTS estimate_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  business_name VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  old_website VARCHAR(255),
  website_design_approach ENUM('portfolio', 'blog', 'ecommerce', 'business', 'saas', 'nonprofit', 'educational', 'other') NOT NULL,
  page_count VARCHAR(50) NOT NULL,
  mobile_first BOOLEAN DEFAULT TRUE,
  website_description TEXT NOT NULL,
  convert_old_website BOOLEAN DEFAULT FALSE,
  backend VARCHAR(50) NOT NULL,
  database_type VARCHAR(50) NOT NULL,
  delivery_timeframe VARCHAR(50) NOT NULL,
  budget VARCHAR(50) NOT NULL,
  timeline VARCHAR(50) NOT NULL,
  additional_info TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'in_review', 'quoted', 'accepted', 'rejected') DEFAULT 'pending'
);

-- Social handles related to submissions
CREATE TABLE IF NOT EXISTS social_handles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estimate_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  handle VARCHAR(100) NOT NULL,
  FOREIGN KEY (estimate_id) REFERENCES estimate_submissions(id) ON DELETE CASCADE
);

-- Frontend technologies chosen (many-to-many relationship)
CREATE TABLE IF NOT EXISTS frontend_technologies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tech_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert common frontend technologies
INSERT INTO frontend_technologies (tech_name) VALUES 
('React'), ('Vue.js'), ('Angular'), ('Next.js'), ('Svelte'), 
('HTML/CSS/JavaScript'), ('Bootstrap'), ('Tailwind CSS');

-- Junction table between submissions and frontend technologies
CREATE TABLE IF NOT EXISTS submission_frontend (
  submission_id INT NOT NULL,
  tech_id INT NOT NULL,
  PRIMARY KEY (submission_id, tech_id),
  FOREIGN KEY (submission_id) REFERENCES estimate_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (tech_id) REFERENCES frontend_technologies(id) ON DELETE CASCADE
);

-- Integrations table (predefined list)
CREATE TABLE IF NOT EXISTS integrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  integration_name VARCHAR(100) UNIQUE NOT NULL
);

-- Insert common integrations
INSERT INTO integrations (integration_name) VALUES 
('Social Media'), ('Analytics'), ('Email Marketing'), 
('CRM'), ('Payment Processing'), ('Chat/Support'),
('Content Management'), ('E-commerce');

-- Junction table between submissions and integrations
CREATE TABLE IF NOT EXISTS submission_integrations (
  submission_id INT NOT NULL,
  integration_id INT NOT NULL,
  PRIMARY KEY (submission_id, integration_id),
  FOREIGN KEY (submission_id) REFERENCES estimate_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (integration_id) REFERENCES integrations(id) ON DELETE CASCADE
);

-- Payment gateway options
CREATE TABLE IF NOT EXISTS payment_gateway_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estimate_id INT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  gateway VARCHAR(50),
  FOREIGN KEY (estimate_id) REFERENCES estimate_submissions(id) ON DELETE CASCADE
);

-- Google Ads information
CREATE TABLE IF NOT EXISTS google_ads_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estimate_id INT NOT NULL,
  run_ads BOOLEAN DEFAULT FALSE,
  budget VARCHAR(50),
  keywords TEXT,
  campaign_type VARCHAR(50),
  location_targeting VARCHAR(100),
  has_account BOOLEAN DEFAULT FALSE,
  need_management BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (estimate_id) REFERENCES estimate_submissions(id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX idx_email ON estimate_submissions(email);
CREATE INDEX idx_submitted_at ON estimate_submissions(submitted_at);
CREATE INDEX idx_status ON estimate_submissions(status);
