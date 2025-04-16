'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import styles from './page.module.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// Lazy load heavier components for better initial load time
const ProcessFlowchart = lazy(() => import('./components/ProcessFlowchart'));
const StatsCounter = lazy(() => import('./components/StatsCounter'));
const KeyFeatures = lazy(() => import('./components/KeyFeatures'));
const Industries = lazy(() => import('./components/Industries'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Handle initial mounting
  useEffect(() => {
    setMounted(true);
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
    <div className={styles.container}>
      <Navbar />
      <Hero />
      
      {/* Use Suspense to handle lazy loaded components */}
      <Suspense fallback={<div className={styles.sectionLoading}></div>}>
        <ProcessFlowchart />
      </Suspense>
      
      <Suspense fallback={<div className={styles.sectionLoading}></div>}>
        <StatsCounter />
      </Suspense>
      
      <Suspense fallback={<div className={styles.sectionLoading}></div>}>
        <KeyFeatures />
      </Suspense>
      
      <Suspense fallback={<div className={styles.sectionLoading}></div>}>
        <Industries />
      </Suspense>
      
      {/* Add the Why Choose Us section */}
      <Suspense fallback={<div className={styles.sectionLoading}></div>}>
        <WhyChooseUs />
      </Suspense>
    </div>
  );
}
