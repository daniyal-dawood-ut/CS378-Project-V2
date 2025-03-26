"use client";

import styles from "./LandingPage.module.css";
import recipeData from "../../demo_recipes.json";

interface LandingPageProps {
  onEnter: () => void;
  onSelectRecipe: (recipeName: string) => void; // Update to accept recipeName argument
}

interface Recipe {
  recipeName: string;
}

const transformData = (json: any): Recipe[] => {
  return json.recipes.map((r: any) => ({
    recipeName: r.name
  }));
};

export default function LandingPage({ onEnter, onSelectRecipe }: LandingPageProps) {
  const recipes = transformData(recipeData);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AL DENTE</h1>
      </div>
      <div className={styles.content}>
        {recipes.map((recipe) => (
          <button
            key={recipe.recipeName} 
            className={styles.button}
            onClick={() => onSelectRecipe(recipe.recipeName)} 
          >
            {recipe.recipeName}
          </button>
        ))}
      </div>
    </div>
  );
}

