'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './AboutHero.module.css';

const AboutHero = () => {
  const heroRef = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  
  const navigateToServices = () => {
    router.push('/services#services-overview');
  };
  
  const scrollToProcess = () => {
    // Find the Timeline component and scroll to it
    const processSection = document.getElementById('timeline-section');
    if (processSection) {
      processSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <motion.section 
      className={styles.heroSection} 
      ref={heroRef}
      style={{ scale: heroScale, opacity: heroOpacity }}
    >
      <div className={styles.heroGraphic}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
        <div className={styles.grid}></div>
        <div className={styles.shapesContainer}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>
      </div>
      
      <div className={styles.heroContent}>
        <motion.div 
          className={styles.heroTextContainer}
          style={{ y: textY }}
        >
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            We Build <span>Digital Excellence</span>
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Blending creativity with technical precision to craft web experiences 
            that transform ideas into digital realities
          </motion.p>
          
          <motion.div 
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className={styles.primaryButton} onClick={navigateToServices}>Our Services</button>
            <button className={styles.secondaryButton} onClick={scrollToProcess}>Our Process</button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.heroImageContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className={styles.heroImageClip}>
            <div className={styles.heroImage}>
              <div className={styles.glowEffect}></div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.mouseIcon}>
          <div className={styles.mouseWheel}></div>
        </div>
        <p>Scroll to explore</p>
      </div>
    </motion.section>
  );
};

export default AboutHero; 