'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaCheck, FaInfoCircle } from 'react-icons/fa';
import styles from './PricingSection.module.css';

// Tooltip content for technical terms
const tooltipContent = {
  cms: "Content Management System - software that allows you to create, manage, and modify content on your website without specialized technical knowledge.",
  responsive: "Your website will adapt perfectly to all devices - desktops, tablets, and mobile phones.",
  seo: "Search Engine Optimization - techniques that help your website rank higher in search engine results.",
  crm: "Customer Relationship Management - systems that help you manage customer data and interactions."
};

const PricingSection = ({ id }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, threshold: 0.1 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      y: 20,
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const handleTooltipToggle = (term) => {
    if (activeTooltip === term) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(term);
    }
  };
  
  return (
    <section className={styles.pricingSection} ref={ref} id={id}>
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle} style={{ top: '10%', left: '5%' }}></div>
        <div className={styles.bgSquare} style={{ top: '60%', right: '8%' }}></div>
        <div className={styles.bgCircle} style={{ bottom: '10%', left: '15%' }}></div>
        <div className={styles.bgDots}></div>
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.sectionHeader}
          initial="hidden"
          animate={controls}
          variants={itemVariants}
        >
          <h2 className={styles.sectionTitle}>Transparent Pricing Plans</h2>
          <p className={styles.sectionSubtitle}>
            Choose a plan that works best for your business needs. All our packages include responsive design, 
            performance optimization, and ongoing support. Not sure which plan is right for you? Contact us for a custom solution.
          </p>
        </motion.div>
        
        <motion.div 
          className={styles.pricingGrid}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Starter Website Plan */}
          <motion.div 
            className={`${styles.pricingCard} ${styles.starterPlan}`}
            variants={itemVariants}
          >
            <span className={styles.planBadge}>Basic</span>
            <h3 className={styles.planName}>Starter</h3>
            <div className={styles.price}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>25,000</span>
            </div>
            <div className={styles.techStack}>HTML/CSS, JavaScript, Bootstrap</div>
            <ul className={styles.featuresList}>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Static Website (Up to 5 Pages)
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Responsive Design
                <span 
                  className={styles.infoIcon}
                  onClick={() => handleTooltipToggle('responsive')}
                >
                  <FaInfoCircle />
                  {activeTooltip === 'responsive' && (
                    <span className={styles.tooltip}>{tooltipContent.responsive}</span>
                  )}
                </span>
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Contact Form
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                SEO Ready
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Social Media Integration
              </li>
            </ul>
            <p className={styles.note}>Perfect for small businesses starting online.</p>
            <button className={styles.ctaButton}>Get Started</button>
          </motion.div>
          
          {/* Professional Web Solution Plan */}
          <motion.div 
            className={`${styles.pricingCard} ${styles.professionalPlan}`}
            variants={itemVariants}
          >
            <span className={`${styles.planBadge} ${styles.popularBadge}`}>Most Popular</span>
            <h3 className={styles.planName}>Professional</h3>
            
            <div className={styles.price}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>45,000</span>
            </div>
            <div className={styles.techStack}>React.js, Next.js, Node.js, MongoDB</div>
            <div className={styles.bestValue}><span>Best Value</span></div>
            
            <ul className={styles.featuresList}>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Dynamic Web Application
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Up to 10 Pages
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Custom CMS Integration
                <span 
                  className={styles.infoIcon}
                  onClick={() => handleTooltipToggle('cms')}
                >
                  <FaInfoCircle />
                  {activeTooltip === 'cms' && (
                    <span className={styles.tooltip}>{tooltipContent.cms}</span>
                  )}
                </span>
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                E-commerce Capabilities
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                3 Months Support
              </li>
            </ul>
            <p className={styles.note}>Ideal for businesses needing feature-rich websites.</p>
            <button className={`${styles.ctaButton} ${styles.primaryCta}`}>Select Plan</button>
          </motion.div>
          
          {/* Custom Solution Plan */}
          <motion.div 
            className={`${styles.pricingCard} ${styles.customPlan}`}
            variants={itemVariants}
          >
            <span className={styles.planBadge}>Enterprise</span>
            <h3 className={styles.planName}>Custom Solution</h3>
            <div className={styles.price}>
              <span className={styles.customPrice}>Custom Quote</span>
            </div>
            <div className={styles.techStack}>Full Stack, Cloud Services, APIs, AI</div>
            <ul className={styles.featuresList}>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Tailored to Your Specific Needs
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Enterprise-Grade Security
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                CRM Integration
                <span 
                  className={styles.infoIcon}
                  onClick={() => handleTooltipToggle('crm')}
                >
                  <FaInfoCircle />
                  {activeTooltip === 'crm' && (
                    <span className={styles.tooltip}>{tooltipContent.crm}</span>
                  )}
                </span>
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Custom APIs & Integrations
              </li>
              <li>
                <span className={styles.checkIcon}><FaCheck /></span>
                Premium Support
              </li>
            </ul>
            <p className={styles.note}>For businesses needing advanced solutions.</p>
            <button className={styles.ctaButton}>Get in Touch</button>
          </motion.div>
        </motion.div>
        
        <p className={styles.disclaimer}>
          * Prices may vary depending on specific requirements, features, or timeline. Contact us for a detailed quote.
        </p>
      </div>
    </section>
  );
};

export default PricingSection; 