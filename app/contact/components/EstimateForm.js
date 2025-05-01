'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EstimateForm.module.css';
import LoadingSpinner from './LoadingSpinner';

// Import form stage components
import BasicInfo from './form-stages/BasicInfo';
import WebsiteNeeds from './form-stages/WebsiteNeeds';
import TechnicalChoices from './form-stages/TechnicalChoices';
import BudgetTimeline from './form-stages/BudgetTimeline';
import ReviewForm from './form-stages/ReviewForm';

const EstimateForm = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const formContainerRef = useRef(null);
  
  // Add effect to detect and set theme
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark-mode') || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (formContainerRef.current) {
      formContainerRef.current.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark-mode');
          if (formContainerRef.current) {
            formContainerRef.current.setAttribute('data-theme', isDark ? 'dark' : 'light');
          }
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (formContainerRef.current) {
        formContainerRef.current.setAttribute(
          'data-theme', 
          e.matches ? 'dark' : 'light'
        );
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    businessName: '',
    email: '',
    phone: '',
    oldWebsite: '',
    socialHandles: [{ platform: '', handle: '' }],
    
    // Website Needs
    websiteDesignApproach: '',
    pageCount: '',
    mobileFirst: true,
    websiteDescription: '',
    convertOldWebsite: false,
    
    // Technical Choices
    frontendStack: [],
    backend: '',
    database: '',
    integrations: [],
    paymentGateway: {
      enabled: false,
      gateway: ''
    },
    googleAds: {
      runAds: false,
      budget: '',
      keywords: '',
      campaignType: '',
      locationTargeting: '',
      hasAccount: false,
      needManagement: false
    },
    deliveryTimeframe: '',
    
    // Budget & Timeline
    budget: '',
    timeline: '',
    additionalInfo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const totalStages = 5;
  
  const updateFields = (data) => {
    setFormData({ ...formData, ...data });
  };
  
  const validateStage = (stage) => {
    const newErrors = {};
    let isValid = true;
    
    if (stage === 1) {
      // Validate Basic Info
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
        isValid = false;
      }
    }
    
    else if (stage === 2) {
      // Validate Website Needs
      if (!formData.websiteDesignApproach) {
        newErrors.websiteDesignApproach = 'Website design approach is required';
        isValid = false;
      }
      
      if (!formData.pageCount) {
        newErrors.pageCount = 'Page count is required';
        isValid = false;
      }
      
      if (!formData.websiteDescription.trim()) {
        newErrors.websiteDescription = 'Website description is required';
        isValid = false;
      }
    }
    
    else if (stage === 3) {
      // Validate Technical Choices
      if (!formData.frontendStack || formData.frontendStack.length === 0) {
        newErrors.frontendStack = 'Please select at least one frontend technology';
        isValid = false;
      }
      
      if (!formData.backend) {
        newErrors.backend = 'Backend technology is required';
        isValid = false;
      }
      
      if (!formData.database) {
        newErrors.database = 'Database selection is required';
        isValid = false;
      }
      
      if (!formData.deliveryTimeframe) {
        newErrors.deliveryTimeframe = 'Delivery timeframe is required';
        isValid = false;
      }
    }
    
    else if (stage === 4) {
      // Validate Budget & Timeline
      if (!formData.budget) {
        newErrors.budget = 'Budget range is required';
        isValid = false;
      }
      
      if (!formData.timeline) {
        newErrors.timeline = 'Timeline is required';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStage(currentStage)) {
      if (currentStage < totalStages) {
        setCurrentStage(currentStage + 1);
      } else {
        handleSubmit();
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Here we would normally send the data to a server
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  if (submitted) {
    return (
      <div className={styles.formContainer} ref={formContainerRef}>
        <div className={styles.formStage}>
          <h2 className={styles.stageTitle}>Thank You!</h2>
          <p>Your estimate request has been submitted successfully. We'll get back to you within 24-48 hours.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.formContainer} ref={formContainerRef}>
      {/* Progress indicator */}
      <div className={styles.progressIndicator}>
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className={styles.progressStep}>
            <div 
              className={`${styles.stepCircle} ${currentStage === step ? styles.active : ''} ${currentStage > step ? styles.completed : ''}`}
            >
              {currentStage > step ? '✓' : step}
            </div>
            <div 
              className={`${styles.stepLabel} ${currentStage === step ? styles.active : ''} ${currentStage > step ? styles.completed : ''}`}
            >
              {step === 1 ? 'Basic Info' : 
               step === 2 ? 'Website Needs' : 
               step === 3 ? 'Technical Choices' : 
               step === 4 ? 'Budget & Timeline' : 'Review'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Form stages */}
      <form onSubmit={(e) => {
        e.preventDefault();
        if (currentStage === 5) {
          handleSubmit();
        } else {
          handleNext();
        }
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStage === 1 && (
              <BasicInfo 
                formData={formData} 
                updateFields={updateFields} 
              />
            )}
            
            {currentStage === 2 && (
              <WebsiteNeeds 
                formData={formData} 
                updateFields={updateFields} 
              />
            )}
            
            {currentStage === 3 && (
              <TechnicalChoices 
                formData={formData} 
                updateFields={updateFields} 
              />
            )}
            
            {currentStage === 4 && (
              <BudgetTimeline 
                formData={formData} 
                updateFields={updateFields} 
              />
            )}
            
            {currentStage === 5 && (
              <ReviewForm formData={formData} />
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className={styles.buttonGroup}>
          {currentStage > 1 && (
            <button 
              type="button" 
              className={styles.secondaryButton} 
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          
          <button 
            type={currentStage === 5 ? "submit" : "button"} 
            className={styles.primaryButton}
            onClick={currentStage < 5 ? handleNext : undefined}
            disabled={loading}
          >
            {currentStage < 5 ? "Next" : loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EstimateForm; 