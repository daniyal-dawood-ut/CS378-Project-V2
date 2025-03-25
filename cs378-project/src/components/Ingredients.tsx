"use client";
import React, { useState, useEffect } from "react";
import styles from "./Ingredients.module.css";
import recipeData from "../../demo_recipes.json"; // Import JSON file

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  selected: boolean;
  alternatives?: {
    id: string;
    name: string;
    amount: string;
    selected: boolean;
  }[];
  showAlternatives?: boolean;
}

interface IngredientsProps {
  onContinueToInstructions: () => void;
  onBack: () => void;
}

// Function to transform JSON structure
const transformData = (json: any): Ingredient[] => {
  const recipe = json.recipes.find((r: any) => r.name === "Hummingbird Muffins");
  if (!recipe) return [];

  return recipe.ingredients.map((item: any) => ({
    id: item.item.toLowerCase().replace(/\s/g, "-"),
    name: item.item,
    amount: item.quantity ? `(${item.quantity})` : "", // Add parentheses around the amount
    selected: false,
    alternatives: item.substitutions
      ? item.substitutions.map((sub: any) => ({
          id: sub.substitution.toLowerCase().replace(/\s/g, "-"),
          name: sub.substitution,
          amount: item.quantity ? `(${item.quantity})` : "", // Add parentheses here too
          selected: false,
        }))
      : [],
    showAlternatives: false,
  }));
};
const Ingredients: React.FC<IngredientsProps> = ({ onContinueToInstructions, onBack }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Load JSON and transform on mount
  useEffect(() => {
    setIngredients(transformData(recipeData));
  }, []);

  // Toggle ingredient selection
  const toggleIngredient = (id: string) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, selected: !ingredient.selected, alternatives: ingredient.alternatives?.map((alt) => ({ ...alt, selected: false })) }
          : ingredient
      )
    );
  };

  // Toggle alternative selection
  const toggleAlternative = (ingredientId: string, alternativeId: string) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === ingredientId
          ? {
              ...ingredient,
              selected: false,
              alternatives: ingredient.alternatives?.map((alt) => ({ ...alt, selected: alt.id === alternativeId ? !alt.selected : false })),
            }
          : ingredient
      )
    );
  };

  // Toggle dropdown visibility
  const toggleDropdown = (id: string) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, showAlternatives: !ingredient.showAlternatives } : ingredient
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Hummingbird Muffins
        </button>
      </div>

      <h1 className={styles.title}>Ingredients</h1>

      <div className={styles.ingredientsList}>
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className={styles.ingredientWrapper}>
            <div className={styles.ingredientItem}>
              <label className={styles.ingredientLabel}>
                <input type="checkbox" checked={ingredient.selected} onChange={() => toggleIngredient(ingredient.id)} className={styles.checkbox} />
                <span className={styles.ingredientText}>{ingredient.name} {ingredient.amount}</span>
              </label>

              {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                <button className={`${styles.dropdownButton} ${ingredient.showAlternatives ? styles.dropdownOpen : styles.dropdownClosed}`} onClick={() => toggleDropdown(ingredient.id)}>
                  ►
                </button>
              )}
            </div>

            {ingredient.showAlternatives && (
              <div className={styles.alternativesList}>
                {ingredient.alternatives?.map((alternative) => (
                  <div key={alternative.id} className={styles.alternativeItem}>
                    <label className={styles.alternativeLabel}>
                      <input type="checkbox" checked={alternative.selected} onChange={() => toggleAlternative(ingredient.id, alternative.id)} className={styles.checkbox} />
                      <span className={styles.alternativeText}>{alternative.name} {alternative.amount}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.continueButton} onClick={onContinueToInstructions}>
          Continue to Instructions →
        </button>
      </div>
    </div>
  );
};

export default Ingredients;
