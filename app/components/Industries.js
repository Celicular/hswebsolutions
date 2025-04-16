'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaStore, FaGraduationCap, FaHospital, FaHotel, FaHome, FaChurch, FaCarAlt } from 'react-icons/fa';
import styles from './Industries.module.css';

const Industries = () => {
  const randomPositionsRef = useRef(null);
  const isMobileRef = useRef(false);

  // Generate random positions for the cards in desktop view
  const getRandomPositions = () => {
    const positions = [];
    const industries = [
      { name: "Corporate", icon: FaBriefcase, color: "#673AB7" },
      { name: "Retail", icon: FaStore, color: "#2196F3" },
      { name: "Education", icon: FaGraduationCap, color: "#FF5722" },
      { name: "Healthcare", icon: FaHospital, color: "#4CAF50" },
      { name: "Hospitality", icon: FaHotel, color: "#FFC107" },
      { name: "Real Estate", icon: FaHome, color: "#9C27B0" },
      { name: "Religious", icon: FaChurch, color: "#00B0A3" },
      { name: "Automotive", icon: FaCarAlt, color: "#E91E63" }
    ];

    industries.forEach((industry, index) => {
      positions.push({
        initialScale: Math.random() * 0.2 + 0.6, // Between 0.6 and 0.8
        rotation: (Math.random() * 10 - 5), // Between -5 and 5 degrees
        delay: index * 0.1 + Math.random() * 0.2, // Staggered with random offset
        yOffset: Math.random() * 30 - 15, // Between -15 and 15px
        xOffset: Math.random() * 20 - 10, // Between -10 and 10px
      });
    });
    
    return positions;
  };

  // Initialize random positions and check for mobile view
  useEffect(() => {
    randomPositionsRef.current = getRandomPositions();
    isMobileRef.current = window.innerWidth < 992;
    
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 992;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const industries = [
    { name: "Corporate", icon: FaBriefcase, color: "#673AB7", colorRgb: "103, 58, 183" },
    { name: "Retail", icon: FaStore, color: "#2196F3", colorRgb: "33, 150, 243" },
    { name: "Education", icon: FaGraduationCap, color: "#FF5722", colorRgb: "255, 87, 34" },
    { name: "Healthcare", icon: FaHospital, color: "#4CAF50", colorRgb: "76, 175, 80" },
    { name: "Hospitality", icon: FaHotel, color: "#FFC107", colorRgb: "255, 193, 7" },
    { name: "Real Estate", icon: FaHome, color: "#9C27B0", colorRgb: "156, 39, 176" },
    { name: "Religious", icon: FaChurch, color: "#00B0A3", colorRgb: "0, 176, 163" },
    { name: "Automotive", icon: FaCarAlt, color: "#E91E63", colorRgb: "233, 30, 99" }
  ];

  // Animation variants for the cards
  const cardVariants = {
    hidden: (custom) => ({
      opacity: 0,
      scale: custom.initialScale || 0.8,
      y: 50,
      rotate: custom.rotation || 0,
    }),
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      y: custom.yOffset || 0,
      x: custom.xOffset || 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: custom.delay || 0,
      }
    }),
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Decorative elements variants
  const decorElements = [
    { type: 'circle', top: '10%', left: '5%', delay: 0 },
    { type: 'box', top: '70%', right: '10%', delay: 2 },
    { type: 'circle', bottom: '15%', left: '20%', delay: 4 },
    { type: 'box', top: '15%', right: '20%', delay: 6 },
  ];

  return (
    <section className={styles.industriesSection} id="industries">
      <div className={styles.backgroundPattern}></div>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Industries We Serve</h2>
          <p className={styles.sectionSubtitle}>
            We build custom websites and web applications tailored to the unique needs of different industries,
            ensuring your online presence effectively serves your specific market.
          </p>
        </div>

        {/* Decorative elements */}
        {decorElements.map((elem, index) => (
          <motion.div
            key={`decor-${index}`}
            className={elem.type === 'circle' ? styles.decorCircle : styles.decorBox}
            style={{
              top: elem.top || 'auto',
              left: elem.left || 'auto',
              right: elem.right || 'auto',
              bottom: elem.bottom || 'auto',
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.15,
              transition: { delay: elem.delay, duration: 1 }
            }}
          />
        ))}

        <motion.div 
          className={styles.industriesGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              className={styles.industryCard}
              variants={cardVariants}
              custom={randomPositionsRef.current ? randomPositionsRef.current[index] : {}}
              whileHover="hover"
              style={{
                '--card-color': industry.color,
                '--card-color-rgb': industry.colorRgb,
                '--rotate': `${index * 45}deg`,
                '--delay': `${index * 0.5}s`
              }}
            >
              <div className={styles.cardContent}>
                <div className={styles.hexShape}>
                  <div className={styles.iconWrapper}>
                    <industry.icon className={styles.icon} />
                    <div className={styles.iconGlow}></div>
                  </div>
                </div>
                <h3 className={styles.industryTitle}>{industry.name}</h3>
              </div>
              <div className={styles.cardBorder}></div>
              <div className={styles.cardHighlight}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Industries; 