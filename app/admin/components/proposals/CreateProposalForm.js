"use client";

import { useState } from "react";
import styles from "./ProposalForm.module.css";
import Step1ClientCompanyDetails from "./Step1ClientCompanyDetails";
import Step2PaymentPolicies from "./Step2PaymentPolicies";
import Step3Milestones from "./Step3Milestones";
import Step4Review from "./Step4Review";

const STEPS = [
  { number: 1, label: "Client Details", component: Step1ClientCompanyDetails },
  { number: 2, label: "Payment & Policies", component: Step2PaymentPolicies },
  { number: 3, label: "Milestones", component: Step3Milestones },
  { number: 4, label: "Review", component: Step4Review },
];

export default function CreateProposalForm({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [formData, setFormData] = useState({
    // Step 1
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    oldWebsiteUrl: "",

    // Step 2
    pdfLink: "",
    paymentMethods: [],
    paymentTerms: "",
    additionalPolicies: "",

    // Step 3
    milestones: [],

    // General
    projectTitle: "",
    projectDescription: "",
    industry: "",
    timeline: "",
    totalProjectCost: "",
    notes: "",
  });

  const updateFields = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setSubmitError("");
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
    setSubmitError("");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      // Convert camelCase to snake_case for API
      const apiPayload = {
        client_name: formData.clientName,
        client_phone: formData.clientPhone,
        client_email: formData.clientEmail,
        company_name: formData.companyName,
        company_phone: formData.companyPhone,
        company_email: formData.companyEmail,
        old_website_url: formData.oldWebsiteUrl || null,
        pdf_google_drive_link: formData.pdfLink,
        payment_policies: formData.paymentTerms,
        payment_methods: formData.paymentMethods,
        additional_policies: formData.additionalPolicies || null,
        total_amount: parseFloat(formData.totalProjectCost) || 0,
        milestones: formData.milestones,
        notes: formData.notes || null,
      };

      const response = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create proposal");
      }

      setSubmitSuccess(`✓ Proposal ${data.proposal_id} created successfully!`);
      setFormData({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        companyName: "",
        companyPhone: "",
        companyEmail: "",
        oldWebsiteUrl: "",
        pdfLink: "",
        paymentMethods: [],
        paymentTerms: "",
        additionalPolicies: "",
        milestones: [],
        projectTitle: "",
        projectDescription: "",
        industry: "",
        timeline: "",
        totalProjectCost: "",
        notes: "",
      });
      setCurrentStep(1);

      if (onSuccess) {
        onSuccess(data.proposal_id);
      }

      setTimeout(() => setSubmitSuccess(""), 5000);
    } catch (error) {
      console.error("Error creating proposal:", error);
      setSubmitError(
        error.message || "Failed to create proposal. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentComponent = STEPS.find(
    (s) => s.number === currentStep
  )?.component;

  return (
    <div className={styles.formContainer}>
      {/* Header */}
      <div className={styles.formHeader}>
        <h1>Create New Proposal</h1>
        <p>Build a professional proposal for your client</p>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        {STEPS.map((step) => (
          <div
            key={step.number}
            className={`${styles.progressStep} ${
              step.number === currentStep ? styles.active : ""
            } ${step.number < currentStep ? styles.completed : ""}`}
          >
            <div className={styles.stepNumber}>
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <div className={styles.stepLabel}>{step.label}</div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {submitError && (
        <div className={styles.errorAlert}>
          <span>⚠️ {submitError}</span>
          <button
            onClick={() => setSubmitError("")}
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>
      )}

      {submitSuccess && (
        <div className={styles.successAlert}>
          <span>{submitSuccess}</span>
          <button
            onClick={() => setSubmitSuccess("")}
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>
      )}

      {/* Current Step */}
      {CurrentComponent && (
        <CurrentComponent
          formData={formData}
          updateFields={updateFields}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Step Info */}
      <div className={styles.stepInfo}>
        <span className={styles.stepCounter}>
          Step {currentStep} of {STEPS.length}
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button
          className={styles.prevButton}
          onClick={handlePrev}
          disabled={currentStep === 1 || isSubmitting}
        >
          ← Previous
        </button>

        {currentStep === STEPS.length ? (
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "✓ Create Proposal"}
          </button>
        ) : (
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
