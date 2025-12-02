"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import styles from "./PaymentTerms.module.css";

export default function PaymentTerms() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const terms = [
    "50% advance to begin development",
    "50% on final delivery",
    "Hosting and maintenance are billed annually",
    "All payments are non-refundable after project initiation.",
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
          <h2 className={styles.sectionTitle}>Payment Terms</h2>
          <p className={styles.sectionSubtitle}>
            Our standard payment structure for projects
          </p>
        </motion.div>

        <motion.div
          className={styles.termsBox}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className={styles.termsHeader}>
            <FontAwesomeIcon icon={faHandshake} className={styles.headerIcon} />
            <h3 className={styles.boxTitle}>Standard Payment Terms:</h3>
          </div>

          <motion.ul
            className={styles.termsList}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {terms.map((term, index) => (
              <motion.li key={index} variants={itemVariants}>
                {term}
              </motion.li>
            ))}
          </motion.ul>

          <div className={styles.highlight}>
            <p className={styles.highlightText}>
              These terms ensure fair practices for both our clients and our
              development team.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
