'use client';

import React, { useState } from 'react';
import styles from './EstimateForm.module.css';
import BasicInfo from './form-stages/BasicInfo';
import ProjectDetails from './form-stages/ProjectDetails';
import BudgetTimeline from './form-stages/BudgetTimeline';
import ReviewForm from './form-stages/ReviewForm';

// Define initial form data
const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  serviceType: '',
  projectDescription: '',
  budget: '',
  timeline: '',
  additionalInfo: ''
};

// Define form stages
const FormStage = {
  BASIC_INFO: 0,
  PROJECT_DETAILS: 1,
  BUDGET_TIMELINE: 2,
  REVIEW: 3,
  THANK_YOU: 4
};

export default function EstimateForm() {
  const [currentStage, setCurrentStage] = useState(FormStage.BASIC_INFO);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to update fields in the form data
  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStage === FormStage.REVIEW) {
      setIsSubmitting(true);
      
      try {
        // Submit form data to your API route
        const response = await fetch('/api/submit-estimate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          setCurrentStage(FormStage.THANK_YOU);
        } else {
          // Handle error
          console.error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Move to next stage
      setCurrentStage(prev => prev + 1);
    }
  };

  // Function to go back to previous stage
  const handleBack = () => {
    setCurrentStage(prev => prev - 1);
  };

  // Function to validate the current stage
  const canProceed = () => {
    switch (currentStage) {
      case FormStage.BASIC_INFO:
        return formData.name && formData.email && formData.phone;
      case FormStage.PROJECT_DETAILS:
        return formData.serviceType && formData.projectDescription;
      case FormStage.BUDGET_TIMELINE:
        return formData.budget && formData.timeline;
      default:
        return true;
    }
  };

  // Get the progress percentage
  const getProgress = () => {
    const totalStages = Object.keys(FormStage).length / 2; // Half because we have both keys and values
    return ((currentStage) / totalStages) * 100;
  };

  // Render form stage content
  const renderStageContent = () => {
    switch (currentStage) {
      case FormStage.BASIC_INFO:
        return <BasicInfo formData={formData} updateFields={updateFields} />;
      case FormStage.PROJECT_DETAILS:
        return <ProjectDetails formData={formData} updateFields={updateFields} />;
      case FormStage.BUDGET_TIMELINE:
        return <BudgetTimeline formData={formData} updateFields={updateFields} />;
      case FormStage.REVIEW:
        return <ReviewForm formData={formData} />;
      case FormStage.THANK_YOU:
        return (
          <div className={styles.formSubmitMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Thank You!</h2>
            <p>Your estimate request has been submitted. We'll be in touch with you shortly.</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Render the progress indicator
  const renderProgressSteps = () => {
    const steps = [
      { id: FormStage.BASIC_INFO, label: 'Basic Info' },
      { id: FormStage.PROJECT_DETAILS, label: 'Project Details' },
      { id: FormStage.BUDGET_TIMELINE, label: 'Budget & Timeline' },
      { id: FormStage.REVIEW, label: 'Review' }
    ];

    return (
      <div className={styles.progressIndicator}>
        {steps.map(step => (
          <div key={step.id} className={styles.progressStep}>
            <div 
              className={`${styles.stepCircle} ${
                currentStage === step.id 
                  ? styles.stepCircleActive 
                  : currentStage > step.id 
                    ? styles.stepCircleCompleted 
                    : ''
              }`}
            >
              {currentStage > step.id ? '✓' : step.id + 1}
            </div>
            <span 
              className={`${styles.stepText} ${
                currentStage === step.id ? styles.stepTextActive : ''
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      {currentStage !== FormStage.THANK_YOU && renderProgressSteps()}
      
      <form onSubmit={handleSubmit}>
        {renderStageContent()}
        
        {currentStage !== FormStage.THANK_YOU && (
          <div className={styles.navigationButtons}>
            {currentStage > 0 && (
              <button 
                type="button"
                onClick={handleBack}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={!canProceed() || isSubmitting}
            >
              {currentStage === FormStage.REVIEW ? 'Submit' : 'Next'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
} 