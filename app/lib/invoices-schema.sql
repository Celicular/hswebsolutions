-- Database Schema for Invoices

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id CHAR(20) NOT NULL UNIQUE,
  proposal_id CHAR(8) NOT NULL,
  invoice_type ENUM('milestone', 'full') NOT NULL,
  milestone_id INT NULL,
  razorpay_invoice_id VARCHAR(100) NOT NULL UNIQUE,
  razorpay_short_url VARCHAR(500),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('draft', 'issued', 'partially_paid', 'paid', 'cancelled', 'expired', 'deleted') DEFAULT 'draft',
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (proposal_id) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
  INDEX idx_proposal_id (proposal_id),
  INDEX idx_razorpay_invoice_id (razorpay_invoice_id),
  INDEX idx_status (status),
  INDEX idx_created_at (generated_at DESC)
);
