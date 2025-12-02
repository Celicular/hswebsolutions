'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FaArrowRight } from 'react-icons/fa';
import styles from './PaymentMethods.module.css';

export default function PaymentMethods() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

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
          <h2 className={styles.sectionTitle}>Accepted Payment Methods</h2>
          <p className={styles.sectionSubtitle}>Choose the payment method that works best for you</p>
        </motion.div>

        <motion.div
          className={styles.methodsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* PayPal Method */}
          <motion.div className={styles.methodCard} variants={itemVariants}>
            <div className={styles.methodHeader}>
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faPaypal} className={styles.icon} />
              </div>
              <h3 className={styles.methodTitle}>PayPal (Recommended for International)</h3>
            </div>

            <div className={styles.methodContent}>
              <p className={styles.methodDescription}>
                Secure online payment for global clients.
              </p>

              <div className={styles.methodDetails}>
                <h4 className={styles.detailsTitle}>PayPal Payment Link:</h4>
                <a
                  href="https://www.paypal.me/hswebsols"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.paypalButton}
                >
                  <FaArrowRight className={styles.buttonIcon} />
                  https://www.paypal.me/hswebsols
                </a>

                <h4 className={styles.detailsTitle}>Accepted Currencies:</h4>
                <p className={styles.currencyList}>
                  USD, AED, INR, and all major global currencies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bank Transfer Method */}
          <motion.div className={styles.methodCard} variants={itemVariants}>
            <div className={styles.methodHeader}>
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faBuilding} className={styles.icon} />
              </div>
              <h3 className={styles.methodTitle}>Bank Transfer (International & Domestic)</h3>
            </div>

            <div className={styles.methodContent}>
              <p className={styles.methodDescription}>
                Pay via direct bank transfer to our account.
              </p>

              <div className={styles.methodDetails}>
                <div className={styles.bankInfo}>
                  <div className={styles.bankDetail}>
                    <span className={styles.bankLabel}>Bank Name:</span>
                    <span className={styles.bankValue}>Jio Payments Bank</span>
                  </div>
                  <div className={styles.bankDetail}>
                    <span className={styles.bankLabel}>Account Holder:</span>
                    <span className={styles.bankValue}>Himadri Shekhar Goswami</span>
                  </div>
                  <div className={styles.bankDetail}>
                    <span className={styles.bankLabel}>Account Number:</span>
                    <span className={styles.bankValue}>001521711552349</span>
                  </div>
                  <div className={styles.bankDetail}>
                    <span className={styles.bankLabel}>IFSC Code:</span>
                    <span className={styles.bankValue}>JIOP0000001</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
