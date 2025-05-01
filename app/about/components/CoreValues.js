'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './CoreValues.module.css';
import aboutStyles from '../about.module.css';
import { FaLightbulb, FaUsers, FaRocket, FaHandshake, FaChartLine, FaGlobe } from 'react-icons/fa';

const ValueCard = ({ icon, title, description, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  
  return (
    <motion.div 
      ref={cardRef}
      className={styles.valueCard}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default function CoreValues() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10px 0px" });
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-10px 0px", amount: 0.1 });
  
  const values = [
    {
      icon: <FaLightbulb />,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and creative approaches to deliver forward-thinking solutions that keep our clients ahead of the curve.'
    },
    {
      icon: <FaUsers />,
      title: 'Client-Centered',
      description: "Our clients' needs drive everything we do. We listen carefully, collaborate closely, and tailor our solutions to meet your specific goals and challenges."
    },
    {
      icon: <FaRocket />,
      title: 'Excellence',
      description: 'We are committed to delivering exceptional quality in every project, focusing on performance, user experience, and attention to detail.'
    },
    {
      icon: <FaHandshake />,
      title: 'Integrity',
      description: 'We build relationships based on trust, transparency, and honest communication, ensuring our clients can rely on us as long-term partners.'
    },
    {
      icon: <FaChartLine />,
      title: 'Results-Driven',
      description: 'We measure our success by your success, focusing on delivering measurable outcomes that help your business grow and thrive.'
    },
    {
      icon: <FaGlobe />,
      title: 'Adaptability',
      description: 'In the ever-evolving digital landscape, we stay flexible and responsive, quickly adapting to new technologies and changing market demands.'
    }
  ];

  return (
    <section className={styles.coreValues} ref={sectionRef}>
      <div className={styles.container}>
        <motion.div
          ref={headerRef}
          className={`${styles.sectionHeader} ${aboutStyles.sectionHeader}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Our Core Values</h2>
          <p>These principles guide everything we do and define who we are as a company.</p>
        </motion.div>
        
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <ValueCard 
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 