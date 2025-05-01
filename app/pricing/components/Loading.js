'use client';

import styles from '../page.module.css';

export default function Loading() {
  return (
    <div className={styles.sectionLoading}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
} 