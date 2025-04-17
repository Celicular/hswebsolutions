'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './CTABanner.module.css';
import Link from 'next/link';

const CTABanner = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleContactClick = (e) => {
    e.preventDefault();
    
    // Use the globally exposed function from Navbar
    if (typeof window !== 'undefined' && window.openContactSidebar) {
      window.openContactSidebar();
    } else {
      // Fallback to clicking the button directly if function not available
      const phoneButtons = document.querySelectorAll(`button[aria-label="Contact information"]`);
      if (phoneButtons && phoneButtons.length > 0) {
        phoneButtons[0].click();
      }
    }
  };

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    // Scroll to the pricing section
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
      
      // Add a highlight pulse effect to the pricing section
      pricingSection.classList.add(styles.highlightPulse);
      setTimeout(() => {
        pricingSection.classList.remove(styles.highlightPulse);
      }, 2000);
    }
  };

  return (
    <section className={styles.ctaBannerSection} ref={sectionRef}>
      <div className={`${styles.container} ${visible ? styles.visible : ''}`}>
        <div className={styles.ctaBannerWrapper}>
          {/* Left Card - Project CTA */}
          <div className={`${styles.ctaCard} ${styles.projectCard}`}>
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <div className={styles.rocketIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                  </svg>
                </div>
                <div className={styles.circlePulse}></div>
              </div>
              <h2 className={styles.cardTitle}>Looking to start a project?</h2>
              <p className={styles.cardDescription}>
                Let us transform your vision into a stunning digital experience.
                Our team is ready to bring your ideas to life.
              </p>
              <button 
                className={`${styles.ctaButton} ${styles.startButton}`}
                onClick={handleGetStartedClick}
              >
                Get Started
                <span className={styles.buttonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className={styles.cardBackground}>
              <div className={styles.circuitPattern}></div>
            </div>
          </div>

          {/* Right Card - Contact CTA */}
          <div className={`${styles.ctaCard} ${styles.contactCard}`}>
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <div className={styles.supportIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"></path>
                  </svg>
                </div>
                <div className={styles.circlePulse}></div>
              </div>
              <h2 className={styles.cardTitle}>Need to ask a question?</h2>
              <p className={styles.cardDescription}>
                Our team is ready to assist you with any inquiries.
                We're just a message away from providing the support you need.
              </p>
              <button 
                className={`${styles.ctaButton} ${styles.contactButton}`}
                onClick={handleContactClick}
              >
                Contact Us
                <span className={styles.buttonIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className={styles.cardBackground}>
              <div className={styles.wavyPattern}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner; 