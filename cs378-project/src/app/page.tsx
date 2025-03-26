"use client";

import { useState } from "react";
import RecipeStep from "../components/RecipeStep";
import Ingredients from "../components/Ingredients";
import StartRecipe from "../components/StartRecipe";
import LandingPage from "../components/LandingPage";
import recipeData from "../../demo_recipes.json"; // Import JSON data
import styles from "../styles/page.module.css";

// Extract steps dynamically from JSON
const getRecipeSteps = (recipeName: string) => {
  const recipe = recipeData.recipes.find((r) => r.name === recipeName);
  return recipe ? recipe.steps : [];
};

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "start" | "ingredients" | "steps">("landing");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasStartedRecipe, setHasStartedRecipe] = useState(false);
  
  // Load recipe steps dynamically
  const recipeSteps = getRecipeSteps("Hummingbird Muffins");
  const totalSteps = recipeSteps.length;
  const currentStep = recipeSteps[currentStepIndex];

  // Navigation handlers
  const goToIngredients = () => setCurrentView("ingredients");
  const goToStart = () => setCurrentView("start");
  const goToSteps = () => {
    setCurrentView("steps");
    setHasStartedRecipe(true);
  };
  const goToLanding = () => setCurrentView("landing");

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

  const handleNavigateHome = () => {
    // Navigate to home page
    setCurrentView("start");
  };

  const handleStepSelect = (stepNumber: number) => {
    // Navigate to specific step
    setCurrentStepIndex(stepNumber - 1); // If using state to track current step
  };
  

  return (
    <div className={styles.container}>
      {currentView === "landing" && (
        <LandingPage onEnter={() => setCurrentView("start")} />
      )}
      {currentView === "start" && (
        <StartRecipe 
          onStart={goToSteps} 
          onShowIngredients={goToIngredients} 
          onBack={goToLanding}
          hasStarted={hasStartedRecipe}
        />
      )}
      {currentView === "ingredients" && (
        <Ingredients 
          onContinueToInstructions={goToSteps} 
          onBack={goToStart} 
        />
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
              demonstration={currentStep.demonstration}
              helpfulTip={currentStep.helpfulTip}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onNavigateHome={handleNavigateHome}
              onStepSelect={handleStepSelect}
              allStepTitles={recipeSteps.map((step) => step.title)}
            />
          </div>
        </>
      )}
    </div>
  );
}
