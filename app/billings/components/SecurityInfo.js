"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faShieldAlt,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./SecurityInfo.module.css";

export default function SecurityInfo() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const securityMethods = [
    {
      icon: faLock,
      title: "Encrypted PayPal Payments",
      description:
        "All PayPal transactions use industry-standard encryption for maximum security.",
    },
    {
      icon: faShieldAlt,
      title: "Verified Bank Transactions",
      description:
        "Direct bank transfers are verified and fully compliant with international banking standards.",
    },
    {
      icon: faCreditCard,
      title: "No Third-Party Wallet Apps",
      description:
        "We do not accept PhonePe, UPI, or other third-party wallet applications for payment security.",
    },
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
          <h2 className={styles.sectionTitle}>Payment Security</h2>
          <p className={styles.sectionSubtitle}>
            We use secure, globally compliant methods
          </p>
        </motion.div>

        <motion.div
          className={styles.securityGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {securityMethods.map((method, index) => (
            <motion.div
              key={index}
              className={styles.securityCard}
              variants={itemVariants}
            >
              <div className={styles.cardIcon}>
                <FontAwesomeIcon icon={method.icon} />
              </div>
              <h3 className={styles.cardTitle}>{method.title}</h3>
              <p className={styles.cardDescription}>{method.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.trustBox}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className={styles.trustText}>
            Your financial information is protected by the highest standards of
            security and compliance. We prioritize your data safety with every
            transaction.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
