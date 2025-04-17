'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './TransformationSlider.module.css';
import { FaArrowsAlt, FaArrowRight } from 'react-icons/fa';

const TransformationSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);
  
  const handleMouseDown = () => {
    isDragging.current = true;
  };
  
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  
  const handleTouchStart = () => {
    isDragging.current = true;
  };
  
  const handleTouchEnd = () => {
    isDragging.current = false;
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(position, 0), 100));
    e.preventDefault();
  };
  
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className={styles.transformationSection} ref={ref}>
      <div 
        className={`${styles.container} ${isVisible ? styles.visible : ''}`}
      >
        <h2 className={styles.sectionTitle}>
          See the Transformation
        </h2>
        
        <div 
          className={styles.sliderContainer}
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Before Website (Left Side) */}
          <div className={styles.beforeContainer} style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
            <div className={styles.beforeWebsite}>
              <div className={styles.beforeHeader}>
                <h1 className={styles.beforeTitle}>My Website</h1>
                <ul className={styles.beforeNav}>
                  <li>Home</li>
                  <li>About</li>
                  <li>Contact</li>
                </ul>
              </div>
              
              <div className={styles.beforeContent}>
                <h2>Welcome to my website</h2>
                <p>This is a basic website with minimal design. No fancy elements or modern styling has been applied.</p>
                <button className={styles.beforeButton}>Read More</button>
                <button className={styles.beforeButton}>Contact Us</button>
              </div>
              
              <div className={styles.beforeFooter}>
                <p>Copyright © 2023. All Rights Reserved.</p>
              </div>
            </div>
            <div className={styles.sideBadge + ' ' + styles.beforeBadge}>Before</div>
          </div>
          
          {/* After Website (Right Side) */}
          <div className={styles.afterContainer} style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
            <div className={styles.afterWebsite}>
              <div className={styles.afterHeader}>
                <div className={styles.afterLogo}>
                  <span className={styles.logoText}>Studio</span>
                  <span className={styles.logoAccent}>Wave</span>
                </div>
                
                <nav className={styles.afterNav}>
                  <a className={styles.active}>Home</a>
                  <a>Services</a>
                  <a>Portfolio</a>
                  <a>About</a>
                  <a>Contact</a>
                </nav>
                
                <button className={styles.afterCta}>Get Started</button>
              </div>
              
              <div className={styles.afterHero}>
                <div className={styles.heroContent}>
                  <h1>Transform Your Digital Presence</h1>
                  <p>We build cutting-edge websites that engage users and drive conversions with modern design principles.</p>
                  
                  <div className={styles.heroCtas}>
                    <button className={styles.primaryButton}>
                      View Our Work
                      <FaArrowRight className={styles.btnIcon} />
                    </button>
                    <button className={styles.secondaryButton}>
                      How We Work
                    </button>
                  </div>
                </div>
                
                <div className={styles.heroGraphic}>
                  <div className={styles.graphicElement}></div>
                  <div className={styles.graphicElement}></div>
                  <div className={styles.graphicElement}></div>
                </div>
              </div>
              
              <div className={styles.afterFeatures}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}></div>
                  <h3>Responsive Design</h3>
                  <p>Beautiful on all devices</p>
                </div>
                
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}></div>
                  <h3>SEO Optimized</h3>
                  <p>Rank higher in searches</p>
                </div>
                
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}></div>
                  <h3>Fast Performance</h3>
                  <p>Lightning quick load times</p>
                </div>
              </div>
            </div>
            <div className={styles.sideBadge + ' ' + styles.afterBadge}>After</div>
          </div>

          {/* Slider Control */}
          <div 
            className={styles.sliderControl}
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleTouchStart();
            }}
          >
            <div className={styles.sliderDivider}></div>
            <div className={styles.sliderHandle}>
              <FaArrowsAlt />
            </div>
          </div>
        </div>
        
        <p className={styles.sliderInstruction}>
          <span className={styles.dragIcon}>↔</span> Drag the slider to compare
        </p>
      </div>
    </section>
  );
};

export default TransformationSlider; 