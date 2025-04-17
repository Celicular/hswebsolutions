'use client';

import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './KeyFeatures.module.css';
import { 
  FaDatabase, 
  FaShieldAlt, 
  FaMedal, 
  FaUserFriends, 
  FaHeadset, 
  FaDollarSign 
} from 'react-icons/fa';

const featureData = [
  {
    id: 1,
    title: 'Data Backup',
    icon: <FaDatabase />,
    description: 'Regular, secure backups that ensure your data is never lost and always recoverable.',
    color: '#673AB7'
  },
  {
    id: 2,
    title: 'Data Protection',
    icon: <FaShieldAlt />,
    description: 'State-of-the-art security measures to protect your sensitive information from threats.',
    color: '#009688'
  },
  {
    id: 3,
    title: 'Quality Deliverance',
    icon: <FaMedal />,
    description: 'Excellence in every project with meticulous attention to detail and craftsmanship.',
    color: '#2196F3'
  },
  {
    id: 4,
    title: 'Dedicated Team',
    icon: <FaUserFriends />,
    description: 'Committed professionals focused exclusively on your project needs and success.',
    color: '#FF5722'
  },
  {
    id: 5,
    title: 'Professional Support',
    icon: <FaHeadset />,
    description: 'Round-the-clock expert assistance whenever you need guidance or help.',
    color: '#00B0A3'
  },
  {
    id: 6,
    title: 'Affordable Pricing',
    icon: <FaDollarSign />,
    description: 'Competitive rates that deliver exceptional value without compromising quality.',
    color: '#8BC34A'
  }
];

const KeyFeatures = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Start animations when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Variants for container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Variants for individual cards
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={styles.featuresSection} ref={ref}>
      {/* Add background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle} style={{ top: '15%', right: '10%' }}></div>
        <div className={styles.bgSquare} style={{ top: '70%', left: '5%' }}></div>
        <div className={styles.bgCircle} style={{ bottom: '20%', right: '15%' }}></div>
        <div className={styles.bgDots}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Key Features</h2>
          <p className={styles.sectionSubtitle}>
            We always use the most avant-garde technology to design and develop your website and application. 
            We work to unfold your success.
          </p>
        </div>
        
        <motion.div 
          className={styles.featuresGrid}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {featureData.map((feature) => (
            <motion.div 
              key={feature.id}
              className={styles.featureCard}
              variants={cardVariants}
              style={{ 
                '--card-color': feature.color,
                '--card-color-rgb': feature.color.replace('#', '').match(/.{2}/g)
                  ?.map(hex => parseInt(hex, 16)).join(', ') || '255, 255, 255'
              }}
              whileHover={{ 
                y: -10,
                boxShadow: `0 20px 35px rgba(0, 0, 0, 0.2), 0 0 10px ${feature.color}40`
              }}
              initial={{y: 0}}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <div className={styles.glowEffect}></div>
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
              <div className={styles.cardBackground}>
                <div className={styles.cardShape}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures; 