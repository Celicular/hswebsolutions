'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SupportAndMaintenance.module.css';
import Link from 'next/link';

export default function SupportAndMaintenance() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector(`.${styles.supportMaintenance}`);
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const pricingTiers = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 499,
      yearlyPrice: 4999,
      description: 'Essential support for small websites with standard response times',
      features: [
        'Email support',
        'Bug fixes',
        'Monthly security updates',
        'Performance monitoring'
      ],
      responseTime: '48 hours',
      uptime: '99.5%',
      color: 'var(--tier1, #68B9FF)'
    },
    {
      id: 'standard',
      name: 'Standard',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      description: 'Enhanced support with faster response times and proactive maintenance',
      features: [
        'Email & phone support',
        'Priority bug fixes',
        'Weekly security updates',
        'Performance optimization',
        'Content updates',
        'Monthly backups'
      ],
      responseTime: '24 hours',
      uptime: '99.8%',
      color: 'var(--tier2, #2196F3)',
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 2499,
      yearlyPrice: 24999,
      description: 'Comprehensive support package with dedicated specialists and immediate response',
      features: [
        '24/7 priority support',
        'Emergency bug fixes',
        'Daily security scans',
        'Advanced performance tuning',
        'Unlimited content updates',
        'Daily backups',
        'Dedicated account manager'
      ],
      responseTime: '4 hours',
      uptime: '99.9%',
      color: 'var(--tier3, #0D47A1)'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        delay: i * 0.1
      }
    })
  };

  const toggleBillingPeriod = () => {
    setBillingPeriod(prevState => prevState === 'monthly' ? 'yearly' : 'monthly');
  };

  return (
    <section className={styles.supportMaintenance}>
      <div className={styles.bgPatterns}>
        <div className={styles.circlePattern}></div>
        <div className={styles.gridPattern}></div>
      </div>
      
      <motion.div 
        className={styles.container}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className={styles.headerSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>
            Support & Maintenance
            <div className={styles.titleHighlight}></div>
          </h2>
          <p className={styles.sectionDescription}>
            Keep your website running at peak performance with our tailored support plans.
            Choose the level of service that matches your business needs.
          </p>
          
          <div className={styles.billingToggle}>
            <span className={billingPeriod === 'monthly' ? styles.activeLabel : styles.inactiveLabel}>
              Monthly Billing
            </span>
            <motion.button 
              className={styles.billingButton}
              onClick={toggleBillingPeriod}
              initial={false}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle billing period"
            >
              {billingPeriod === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
              {billingPeriod === 'yearly' && (
                <motion.div 
                  className={styles.discountBadge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Save 15%
                </motion.div>
              )}
            </motion.button>
            <span className={billingPeriod === 'yearly' ? styles.activeLabel : styles.inactiveLabel}>
              Yearly Billing
            </span>
          </div>
        </motion.div>
        
        <div className={styles.plansGrid}>
          {pricingTiers.map((plan, index) => (
            <motion.div 
              key={plan.id}
              custom={index}
              variants={cardVariants}
              className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selectedPlan : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
              style={{ 
                '--plan-color': plan.color
              }}
            >
              {plan.recommended && (
                <div className={styles.recommendedTag}>Most Popular</div>
              )}
              
              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.currencySymbol}>₹</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={billingPeriod + plan.id}
                      className={styles.priceAmount}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className={styles.pricePeriod}>
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
              </div>
              
              <div className={styles.planDescription}>
                {plan.description}
              </div>
              
              <div className={styles.planMetrics}>
                <div className={styles.metricItem}>
                  <div className={styles.metricName}>Response Time</div>
                  <div className={styles.metricValue}>{plan.responseTime}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricName}>Uptime Guarantee</div>
                  <div className={styles.metricValue}>{plan.uptime}</div>
                </div>
              </div>
              
              <div className={styles.planFeatures}>
                <h4 className={styles.featuresTitle}>Included Features:</h4>
                <ul className={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href={`/contact?plan=${plan.id}`} className={styles.planButton}>
                Choose {plan.name}
                <svg className={styles.buttonArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className={styles.ctaSection}
          variants={itemVariants}
        >
          <p className={styles.ctaNote}>
            Need a custom plan tailored to your specific requirements?
            <Link href="/contact" className={styles.contactLink}> Contact us</Link> for a personalized quote.
          </p>
        </motion.div>
      </motion.div>
      
      <div className={styles.angledDivider}></div>
    </section>
  );
} 