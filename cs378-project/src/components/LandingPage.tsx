"use client";
import { useState } from "react";
import styles from "./LandingPage.module.css";
import AddRecipeModal from "./AddRecipeModal";

interface DemoRecipe {
  name: string;
}

interface LandingPageProps {
  recipes: DemoRecipe[];
  onSelectRecipe: (recipeName: string) => void;
}

export default function LandingPage({ recipes, onSelectRecipe }: LandingPageProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AL DENTE</h1>
      </div>
      <div className={styles.uploadPill} onClick={() => setShowModal(true)}>
        <span>Upload custom recipe</span>
        <span className={styles.arrow}>↑</span>
      </div>
      {showModal && <AddRecipeModal onClose={() => setShowModal(false)} />}
      <div className={styles.content}>
        {recipes.map((recipe) => {
          const formattedRecipeName = recipe.name.toLowerCase().replace(/\s+/g, "_");
          const imageUrl = `./images/${formattedRecipeName}/cover_photo.jpg`;

          return (
            <button
              key={recipe.name}
              className={styles.button}
              onClick={() => onSelectRecipe(recipe.name)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={imageUrl}
                  alt={recipe.name}
                  className={styles.recipeImage}
                  onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span>{recipe.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
