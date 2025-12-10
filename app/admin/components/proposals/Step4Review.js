"use client";

import { useState } from "react";
import styles from "./ProposalForm.module.css";

export default function Step4Review({
  formData,
  updateFields,
  onPrev,
  onSubmit,
  isSubmitting,
}) {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    // Check all required fields
    if (!formData.clientName?.trim())
      newErrors.clientName = "Client name is required";
    if (!formData.clientEmail?.trim())
      newErrors.clientEmail = "Client email is required";
    if (!formData.clientPhone?.trim())
      newErrors.clientPhone = "Client phone is required";
    if (!formData.companyName?.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.totalProjectCost)
      newErrors.totalProjectCost = "Project cost is required";
    if (!formData.milestones || formData.milestones.length === 0) {
      newErrors.milestones = "At least one milestone is required";
    }
    if (!formData.pdfLink?.trim()) newErrors.pdfLink = "PDF link is required";
    if (!formData.paymentTerms?.trim())
      newErrors.paymentTerms = "Payment terms are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    if (onSubmit) {
      await onSubmit();
    }
  };

  const totalMilestoneAmount = (formData.milestones || []).reduce(
    (sum, m) => sum + (m.amount || 0),
    0
  );

  const ReviewSection = ({ title, icon, children }) => (
    <div className={styles.formCardSection}>
      <div className={styles.sectionHeader}>
        <h3>
          {icon} {title}
        </h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className={styles.stepContainer}>
      {errors.milestones && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(255, 68, 68, 0.1)",
            border: "2px solid #FF4444",
            borderRadius: "10px",
            color: "#FF4444",
            fontWeight: "500",
            marginBottom: "1.5rem",
          }}
        >
          ✕ {errors.milestones}
        </div>
      )}

      {/* Client Information */}
      <ReviewSection title="Client Information" icon="👤">
        <div className={styles.reviewGrid}>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Full Name</span>
            <span className={styles.reviewValue}>
              {formData.clientName || "—"}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Email</span>
            <span className={styles.reviewValue}>
              {formData.clientEmail || "—"}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Phone</span>
            <span className={styles.reviewValue}>
              {formData.clientPhone || "—"}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Company</span>
            <span className={styles.reviewValue}>
              {formData.companyName || "—"}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Company Email</span>
            <span className={styles.reviewValue}>
              {formData.companyEmail || "—"}
            </span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Company Phone</span>
            <span className={styles.reviewValue}>
              {formData.companyPhone || "—"}
            </span>
          </div>
        </div>
      </ReviewSection>

      {/* Milestones */}
      <ReviewSection title="Project Milestones" icon="🎯">
        <div className={styles.milestonesList}>
          {(formData.milestones || []).map((milestone, index) => (
            <div key={milestone.id} className={styles.milestoneCard}>
              <div className={styles.milestoneHeader}>
                <div>
                  <h4 className={styles.milestoneTitle}>
                    #{index + 1} {milestone.title}
                  </h4>
                  {milestone.description && (
                    <p
                      style={{
                        color: "#666",
                        marginTop: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {milestone.description}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <small style={{ color: "#999" }}>Amount</small>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      margin: "0.5rem 0 0 0",
                      color: "#4CAF50",
                    }}
                  >
                    ₹{milestone.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <div>
                  <small style={{ color: "#999" }}>Due Date</small>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      margin: "0.5rem 0 0 0",
                    }}
                  >
                    {new Date(milestone.dueDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
                {milestone.deliverables && (
                  <div>
                    <small style={{ color: "#999" }}>Deliverables</small>
                    <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
                      {milestone.deliverables}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Milestone Summary */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.5rem",
            background:
              "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
            border: "2px solid rgba(76, 175, 80, 0.3)",
            borderRadius: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          <div>
            <small style={{ color: "#666" }}>Total Milestone Value</small>
            <p
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                margin: "0.5rem 0 0 0",
                color: "#4CAF50",
              }}
            >
              ₹{totalMilestoneAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <small style={{ color: "#666" }}>Total Project Cost</small>
            <p
              style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                margin: "0.5rem 0 0 0",
                color: "#4CAF50",
              }}
            >
              ₹{parseFloat(formData.totalProjectCost || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </ReviewSection>

      {/* Payment & Policies */}
      <ReviewSection title="Payment & Policies" icon="💰">
        <div className={styles.reviewGrid}>
          <div className={styles.reviewItem} style={{ gridColumn: "1 / -1" }}>
            <span className={styles.reviewLabel}>Payment Methods</span>
            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
              }}
            >
              {(formData.paymentMethods || []).map((method) => (
                <span
                  key={method}
                  style={{
                    background: "rgba(76, 175, 80, 0.2)",
                    color: "#2E7D32",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  ✓ {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {formData.paymentTerms && (
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#666",
                marginBottom: "0.8rem",
              }}
            >
              Payment Terms & Conditions
            </p>
            <p
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                color: "#555",
              }}
            >
              {formData.paymentTerms}
            </p>
          </div>
        )}

        {formData.additionalPolicies && (
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#666",
                marginBottom: "0.8rem",
              }}
            >
              Additional Policies
            </p>
            <p
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                color: "#555",
              }}
            >
              {formData.additionalPolicies}
            </p>
          </div>
        )}
      </ReviewSection>

      {/* Documents */}
      <ReviewSection title="Proposal Document" icon="📄">
        <div
          style={{
            padding: "1.5rem",
            background: "rgba(76, 175, 80, 0.05)",
            borderRadius: "10px",
            border: "2px solid rgba(76, 175, 80, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: "0.9rem", color: "#666", margin: "0" }}>
                Proposal PDF Link
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#999",
                  margin: "0.5rem 0 0 0",
                  wordBreak: "break-all",
                }}
              >
                {formData.pdfLink}
              </p>
            </div>
            <a
              href={formData.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.7rem 1.2rem",
                background: "#4CAF50",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#45A049";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#4CAF50";
                e.target.style.transform = "scale(1)";
              }}
            >
              View PDF
            </a>
          </div>
        </div>
      </ReviewSection>

      {/* Additional Notes */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>📝 Additional Notes</h3>
          <p>Add any extra information for the client (optional)</p>
        </div>

        <div className={styles.inputGroup}>
          <textarea
            className={styles.modernInput}
            style={{ minHeight: "120px", resize: "vertical" }}
            placeholder="Add any additional notes or special instructions..."
            value={formData.notes || ""}
            onChange={(e) => updateFields({ notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
