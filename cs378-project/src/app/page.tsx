"use client";

import { useState } from "react";
import RecipeStep from "../components/RecipeStep";
import Ingredients from "../components/Ingredients";
import StartRecipe from "../components/StartRecipe";
import recipeData from "../../demo_recipes.json"; // Import JSON data
import styles from "../styles/page.module.css";

// Extract steps dynamically from JSON
const getRecipeSteps = (recipeName: string) => {
  const recipe = recipeData.recipes.find((r) => r.name === recipeName);
  return recipe ? recipe.steps : [];
};

export default function Home() {
  const [currentView, setCurrentView] = useState<"start" | "ingredients" | "steps">("start");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Load recipe steps dynamically
  const recipeSteps = getRecipeSteps("Hummingbird Muffins");
  const totalSteps = recipeSteps.length;
  const currentStep = recipeSteps[currentStepIndex];

  // Navigation handlers
  const goToIngredients = () => setCurrentView("ingredients");
  const goToStart = () => setCurrentView("start");
  const goToSteps = () => setCurrentView("steps");

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFlip = () => {
    console.log("Flip card");
  };

  return (
    <div className={styles.container}>
      {currentView === "start" && (
        <StartRecipe onStart={goToSteps} onShowIngredients={goToIngredients} />
      )}
      {currentView === "ingredients" && (
        <Ingredients onContinueToInstructions={goToSteps} onBack={goToStart} />
      )}
      {currentView === "steps" && totalSteps > 0 && (
        <>
          <h1 className={styles.title}>Hummingbird Muffins</h1>
          <div className={styles.stepWrapper}>
            <RecipeStep
              stepNumber={currentStepIndex + 1}
              totalSteps={totalSteps}
              title={currentStep.title}
              description={currentStep.description}
              imageUrl={currentStep.imageUrl}
              timerDuration={currentStep.timerDuration}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onFlip={handleFlip}
            />
          </div>
        </>
      )}
    </div>
  );
}
