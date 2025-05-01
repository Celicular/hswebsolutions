'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './PricingPlans.module.css';

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  const plans = [
    {
      name: "Essential",
      description: "Perfect for small businesses just getting started",
      monthlyPrice: 499,
      annualPrice: 5499,
      features: [
        "Responsive website design",
        "Content management system",
        "Basic SEO optimization",
        "Contact form integration",
        "Mobile-friendly design"
      ],
      popular: false,
      color: "var(--link)"
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses seeking more features",
      monthlyPrice: 999,
      annualPrice: 10999,
      features: [
        "Everything in Essential",
        "E-commerce functionality",
        "Custom animations",
        "Advanced SEO package",
        "Social media integration",
        "Premium support"
      ],
      popular: true,
      color: "var(--primary)"
    },
    {
      name: "Enterprise",
      description: "For established businesses with complex requirements",
      monthlyPrice: 1999,
      annualPrice: 21999,
      features: [
        "Everything in Professional",
        "Custom web application development",
        "API integrations",
        "Advanced analytics",
        "Dedicated support",
        "Priority updates",
        "Performance optimization"
      ],
      popular: false,
      color: "var(--accent)"
    }
  ];
  
  return (
    <section className={styles.pricingPlans}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
        <p className={styles.sectionSubtitle}>Select the package that best suits your business needs</p>
        
        <div className={styles.switchContainer}>
          <span className={isAnnual ? styles.inactiveLabel : styles.activeLabel}>Monthly</span>
          <div className={styles.switch} onClick={() => setIsAnnual(!isAnnual)}>
            <div className={`${styles.switchKnob} ${isAnnual ? styles.switchActive : ''}`}></div>
          </div>
          <span className={isAnnual ? styles.activeLabel : styles.inactiveLabel}>Annual <span className={styles.discount}>Save 10%</span></span>
        </div>
        
        <motion.div 
          className={styles.plansContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              className={`${styles.planCard} ${plan.popular ? styles.popularPlan : ''}`}
              variants={cardVariants}
            >
              {plan.popular && <div className={styles.popularBadge}>Popular Choice</div>}
              <div className={styles.planHeader} style={{ background: `linear-gradient(135deg, ${plan.color}33 0%, ${plan.color}15 100%)` }}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>
              
              <div className={styles.planPrice}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                <span className={styles.period}>{isAnnual ? '/year' : '/month'}</span>
              </div>
              
              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className={styles.planFooter}>
                <div className={styles.estimateBlock} style={{ borderColor: `${plan.color}66` }}>
                  <span>Get your estimate now</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className={styles.customQuote}>
          <h3 className={styles.customTitle}>Need a custom solution?</h3>
          <p className={styles.customDescription}>Contact us for a tailored quote that fits your exact requirements.</p>
          <div className={styles.estimateCustom}>
            <svg className={styles.customIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Get your custom estimate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans; 