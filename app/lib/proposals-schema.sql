-- Database Schema for Proposals Management Module
-- Run this via the Query Runner API or manually

-- 1. Main Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id CHAR(8) NOT NULL UNIQUE,
  
  -- Client Information
  client_name VARCHAR(100) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_email VARCHAR(100) NOT NULL,
  
  -- Company Information
  company_name VARCHAR(100) NOT NULL,
  company_phone VARCHAR(20) NOT NULL,
  company_email VARCHAR(100) NOT NULL,
  old_website_url VARCHAR(255) NULL,
  
  -- Proposal Document
  pdf_google_drive_link VARCHAR(500) NOT NULL,
  
  -- Payment Information
  payment_policies TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  advance_payment_count INT NOT NULL DEFAULT 0,
  milestone_count INT NOT NULL DEFAULT 0,
  milestones JSON,
  
  -- Additional Fields
  notes TEXT NULL,
  
  -- Status and Metadata
  status ENUM('draft', 'sent', 'viewed', 'paid', 'completed', 'expired', 'rejected') DEFAULT 'draft',
  payment_status ENUM('pending', 'partially_paid', 'fully_paid') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  viewed_at TIMESTAMP NULL,
  
  -- Tracking
  created_by INT,
  
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_client_email (client_email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
);

-- 2. Payment Tracking Table
CREATE TABLE IF NOT EXISTS proposal_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id CHAR(8) NOT NULL,
  payment_type ENUM('advance', 'milestone', 'full') NOT NULL,
  milestone_id INT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  razorpay_order_id VARCHAR(100) NULL,
  razorpay_payment_id VARCHAR(100) NULL,
  transaction_id VARCHAR(100) NULL,
  payment_date TIMESTAMP NULL,
  status ENUM('pending', 'initiated', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (proposal_id) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_status (status),
  INDEX idx_razorpay_payment_id (razorpay_payment_id)
);

-- 3. Audit Log Table
CREATE TABLE IF NOT EXISTS proposal_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id CHAR(8) NOT NULL,
  action VARCHAR(100) NOT NULL,
  changed_by INT,
  old_value JSON NULL,
  new_value JSON NULL,
  ip_address VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (proposal_id) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_action (action)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_proposal_created ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_proposal ON proposal_payments(proposal_id);
