'use client';

import { useState } from 'react';
import styles from '../page.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (formData.phone && !/^[0-9+\-()\s]*$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Message should be at least 20 characters';
    }
    
    return errors;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.contactFormContainer}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      
      {submitSuccess && (
        <div className={styles.successMessage}>
          <p>Your message has been sent successfully! We'll get back to you soon.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.formControl}
            placeholder="Enter your full name"
          />
          {formErrors.name && <div className={styles.errorText}>{formErrors.name}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.formControl}
            placeholder="Enter your email address"
          />
          {formErrors.email && <div className={styles.errorText}>{formErrors.email}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.formLabel}>Phone Number (optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.formControl}
            placeholder="Enter your phone number"
          />
          {formErrors.phone && <div className={styles.errorText}>{formErrors.phone}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.formLabel}>Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.formControl}
            placeholder="What is this regarding?"
          />
          {formErrors.subject && <div className={styles.errorText}>{formErrors.subject}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.formLabel}>Your Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.formControl} ${styles.textArea}`}
            placeholder="How can we help you?"
            rows="5"
          />
          {formErrors.message && <div className={styles.errorText}>{formErrors.message}</div>}
        </div>
        
        {formErrors.submit && <div className={styles.errorText}>{formErrors.submit}</div>}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
          {!isSubmitting && (
            <span className={styles.buttonIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 