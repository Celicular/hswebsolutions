'use client';
import { useState } from 'react';
import styles from '../EstimateForm.module.css';

export default function ProjectDetails({ formData, updateFields }) {
  const [errors, setErrors] = useState({
    serviceType: '',
    projectDescription: '',
  });

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'serviceType' && !formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    } else if (field === 'serviceType') {
      newErrors.serviceType = '';
    }
    
    if (field === 'projectDescription' && !formData.projectDescription) {
      newErrors.projectDescription = 'Project description is required';
    } else if (field === 'projectDescription') {
      newErrors.projectDescription = '';
    }
    
    setErrors(newErrors);
  };

  return (
    <div className={styles.formStage}>
      <h2 className={styles.stageTitle}>Tell us about your project</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="serviceType" className={styles.label}>
          What type of service do you need? <span className={styles.required}>*</span>
        </label>
        <select
          id="serviceType"
          className={`${styles.select} ${errors.serviceType ? styles.inputError : ''}`}
          value={formData.serviceType}
          onChange={(e) => updateFields({ serviceType: e.target.value })}
          onBlur={() => handleBlur('serviceType')}
          required
        >
          <option value="">Select a service</option>
          <option value="website">Website Development</option>
          <option value="webapp">Web Application</option>
          <option value="mobileapp">Mobile Application</option>
          <option value="ecommerce">E-commerce Website</option>
          <option value="design">UI/UX Design</option>
          <option value="maintenance">Website Maintenance</option>
          <option value="other">Other</option>
        </select>
        {errors.serviceType && <div className={styles.errorMessage}>{errors.serviceType}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="projectDescription" className={styles.label}>
          Project Description <span className={styles.required}>*</span>
        </label>
        <textarea
          id="projectDescription"
          className={`${styles.textarea} ${errors.projectDescription ? styles.inputError : ''}`}
          value={formData.projectDescription}
          onChange={(e) => updateFields({ projectDescription: e.target.value })}
          onBlur={() => handleBlur('projectDescription')}
          placeholder="Please provide details about your project, including goals, expectations, and any specific features you need."
          required
          rows={5}
        />
        {errors.projectDescription && <div className={styles.errorMessage}>{errors.projectDescription}</div>}
      </div>
    </div>
  );
} 