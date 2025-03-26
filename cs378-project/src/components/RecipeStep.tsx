"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./RecipeStep.module.css";
import { FaRegStar, FaStar } from "react-icons/fa";

interface RecipeStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  imageUrl: string;
  timerDuration?: number; // in seconds
  demonstration: string;
  helpfulTip: string;
  onNext?: () => void;
  onPrevious?: () => void;
  allStepTitles?: string[];
  onNavigateHome?: () => void;
  onStepSelect?: (stepNumber: number) => void;
}

const RecipeStep: React.FC<RecipeStepProps> = ({
  stepNumber,
  totalSteps,
  title,
  description,
  imageUrl,
  timerDuration = 0,
  demonstration,
  helpfulTip,
  onNext,
  onPrevious,
  allStepTitles = [],
  onNavigateHome,
  onStepSelect,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [timerActive, setTimerActive] = useState(timerDuration > 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    const stored = localStorage.getItem("isFavorite");
    return stored ? JSON.parse(stored) : false;
  });
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Reset to front side whenever step changes
  useEffect(() => {
    setIsFlipped(false);
  }, [stepNumber]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec left`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleStepSelect = (index: number) => {
    if (onStepSelect) {
      onStepSelect(index);
    }
    setMenuOpen(false);
  };

  const toggleFavorite = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    localStorage.setItem("isFavorite", JSON.stringify(newFavorite));
  };

  return (
    <div className={styles.recipeStepContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.menuButton} onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" width="24" height="24" className={styles.menuIcon}>
              <rect y="4" width="24" height="2" rx="1" />
              <rect y="11" width="24" height="2" rx="1" />
              <rect y="18" width="24" height="2" rx="1" />
            </svg>
          </button>
          {menuOpen && (
            <div className={styles.menuDropdown}>
              <ul>
                <li onClick={onNavigateHome}>Home</li>
                {allStepTitles.map((title, index) => (
                  <li
                    key={index}
                    onClick={() => handleStepSelect(index + 1)}
                    className={stepNumber === index + 1 ? styles.activeStep : ""}
                  >
                    {index + 1}. {title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className={styles.stepIndicator}>
          {stepNumber} / {totalSteps}
        </div>
        <button className={styles.settingsButton} onClick={() => setShowSettings(true)}>
          <svg viewBox="0 0 24 24" width="24" height="24" className={styles.settingsIcon}>
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </svg>
        </button>
      </div>

      {/* Card with Flip Animation */}
      <div className={styles.cardContainer}>
        <div className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ""}`}>
          {/* Front Side */}
          <div className={`${styles.cardFace} ${styles.cardFront}`} onClick={handleFlip}>
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

          {/* Back Side */}
          <div className={`${styles.cardFace} ${styles.cardBack}`} onClick={handleFlip}>
            <h2 className={styles.title}>Demo &amp; Tips</h2>
            <div className={styles.demoSection}>
              <h3>Demonstration</h3>
              <p>{demonstration}</p>
            </div>
            <div className={styles.tipsSection}>
              <h3>Helpful Tips</h3>
              <p>{helpfulTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.navButton} onClick={onPrevious} disabled={stepNumber === 1}>
          ←
        </button>
        <div className={styles.flipText}>Flip card to see demo &amp; tips</div>
        <button className={styles.navButton} onClick={onNext} disabled={stepNumber === totalSteps}>
          →
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.settingsRow}>
              <span style={{ color: "#000" }}>Add recipe to favorites</span>
              {isFavorite ? (
                <FaStar onClick={toggleFavorite} style={{ cursor: "pointer", color: "yellow" }} size={24} />
              ) : (
                <FaRegStar onClick={toggleFavorite} style={{ cursor: "pointer", color: "#333" }} size={24} />
              )}
            </div>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeStep;
