"use client";

import React, { useState, useEffect } from "react";
import styles from "./RecipeStep.module.css";

interface RecipeStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  imageUrl: string;
  timerDuration?: number; // in seconds
  onNext?: () => void;
  onPrevious?: () => void;
  onFlip?: () => void;
}

const RecipeStep: React.FC<RecipeStepProps> = ({
  stepNumber,
  totalSteps,
  title,
  description,
  imageUrl,
  timerDuration = 0,
  onNext,
  onPrevious,
  onFlip,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [timerActive, setTimerActive] = useState(timerDuration > 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Function to format time properly
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return null; // Don't display timer if 0
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec left`;
  };

  return (
    <div className={styles.recipeStepContainer}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.menuButton}>
          <svg viewBox="0 0 24 24" width="24" height="24" className={styles.menuIcon}>
            <rect y="4" width="24" height="2" rx="1" />
            <rect y="11" width="24" height="2" rx="1" />
            <rect y="18" width="24" height="2" rx="1" />
          </svg>
        </button>
        <div className={styles.stepIndicator}>{stepNumber} / {totalSteps}</div>
        <button className={styles.settingsButton}>
          <svg viewBox="0 0 24 24" width="24" height="24" className={styles.settingsIcon}>
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </svg>
        </button>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={title} className={styles.image} />
        </div>

        <p className={styles.description}>{description}</p>

        {timeRemaining > 0 && (
          <div className={styles.timerContainer}>
            <svg viewBox="0 0 24 24" width="24" height="24" className={styles.timerIcon}>
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
            </svg>
            <div className={styles.timerText}>{formatTime(timeRemaining)}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.navButton} onClick={onPrevious} disabled={stepNumber === 1}>
          ←
        </button>
        <div className={styles.flipText}>Flip card to see demo & tips</div>
        <button className={styles.navButton} onClick={onNext} disabled={stepNumber === totalSteps}>
          →
        </button>
      </div>
    </div>
  );
};

export default RecipeStep;
