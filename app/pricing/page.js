import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingHero from './components/PricingHero';
import HostingPlans from './components/HostingPlans';
import TechnologyTiers from './components/TechnologyTiers';
import Integrations from './components/Integrations';
import SupportAndMaintenance from './components/SupportAndMaintenance';
import PricingCTA from './components/PricingCTA';
import Loading from './components/Loading';
import styles from './page.module.css';

export const metadata = {
  title: 'Pricing - HS Web Solutions',
  description: 'Affordable and transparent pricing for web development, hosting, and maintenance services.'
};

export default function PricingPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.pageContent}>
        <PricingHero />
        
        <Suspense fallback={<Loading />}>
          <HostingPlans />
        </Suspense>
        
        <Suspense fallback={<Loading />}>
          <TechnologyTiers />
        </Suspense>
        
        <Suspense fallback={<Loading />}>
          <Integrations />
        </Suspense>
        
        <Suspense fallback={<Loading />}>
          <SupportAndMaintenance />
        </Suspense>
        
        <PricingCTA />
      </div>
      
      <Footer />
    </div>
  );
} 