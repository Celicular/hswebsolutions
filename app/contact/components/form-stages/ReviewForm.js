'use client';
import styles from '../EstimateForm.module.css';

export default function ReviewForm({ formData }) {
  // Helper function to display budget in a readable format
  const formatBudget = (budgetCode) => {
    const budgetMap = {
      'under50k': 'Under ₹50,000',
      '50k-1l': '₹50,000 - ₹1,00,000',
      '1l-3l': '₹1,00,000 - ₹3,00,000',
      '3l-5l': '₹3,00,000 - ₹5,00,000',
      '5l-10l': '₹5,00,000 - ₹10,00,000',
      '10l+': 'Above ₹10,00,000',
      'undecided': 'Undecided / Need Consultation'
    };
    return budgetMap[budgetCode] || budgetCode;
  };

  // Helper function to format Google Ads budget
  const formatAdsBudget = (budgetCode) => {
    const adsBudgetMap = {
      '10k-25k': '₹10,000 - ₹25,000 per month',
      '25k-50k': '₹25,000 - ₹50,000 per month',
      '50k-1l': '₹50,000 - ₹1,00,000 per month',
      '1l-2l': '₹1,00,000 - ₹2,00,000 per month',
      '2l+': 'Above ₹2,00,000 per month',
      'undecided': 'Undecided (need consultation)'
    };
    return adsBudgetMap[budgetCode] || budgetCode;
  };

  // Helper function to display timeline in a readable format
  const formatTimeline = (timelineCode) => {
    const timelineMap = {
      'asap': 'As soon as possible',
      '1month': 'Within 1 month',
      '1-3months': '1-3 months',
      '3-6months': '3-6 months',
      '6months+': 'More than 6 months',
      'flexible': 'Flexible'
    };
    return timelineMap[timelineCode] || timelineCode;
  };

  // Helper function to display service type in a readable format
  const formatServiceType = (serviceCode) => {
    const serviceMap = {
      'portfolio': 'Portfolio',
      'blog': 'Blog',
      'ecommerce': 'E-commerce',
      'business': 'Business/Corporate',
      'saas': 'SaaS/Web Application',
      'nonprofit': 'Non-profit/Organization',
      'educational': 'Educational',
      'other': 'Other'
    };
    return serviceMap[serviceCode] || serviceCode;
  };

  // Format delivery timeframe
  const formatDeliveryTimeframe = (timeframeCode) => {
    const timeframeMap = {
      '1month': 'Less than 1 month',
      '1-3months': '1-3 months',
      '3-6months': '3-6 months',
      '6months+': '6+ months',
      'flexible': 'Flexible'
    };
    return timeframeMap[timeframeCode] || timeframeCode;
  };

  // Format page count
  const formatPageCount = (countCode) => {
    const countMap = {
      '1-5': '1-5 pages (Basic)',
      '6-10': '6-10 pages (Standard)',
      '11-20': '11-20 pages (Advanced)',
      '20+': '20+ pages (Enterprise)',
      'unknown': 'Not sure yet'
    };
    return countMap[countCode] || countCode;
  };

  return (
    <div className={styles.formStage}>
      <h2 className={styles.stageTitle}>Review Your Information</h2>
      <p>Please review your information before submitting the estimate request.</p>
      
      <div className={styles.reviewSection}>
        <h3>Personal Information</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Name:</span>
          <span className={styles.reviewValue}>{formData.name}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Business Name:</span>
          <span className={styles.reviewValue}>{formData.businessName || 'Not provided'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Email:</span>
          <span className={styles.reviewValue}>{formData.email}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Phone:</span>
          <span className={styles.reviewValue}>{formData.phone || 'Not provided'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Old Website:</span>
          <span className={styles.reviewValue}>{formData.oldWebsite || 'Not provided'}</span>
        </div>
        {formData.socialHandles && formData.socialHandles.length > 0 && formData.socialHandles[0].platform && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Social Handles:</span>
            <div className={styles.reviewValue}>
              {formData.socialHandles.map((social, index) => 
                social.platform && (
                  <div key={index}>
                    {social.platform}: {social.handle}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.reviewSection}>
        <h3>Website Needs</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Design Approach:</span>
          <span className={styles.reviewValue}>{formatServiceType(formData.websiteDesignApproach)}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Page Count:</span>
          <span className={styles.reviewValue}>{formatPageCount(formData.pageCount)}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Mobile First:</span>
          <span className={styles.reviewValue}>{formData.mobileFirst ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Convert Old Website:</span>
          <span className={styles.reviewValue}>{formData.convertOldWebsite ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Description:</span>
          <div className={styles.reviewText}>{formData.websiteDescription}</div>
        </div>
      </div>
      
      <div className={styles.reviewSection}>
        <h3>Technical Choices</h3>
        {formData.frontendStack && formData.frontendStack.length > 0 && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Frontend Stack:</span>
            <span className={styles.reviewValue}>{formData.frontendStack.join(', ')}</span>
          </div>
        )}
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Backend:</span>
          <span className={styles.reviewValue}>{formData.backend}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Database:</span>
          <span className={styles.reviewValue}>{formData.database}</span>
        </div>
        {formData.integrations && formData.integrations.length > 0 && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Integrations:</span>
            <span className={styles.reviewValue}>{formData.integrations.join(', ')}</span>
          </div>
        )}
        {formData.paymentGateway?.enabled && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Payment Gateway:</span>
            <span className={styles.reviewValue}>{formData.paymentGateway.gateway}</span>
          </div>
        )}
        {formData.googleAds?.runAds && (
          <>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Google Ads:</span>
              <span className={styles.reviewValue}>Yes</span>
            </div>
            {formData.googleAds.budget && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Ads Budget:</span>
                <span className={styles.reviewValue}>{formatAdsBudget(formData.googleAds.budget)}</span>
              </div>
            )}
            {formData.googleAds.keywords && (
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Ads Keywords:</span>
                <span className={styles.reviewValue}>{formData.googleAds.keywords}</span>
              </div>
            )}
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Ads Management:</span>
              <span className={styles.reviewValue}>{formData.googleAds.needManagement ? 'Yes' : 'No'}</span>
            </div>
          </>
        )}
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Delivery Timeframe:</span>
          <span className={styles.reviewValue}>{formatDeliveryTimeframe(formData.deliveryTimeframe)}</span>
        </div>
      </div>
      
      <div className={styles.reviewSection}>
        <h3>Budget & Timeline</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Budget Range:</span>
          <span className={styles.reviewValue}>{formatBudget(formData.budget)}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Timeline:</span>
          <span className={styles.reviewValue}>{formatTimeline(formData.timeline)}</span>
        </div>
        {formData.additionalInfo && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Additional Information:</span>
            <div className={styles.reviewText}>{formData.additionalInfo}</div>
          </div>
        )}
      </div>
    </div>
  );
} 