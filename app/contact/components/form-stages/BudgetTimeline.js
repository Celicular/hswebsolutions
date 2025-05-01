'use client';
import { useState } from 'react';
import styles from '../EstimateForm.module.css';

export default function BudgetTimeline({ formData, updateFields }) {
  const [errors, setErrors] = useState({
    budget: '',
    timeline: '',
  });

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'budget' && !formData.budget) {
      newErrors.budget = 'Budget range is required';
    } else if (field === 'budget') {
      newErrors.budget = '';
    }
    
    if (field === 'timeline' && !formData.timeline) {
      newErrors.timeline = 'Timeline is required';
    } else if (field === 'timeline') {
      newErrors.timeline = '';
    }
    
    setErrors(newErrors);
  };

  return (
    <div className={styles.formStage}>
      <h2 className={styles.stageTitle}>Budget & Timeline</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="budget" className={styles.label}>
          What is your budget range? <span className={styles.required}>*</span>
        </label>
        <select
          id="budget"
          className={`${styles.select} ${errors.budget ? styles.inputError : ''}`}
          value={formData.budget}
          onChange={(e) => updateFields({ budget: e.target.value })}
          onBlur={() => handleBlur('budget')}
          required
        >
          <option value="">Select a budget range</option>
          <option value="under50k">Under ₹50,000</option>
          <option value="50k-1l">₹50,000 - ₹1,00,000</option>
          <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
          <option value="3l-5l">₹3,00,000 - ₹5,00,000</option>
          <option value="5l-10l">₹5,00,000 - ₹10,00,000</option>
          <option value="10l+">Above ₹10,00,000</option>
          <option value="undecided">Undecided / Need Consultation</option>
        </select>
        {errors.budget && <div className={styles.errorMessage}>{errors.budget}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="timeline" className={styles.label}>
          What is your expected timeline? <span className={styles.required}>*</span>
        </label>
        <select
          id="timeline"
          className={`${styles.select} ${errors.timeline ? styles.inputError : ''}`}
          value={formData.timeline}
          onChange={(e) => updateFields({ timeline: e.target.value })}
          onBlur={() => handleBlur('timeline')}
          required
        >
          <option value="">Select a timeline</option>
          <option value="asap">As soon as possible</option>
          <option value="1month">Within 1 month</option>
          <option value="1-3months">1-3 months</option>
          <option value="3-6months">3-6 months</option>
          <option value="6months+">More than 6 months</option>
          <option value="flexible">Flexible</option>
        </select>
        {errors.timeline && <div className={styles.errorMessage}>{errors.timeline}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="additionalInfo" className={styles.label}>
          Additional Information (Optional)
        </label>
        <textarea
          id="additionalInfo"
          className={styles.textarea}
          value={formData.additionalInfo}
          onChange={(e) => updateFields({ additionalInfo: e.target.value })}
          placeholder="Is there anything else you'd like to tell us about your project?"
          rows={4}
        />
      </div>
    </div>
  );
} 