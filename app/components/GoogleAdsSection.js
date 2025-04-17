'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './GoogleAdsSection.module.css';
import { FaGoogle, FaArrowRight, FaChartLine, FaCog, FaMousePointer, FaBrain, FaLaptopCode } from 'react-icons/fa';

const GoogleAdsSection = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const cardsRef = useRef(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (!cardsRef.current) return;
    
    const handleMouseMove = (e) => {
      const cards = cardsRef.current.querySelectorAll(`.${styles.adCard}`);
      const rect = cardsRef.current.getBoundingClientRect();
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      cards.forEach((card, index) => {
        const cardX = card.getBoundingClientRect().left - rect.left + card.offsetWidth / 2;
        const cardY = card.getBoundingClientRect().top - rect.top + card.offsetHeight / 2;
        
        const distX = mouseX - cardX;
        const distY = mouseY - cardY;
        
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
        
        const intensity = (1 - Math.min(distance / maxDistance, 1)) * 10;
        
        const rotateX = distY * intensity * 0.05;
        const rotateY = -distX * intensity * 0.05;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          rotateZ(${(index - 1) * 5}deg)
          translateZ(${intensity * 2}px)
        `;
      });
    };
    
    const resetCardPosition = (index) => {
      return () => {
        const cards = cardsRef.current.querySelectorAll(`.${styles.adCard}`);
        if (cards[index]) {
          cards[index].style.transform = `
            perspective(1000px)
            rotate(${(index - 1) * 5}deg)
            rotateX(0deg)
            rotateY(0deg)
            rotateZ(${(index - 1) * 5}deg)
            translateZ(0px)
          `;
        }
      };
    };
    
    const handleMouseLeave = () => {
      const cards = cardsRef.current.querySelectorAll(`.${styles.adCard}`);
      cards.forEach((card, index) => {
        card.style.transform = `
          perspective(1000px)
          rotate(${(index - 1) * 5}deg)
          rotateX(0deg)
          rotateY(0deg)
          rotateZ(${(index - 1) * 5}deg)
          translateZ(0px)
        `;
      });
    };
    
    const cardsElement = cardsRef.current;
    cardsElement.addEventListener('mousemove', handleMouseMove);
    cardsElement.addEventListener('mouseleave', handleMouseLeave);
    
    // Add individual card event listeners
    const cards = cardsRef.current.querySelectorAll(`.${styles.adCard}`);
    const cardListeners = [];
    
    cards.forEach((card, index) => {
      const listener = resetCardPosition(index);
      card.addEventListener('mouseout', listener);
      cardListeners.push({ element: card, listener });
    });
    
    return () => {
      cardsElement.removeEventListener('mousemove', handleMouseMove);
      cardsElement.removeEventListener('mouseleave', handleMouseLeave);
      
      // Clean up individual card listeners
      cardListeners.forEach(({ element, listener }) => {
        element.removeEventListener('mouseout', listener);
      });
    };
  }, [inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 20px rgba(5, 169, 244, 0.8)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const features = [
    { id: 1, icon: <FaMousePointer />, text: "Precision Targeting" },
    { id: 2, icon: <FaChartLine />, text: "Performance Optimization" },
    { id: 3, icon: <FaCog />, text: "Conversion Tracking" },
    { id: 4, icon: <FaBrain />, text: "Smart Bidding & Budget Control" },
    { id: 5, icon: <FaLaptopCode />, text: "Custom Landing Page Integration" }
  ];

  return (
    <section className={styles.googleAdsSection} ref={ref}>
      <div className={styles.backgroundEffects}>
        <div className={styles.gradientMesh}></div>
        <div className={styles.particles}></div>
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.logoWrapper}
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={styles.floatingLogo}>
            <FaGoogle />
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.sectionHeader}
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className={styles.sectionTitle}>
            Accelerate Your Growth with Google Ads
          </h2>
          <p className={styles.sectionSubtitle}>
            Smart advertising solutions that deliver real-time traffic and measurable ROI.
          </p>
        </motion.div>
        
        <div className={styles.contentWrapper}>
          <motion.div 
            className={styles.adCardsWrapper}
            ref={cardsRef}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className={`${styles.adCard} ${styles.adCard1}`}
              variants={cardVariants}
            >
              <div className={styles.adCardInner}>
                <div className={styles.adHeader}>
                  <div className={styles.adCampaign}>Campaign: Summer Sale</div>
                  <div className={styles.adStats}>
                    <span className={styles.adStat}>CTR: 4.8%</span>
                    <span className={styles.adStat}>Conv: 12.3%</span>
                  </div>
                </div>
                <div className={styles.adContent}>
                  <div className={styles.adKeywords}>
                    <div className={styles.keyword}>web development</div>
                    <div className={styles.keyword}>+mobile app</div>
                    <div className={styles.keyword}>+digital marketing</div>
                  </div>
                  <div className={styles.adPerformance}>
                    <div className={styles.performanceBar}>
                      <div className={styles.performanceFill} style={{width: '78%'}}></div>
                    </div>
                    <div className={styles.performanceLabel}>Performance: Excellent</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`${styles.adCard} ${styles.adCard2}`}
              variants={cardVariants}
            >
              <div className={styles.adCardInner}>
                <div className={styles.adHeader}>
                  <div className={styles.adCampaign}>Campaign: Lead Gen</div>
                  <div className={styles.adStats}>
                    <span className={styles.adStat}>CTR: 3.9%</span>
                    <span className={styles.adStat}>Conv: 8.7%</span>
                  </div>
                </div>
                <div className={styles.adContent}>
                  <div className={styles.adKeywords}>
                    <div className={styles.keyword}>business solutions</div>
                    <div className={styles.keyword}>+IT services</div>
                    <div className={styles.keyword}>+web design</div>
                  </div>
                  <div className={styles.adPerformance}>
                    <div className={styles.performanceBar}>
                      <div className={styles.performanceFill} style={{width: '65%'}}></div>
                    </div>
                    <div className={styles.performanceLabel}>Performance: Good</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={`${styles.adCard} ${styles.adCard3}`}
              variants={cardVariants}
            >
              <div className={styles.adCardInner}>
                <div className={styles.adHeader}>
                  <div className={styles.adCampaign}>Campaign: Ecommerce</div>
                  <div className={styles.adStats}>
                    <span className={styles.adStat}>CTR: 5.2%</span>
                    <span className={styles.adStat}>Conv: 15.1%</span>
                  </div>
                </div>
                <div className={styles.adContent}>
                  <div className={styles.adKeywords}>
                    <div className={styles.keyword}>online store</div>
                    <div className={styles.keyword}>+ecommerce solution</div>
                    <div className={styles.keyword}>+shopping cart</div>
                  </div>
                  <div className={styles.adPerformance}>
                    <div className={styles.performanceBar}>
                      <div className={styles.performanceFill} style={{width: '92%'}}></div>
                    </div>
                    <div className={styles.performanceLabel}>Performance: Outstanding</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className={styles.contentCard}
            variants={contentVariants}
            initial="hidden"
            animate={controls}
          >
            <h3 className={styles.contentTitle}>Boost Visibility. Get Results.</h3>
            
            <p className={styles.contentDescription}>
              Launch precision-targeted campaigns that drive leads, sales, and traffic. 
              Our Google Ads experts craft and manage powerful ad funnels tailored to 
              your business goals.
            </p>
            
            <div className={styles.divider}></div>
            
            <div className={styles.featuresList}>
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.id}
                  className={styles.featureItem}
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  animate={controls}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <span className={styles.featureText}>{feature.text}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.button 
              className={styles.ctaButton}
              variants={buttonVariants}
              initial="hidden"
              animate={controls}
              whileHover="hover"
            >
              Request Audit
              <span className={styles.buttonIcon}><FaArrowRight /></span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GoogleAdsSection; 