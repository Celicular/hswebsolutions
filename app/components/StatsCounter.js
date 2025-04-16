'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './StatsCounter.module.css';
import { FaUsers, FaProjectDiagram, FaClock, FaHandshake } from 'react-icons/fa';

const statsData = [
  { 
    id: 1, 
    title: 'Clients',
    value: 60,
    suffix: '+',
    icon: <FaUsers />,
    color: '#673AB7'
  },
  { 
    id: 2, 
    title: 'Projects',
    value: 65,
    suffix: '+',
    icon: <FaProjectDiagram />,
    color: '#009688'
  },
  { 
    id: 3, 
    title: 'Work Hours',
    value: 4000,
    suffix: '+',
    icon: <FaClock />,
    color: '#2196F3'
  },
  { 
    id: 4, 
    title: 'Trust',
    value: 100,
    suffix: '%',
    icon: <FaHandshake />,
    color: '#00B0A3'
  }
];

const StatsCounter = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [counters, setCounters] = useState(statsData.map(() => 0));
  const animationsStarted = useRef(false);
  const isMobile = useRef(false);

  // Check if mobile on mount
  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
  }, []);

  // Animate stats when they come into view
  useEffect(() => {
    if (inView && !animationsStarted.current) {
      controls.start('visible');
      animationsStarted.current = true;
      
      // Start animated counters with staggered timing to reduce simultaneous updates
      statsData.forEach((stat, index) => {
        setTimeout(() => {
          animateCounter(index, stat.value);
        }, index * 100); // Stagger each counter's start by 100ms
      });
    }
  }, [controls, inView]);

  // Function to animate each counter
  const animateCounter = (index, targetValue) => {
    // Reduce animation complexity on mobile
    const isMobileDevice = isMobile.current;
    
    // Calculate duration based on value and device
    // Make animations shorter on mobile for better performance
    const baseDuration = isMobileDevice ? 800 : 1500;
    const duration = Math.min(baseDuration, Math.max(600, targetValue * (isMobileDevice ? 5 : 10)));
    
    // Use fewer frames on mobile for better performance
    const fps = isMobileDevice ? 30 : 60;
    const frameDuration = 1000 / fps;
    const totalFrames = Math.round(duration / frameDuration);
    
    // For very large numbers on mobile, use bigger step sizes to reduce total updates
    const stepMultiplier = isMobileDevice && targetValue > 1000 ? 3 : 1;
    
    let frame = 0;
    
    const counter = setInterval(() => {
      frame += stepMultiplier;
      
      // Use easeOutExpo for better animation feel, with simplified calculation for mobile
      const progress = frame / totalFrames;
      const easedProgress = isMobileDevice ? 
        progress * (2 - progress) : // Simple quadratic easing for mobile
        1 - Math.pow(1 - progress, 3); // Cubic easing for desktop
      
      const currentValue = Math.min(
        Math.floor(easedProgress * targetValue),
        targetValue
      );
      
      setCounters(prevCounters => {
        const newCounters = [...prevCounters];
        newCounters[index] = currentValue;
        return newCounters;
      });
      
      if (frame >= totalFrames) {
        clearInterval(counter);
        
        // Ensure we end exactly at the target value
        setCounters(prevCounters => {
          const newCounters = [...prevCounters];
          newCounters[index] = targetValue;
          return newCounters;
        });
      }
    }, frameDuration);
  };
  
  // Simpler animation variants for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  // Reduced motion for stats cards
  const statVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={styles.statsSection} ref={ref}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Track Record</h2>
        
        <motion.div 
          className={styles.statsContainer}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={stat.id}
              className={styles.statCard}
              variants={statVariants}
              style={{ '--accent-color': stat.color }}
              whileHover={{ y: -5 }}
              transition={{ type: "tween", duration: 0.2 }}
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
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter; 