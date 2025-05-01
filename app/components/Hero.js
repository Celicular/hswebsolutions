'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';
import AnimatedBackground from './AnimatedBackground';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  return (
    <motion.div 
      className={styles.heroSection} 
      ref={heroRef}
      style={{ scale: heroScale, opacity: heroOpacity }}
    >
      <AnimatedBackground />
      <div className={styles.heroContent}>
        <motion.h1 
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Elevate Your Digital Presence
        </motion.h1>
        <motion.p 
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We craft beautiful, responsive websites that drive results
          and provide exceptional user experiences
        </motion.p>
        <motion.div 
          className={styles.heroCta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/contact">
            <button className={styles.primaryButton}>Get Started</button>
          </Link>
          <Link href="/services">
            <button className={styles.secondaryButton}>Learn More</button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero; 