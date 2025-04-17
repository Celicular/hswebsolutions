'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import styles from './StatsCounter.module.css';
import { FaUsers, FaProjectDiagram, FaClock, FaHandshake } from 'react-icons/fa';

const statsData = [
  {
    icon: <FaUsers />,
    value: 85,
    suffix: '+',
    title: 'Satisfied Clients',
    accentColor: '#3b82f6'
  },
  {
    icon: <FaProjectDiagram />,
    value: 95,
    suffix: '+',
    title: 'Projects Completed',
    accentColor: '#38bdf8'
  },
  {
    icon: <FaClock />,
    value: 12000,
    suffix: '+',
    title: 'Hours of Work',
    accentColor: '#8b5cf6'
  },
  {
    icon: <FaHandshake />,
    value: 100,
    suffix: '%',
    title: 'Client Trust',
    accentColor: '#10b981'
  }
];

export default function StatsCounter() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if on mobile device for performance optimizations
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Create counters for all stats regardless of mobile/desktop
  const counters = statsData.map(stat => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isInView) return;
      
      // Skip animation on mobile devices
      if (isMobile) {
        setCount(stat.value);
        return;
      }
      
      let startTime;
      let animationFrame;
      const duration = 2;
      
      const countUp = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuad = t => t * (2 - t);
        const easedProgress = easeOutQuad(percentage);
        
        setCount(Math.floor(easedProgress * stat.value));
        
        if (percentage < 1) {
          animationFrame = requestAnimationFrame(countUp);
        }
      };
      
      animationFrame = requestAnimationFrame(countUp);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [stat.value, isInView, isMobile]);
    
    return count;
  });
  
  return (
    <section className={styles.statsSection} ref={ref}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgDots}></div>
        <motion.div 
          className={styles.bgCircle}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4, x: [0, 20, 0], y: [0, 10, 0] } : {}}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '10%', right: '15%' }}
        />
        <motion.div 
          className={styles.bgCircle}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3, x: [0, -15, 0], y: [0, -20, 0] } : {}}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ bottom: '15%', left: '10%' }}
        />
        <motion.div 
          className={styles.bgSquare}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3, rotate: [15, 30, 15] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '30%', left: '5%' }}
        />
        <motion.div 
          className={styles.bgSquare}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.2, rotate: [0, -20, 0] } : {}}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ bottom: '10%', right: '5%' }}
        />
      </div>
      
      <div className={styles.container}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Our Success in Numbers
        </motion.h2>
        
        <div className={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              className={styles.statCard}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              variants={{
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.6, 
                    delay: index * 0.1 + 0.3 
                  } 
                }
              }}
              style={{ '--accent-color': stat.accentColor }}
            >
              <div className={styles.iconContainer}>
                {stat.icon}
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>
                  {counters[index]}
                  <span className={styles.statSuffix}>{stat.suffix}</span>
                </h3>
                <p className={styles.statTitle}>{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 