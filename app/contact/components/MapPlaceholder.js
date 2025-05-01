'use client';

import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';

const MapPlaceholder = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode on component mount and when theme changes
  useEffect(() => {
    // Initial check
    checkDarkMode();
    
    // Set up a function to check dark mode
    const checkTheme = () => {
      checkDarkMode();
    };
    
    // Check for theme changes using multiple methods
    
    // 1. MutationObserver for HTML attribute/class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        checkTheme();
      });
    });
    
    // Start observing document and html for any attribute or class changes
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
    
    // 2. Listen for custom theme change events
    window.addEventListener('themeChanged', checkTheme);
    document.addEventListener('themeChanged', checkTheme);
    
    // 3. Regular interval check (backup)
    const intervalCheck = setInterval(checkTheme, 1000);
    
    // Clean up
    return () => {
      observer.disconnect();
      window.removeEventListener('themeChanged', checkTheme);
      document.removeEventListener('themeChanged', checkTheme);
      clearInterval(intervalCheck);
    };
  }, []);

  // Function to check if dark mode is active
  const checkDarkMode = () => {
    // Check multiple sources to determine if dark mode is active
    const isDark = 
      document.documentElement.classList.contains('dark-mode') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('dark-mode') ||
      document.body.getAttribute('data-theme') === 'dark' ||
      localStorage.getItem('theme') === 'dark' ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
  };

  // Base map URL
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.615154595861!2d86.16426066270446!3d22.77965911349691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e4ba54d9a46d%3A0x943c1e78c8462838!2sAdharshila%20Tower!5e0!3m2!1sen!2sin!4v1746120762203!5m2!1sen!2sin";
  
  // Add dark mode parameter if in dark mode
  const fullMapUrl = isDarkMode ? `${mapUrl}&style=dark` : mapUrl;

  // For debugging
  console.log("Map is in dark mode:", isDarkMode);

  return (
    <div className={styles.mapContainer}>
      <iframe 
        src={fullMapUrl} 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps - Adharshila Tower"
        className={isDarkMode ? styles.darkModeMap : ' '}
      ></iframe>
    </div>
  );
};

export default MapPlaceholder; 