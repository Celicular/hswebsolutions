'use client';
import { useState, useEffect } from 'react';
import styles from '../EstimateForm.module.css';

export default function BasicInfo({ formData, updateFields }) {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Use useEffect to initialize socialHandles if needed
  useEffect(() => {
    if (!formData.socialHandles || formData.socialHandles.length === 0) {
      updateFields({ socialHandles: [{ platform: '', handle: '' }] });
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Mobile numbers are typically 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'name' && !formData.name) {
      newErrors.name = 'Name is required';
    } else if (field === 'name') {
      newErrors.name = '';
    }
    
    if (field === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      } else {
        newErrors.email = '';
      }
    }
    
    if (field === 'phone') {
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number';
      } else {
        newErrors.phone = '';
      }
    }
    
    setErrors(newErrors);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const phone = value.replace(/\D/g, '');
    
    // Format according to standard mobile number format
    if (phone.length <= 5) return phone;
    if (phone.length <= 10) return `${phone.slice(0, 5)}-${phone.slice(5)}`;
    return `${phone.slice(0, 5)}-${phone.slice(5, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    updateFields({ phone: formattedPhone });
  };

  const socialPlatforms = [
    { value: '', label: 'Select platform' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'other', label: 'Other' }
  ];

  const addSocialHandle = () => {
    const updatedSocialHandles = [...formData.socialHandles, { platform: '', handle: '' }];
    updateFields({ socialHandles: updatedSocialHandles });
  };

  const removeSocialHandle = (index) => {
    const updatedSocialHandles = formData.socialHandles.filter((_, i) => i !== index);
    updateFields({ socialHandles: updatedSocialHandles });
  };

  const updateSocialHandle = (index, field, value) => {
    const updatedSocialHandles = [...formData.socialHandles];
    updatedSocialHandles[index] = { 
      ...updatedSocialHandles[index], 
      [field]: value 
    };
    updateFields({ socialHandles: updatedSocialHandles });
  };

  return (
    <div className={styles.formStage}>
      <h2 className={styles.stageTitle}>Tell us about yourself</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Your Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={formData.name || ''}
          onChange={(e) => updateFields({ name: e.target.value })}
          onBlur={() => handleBlur('name')}
          placeholder="Your name"
          required
        />
        {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="businessName" className={styles.label}>
          Business Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="businessName"
          className={styles.input}
          value={formData.businessName || ''}
          onChange={(e) => updateFields({ businessName: e.target.value })}
          placeholder="Your business name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          value={formData.email || ''}
          onChange={(e) => updateFields({ email: e.target.value })}
          onBlur={() => handleBlur('email')}
          placeholder="your@email.com"
          required
        />
        {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>
          Mobile Number <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          id="phone"
          className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
          value={formData.phone || ''}
          onChange={handlePhoneChange}
          onBlur={() => handleBlur('phone')}
          placeholder="9876512345"
        />
        {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="oldWebsite" className={styles.label}>
          Old Website URL (Optional)
        </label>
        <input
          type="url"
          id="oldWebsite"
          className={styles.input}
          value={formData.oldWebsite || ''}
          onChange={(e) => updateFields({ oldWebsite: e.target.value })}
          placeholder="https://youroldwebsite.com"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Social Media Handles (Optional)
        </label>
        
        {formData.socialHandles && formData.socialHandles.map((social, index) => (
          <div key={index} className={styles.socialHandleRow}>
            <div className={styles.socialPlatformSelect}>
              <select
                className={styles.select}
                value={social.platform}
                onChange={(e) => updateSocialHandle(index, 'platform', e.target.value)}
              >
                {socialPlatforms.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.socialHandleInput}>
              <input
                type="text"
                className={styles.input}
                value={social.handle}
                onChange={(e) => updateSocialHandle(index, 'handle', e.target.value)}
                placeholder="@username or profile URL"
              />
            </div>
            
            {index > 0 && (
              <button 
                type="button" 
                className={styles.removeButton}
                onClick={() => removeSocialHandle(index)}
                aria-label="Remove social handle"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          className={styles.addButton}
          onClick={addSocialHandle}
        >
          + Add Another Social Handle
        </button>
      </div>
    </div>
  );
} 