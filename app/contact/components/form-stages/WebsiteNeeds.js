'use client';
import { useState } from 'react';
import styles from '../EstimateForm.module.css';

export default function WebsiteNeeds({ formData, updateFields }) {
  const [errors, setErrors] = useState({
    websiteDesignApproach: '',
    pageCount: '',
    websiteDescription: '',
  });

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'websiteDesignApproach' && !formData.websiteDesignApproach) {
      newErrors.websiteDesignApproach = 'Website design approach is required';
    } else if (field === 'websiteDesignApproach') {
      newErrors.websiteDesignApproach = '';
    }
    
    if (field === 'pageCount' && !formData.pageCount) {
      newErrors.pageCount = 'Page count is required';
    } else if (field === 'pageCount') {
      newErrors.pageCount = '';
    }
    
    if (field === 'websiteDescription' && !formData.websiteDescription) {
      newErrors.websiteDescription = 'Website description is required';
    } else if (field === 'websiteDescription') {
      newErrors.websiteDescription = '';
    }
    
    setErrors(newErrors);
  };

  return (
    <div className={styles.formStage}>
      <h2 className={styles.stageTitle}>Website Needs</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="websiteDesignApproach" className={styles.label}>
          Website Design Approach <span className={styles.required}>*</span>
        </label>
        <select
          id="websiteDesignApproach"
          className={`${styles.select} ${errors.websiteDesignApproach ? styles.inputError : ''}`}
          value={formData.websiteDesignApproach || ''}
          onChange={(e) => updateFields({ websiteDesignApproach: e.target.value })}
          onBlur={() => handleBlur('websiteDesignApproach')}
          required
        >
          <option value="">Select an approach</option>
          <option value="portfolio">Portfolio</option>
          <option value="blog">Blog</option>
          <option value="ecommerce">E-commerce</option>
          <option value="business">Business/Corporate</option>
          <option value="saas">SaaS/Web Application</option>
          <option value="nonprofit">Non-profit/Organization</option>
          <option value="educational">Educational</option>
          <option value="other">Other</option>
        </select>
        {errors.websiteDesignApproach && <div className={styles.errorMessage}>{errors.websiteDesignApproach}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="pageCount" className={styles.label}>
          Approximate Page Count <span className={styles.required}>*</span>
        </label>
        <select
          id="pageCount"
          className={`${styles.select} ${errors.pageCount ? styles.inputError : ''}`}
          value={formData.pageCount || ''}
          onChange={(e) => updateFields({ pageCount: e.target.value })}
          onBlur={() => handleBlur('pageCount')}
          required
        >
          <option value="">Select page count</option>
          <option value="1-5">1-5 pages (Basic)</option>
          <option value="6-10">6-10 pages (Standard)</option>
          <option value="11-20">11-20 pages (Advanced)</option>
          <option value="20+">20+ pages (Enterprise)</option>
          <option value="unknown">Not sure yet</option>
        </select>
        {errors.pageCount && <div className={styles.errorMessage}>{errors.pageCount}</div>}
      </div>

      <div className={styles.formGroup}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="mobileFirst"
            checked={formData.mobileFirst || false}
            onChange={(e) => updateFields({ mobileFirst: e.target.checked })}
            className={styles.checkbox}
          />
          <label htmlFor="mobileFirst" className={styles.checkboxLabel}>
            Mobile First Design
            <span className={styles.infoIcon} title="A design approach that prioritizes mobile devices first, then scales up to larger screens">ⓘ</span>
          </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="websiteDescription" className={styles.label}>
          Website Description <span className={styles.required}>*</span>
        </label>
        <textarea
          id="websiteDescription"
          className={`${styles.textarea} ${errors.websiteDescription ? styles.inputError : ''}`}
          value={formData.websiteDescription || ''}
          onChange={(e) => updateFields({ websiteDescription: e.target.value })}
          onBlur={() => handleBlur('websiteDescription')}
          placeholder="Please describe your website needs, including target audience, main goals, and key features."
          rows={5}
          required
        />
        {errors.websiteDescription && <div className={styles.errorMessage}>{errors.websiteDescription}</div>}
      </div>

      <div className={styles.formGroup}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="convertOldWebsite"
            checked={formData.convertOldWebsite || false}
            onChange={(e) => updateFields({ convertOldWebsite: e.target.checked })}
            className={styles.checkbox}
          />
          <label htmlFor="convertOldWebsite" className={styles.checkboxLabel}>
            Convert Old Website (use content from existing site)
          </label>
        </div>
      </div>
    </div>
  );
} 