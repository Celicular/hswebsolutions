"use client";

import { useState } from "react";
import styles from "./ProposalForm.module.css";

export default function Step3Milestones({
  formData,
  updateFields,
  onNext,
  onPrev,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    amount: "",
    dueDate: "",
    deliverables: "",
  });

  const milestones = formData.milestones || [];

  const handleAddMilestone = () => {
    const newErrors = {};

    if (!newMilestone.title?.trim()) newErrors.title = "Title is required";
    if (
      !newMilestone.amount ||
      isNaN(newMilestone.amount) ||
      parseFloat(newMilestone.amount) <= 0
    ) {
      newErrors.amount = "Valid amount is required";
    }
    if (!newMilestone.dueDate) newErrors.dueDate = "Due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedMilestones = [
      ...milestones,
      {
        id: Date.now(),
        ...newMilestone,
        amount: parseFloat(newMilestone.amount),
      },
    ];

    // Calculate total project cost from all milestones
    const totalAmount = updatedMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);

    updateFields({ 
      milestones: updatedMilestones,
      totalProjectCost: totalAmount.toString(),
    });
    setNewMilestone({
      title: "",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleRemoveMilestone = (id) => {
    const updated = milestones.filter((m) => m.id !== id);
    
    // Recalculate total project cost
    const totalAmount = updated.reduce((sum, m) => sum + (m.amount || 0), 0);
    
    updateFields({ 
      milestones: updated,
      totalProjectCost: totalAmount > 0 ? totalAmount.toString() : "",
    });
  };

  const handleMilestoneChange = (field, value) => {
    setNewMilestone((prev) => ({ ...prev, [field]: value }));
    setTouched({ ...touched, [field]: true });
  };

  const validateStep = () => {
    if (milestones.length === 0) {
      setErrors({ milestones: "Add at least one milestone" });
      return false;
    }

    const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
    if (
      !formData.totalProjectCost ||
      parseFloat(formData.totalProjectCost) !== totalAmount
    ) {
      setErrors({
        amount: `Milestone amounts (₹${totalAmount.toFixed(
          2
        )}) must equal total project cost (₹${parseFloat(
          formData.totalProjectCost || 0
        ).toFixed(2)})`,
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const totalMilestoneAmount = milestones.reduce(
    (sum, m) => sum + (m.amount || 0),
    0
  );

  return (
    <div className={styles.stepContainer}>
      {/* Add Milestone Form */}
      <div className={styles.formCardSection}>
        <div className={styles.sectionHeader}>
          <h3>🎯 Add New Milestone</h3>
          <p>Break down your project into payment stages</p>
        </div>

        <div className={styles.inputGrid2}>
          <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.inputLabel}>
              Milestone Title <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.modernInput} ${
                touched.title && errors.title ? styles.inputError : ""
              }`}
              placeholder="e.g., UI Design & Mockups"
              value={newMilestone.title}
              onChange={(e) => handleMilestoneChange("title", e.target.value)}
            />
            {touched.title && errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.inputLabel}>Description</label>
            <textarea
              className={styles.modernInput}
              style={{ minHeight: "100px", resize: "vertical" }}
              placeholder="Describe what will be delivered in this milestone..."
              value={newMilestone.description}
              onChange={(e) =>
                handleMilestoneChange("description", e.target.value)
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Amount (₹) <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="number"
              className={`${styles.modernInput} ${
                touched.amount && errors.amount ? styles.inputError : ""
              }`}
              placeholder="5000"
              value={newMilestone.amount}
              onChange={(e) => handleMilestoneChange("amount", e.target.value)}
            />
            {touched.amount && errors.amount && (
              <span className={styles.errorText}>{errors.amount}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Due Date <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="date"
              className={`${styles.modernInput} ${
                touched.dueDate && errors.dueDate ? styles.inputError : ""
              }`}
              value={newMilestone.dueDate}
              onChange={(e) => handleMilestoneChange("dueDate", e.target.value)}
            />
            {touched.dueDate && errors.dueDate && (
              <span className={styles.errorText}>{errors.dueDate}</span>
            )}
          </div>

          <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.inputLabel}>Deliverables</label>
            <textarea
              className={styles.modernInput}
              style={{ minHeight: "80px", resize: "vertical" }}
              placeholder="List deliverables (comma-separated)..."
              value={newMilestone.deliverables}
              onChange={(e) =>
                handleMilestoneChange("deliverables", e.target.value)
              }
            />
          </div>
        </div>

        <button
          onClick={handleAddMilestone}
          style={{
            width: "100%",
            padding: "1rem",
            marginTop: "1.5rem",
            background: "linear-gradient(135deg, #4CAF50, #45A049)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 16px rgba(76, 175, 80, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          + Add Milestone
        </button>
      </div>

      {/* Error Messages */}
      {errors.milestones && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(255, 68, 68, 0.1)",
            border: "2px solid #FF4444",
            borderRadius: "10px",
            color: "#FF4444",
            fontWeight: "500",
          }}
        >
          ✕ {errors.milestones}
        </div>
      )}

      {errors.amount && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(255, 68, 68, 0.1)",
            border: "2px solid #FF4444",
            borderRadius: "10px",
            color: "#FF4444",
            fontWeight: "500",
          }}
        >
          ✕ {errors.amount}
        </div>
      )}

      {/* Milestones List */}
      {milestones.length > 0 && (
        <div className={styles.formCardSection}>
          <div className={styles.sectionHeader}>
            <h3>📋 Your Milestones ({milestones.length})</h3>
            <p>Review and manage all project milestones</p>
          </div>

          <div className={styles.milestonesList}>
            {milestones.map((milestone, index) => (
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
                  <button
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <div>
                    <small style={{ color: "#999" }}>Amount</small>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        margin: "0.5rem 0 0 0",
                      }}
                    >
                      ₹{milestone.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <small style={{ color: "#999" }}>Due Date</small>
                    <p
                      style={{
                        fontSize: "1.1rem",
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
                        {milestone.deliverables.substring(0, 50)}...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: "2rem",
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
              <small style={{ color: "#666" }}>Total Milestone Amount</small>
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
            {formData.totalProjectCost && (
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
                  ₹{parseFloat(formData.totalProjectCost).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
