'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MapPlaceholder from './components/MapPlaceholder';
import MultiStageEstimateForm from './components/MultiStageEstimateForm';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState(null);

  // Parse URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('name');
      const email = urlParams.get('email');
      const mobile = urlParams.get('mobile');
      
      // Check if we have parameters
      if (name || email || mobile) {
        setFormData({
          name: name || '',
          email: email || '',
          mobile: mobile || ''
        });
        
        // Scroll to the form section after a short delay to ensure DOM is ready
        setTimeout(() => {
          const formElement = document.getElementById('estimate-form');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        {/* Background Elements */}
        <div className={styles.backgroundElements}>
          <div className={styles.blob + ' ' + styles.blob1}></div>
          <div className={styles.blob + ' ' + styles.blob2}></div>
          <div className={styles.gridPattern}></div>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.pageTitle}>Contact Us</h1>
          <p className={styles.pageSubtitle}>
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Form and Info Section */}
        <motion.div 
          className={styles.contactWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          id="estimate-form"
        >
          {/* Contact Form Placeholder */}
          <div className={styles.contactFormContainer}>
            <h2 className={`${styles.formTitle} ${styles.gradientTitle}`}>Get Your Estimate Now</h2>
            <div className={styles.darkModeFormWrapper}>
              <MultiStageEstimateForm initialData={formData} />
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.contactInfoContainer}>
            <h2 className={styles.infoTitle}>Contact Info</h2>
            <div className={styles.contactInfoContent}>
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                <div>
                  <h3 className={styles.contactLabel}>Phone</h3>
                  <p className={styles.contactValue}>+91 9942868093</p>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.contactIcon} />
                <div>
                  <h3 className={styles.contactLabel}>Email</h3>
                  <p className={styles.contactValue}>hsg090907.jsr@gmail.com</p>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.contactIcon} />
                <div>
                  <h3 className={styles.contactLabel}>Address</h3>
                  <p className={styles.contactValue}>Adityapur, Jamshedpur<br />Jharkhand 831013, India</p>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faClock} className={styles.contactIcon} />
                <div>
                  <h3 className={styles.contactLabel}>Business Hours</h3>
                  <p className={styles.contactValue}>Monday - Friday: 9AM - 5PM<br />Saturday & Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a href="https://twitter.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://facebook.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://linkedin.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://instagram.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.section 
          className={styles.mapSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MapPlaceholder />
        </motion.section>
      </main>
      <Footer />
    </div>
  );
} 