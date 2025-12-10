"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./BillingWidget.module.css";

export default function BillingWidget() {
  const [proposalId, setProposalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!proposalId.trim()) {
      setError("Please enter a valid Proposal ID");
      return;
    }

    setLoading(true);

    try {
      const id = proposalId.toUpperCase().trim();

      // Validate format
      if (!/^PROP\d{4}$/.test(id)) {
        setError("Invalid Proposal ID format. Example: PROP0001");
        setLoading(false);
        return;
      }

      // Check if proposal exists
      const response = await fetch(`/api/proposals/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Proposal not found. Please check the ID and try again.");
        } else {
          setError("Unable to find proposal. Please try again later.");
        }
        setLoading(false);
        return;
      }

      setSuccess(`Proposal ${id} found! Redirecting...`);
      setTimeout(() => {
        router.push(`/proposals/${id}`);
      }, 500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error searching proposal:", err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Track Your Proposal</h2>

        <p className={styles.subtitle}>
          Already have a Proposal ID? Enter it below to view details & manage
          payments
        </p>

        <form onSubmit={handleSearch}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter Proposal ID (e.g., PROP0001)"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              disabled={loading}
              maxLength="8"
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
                  <span className={styles.icon}>→</span>
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        <p className={styles.description}>
          Your proposal ID is in your email from us or in your confirmation
          message.
        </p>

        <p className={styles.helperText}>
          <strong>💡 Need help?</strong>
          Check your email for the proposal link, or contact us if you can't
          find it.
        </p>

        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✓</span>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}
