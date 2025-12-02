'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './BillingSupport.module.css';

export default function BillingSupport() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const supportChannels = [
    {
      icon: faEnvelope,
      title: 'Email',
      value: 'hsg090907.jsr@gmail.com',
      href: 'mailto:hsg090907.jsr@gmail.com',
      isLink: true
    },
    {
      icon: faPhone,
      title: 'Phone',
      value: '+91 9942868093',
      href: 'tel:+919942868093',
      isLink: true
    },
    {
      icon: faClock,
      title: 'Business Hours',
      value: 'Monday - Friday: 9AM - 5PM',
      href: null,
      isLink: false
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={styles.sectionHeader}
        >
          <h2 className={styles.sectionTitle}>Billing Support</h2>
          <p className={styles.sectionSubtitle}>For any payment or invoice-related queries</p>
        </motion.div>

        <motion.div
          className={styles.supportGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {supportChannels.map((channel, index) => (
            <motion.div key={index} className={styles.supportCard} variants={itemVariants}>
              <div className={styles.cardIcon}>
                <FontAwesomeIcon icon={channel.icon} />
              </div>
              <h3 className={styles.cardTitle}>{channel.title}</h3>
              {channel.isLink ? (
                <a href={channel.href} className={styles.supportLink}>
                  {channel.value}
                </a>
              ) : (
                <p className={styles.cardValue}>{channel.value}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.ctaBox}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.ctaTitle}>Need Help With Your Payment?</h3>
          <p className={styles.ctaText}>
            Our billing team is ready to assist you with any questions or concerns about your payment.
          </p>
          <div className={styles.ctaButtons}>
            <a href="mailto:hsg090907.jsr@gmail.com" className={styles.ctaButton + ' ' + styles.emailButton}>
              <FontAwesomeIcon icon={faEnvelope} />
              Send Email
            </a>
            <a href="tel:+919942868093" className={styles.ctaButton + ' ' + styles.phoneButton}>
              <FontAwesomeIcon icon={faPhone} />
              Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
