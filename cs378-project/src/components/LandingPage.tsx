"use client";

import styles from "./LandingPage.module.css";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AL DENTE</h1>
      </div>
      <div className={styles.content}>
        <button className={styles.button} onClick={onEnter}>
          Hummingbird Muffins
        </button>
      </div>
    </div>
  );
}
