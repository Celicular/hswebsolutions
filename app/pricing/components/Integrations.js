'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Integrations.module.css';
import Link from 'next/link';

// Group integrations by category
const INTEGRATION_CATEGORIES = {
  CMS: [
    { name: 'WordPress', description: 'World\'s most popular CMS with extensive plugin ecosystem.' },
    { name: 'Drupal', description: 'Enterprise-grade CMS for complex sites and applications.' },
    { name: 'Joomla', description: 'Flexible content management system with robust extensions.' }
  ],
  ECOMMERCE: [
    { name: 'WooCommerce', description: 'Customizable eCommerce platform built on WordPress.' },
    { name: 'Magento', description: 'Powerful eCommerce solution for growing businesses.' },
    { name: 'Shopify', description: 'All-in-one commerce platform to sell online and in-person.' }
  ],
  DEVELOPER: [
    { name: 'Git', description: 'Version control system for tracking code changes.' },
    { name: 'Node.js', description: 'JavaScript runtime for server-side applications.' },
    { name: 'Docker', description: 'Containerization platform for consistent deployments.' }
  ],
  MARKETING: [
    { name: 'Google Analytics', description: 'Web analytics service for tracking website traffic.' },
    { name: 'Mailchimp', description: 'Email marketing platform for campaigns and automation.' },
    { name: 'HubSpot', description: 'All-in-one inbound marketing, sales, and CRM software.' }
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    y: -5
  },
  tap: { scale: 0.98 }
};

const pillVariants = {
  inactive: { 
    opacity: 0.7,
    scale: 0.98,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  active: { 
    opacity: 1,
    scale: 1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
  }
};

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState('CMS');
  
  return (
    <section className={styles.integrations}>
      <div className={styles.shapeDivider}>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.headerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 
            className={styles.sectionTitle}
            variants={titleVariants}
          >
            Powerful Integrations
            <span className={styles.titleAccent}></span>
          </motion.h2>
          
          <motion.p 
            className={styles.sectionDescription}
            variants={titleVariants}
          >
            Our hosting plans seamlessly connect with your favorite platforms.
            Set up your technology stack with just a few clicks.
          </motion.p>
          
          <motion.div className={styles.categoryPills}>
            {Object.keys(INTEGRATION_CATEGORIES).map((category) => (
              <motion.button
                key={category}
                className={`${styles.categoryPill} ${activeCategory === category ? styles.activePill : ''}`}
                onClick={() => setActiveCategory(category)}
                variants={pillVariants}
                initial="inactive"
                animate={activeCategory === category ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                {activeCategory === category && (
                  <motion.span 
                    className={styles.activePillIndicator}
                    layoutId="pillIndicator"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className={styles.integrationsGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {INTEGRATION_CATEGORIES[activeCategory].map((integration, index) => (
              <motion.div 
                key={integration.name}
                className={styles.integrationCard}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                whileTap="tap"
                viewport={{ once: true, amount: 0.1 }}
                custom={index}
              >
                <div className={styles.integrationContent}>
                  <div className={styles.iconIndicator}>
                    <span className={styles.iconText}>{integration.name.charAt(0)}</span>
                    <div className={styles.glowEffect}></div>
                  </div>
                  
                  <h3 className={styles.integrationName}>
                    {integration.name}
                    <div className={styles.nameUnderline}></div>
                  </h3>
                  
                  <p className={styles.integrationDescription}>
                    {integration.description}
                  </p>
                  
                  <div className={styles.integrationFeatures}>
                    <span className={styles.feature}>Quick Setup</span>
                    <span className={styles.feature}>Auto Updates</span>
                  </div>
                </div>
                
                <div className={styles.cardBackground}>
                  <div className={styles.bgCircle}></div>
                  <div className={styles.bgSquare}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className={styles.integrationsFooter}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              Don't see what you need? We support hundreds of additional integrations.
            </p>
            <Link href="/contact" className={styles.ctaButton}>
              Get Custom Integration Support
              <motion.span 
                className={styles.btnArrow}
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  duration: 1
                }}
              >→</motion.span>
            </Link>
          </div>
          
          <div className={styles.footerDecoration}>
            <div className={styles.decorationDot}></div>
            <div className={styles.decorationLine}></div>
            <div className={styles.decorationDot}></div>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.bottomShapeDivider}>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </section>
  );
} 