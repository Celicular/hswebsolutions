"use client";

import { useState } from "react";
import styles from "./ProposalForm.module.css";

export default function Step2PaymentPolicies({
  formData,
  updateFields,
  onNext,
  onPrev,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const togglePaymentMethod = (method) => {
    const current = formData.paymentMethods || [];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    updateFields({ paymentMethods: updated });
  };

  const validateStep = () => {
    const newErrors = {};

    if (!formData.pdfLink?.trim()) {
      newErrors.pdfLink = "PDF link is required";
    } else if (!isValidUrl(formData.pdfLink)) {
      newErrors.pdfLink = "Please enter a valid URL";
    }

    if (!formData.paymentTerms?.trim()) {
      newErrors.paymentTerms = "Payment terms are required";
    }

    if (!formData.paymentMethods || formData.paymentMethods.length === 0) {
      newErrors.paymentMethods = "Select at least one payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const paymentOptions = [
    { id: "credit", label: "💳 Credit Card" },
    { id: "debit", label: "💳 Debit Card" },
    { id: "razorpay", label: "🔐 Razorpay" },
    { id: "upi", label: "📱 UPI" },
    { id: "cheque", label: "📄 Cheque" },
  ];

  return (
    <div className={styles.stepContainer}>
      {/* PDF Document Section */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>📄 Proposal Document</h3>
          <p>Upload your proposal document to share with the client</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Proposal PDF Link <span className={styles.asterisk}>*</span>
          </label>
          <input
            type="url"
            className={`${styles.modernInput} ${
              touched.pdfLink && errors.pdfLink ? styles.inputError : ""
            }`}
            value={formData.pdfLink || ""}
            onChange={(e) => {
              updateFields({ pdfLink: e.target.value });
              setTouched({ ...touched, pdfLink: true });
            }}
            placeholder="https://drive.google.com/file/d/..."
          />
          {touched.pdfLink && errors.pdfLink && (
            <span className={styles.errorText}>{errors.pdfLink}</span>
          )}
          <small style={{ color: "#999", marginTop: "0.5rem" }}>
            ✓ Google Drive link, Dropbox, or any hosted PDF URL
          </small>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>💰 Payment Methods</h3>
          <p>Select all payment methods you accept</p>
        </div>

        <div className={styles.paymentMethodsList}>
          {paymentOptions.map((option) => (
            <label
              key={option.id}
              className={styles.paymentMethodCheckbox}
              style={{
                borderColor: (formData.paymentMethods || []).includes(option.id)
                  ? "#4CAF50"
                  : undefined,
                backgroundColor: (formData.paymentMethods || []).includes(
                  option.id
                )
                  ? "rgba(76, 175, 80, 0.1)"
                  : undefined,
              }}
            >
              <input
                type="checkbox"
                checked={(formData.paymentMethods || []).includes(option.id)}
                onChange={() => togglePaymentMethod(option.id)}
                style={{ cursor: "pointer" }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {touched.paymentMethods && errors.paymentMethods && (
          <span
            className={styles.errorText}
            style={{ display: "block", marginTop: "1rem" }}
          >
            {errors.paymentMethods}
          </span>
        )}
      </div>

      {/* Payment Terms Section */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>📋 Payment Terms & Conditions</h3>
          <p>Define your payment policies and terms</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Terms <span className={styles.asterisk}>*</span>
          </label>
          <textarea
            className={`${styles.modernInput} ${
              touched.paymentTerms && errors.paymentTerms
                ? styles.inputError
                : ""
            }`}
            style={{ minHeight: "140px", resize: "vertical", padding: "1rem" }}
            value={formData.paymentTerms || ""}
            onChange={(e) => {
              updateFields({ paymentTerms: e.target.value });
              setTouched({ ...touched, paymentTerms: true });
            }}
            placeholder="e.g., 50% advance payment required. Remaining 50% upon project completion..."
          />
          {touched.paymentTerms && errors.paymentTerms && (
            <span className={styles.errorText}>{errors.paymentTerms}</span>
          )}
          <small style={{ color: "#999", marginTop: "0.5rem" }}>
            Include advance payment %, milestone payments, late fees, refund
            policy
          </small>
        </div>
      </div>

      {/* Additional Policies Section */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>⚙️ Additional Policies</h3>
          <p>Any extra terms or conditions (optional)</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Extra Terms</label>
          <textarea
            className={styles.modernInput}
            style={{ minHeight: "120px", resize: "vertical", padding: "1rem" }}
            value={formData.additionalPolicies || ""}
            onChange={(e) =>
              updateFields({ additionalPolicies: e.target.value })
            }
            placeholder="e.g., Revision limits, support duration, warranty period, etc."
          />
          <small style={{ color: "#999", marginTop: "0.5rem" }}>
            Optional: Scope limitations, revision limits, support terms
          </small>
        </div>
      </div>
    </div>
  );
}
