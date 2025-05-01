'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaServer, FaDatabase, FaGlobe, FaHeadset, FaClock, FaShieldAlt, FaCheck, FaTimes, FaLock } from 'react-icons/fa';
import { RiCloudLine } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import styles from './HostingPlans.module.css';

const HostingPlans = () => {
  const [activeCategory, setActiveCategory] = useState('shared');
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState('shared');
  
  // Clean up body overflow style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Function to handle the contact page navigation
  const navigateToContact = () => {
    if (typeof window !== 'undefined' && window.openContactSidebar) {
      window.openContactSidebar();
    } else {
      window.location.href = '/contact';
    }
  };
  
  const plans = {
    shared: [
      {
        name: "Basic",
        price: 299,
        bandwidth: "10 GB",
        storage: "20 GB SSD",
        domains: "1 Domain",
        support: "Email Support",
        uptime: "99.9%",
        backups: "Weekly",
        ssl: "Free Basic SSL",
        cdn: "Not Included",
        color: "var(--link)"
      },
      {
        name: "Standard",
        price: 499,
        bandwidth: "Unlimited",
        storage: "100 GB SSD",
        domains: "5 Domains",
        support: "24/7 Chat Support",
        uptime: "99.95%",
        backups: "Daily",
        ssl: "Free Standard SSL",
        cdn: "Basic CDN",
        color: "var(--primary)",
        popular: true
      },
      {
        name: "Premium",
        price: 799,
        bandwidth: "Unlimited",
        storage: "250 GB SSD",
        domains: "Unlimited Domains",
        support: "Priority Support",
        uptime: "99.99%",
        backups: "Daily + Archive",
        ssl: "Premium Wildcard SSL",
        cdn: "Advanced CDN",
        color: "var(--accent)"
      }
    ],
    vps: [
      {
        name: "Starter VPS",
        price: 999,
        bandwidth: "2 TB",
        storage: "50 GB SSD",
        cpu: "2 vCPU",
        ram: "4 GB RAM",
        support: "24/7 Technical Support",
        uptime: "99.95%",
        backups: "Weekly",
        controlPanel: "Basic Panel",
        rootAccess: "Yes",
        color: "var(--link)"
      },
      {
        name: "Business VPS",
        price: 1999,
        bandwidth: "3 TB",
        storage: "100 GB SSD",
        cpu: "4 vCPU",
        ram: "8 GB RAM",
        support: "Priority Support",
        uptime: "99.99%",
        backups: "Daily",
        controlPanel: "Advanced Panel",
        rootAccess: "Yes",
        color: "var(--primary)",
        popular: true
      },
      {
        name: "Enterprise VPS",
        price: 3499,
        bandwidth: "5 TB",
        storage: "200 GB SSD",
        cpu: "8 vCPU",
        ram: "16 GB RAM",
        support: "Dedicated Support Team",
        uptime: "99.99%",
        backups: "Daily + Archive",
        controlPanel: "Premium Panel",
        rootAccess: "Yes",
        color: "var(--accent)"
      }
    ],
    dedicated: [
      {
        name: "Performance",
        price: 4999,
        bandwidth: "10 TB",
        storage: "500 GB SSD",
        cpu: "Intel Xeon 4-Core",
        ram: "16 GB RAM",
        support: "24/7 Priority Support",
        uptime: "99.99%",
        backups: "Daily",
        ddosProtection: "Basic",
        managedServices: "Optional",
        color: "var(--link)"
      },
      {
        name: "Professional",
        price: 7999,
        bandwidth: "Unlimited",
        storage: "1 TB SSD",
        cpu: "Intel Xeon 8-Core",
        ram: "32 GB RAM",
        support: "Dedicated Support Manager",
        uptime: "99.995%",
        backups: "Daily + Archive",
        ddosProtection: "Advanced",
        managedServices: "Basic Included",
        color: "var(--primary)",
        popular: true
      },
      {
        name: "Enterprise",
        price: 12999,
        bandwidth: "Unlimited",
        storage: "2 TB SSD",
        cpu: "Intel Xeon 16-Core",
        ram: "64 GB RAM",
        support: "Enterprise Support Team",
        uptime: "99.999%",
        backups: "Realtime + Archive",
        ddosProtection: "Premium",
        managedServices: "Fully Managed",
        color: "var(--accent)"
      }
    ]
  };
  
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
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Helper function to render feature items with different icons
  const renderFeatureItem = (feature, value, planType, color) => {
    let icon;
    
    if (feature === 'uptime') {
      icon = <FaClock className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'support') {
      icon = <FaHeadset className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'bandwidth') {
      icon = <FaGlobe className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'storage') {
      icon = <FaDatabase className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'domains') {
      icon = <RiCloudLine className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'cpu') {
      icon = <FaServer className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'ram') {
      icon = <FaServer className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'backups') {
      icon = <FaShieldAlt className={styles.featureIcon} style={{color}} />;
    } else if (feature === 'ssl') {
      icon = <FaLock className={styles.featureIcon} style={{color}} />;
    } else {
      icon = <FaCheck className={styles.featureIcon} style={{color}} />;
    }
    
    return (
      <div className={styles.featureItem}>
        {icon}
        <span className={styles.featureLabel}>{feature.charAt(0).toUpperCase() + feature.slice(1)}:</span>
        <span className={styles.featureValue}>{value}</span>
      </div>
    );
  };
  
  // Generate feature comparison data
  const getComparisonData = () => {
    const features = [
      { id: 'bandwidth', label: 'Bandwidth' },
      { id: 'storage', label: 'Storage' },
      { id: 'domains', label: 'Websites' },
      { id: 'support', label: 'Support' },
      { id: 'uptime', label: 'Uptime' },
      { id: 'backups', label: 'Backups' },
      { id: 'ssl', label: 'SSL Certificate' },
      { id: 'cdn', label: 'CDN' },
    ];

    return features;
  };
  
  // Handle modal close
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };
  
  const openComparisonModal = () => {
    setModalCategory(activeCategory);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  return (
    <section className={styles.hostingPlans}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Reliable Hosting Solutions</h2>
        <p className={styles.sectionSubtitle}>Choose the perfect hosting plan for your website's needs</p>
        
        <div className={styles.categoryTabs}>
          <button 
            className={`${styles.categoryTab} ${activeCategory === 'shared' ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory('shared')}
          >
            Shared Hosting
          </button>
          <button 
            className={`${styles.categoryTab} ${activeCategory === 'vps' ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory('vps')}
          >
            VPS Hosting
          </button>
          <button 
            className={`${styles.categoryTab} ${activeCategory === 'dedicated' ? styles.activeTab : ''}`}
            onClick={() => setActiveCategory('dedicated')}
          >
            Dedicated Hosting
          </button>
        </div>
        
        <motion.div 
          className={styles.plansContainer}
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {plans[activeCategory].map((plan, index) => (
            <motion.div 
              key={index} 
              className={`${styles.planCard} ${plan.popular ? styles.popularPlan : ''}`}
              variants={cardVariants}
            >
              {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
              
              <div className={styles.planHeader} style={{ background: `linear-gradient(135deg, ${plan.color}33 0%, ${plan.color}15 100%)` }}>
                <h3 className={styles.planName}>{plan.name}</h3>
              </div>
              
              <div className={styles.planPrice}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>{plan.price}</span>
                <span className={styles.period}>/month</span>
              </div>
              
              <div className={styles.planFeatures}>
                {Object.entries(plan).map(([key, value]) => {
                  if (key !== 'name' && key !== 'price' && key !== 'color' && key !== 'popular') {
                    return (
                      <div key={key}>
                        {renderFeatureItem(key, value, activeCategory, plan.color)}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
              <div className={styles.planFooter}>
                <Link href="/contact" className={styles.estimateBlock} style={{ borderColor: `${plan.color}66` }}>
                  <span>Get your estimate now</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className={styles.compareFeatures}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>Need help deciding? <span className={styles.compareLink} onClick={openComparisonModal}>Compare all features</span></p>
        </motion.div>
        
        {/* Feature Comparison Modal */}
        <AnimatePresence mode="wait">
          {showModal && (
            <>
              <motion.div 
                className={styles.modalOverlay}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={closeModal}
              />
              <motion.div 
                className={styles.modal}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h3>Complete Feature Comparison</h3>
                  <button onClick={closeModal} className={styles.closeButton} aria-label="Close modal">
                    <IoMdClose size={24} />
                  </button>
                </div>
                
                <div className={styles.modalTabs}>
                  <button 
                    className={`${styles.modalTab} ${modalCategory === 'shared' ? styles.activeModalTab : ''}`}
                    onClick={() => setModalCategory('shared')}
                  >
                    Shared Hosting
                  </button>
                  <button 
                    className={`${styles.modalTab} ${modalCategory === 'vps' ? styles.activeModalTab : ''}`}
                    onClick={() => setModalCategory('vps')}
                  >
                    VPS Hosting
                  </button>
                  <button 
                    className={`${styles.modalTab} ${modalCategory === 'dedicated' ? styles.activeModalTab : ''}`}
                    onClick={() => setModalCategory('dedicated')}
                  >
                    Dedicated Hosting
                  </button>
                </div>
                
                <div className={styles.modalContent}>
                  <div className={styles.comparisonTable}>
                    <div className={styles.comparisonHeader}>
                      <div className={styles.featureColumn}>
                        <h4>Features</h4>
                      </div>
                      {plans[modalCategory].map((plan, index) => (
                        <div className={styles.planColumn} key={index}>
                          <h4 className={plan.popular ? styles.popularHeader : ''}>
                            {plan.name}
                            {plan.popular && <span className={styles.modalPopularBadge}>Popular</span>}
                          </h4>
                          <div className={styles.modalPrice}>
                            <span className={styles.modalCurrency}>₹</span>
                            <span className={styles.modalAmount}>{plan.price}</span>
                            <span className={styles.modalPeriod}>/mo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.comparisonBody}>
                      {getComparisonData().map((feature) => (
                        <div className={styles.comparisonRow} key={feature.id}>
                          <div className={styles.featureColumn}>
                            <span className={styles.featureLabel}>{feature.label}</span>
                          </div>
                          {plans[modalCategory].map((plan, index) => (
                            <div className={styles.planColumn} key={index}>
                              <span className={styles.featureValue} style={{ color: plan.popular ? plan.color : 'inherit' }}>
                                {plan[feature.id] || 'Not included'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={styles.modalFooter}>
                  <button className={styles.modalClose} onClick={closeModal}>Close</button>
                  <Link href="/contact" className={styles.modalEstimateBlock}>
                    <span>Get your estimate now</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HostingPlans;