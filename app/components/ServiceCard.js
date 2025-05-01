'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ title, description, icon, benefits, technologies, methodologies, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <>
      <motion.div 
        className={styles.serviceCard}
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: delay * 0.1 }}
      >
        <div className={styles.serviceIcon}>
          {icon}
          <div className={styles.iconGlow}></div>
        </div>
        <h3 className={styles.serviceTitle}>{title}</h3>
        <p className={styles.serviceDescription}>{description}</p>
        
        <div className={styles.serviceFooter}>
          <button 
            className={styles.expandButton}
            onClick={openModal}
          >
            Learn More
          </button>
          <button className={styles.ctaButton}>Enquire Now</button>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <h2 className={styles.modalTitle}>{title}</h2>
            <p className={styles.modalDescription}>{description}</p>
            
            {benefits && (
              <div className={styles.serviceSection}>
                <h4>Why Choose Our {title}</h4>
                <ul className={styles.serviceList}>
                  {benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {technologies && (
              <div className={styles.serviceSection}>
                <h4>Technologies We Use</h4>
                <ul className={styles.serviceList}>
                  {technologies.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {methodologies && (
              <div className={styles.serviceSection}>
                <h4>Our Approach</h4>
                <ul className={styles.serviceList}>
                  {methodologies.map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button className={styles.modalCtaButton}>Enquire Now</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard; 