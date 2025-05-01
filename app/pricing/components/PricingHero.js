'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './PricingHero.module.css';

const PricingHero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // For the animated background pattern
  const patternRef = useRef(null);
  
  useEffect(() => {
    if (!patternRef.current) return;
    
    const pattern = patternRef.current;
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const rect = pattern.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      // Parallax effect for the pattern
      const moveX = (x - rect.width / 2) * 0.02;
      const moveY = (y - rect.height / 2) * 0.02;
      
      pattern.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className={styles.pricingHero} ref={heroRef}>
      <div className={styles.backgroundContainer}>
        <div className={styles.patternContainer} ref={patternRef}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.pattern}>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--link)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.05" />
                <stop offset="100%" stopColor="var(--link)" stopOpacity="0.1" />
              </linearGradient>
              <pattern id="hexagons" width="10" height="18" patternUnits="userSpaceOnUse">
                <polygon points="5,0 10,2.5 10,7.5 5,10 0,7.5 0,2.5" fill="var(--hexagon-fill)" stroke="var(--hexagon-stroke)" strokeWidth="0.2"/>
                <polygon points="5,10 10,12.5 10,17.5 5,20 0,17.5 0,12.5" fill="var(--hexagon-fill)" stroke="var(--hexagon-stroke)" strokeWidth="0.2"/>
                <polygon points="15,5 20,7.5 20,12.5 15,15 10,12.5 10,7.5" fill="var(--hexagon-fill)" stroke="var(--hexagon-stroke)" strokeWidth="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
            <path d="M0,20 Q50,40 100,20 L100,100 L0,100 Z" fill="url(#gradient1)" />
            <path d="M0,40 Q50,60 100,40 L100,100 L0,100 Z" fill="url(#gradient2)" />
            <path d="M0,60 Q50,80 100,60 L100,100 L0,100 Z" fill="url(#gradient3)" />
          </svg>
        </div>
        <div className={styles.glassmorphism}></div>
      </div>
      
      <div className={styles.heroContent}>
        <motion.h1 
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Transparent Pricing for Exceptional Value
        </motion.h1>
        
        <motion.p 
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Simple, predictable pricing with no hidden costs. Find the perfect plan for your business needs.
        </motion.p>
        
        <motion.div 
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.estimateBlock}>
            <svg className={styles.estimateIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5Z" strokeWidth="1.5" />
              <path d="M21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z" strokeWidth="1.5" />
              <path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" strokeWidth="1.5" />
              <path d="M9 12H15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 5H9V12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 19H9V12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Get your estimate now</span>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className={styles.scrollIcon}>
            <span></span>
          </div>
          <p>Scroll to learn more</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingHero; 