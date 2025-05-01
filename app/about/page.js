'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './about.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHero from './components/AboutHero';
import Timeline from './components/Timeline';
import CoreValues from './components/CoreValues';
import TechStack from './components/TechStack';
import StatsCounter from '../components/StatsCounter';
import ContactCTA from './components/ContactCTA';

export default function About() {
  const [mounted, setMounted] = useState(false);
  
  // Handle initial mounting
  useEffect(() => {
    setMounted(true);
    
    // Smooth scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Render a loading state until client-side code has executed
  if (!mounted) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className="module-background">
      <Navbar />
      
      <div className={styles.aboutPage}>
        {/* Hero Section */}
        <AboutHero />
        
        {/* Journey/Timeline Section */}
        <Timeline />
        
        {/* Core Values Section */}
        <CoreValues />
        
        {/* Tech Stack Section */}
        <TechStack />
        
        {/* Stats Section */}
        <StatsCounter />
      
        {/* Contact CTA Section */}
        <ContactCTA />
      </div>
      
      <Footer />
    </div>
  );
} 