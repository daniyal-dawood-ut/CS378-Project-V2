"use client"
import React, { useState } from 'react';
import styles from './Ingredients.module.css';

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

const Ingredients: React.FC<IngredientsProps> = ({ onContinueToInstructions, onBack }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: "banana",
      name: "Mashed Banana",
      amount: "(1 fruit)",
      selected: false,
      alternatives: [],
      showAlternatives: false
    },
    {
      id: "oil",
      name: "Olive Oil",
      amount: "(1/2 cup)",
      selected: false,
      alternatives: [
        {
          id: "sunflower",
          name: "Sunflower Oil",
          amount: "(1/2 cup)",
          selected: false
        },
        {
          id: "avocado",
          name: "Avocado Oil",
          amount: "(1/2 cup)",
          selected: false
        }
      ],
      showAlternatives: false
    },
    {
      id: "sugar",
      name: "Rapadura Sugar",
      amount: "(1 cup)",
      selected: false,
      alternatives: [
        {
          id: "brown",
          name: "Brown Sugar",
          amount: "(1 cup)",
          selected: false
        }
      ],
      showAlternatives: false
    },
    {
      id: "eggs",
      name: "Large Eggs",
      amount: "(2 eggs)",
      selected: false,
      alternatives: [],
      showAlternatives: false
    },
    {
      id: "pineapple",
      name: "Canned Pineapple",
      amount: "(1/2 cup)",
      selected: false,
      alternatives: [],
      showAlternatives: false
    },
    {
      id: "flour",
      name: "All-Purpose Flour",
      amount: "(1 and 1/2 cups)",
      selected: false,
      alternatives: [
        {
          id: "whole-wheat",
          name: "Whole Wheat Flour",
          amount: "(1 and 1/4 cups)",
          selected: false
        }
      ],
      showAlternatives: false
    },
    {
      id: "pecans",
      name: "Crushed Pecans",
      amount: "(3/4 cup)",
      selected: false,
      alternatives: [],
      showAlternatives: false
    },
    {
      id: "cream-cheese",
      name: "Cream Cheese",
      amount: "(2 tbsp)",
      selected: false,
      alternatives: [],
      showAlternatives: false
    }
  ]);

  const toggleIngredient = (id: string) => {
    setIngredients(ingredients.map(ingredient => {
      if (ingredient.id === id) {
        return {
          ...ingredient,
          selected: !ingredient.selected,
          alternatives: ingredient.alternatives?.map(alt => ({ ...alt, selected: false }))
        };
      }
      return ingredient;
    }));
  };

  const toggleAlternative = (ingredientId: string, alternativeId: string) => {
    setIngredients(ingredients.map(ingredient => {
      if (ingredient.id === ingredientId) {
        const currentAlt = ingredient.alternatives?.find(alt => alt.id === alternativeId);
        const newAltSelected = currentAlt ? !currentAlt.selected : true;
        return {
          ...ingredient,
          selected: false,
          alternatives: ingredient.alternatives?.map(alt => ({
            ...alt,
            selected: alt.id === alternativeId ? newAltSelected : false
          }))
        };
      }
      return ingredient;
    }));
  };

  const toggleDropdown = (id: string) => {
    setIngredients(ingredients.map(ingredient => {
      if (ingredient.id === id) {
        return { ...ingredient, showAlternatives: !ingredient.showAlternatives };
      }
      return ingredient;
    }));
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleSettingsClick = () => {
    console.log("Settings button clicked");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          ← Back to Hummingbird Muffins
        </button>
        <button className={styles.settingsButton} onClick={handleSettingsClick}>
          {/* SVG for settings */}
          <svg viewBox="0 0 24 24" width="24" height="24" className={styles.settingsIcon}>
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61
                     l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41
                     h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87
                     C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58
                     c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54
                     c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96
                     c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6
                     s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </svg>
        </button>
      </div>

      <h1 className={styles.title}>Ingredients</h1>

      <div className={styles.ingredientsList}>
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className={styles.ingredientWrapper}>
            <div className={styles.ingredientItem}>
              <label className={styles.ingredientLabel}>
                <input
                  type="checkbox"
                  checked={ingredient.selected}
                  onChange={() => toggleIngredient(ingredient.id)}
                  className={styles.checkbox}
                />
                <span className={styles.ingredientText}>
                  {ingredient.name} {ingredient.amount}
                </span>
              </label>
              
              {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                <button 
                  className={`${styles.dropdownButton} ${ingredient.showAlternatives ? styles.dropdownOpen : styles.dropdownClosed}`}
                  onClick={() => toggleDropdown(ingredient.id)}
                >
                  ►
                </button>
              )}
            </div>

            {ingredient.alternatives && ingredient.alternatives.length > 0 && ingredient.showAlternatives && (
              <div className={styles.alternativesList}>
                {ingredient.alternatives.map((alternative) => (
                  <div key={alternative.id} className={styles.alternativeItem}>
                    <label className={styles.alternativeLabel}>
                      <input
                        type="checkbox"
                        checked={alternative.selected}
                        onChange={() => toggleAlternative(ingredient.id, alternative.id)}
                        className={styles.checkbox}
                      />
                      <span className={styles.alternativeText}>
                        {alternative.name} {alternative.amount}
                      </span>
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
