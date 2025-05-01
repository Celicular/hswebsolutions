'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './BlogHero.module.css';

const BlogHero = () => {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const router = useRouter();
  
  useEffect(() => {
    setIsVisible(true);
    
    // Create floating blobs animation
    const createFloatingBlobs = () => {
      const blobs = document.querySelectorAll(`.${styles.blob}`);
      
      blobs.forEach((blob, index) => {
        // Create random animation duration between 15-30s
        const duration = 15 + Math.random() * 15;
        
        // Create random delay for each blob
        const delay = Math.random() * 5;
        
        // Apply animation
        blob.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
      });
    };
    
    createFloatingBlobs();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Navigate to the blog page with search query parameter
    router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    })
  };
  
  const title = "Our Blog";
  const subtitle = "Insights, tutorials, and updates from our team to help grow your business online.";
  
  return (
    <motion.section 
      className={styles.heroSection}
      ref={heroRef}
      style={{
        opacity: heroOpacity,
        scale: heroScale
      }}
    >
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.blob + ' ' + styles.blob1}></div>
        <div className={styles.blob + ' ' + styles.blob2}></div>
        <div className={styles.blob + ' ' + styles.blob3}></div>
        
        <div className={styles.gridOverlay}></div>
        
        <svg className={styles.waveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fillOpacity="0.05" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,218.7C672,235,768,213,864,181.3C960,149,1056,107,1152,96C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        <svg className={styles.curveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fillOpacity="0.1" d="M0,96L80,112C160,128,320,160,480,154.7C640,149,800,107,960,101.3C1120,96,1280,128,1360,144L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.title}
            style={{ y: titleY }}
          >
            <AnimatePresence>
              {isVisible && title.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className={styles.animatedLetter}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.h1>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
          
          <motion.form 
            className={styles.searchContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            onSubmit={handleSearch}
          >
            <input 
              type="text" 
              placeholder="Search articles..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for blog posts"
            />
            <button 
              className={styles.searchButton}
              type="submit"
              disabled={isSearching}
              aria-label="Search"
            >
              {isSearching ? (
                <span className={styles.searchingIndicator}></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </motion.form>
          
          <motion.div 
            className={styles.categoriesContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <span className={styles.categoryLabel}>Popular Topics:</span>
            <div className={styles.categories}>
              <a href="/blog?tag=Development" className={styles.category}>Web Development</a>
              <a href="/blog?tag=Design" className={styles.category}>Web Design</a>
              <a href="/blog?tag=SEO" className={styles.category}>SEO</a>
              <a href="/blog?tag=Performance" className={styles.category}>Performance</a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll Down</span>
        <svg className={styles.scrollArrow} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.section>
  );
};

export default BlogHero; 