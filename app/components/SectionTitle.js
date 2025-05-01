'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './SectionTitle.module.css';

const SectionTitle = ({ title, subtitle, center = true, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  
  return (
    <div 
      ref={ref}
      className={`${styles.sectionHeader} ${center ? styles.center : ''}`}
    >
      <motion.h2 
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: delay * 0.1 }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          className={styles.sectionSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: (delay + 1) * 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle; 