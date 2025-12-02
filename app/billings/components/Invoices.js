"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FaEnvelope } from "react-icons/fa";
import styles from "./Invoices.module.css";

export default function Invoices() {
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
          <h2 className={styles.sectionTitle}>Invoices</h2>
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className={styles.invoiceBox}>
            <div className={styles.invoiceHeader}>
              <FontAwesomeIcon
                icon={faFileInvoiceDollar}
                className={styles.headerIcon}
              />
              <h3 className={styles.boxTitle}>Official Invoices Issued For:</h3>
            </div>

            <ul className={styles.invoiceList}>
              <li>Advance payments</li>
              <li>Final payments</li>
              <li>Full project billing</li>
              <li>Annual hosting & maintenance renewals</li>
            </ul>

            <div className={styles.divider}></div>

            <div className={styles.contactSection}>
              <h4 className={styles.contactTitle}>To Request a New Invoice:</h4>
              <a
                href="mailto:hsg090907.jsr@gmail.com"
                className={styles.contactLink}
              >
                <FaEnvelope className={styles.contactIcon} />
                hsg090907.jsr@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
