'use client';

import React from 'react';
import styles from './Hero.module.css';
import AnimatedBackground from './AnimatedBackground';

const Hero = () => {
  return (
    <div className={styles.heroSection}>
      <AnimatedBackground />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Elevate Your Digital Presence
        </h1>
        <p className={styles.heroSubtitle}>
          We craft beautiful, responsive websites that drive results
          and provide exceptional user experiences
        </p>
        <div className={styles.heroCta}>
          <button className={styles.primaryButton}>Get Started</button>
          <button className={styles.secondaryButton}>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Hero; 