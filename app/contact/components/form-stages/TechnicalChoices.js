'use client';
import { useState } from 'react';
import styles from '../EstimateForm.module.css';

export default function TechnicalChoices({ formData, updateFields }) {
  const [errors, setErrors] = useState({
    frontendStack: '',
    backend: '',
    database: '',
    deliveryTimeframe: ''
  });

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    
    if (field === 'frontendStack' && (!formData.frontendStack || formData.frontendStack.length === 0)) {
      newErrors.frontendStack = 'Please select at least one frontend technology';
    } else if (field === 'frontendStack') {
      newErrors.frontendStack = '';
    }
    
    if (field === 'backend' && !formData.backend) {
      newErrors.backend = 'Backend technology is required';
    } else if (field === 'backend') {
      newErrors.backend = '';
    }
    
    if (field === 'database' && !formData.database) {
      newErrors.database = 'Database selection is required';
    } else if (field === 'database') {
      newErrors.database = '';
    }
    
    if (field === 'deliveryTimeframe' && !formData.deliveryTimeframe) {
      newErrors.deliveryTimeframe = 'Delivery timeframe is required';
    } else if (field === 'deliveryTimeframe') {
      newErrors.deliveryTimeframe = '';
    }
    
    setErrors(newErrors);
  };

  const frontendOptions = [
    { value: 'html', label: 'HTML/CSS/JS' },
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'wordpress', label: 'WordPress' }
  ];

  const backendOptions = [
    { value: '', label: 'Select backend technology' },
    { value: 'node', label: 'Node.js' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'dotnet', label: '.NET' },
    { value: 'other', label: 'Other' }
  ];

  const databaseOptions = [
    { value: '', label: 'Select database' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'firebase', label: 'Firebase' },
    { value: 'redis', label: 'Redis' },
    { value: 'dynamodb', label: 'DynamoDB' },
    { value: 'other', label: 'Other' }
  ];

  const integrationOptions = [
    { value: 'ai', label: 'AI/ML' },
    { value: 'delivery', label: 'Delivery Services' },
    { value: 'payment', label: 'Payment APIs' },
    { value: 'social', label: 'Social Media' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'crm', label: 'CRM' }
  ];

  const paymentGateways = [
    { value: '', label: 'Select payment gateway' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'razorpay', label: 'Razorpay' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'square', label: 'Square' },
    { value: 'other', label: 'Other' }
  ];

  const handleFrontendChange = (value) => {
    const updatedStack = formData.frontendStack || [];
    
    if (updatedStack.includes(value)) {
      updateFields({ frontendStack: updatedStack.filter(item => item !== value) });
    } else {
      updateFields({ frontendStack: [...updatedStack, value] });
    }
  };

  const handleIntegrationsChange = (value) => {
    const updatedIntegrations = formData.integrations || [];
    
    if (updatedIntegrations.includes(value)) {
      updateFields({ integrations: updatedIntegrations.filter(item => item !== value) });
    } else {
      updateFields({ integrations: [...updatedIntegrations, value] });
    }
  };

  const toggleGoogleAds = (value) => {
    updateFields({ 
      googleAds: { 
        ...formData.googleAds,
        runAds: value 
      } 
    });
  };

  return (
    <div className={styles.formStage}>
      <h2 className={styles.stageTitle}>Technical Choices & Extras</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Frontend Stack <span className={styles.required}>*</span>
          <span className={styles.infoIcon} title="The technologies used for the user interface of your website">ⓘ</span>
        </label>
        <div className={styles.checkboxGrid}>
          {frontendOptions.map(option => (
            <div key={option.value} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`frontend-${option.value}`}
                checked={formData.frontendStack?.includes(option.value) || false}
                onChange={() => handleFrontendChange(option.value)}
                className={styles.checkbox}
                onBlur={() => handleBlur('frontendStack')}
              />
              <label htmlFor={`frontend-${option.value}`} className={styles.checkboxLabel}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {errors.frontendStack && <div className={styles.errorMessage}>{errors.frontendStack}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="backend" className={styles.label}>
          Backend Technology <span className={styles.required}>*</span>
          <span className={styles.infoIcon} title="The server-side technology that powers your website">ⓘ</span>
        </label>
        <select
          id="backend"
          className={`${styles.select} ${errors.backend ? styles.inputError : ''}`}
          value={formData.backend || ''}
          onChange={(e) => updateFields({ backend: e.target.value })}
          onBlur={() => handleBlur('backend')}
          required
        >
          {backendOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.backend && <div className={styles.errorMessage}>{errors.backend}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="database" className={styles.label}>
          Database <span className={styles.required}>*</span>
          <span className={styles.infoIcon} title="The database system to store your website's data">ⓘ</span>
        </label>
        <select
          id="database"
          className={`${styles.select} ${errors.database ? styles.inputError : ''}`}
          value={formData.database || ''}
          onChange={(e) => updateFields({ database: e.target.value })}
          onBlur={() => handleBlur('database')}
          required
        >
          {databaseOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.database && <div className={styles.errorMessage}>{errors.database}</div>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Integrations (Optional)
        </label>
        <div className={styles.checkboxGrid}>
          {integrationOptions.map(option => (
            <div key={option.value} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`integration-${option.value}`}
                checked={formData.integrations?.includes(option.value) || false}
                onChange={() => handleIntegrationsChange(option.value)}
                className={styles.checkbox}
              />
              <label htmlFor={`integration-${option.value}`} className={styles.checkboxLabel}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Payment Gateway
        </label>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="paymentGatewayEnabled"
            checked={formData.paymentGateway?.enabled || false}
            onChange={(e) => updateFields({ 
              paymentGateway: { 
                ...formData.paymentGateway,
                enabled: e.target.checked 
              } 
            })}
            className={styles.checkbox}
          />
          <label htmlFor="paymentGatewayEnabled" className={styles.checkboxLabel}>
            Include Payment Gateway
          </label>
        </div>
        
        {formData.paymentGateway?.enabled && (
          <div className={styles.conditionalField}>
            <select
              id="paymentGatewayType"
              className={styles.select}
              value={formData.paymentGateway?.gateway || ''}
              onChange={(e) => updateFields({ 
                paymentGateway: { 
                  ...formData.paymentGateway,
                  gateway: e.target.value
                } 
              })}
            >
              {paymentGateways.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Google Ads Preferences
        </label>
        <div className={styles.radioGroup}>
          <div className={styles.radioContainer}>
            <input
              type="radio"
              id="adsYes"
              name="runAds"
              checked={formData.googleAds?.runAds === true}
              onChange={() => toggleGoogleAds(true)}
              className={styles.radio}
            />
            <label htmlFor="adsYes" className={styles.radioLabel}>
              Yes, I want to run Google Ads
            </label>
          </div>
          <div className={styles.radioContainer}>
            <input
              type="radio"
              id="adsNo"
              name="runAds"
              checked={formData.googleAds?.runAds === false}
              onChange={() => toggleGoogleAds(false)}
              className={styles.radio}
            />
            <label htmlFor="adsNo" className={styles.radioLabel}>
              No, I don't want to run ads right now
            </label>
          </div>
        </div>
        
        {formData.googleAds?.runAds && (
          <div className={styles.conditionalFieldset}>
            <div className={styles.formGroup}>
              <label htmlFor="adsBudget" className={styles.label}>
                Ads Budget
              </label>
              <select
                id="adsBudget"
                className={styles.select}
                value={formData.googleAds?.budget || ''}
                onChange={(e) => updateFields({ 
                  googleAds: { 
                    ...formData.googleAds, 
                    budget: e.target.value 
                  } 
                })}
              >
                <option value="">Select budget</option>
                <option value="10k-25k">₹10,000 - ₹25,000 per month</option>
                <option value="25k-50k">₹25,000 - ₹50,000 per month</option>
                <option value="50k-1l">₹50,000 - ₹1,00,000 per month</option>
                <option value="1l-2l">₹1,00,000 - ₹2,00,000 per month</option>
                <option value="2l+">Above ₹2,00,000 per month</option>
                <option value="undecided">Undecided (need consultation)</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="adsKeywords" className={styles.label}>
                Keywords (comma separated)
              </label>
              <input
                type="text"
                id="adsKeywords"
                className={styles.input}
                value={formData.googleAds?.keywords || ''}
                onChange={(e) => updateFields({ 
                  googleAds: { 
                    ...formData.googleAds, 
                    keywords: e.target.value 
                  } 
                })}
                placeholder="e.g., web design, development, e-commerce"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="adsCampaignType" className={styles.label}>
                Campaign Type
              </label>
              <select
                id="adsCampaignType"
                className={styles.select}
                value={formData.googleAds?.campaignType || ''}
                onChange={(e) => updateFields({ 
                  googleAds: { 
                    ...formData.googleAds, 
                    campaignType: e.target.value 
                  } 
                })}
              >
                <option value="">Select campaign type</option>
                <option value="search">Search Ads</option>
                <option value="display">Display Ads</option>
                <option value="shopping">Shopping Ads</option>
                <option value="video">Video Ads</option>
                <option value="discovery">Discovery Ads</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="adsLocation" className={styles.label}>
                Location Targeting
              </label>
              <input
                type="text"
                id="adsLocation"
                className={styles.input}
                value={formData.googleAds?.locationTargeting || ''}
                onChange={(e) => updateFields({ 
                  googleAds: { 
                    ...formData.googleAds, 
                    locationTargeting: e.target.value 
                  } 
                })}
                placeholder="e.g., New York, USA"
              />
            </div>
            
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="adsAccount"
                checked={formData.googleAds?.hasAccount || false}
                onChange={(e) => updateFields({ 
                  googleAds: { 
                    ...formData.googleAds, 
                    hasAccount: e.target.checked 
                  } 
                })}
                className={styles.checkbox}
              />
              <label htmlFor="adsAccount" className={styles.checkboxLabel}>
                I already have a Google Ads account
              </label>
            </div>
            
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="adsManagement"
                checked={formData.googleAds?.needManagement || false}
                onChange={(e) => updateFields({ 
                  googleAds: { 
                    ...formData.googleAds, 
                    needManagement: e.target.checked 
                  } 
                })}
                className={styles.checkbox}
              />
              <label htmlFor="adsManagement" className={styles.checkboxLabel}>
                I need help with ad management
              </label>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="deliveryTimeframe" className={styles.label}>
          Delivery Timeframe <span className={styles.required}>*</span>
        </label>
        <select
          id="deliveryTimeframe"
          className={`${styles.select} ${errors.deliveryTimeframe ? styles.inputError : ''}`}
          value={formData.deliveryTimeframe || ''}
          onChange={(e) => updateFields({ deliveryTimeframe: e.target.value })}
          onBlur={() => handleBlur('deliveryTimeframe')}
          required
        >
          <option value="">Select timeframe</option>
          <option value="1month">Less than 1 month</option>
          <option value="1-3months">1-3 months</option>
          <option value="3-6months">3-6 months</option>
          <option value="6months+">6+ months</option>
          <option value="flexible">Flexible</option>
        </select>
        {errors.deliveryTimeframe && <div className={styles.errorMessage}>{errors.deliveryTimeframe}</div>}
      </div>
    </div>
  );
} 