"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProposalTracker.module.css";

export default function ProposalTracker() {
  const router = useRouter();
  const [proposalId, setProposalId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!proposalId.trim()) {
      setError("Please enter a proposal ID");
      return;
    }

    // Validate format (PROP followed by 4 digits)
    const proposalIdRegex = /^PROP\d{4}$/i;
    if (!proposalIdRegex.test(proposalId)) {
      setError("Invalid format. Use format: PROP0001");
      return;
    }

    setLoading(true);

    try {
      // Check if proposal exists
      const response = await fetch(`/api/proposals/${proposalId}`);

      if (!response.ok) {
        throw new Error("Proposal not found");
      }

      setSuccess(`Found proposal ${proposalId}! Redirecting...`);
      setTimeout(() => {
        router.push(`/proposals/${proposalId}`);
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to find proposal");
      setProposalId("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Track Your Proposal</h2>
          <p className={styles.subtitle}>
            Enter your proposal ID to view payment status, milestones, and
            project details
          </p>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="e.g., PROP0001"
                value={proposalId}
                onChange={(e) => {
                  setProposalId(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                className={styles.input}
                disabled={loading}
              />
              <button
                type="submit"
                className={styles.searchButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span className={styles.icon}>🔍</span>
                    Track Proposal
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <span>⚠️ {error}</span>
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <span>✓ {success}</span>
              </div>
            )}

            <p className={styles.helpText}>
              Don't have a proposal ID?{" "}
              <a href="/contact">Request an estimate</a> to get started
            </p>
          </form>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📋</span>
              <h3>View Details</h3>
              <p>See full project scope and deliverables</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💰</span>
              <h3>Payment Status</h3>
              <p>Track milestone payments and due dates</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📊</span>
              <h3>Progress</h3>
              <p>Monitor project milestones and deliverables</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
