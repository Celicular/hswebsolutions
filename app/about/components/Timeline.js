'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Timeline.module.css';
import aboutStyles from '../about.module.css';

const timelineData = [
  {
    year: '2020',
    title: 'Our Foundation',
    description: 'Started as a small team of passionate developers with a vision to create impactful digital experiences for local businesses during challenging times.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    year: '2021',
    title: 'First Clients',
    description: 'Secured our first major clients and built a reputation for delivering high-quality websites and applications with exceptional attention to detail.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    year: '2022',
    title: 'Service Expansion',
    description: 'Added SEO, digital marketing, and e-commerce solutions to our service offerings, helping small businesses improve their online presence.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    year: '2023',
    title: 'Regional Growth',
    description: 'Expanded our client base across the region, establishing ourselves as a reliable partner for businesses looking to build or improve their digital presence.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    year: '2024',
    title: 'Our Growth',
    description: 'Expanded our team to meet increasing demand and invested in training to stay current with the latest web technologies and design trends.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    year: '2025',
    title: 'Looking Ahead',
    description: 'Planning to expand our reach, enhance our service offerings with AI integration, and continue delivering exceptional value to our growing client base.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
      </svg>
    )
  }
];

const Timeline = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(null);
  
  const scrollContainerRef = useRef(null);
  
  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  
  return (
    <section className={styles.section} ref={sectionRef} id="timeline-section">
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle} style={{ top: '15%', right: '10%', background: 'var(--circle-gradient-1)' }}></div>
        <div className={styles.bgCircle} style={{ bottom: '20%', left: '5%', background: 'var(--circle-gradient-2)' }}></div>
        <div className={styles.bgDots}></div>
      </div>
      
      <div className={styles.container}>
        <div className={`${styles.sectionHeader} ${aboutStyles.sectionHeader}`}>
          <motion.h2 
            className={`${styles.sectionTitle} ${aboutStyles.sectionTitle}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Our Journey
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The growth and evolution that shaped our approach to digital excellence
          </motion.p>
        </div>
        
        <div className={styles.timelineWrapper} ref={scrollContainerRef}>
          <div className={styles.timelineTrack}>
            {timelineData.map((item, index) => (
              <motion.div 
                key={index}
                className={`${styles.timelineItem} ${activeIndex === index ? styles.active : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleItemClick(index)}
              >
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineIconContainer}>
                  <div className={styles.timelineIcon}>
                    {item.icon}
                  </div>
                  <div className={styles.timelineLine}></div>
                </div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className={styles.horizontalScroller}>
          <div className={styles.scrollText}>
            <span>Drag to explore</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={styles.scrollIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline; 