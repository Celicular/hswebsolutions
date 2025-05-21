'use client';

// Configure segment behavior
export const runtime = 'edge';
export const preferredRegion = 'auto';
export const dynamicConfig = 'force-dynamic';

import { useState, useEffect, lazy, Suspense } from 'react';
import styles from './page.module.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import dynamic from 'next/dynamic';

// Lazy load heavier components for better initial load time
const ProcessFlowchart = dynamic(() => import('./components/ProcessFlowchart'), { ssr: false });
const StatsCounter = dynamic(() => import('./components/StatsCounter'), { ssr: false });
const KeyFeatures = dynamic(() => import('./components/KeyFeatures'), { ssr: false });
const Industries = dynamic(() => import('./components/Industries'), { ssr: false });
const WhyChooseUs = dynamic(() => import('./components/WhyChooseUs'), { ssr: false });
const ClientsSection = dynamic(() => import('./components/ClientsSection'), { ssr: false });
const PricingSection = dynamic(() => import('./components/PricingSection'), { ssr: false });
const GoogleAdsSection = dynamic(() => import('./components/GoogleAdsSection'), { ssr: false });
const TransformationSlider = dynamic(
  () => import('./components/TransformationSlider'),
  { 
    ssr: false,
    loading: () => <div className={styles.sectionLoading}></div>
  }
);
const CTABanner = dynamic(() => import('./components/CTABanner'), { ssr: false });

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
      
      {/* Content sections with module-background class */}
      <div className="module-background">
        {/* Use Suspense to handle lazy loaded components */}
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <ProcessFlowchart />
        </Suspense>
        
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <TransformationSlider />
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
        
        {/* Add the Clients section */}
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <ClientsSection />
        </Suspense>
        
        {/* Add the Why Choose Us section */}
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <WhyChooseUs />
        </Suspense>
        
        {/* Add the Google Ads section */}
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <GoogleAdsSection />
        </Suspense>
        
        {/* Pricing section at the end */}
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <PricingSection id="pricing-section" />
        </Suspense>
        
        {/* CTA Banner at the very end */}
        <Suspense fallback={<div className={styles.sectionLoading}></div>}>
          <CTABanner />
        </Suspense>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
