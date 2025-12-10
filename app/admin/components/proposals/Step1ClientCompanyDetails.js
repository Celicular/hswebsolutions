"use client";

import { useState } from "react";
import styles from "./ProposalForm.module.css";

export default function Step1ClientCompanyDetails({
  formData,
  updateFields,
  errors = {},
}) {
  const [localErrors, setLocalErrors] = useState(errors);
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    const newErrors = { ...localErrors };
    const value = formData[field];

    switch (field) {
      case "client_name":
        if (!value?.trim()) {
          newErrors.client_name = "Client name is required";
        } else {
          delete newErrors.client_name;
        }
        break;
      case "client_email":
        if (!value?.trim()) {
          newErrors.client_email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.client_email = "Invalid email format";
        } else {
          delete newErrors.client_email;
        }
        break;
      case "client_phone":
        if (!value?.trim()) {
          newErrors.client_phone = "Phone is required";
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) {
          newErrors.client_phone = "Phone must be 10 digits";
        } else {
          delete newErrors.client_phone;
        }
        break;
      case "company_name":
        if (!value?.trim()) {
          newErrors.company_name = "Company name is required";
        } else {
          delete newErrors.company_name;
        }
        break;
      case "company_email":
        if (!value?.trim()) {
          newErrors.company_email = "Company email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.company_email = "Invalid email format";
        } else {
          delete newErrors.company_email;
        }
        break;
      case "company_phone":
        if (!value?.trim()) {
          newErrors.company_phone = "Company phone is required";
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) {
          newErrors.company_phone = "Phone must be 10 digits";
        } else {
          delete newErrors.company_phone;
        }
        break;
    }

    setLocalErrors(newErrors);
  };

  const handlePhoneChange = (value) => {
    // Remove non-digits
    const digitsOnly = value.replace(/\D/g, "");
    // Format as you type
    if (digitsOnly.length <= 5) {
      return digitsOnly;
    } else if (digitsOnly.length <= 10) {
      return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    }
    return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 10)}`;
  };

  return (
    <div className={styles.stepContainer}>
      {/* Client Section */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>👤 Client Information</h3>
          <p>Enter your client's contact details</p>
        </div>

        <div className={styles.inputGrid2}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Full Name <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.modernInput} ${
                touched.client_name && localErrors.client_name
                  ? styles.inputError
                  : ""
              }`}
              value={formData.clientName || ""}
              onChange={(e) => {
                updateFields({ clientName: e.target.value });
                setTouched({ ...touched, client_name: true });
              }}
              placeholder="John Doe"
            />
            {touched.client_name && localErrors.client_name && (
              <span className={styles.errorText}>
                {localErrors.client_name}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Email <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="email"
              className={`${styles.modernInput} ${
                touched.client_email && localErrors.client_email
                  ? styles.inputError
                  : ""
              }`}
              value={formData.clientEmail || ""}
              onChange={(e) => {
                updateFields({ clientEmail: e.target.value });
                setTouched({ ...touched, client_email: true });
              }}
              placeholder="john@example.com"
            />
            {touched.client_email && localErrors.client_email && (
              <span className={styles.errorText}>
                {localErrors.client_email}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Phone <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="tel"
              className={`${styles.modernInput} ${
                touched.client_phone && localErrors.client_phone
                  ? styles.inputError
                  : ""
              }`}
              value={formData.clientPhone || ""}
              onChange={(e) => {
                updateFields({ clientPhone: e.target.value });
                setTouched({ ...touched, client_phone: true });
              }}
              placeholder="(123) 456-7890"
            />
            {touched.client_phone && localErrors.client_phone && (
              <span className={styles.errorText}>
                {localErrors.client_phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Company Section */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>🏢 Company Information</h3>
          <p>Tell us about the client's company</p>
        </div>

        <div className={styles.inputGrid2}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Company Name <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.modernInput} ${
                touched.company_name && localErrors.company_name
                  ? styles.inputError
                  : ""
              }`}
              value={formData.companyName || ""}
              onChange={(e) => {
                updateFields({ companyName: e.target.value });
                setTouched({ ...touched, company_name: true });
              }}
              placeholder="ABC Corporation"
            />
            {touched.company_name && localErrors.company_name && (
              <span className={styles.errorText}>
                {localErrors.company_name}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Email <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="email"
              className={`${styles.modernInput} ${
                touched.company_email && localErrors.company_email
                  ? styles.inputError
                  : ""
              }`}
              value={formData.companyEmail || ""}
              onChange={(e) => {
                updateFields({ companyEmail: e.target.value });
                setTouched({ ...touched, company_email: true });
              }}
              placeholder="contact@company.com"
            />
            {touched.company_email && localErrors.company_email && (
              <span className={styles.errorText}>
                {localErrors.company_email}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Phone <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="tel"
              className={`${styles.modernInput} ${
                touched.company_phone && localErrors.company_phone
                  ? styles.inputError
                  : ""
              }`}
              value={formData.companyPhone || ""}
              onChange={(e) => {
                updateFields({ companyPhone: e.target.value });
                setTouched({ ...touched, company_phone: true });
              }}
              placeholder="(123) 456-7890"
            />
            {touched.company_phone && localErrors.company_phone && (
              <span className={styles.errorText}>
                {localErrors.company_phone}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Old Website URL{" "}
              <span className={styles.optionalBadge}>(Optional)</span>
            </label>
            <input
              type="url"
              className={styles.modernInput}
              value={formData.oldWebsiteUrl || ""}
              onChange={(e) => updateFields({ oldWebsiteUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
