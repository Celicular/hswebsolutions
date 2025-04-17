'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { FaMoon, FaSun, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [lightMode, setLightMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle theme switching
  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('lightMode');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Set light mode if explicitly saved as true or if user prefers light and no saved preference
    const isLight = savedTheme === 'true' || (savedTheme === null && prefersLight);
    
    setLightMode(isLight);
    document.documentElement.classList.toggle('light-mode', isLight);
    
    // Make sure dark-mode is also toggled correctly
    document.documentElement.classList.toggle('dark-mode', !isLight);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e) => {
      if (localStorage.getItem('lightMode') === null) {
        setLightMode(e.matches);
        document.documentElement.classList.toggle('light-mode', e.matches);
        document.documentElement.classList.toggle('dark-mode', !e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Expose the toggleSidebar function globally
    if (typeof window !== 'undefined') {
      window.openContactSidebar = () => {
        setSidebarOpen(true);
        document.body.style.overflow = 'hidden';
      };
    }
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      // Clean up global function
      if (typeof window !== 'undefined') {
        delete window.openContactSidebar;
      }
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !lightMode;
    setLightMode(newMode);
    
    // Save to localStorage
    localStorage.setItem('lightMode', String(newMode));
    
    // Update document classes
    document.documentElement.classList.toggle('light-mode', newMode);
    document.documentElement.classList.toggle('dark-mode', !newMode);
    
    // Force recreate particles if the function exists
    if (window.createAnimatedBackgroundParticles) {
      window.createAnimatedBackgroundParticles();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // Prevent scrolling when sidebar is open
    if (!sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    document.body.classList.toggle('mobile-menu-open');
    if (document.body.classList.contains('mobile-menu-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', mobile: '' };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
        valid = false;
      }
    }
    
    // Validate mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      valid = false;
    } else {
      const mobileRegex = /^[0-9]{10,12}$/;
      if (!mobileRegex.test(formData.mobile.replace(/[^0-9]/g, ''))) {
        newErrors.mobile = 'Mobile number should be 10-12 digits';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, would normally submit data here
      console.log('Form data:', formData);
      setFormSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', mobile: '' });
      }, 3000);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <Image 
              src="/h.ico" 
              alt="HS Logo" 
              width={39} 
              height={39} 
              priority 
              className={styles.logoImage} 
            />
          </div>
          <h2 className={styles.brandName}>HS Web Solutions</h2>
        </div>
        
        <div className={styles.navCenter}>
          <Link href="#services" className={styles.navLink}>Services</Link>
          <Link href="#about" className={styles.navLink}>About Us</Link>
          <Link href="#pricing" className={styles.navLink}>Pricing</Link>
          <Link href="#blogs" className={styles.navLink}>Blogs</Link>
          <Link href="#estimate" className={styles.estimateButton}>
            Estimate Project →
          </Link>
        </div>
        
        <div className={styles.navRight}>
          <button 
            className={styles.iconButton} 
            onClick={toggleTheme}
            aria-label="Toggle light mode"
          >
            {lightMode ? <FaMoon /> : <FaSun />}
          </button>
          <button 
            className={styles.iconButton} 
            onClick={toggleSidebar}
            aria-label="Contact information"
          >
            <FaPhone />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className={styles.mobileMenuButton}>
          <button 
            className={styles.iconButton} 
            onClick={toggleTheme}
            aria-label="Toggle light mode"
          >
            {lightMode ? <FaMoon /> : <FaSun />}
          </button>
          <button 
            className={styles.iconButton} 
            onClick={toggleSidebar}
            aria-label="Contact information"
          >
            <FaPhone />
          </button>
          <button 
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={styles.mobileMenu}>
        <div className={styles.mobileMenuHeader}>
          <Image 
            src="/h.ico" 
            alt="HS Logo" 
            width={31} 
            height={31} 
            className={styles.mobileMenuLogo} 
          />
          <span>HS Web Solutions</span>
        </div>
        <Link href="#services" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Services</Link>
        <Link href="#about" className={styles.mobileNavLink} onClick={toggleMobileMenu}>About Us</Link>
        <Link href="#pricing" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Pricing</Link>
        <Link href="#blogs" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Blogs</Link>
        <Link href="#estimate" className={styles.mobileEstimateButton} onClick={toggleMobileMenu}>
          Estimate Project →
        </Link>
      </div>

      {/* Contact Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <button 
          className={styles.closeButton} 
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <Image 
              src="/h.ico" 
              alt="HS Logo" 
              width={39} 
              height={39} 
              className={styles.sidebarLogo} 
            />
            <h2>Contact Us</h2>
          </div>
          
          {/* Contact Form */}
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>Get in Touch</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formInput}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              {formErrors.name && <p className={styles.formError}>{formErrors.name}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.formInput}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {formErrors.email && <p className={styles.formError}>{formErrors.email}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="mobile" className={styles.formLabel}>Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className={styles.formInput}
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
              />
              {formErrors.mobile && <p className={styles.formError}>{formErrors.mobile}</p>}
            </div>
            
            <button type="submit" className={styles.submitButton}>
              {formSubmitted ? 'Thanks for contacting!' : 'Send Message'}
            </button>
          </form>
          
          <div className={styles.divider}></div>
          
          <h3 className={styles.formTitle}>Contact Information</h3>
          <div className={styles.contactItem}>
            <FaPhone />
            <span>+1 234 567 8901</span>
          </div>
          <div className={styles.contactItem}>
            <FaEnvelope />
            <span>info@hswebsolutions.com</span>
          </div>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt />
            <span>123 Business Avenue, New York, NY 10001</span>
          </div>
          
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15831228695!2d-74.11976235508171!3d40.69766374879398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1667544549096!5m2!1sen!2sus" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Our location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Overlay for when sidebar is open */}
      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.active : ''}`} 
        onClick={closeSidebar}
      ></div>
    </>
  );
} 