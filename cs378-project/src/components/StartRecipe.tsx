import React from "react";
import styles from "./StartRecipe.module.css";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

// Define the prop types
interface StartRecipeProps {
  onStart: () => void;
  onShowIngredients: () => void;
}

const StartRecipe: React.FC<StartRecipeProps> = ({ onStart, onShowIngredients }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hummingbird Muffins</h1>
      <div className={styles.imageWrapper}>
        <Image 
          src="/images/hummingbird_muffins.jpg" 
          alt="Hummingbird Muffins" 
          width={200} 
          height={200} 
          className={styles.image}
        />
      </div>
      <div className={styles.rating}>
        ⭐⭐⭐⭐☆
      </div>
      <p className={styles.time}>Time: 20 min</p>
      <p className={styles.difficulty}>Difficulty: Beginner</p>
      <div className={styles.buttons}>
        <button className={styles.ingredientsButton} onClick={onShowIngredients}>Ingredients</button>
        <button className={styles.startButton} onClick={onStart}>
          Start <FaPlay />
        </button>
      </div>
    </div>
  );
};

export default StartRecipe;
