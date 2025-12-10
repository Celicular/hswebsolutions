"use client";

import { useState } from "react";
import styles from "../admin.module.css";

export default function QueryRunner() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (password === "QueryRunner@2025") {
      setIsAuthenticated(true);
      setPassword("");
      setError("");
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  const handleRunQuery = async (e) => {
    e.preventDefault();
    if (!sqlQuery.trim()) {
      setError("Please enter a SQL query");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/proposals/query-runner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sqlQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute query");
      }

      setSuccessMessage("✓ Query executed successfully!");
      setResult(data.result);
      setSqlQuery("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.message || "Failed to execute query");
    } finally {
      setLoading(false);
    }
  };

  const loadSchemaQuery = () => {
    const schemaQuery = `-- Database Schema for Proposals Management Module
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
CREATE INDEX IF NOT EXISTS idx_payment_proposal ON proposal_payments(proposal_id);`;
    setSqlQuery(schemaQuery);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.section}>
        <h2>Query Runner</h2>
        <p>
          Execute custom SQL queries for database setup and management. This
          tool requires authentication.
        </p>

        <form onSubmit={handleAuthenticate} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Query Runner Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to access Query Runner"
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Authenticate
          </button>
        </form>

        <div className={styles.infoBox}>
          <h3>Default Password</h3>
          <p>
            <code>QueryRunner@2025</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.queryRunnerHeader}>
        <h2>Query Runner</h2>
        <button
          onClick={() => setIsAuthenticated(false)}
          className={styles.logoutButton}
        >
          Lock
        </button>
      </div>

      <div className={styles.queryRunnerInfo}>
        <h3>⚠️ Advanced Tool</h3>
        <p>
          Execute SQL queries directly. Be careful with DELETE and DROP
          commands.
        </p>
      </div>

      {successMessage && <div className={styles.success}>{successMessage}</div>}

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleRunQuery} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="sqlQuery">SQL Query</label>
          <textarea
            id="sqlQuery"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            className={styles.textarea}
            rows="12"
          />
        </div>

        <div className={styles.queryRunnerButtons}>
          <button
            type="button"
            onClick={loadSchemaQuery}
            className={styles.secondaryButton}
          >
            Load Proposals Schema
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Executing..." : "Execute Query"}
          </button>
        </div>
      </form>

      {result && (
        <div className={styles.resultBox}>
          <h3>Query Result</h3>
          <pre className={styles.resultContent}>
            {typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
