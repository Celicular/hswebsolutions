'use client';

import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHero from './components/BlogHero';
import BlogGrid from './components/BlogGrid';
import EstimateCallout from './components/EstimateCallout';
import styles from './page.module.css';

export default function BlogPage() {
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

  // Loading state
  if (!mounted) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Blog - HS Web Solutions</title>
        <meta name="description" content="Latest articles, tutorials and insights on web development, design, and digital marketing strategies." />
      </Head>
      
      <Navbar />
      
      <main className={styles.main}>
        <BlogHero />
        
        {/* Blog content */}
        <section className={styles.blogContent}>
          <div className={styles.contentContainer}>
            <h2 className={styles.sectionTitle}>Latest Articles</h2>
            
            <Suspense fallback={
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading...</p>
              </div>
            }>
              <BlogGrid />
            </Suspense>
          </div>
        </section>
        
        <Suspense fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading...</p>
          </div>
        }>
          <EstimateCallout />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
} 