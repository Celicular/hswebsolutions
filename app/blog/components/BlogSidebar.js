'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './BlogSidebar.module.css';

export default function BlogSidebar() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Mock categories data
  const categories = [
    { name: 'Web Development', count: 12, slug: 'web-development' },
    { name: 'Design', count: 8, slug: 'design' },
    { name: 'SEO', count: 5, slug: 'seo' },
    { name: 'Marketing', count: 7, slug: 'marketing' },
    { name: 'Business', count: 4, slug: 'business' },
  ];
  
  // Mock recent posts data
  const recentPosts = [
    { 
      title: 'How to Optimize Your Website for Mobile Users', 
      date: 'June 12, 2023',
      slug: 'optimize-website-mobile-users'
    },
    { 
      title: '10 SEO Strategies That Actually Work in 2023', 
      date: 'May 28, 2023',
      slug: '10-seo-strategies-2023'
    },
    { 
      title: 'The Importance of Web Accessibility', 
      date: 'May 15, 2023',
      slug: 'importance-web-accessibility'
    },
  ];
  
  // Handle newsletter form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, you would send this to your API
    console.log('Subscribing email:', email);
    
    // Show success message
    setSubscribed(true);
    
    // Reset form
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };
  
  return (
    <motion.div 
      className={styles.sidebar}
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* Categories Section */}
      <motion.div className={styles.sidebarSection} variants={itemVariants}>
        <h3 className={styles.sidebarTitle}>Categories</h3>
        <ul className={styles.categoryList}>
          {categories.map((category, index) => (
            <li key={index} className={styles.categoryItem}>
              <Link href={`/blog/category/${category.slug}`} className={styles.categoryLink}>
                {category.name}
                <span className={styles.categoryCount}>{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
      
      {/* Recent Posts Section */}
      <motion.div className={styles.sidebarSection} variants={itemVariants}>
        <h3 className={styles.sidebarTitle}>Recent Posts</h3>
        <ul className={styles.recentPostList}>
          {recentPosts.map((post, index) => (
            <li key={index} className={styles.recentPostItem}>
              <Link href={`/blog/${post.slug}`} className={styles.recentPostLink}>
                <h4 className={styles.recentPostTitle}>{post.title}</h4>
                <span className={styles.recentPostDate}>{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
      
      {/* Newsletter Section */}
      <motion.div className={styles.sidebarSection} variants={itemVariants}>
        <h3 className={styles.sidebarTitle}>Newsletter</h3>
        <div className={styles.newsletterContainer}>
          <p className={styles.newsletterDesc}>Subscribe to get the latest updates directly to your inbox</p>
          
          {subscribed ? (
            <div className={styles.successMessage}>
              <p>Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.newsletterForm}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </motion.div>
      
      {/* Tags Cloud Section */}
      <motion.div className={styles.sidebarSection} variants={itemVariants}>
        <h3 className={styles.sidebarTitle}>Popular Tags</h3>
        <div className={styles.tagsCloud}>
          <Link href="/blog/tag/html" className={styles.tag}>HTML</Link>
          <Link href="/blog/tag/css" className={styles.tag}>CSS</Link>
          <Link href="/blog/tag/javascript" className={styles.tag}>JavaScript</Link>
          <Link href="/blog/tag/react" className={styles.tag}>React</Link>
          <Link href="/blog/tag/nextjs" className={styles.tag}>Next.js</Link>
          <Link href="/blog/tag/responsive" className={styles.tag}>Responsive</Link>
          <Link href="/blog/tag/ui" className={styles.tag}>UI</Link>
          <Link href="/blog/tag/ux" className={styles.tag}>UX</Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 