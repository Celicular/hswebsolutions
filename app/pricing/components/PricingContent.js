'use client';

import { useState, useEffect, Suspense } from 'react';
import styles from '../page.module.css';
import PricingHero from './PricingHero';
import HostingPlans from './HostingPlans';
import TechnologyTiers from './TechnologyTiers';
import Integrations from './Integrations';
import SupportAndMaintenance from './SupportAndMaintenance';
import PricingCTA from './PricingCTA';
import Loading from './Loading';

export default function PricingContent() {
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
    <Suspense fallback={<Loading />}>
      <PricingHero />
      <HostingPlans />
      <TechnologyTiers />
      <Integrations />
      <SupportAndMaintenance />
      <PricingCTA />
    </Suspense>
  );
} 