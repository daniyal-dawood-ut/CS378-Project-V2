"use client";
import { useState } from "react";
import styles from "./LandingPage.module.css";
import recipeData from "../../demo_recipes.json";
import AddRecipeModal from "./AddRecipeModal";

interface LandingPageProps {
  onSelectRecipe: (recipeName: string) => void;
}

interface DemoRecipe {
  name: string;
  ingredients: unknown;
  steps: unknown;
}

interface DemoRecipes {
  recipes: DemoRecipe[];
}

interface Recipe {
  recipeName: string;
}

const transformData = (json: DemoRecipes): Recipe[] => {
  return json.recipes.map((r) => ({
    recipeName: r.name,
  }));
};

export default function LandingPage({ onSelectRecipe }: LandingPageProps) {
  const recipes = transformData(recipeData as DemoRecipes);
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
          const formattedRecipe = recipe.recipeName.toLowerCase().replace(/\s+/g, "_");
          return (
            <button
              key={recipe.recipeName}
              className={styles.button}
              onClick={() => onSelectRecipe(recipe.recipeName)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={`./images/${formattedRecipe}/cover_photo.jpg`}
                  alt={recipe.recipeName}
                  className={styles.recipeImage}
                />
              </div>
              <span>{recipe.recipeName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
