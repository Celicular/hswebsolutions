'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import styles from './ContactCTA.module.css';

const ContactCTA = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const openContactSidebar = () => {
    // Call the global function defined in Navbar
    if (typeof window !== 'undefined' && window.openContactSidebar) {
      window.openContactSidebar();
    }
  };
  
  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle}></div>
        <div className={styles.bgCircle}></div>
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.ctaTitle}>Ready to Start Your Digital Journey?</h2>
          <p className={styles.ctaDescription}>
            Let's discuss how we can help bring your vision to life with our web development expertise.
          </p>
          
          <div className={styles.ctaButtons}>
            <button 
              className={styles.primaryButton}
              onClick={openContactSidebar}
            >
              Get in Touch
            </button>
            <Link href="/services" className={styles.secondaryButton}>
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA; 