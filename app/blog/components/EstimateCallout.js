'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import styles from './EstimateCallout.module.css';

export default function EstimateCallout() {
  const calloutRef = useRef(null);
  const isInView = useInView(calloutRef, { once: true, amount: 0.3 });
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1 
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1] 
      }
    }
  };
  
  const decorationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 0.7, 
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.25, 0.1, 0.25, 1] 
      }
    }
  };

  return (
    <section className={styles.estimateCallout} ref={calloutRef}>
      <div className={styles.bgDecorations}>
        <motion.div 
          className={`${styles.decoration} ${styles.decorationTop}`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={decorationVariants}
        />
        <motion.div 
          className={`${styles.decoration} ${styles.decorationBottom}`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={decorationVariants}
        />
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.calloutContent}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 
            className={styles.calloutTitle}
            variants={childVariants}
          >
            Ready to transform your online presence?
          </motion.h2>
          
          <motion.p 
            className={styles.calloutDescription}
            variants={childVariants}
          >
            Get a customized hosting solution and website strategy tailored to your business needs.
          </motion.p>
          
          <motion.div 
            className={styles.calloutCta}
            variants={childVariants}
          >
            <div className={styles.ctaButtonWrapper}>
              <Link href="/contact" className={styles.primaryButton}>
                <span className={styles.buttonInner}>
                  Get Your Free Estimate
                  <span className={styles.buttonArrow}>→</span>
                </span>
                <span className={styles.buttonGlow}></span>
              </Link>
            </div>
            
            <motion.p 
              className={styles.calloutNote}
              variants={childVariants}
            >
              No commitment required. Typically responds within 24 hours.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 