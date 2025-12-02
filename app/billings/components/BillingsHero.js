"use client";

import { motion } from "framer-motion";
import styles from "./BillingsHero.module.css";

export default function BillingsHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundElements}>
        <div className={styles.blob + " " + styles.blob1}></div>
        <div className={styles.blob + " " + styles.blob2}></div>
      </div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>Payments & Billing</h1>
        <p className={styles.subtitle}>HS Web Solutions</p>

        <div className={styles.description}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            At HS Web Solutions, we provide secure, compliant, and
            internationally accepted payment methods for all projects.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Clients may choose to pay through direct bank transfer or PayPal.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            All payments include official invoices for accounting and audit
            purposes.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
