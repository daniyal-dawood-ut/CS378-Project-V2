"use client";

import { useState } from 'react';
import RecipeStep from '../components/RecipeStep';
import Ingredients from '../components/Ingredients';
import StartRecipe from '../components/StartRecipe';

const Page = () => {
  const [currentStep, setCurrentStep] = useState<"ingredients" | "step" | "none">("none");

  const handleShowIngredients = () => {
    setCurrentStep("ingredients");
  };

  const handleStartRecipe = () => {
    setCurrentStep("step");
  };

  const handleContinueToInstructions = () => {
    setCurrentStep("step");
  };

  // Sample data for RecipeStep
  const recipeStepData = {
    stepNumber: 1,
    totalSteps: 5,
    title: "Prepare the Muffin Batter",
    description: "Mix all the dry ingredients together and then add the wet ingredients.",
    imageUrl: "/images/step1.jpg",
  };

  return (
    <div>
      <StartRecipe 
        onStart={handleStartRecipe} 
        onShowIngredients={handleShowIngredients} 
      />

      {currentStep === "ingredients" && (
        <Ingredients onContinueToInstructions={handleContinueToInstructions} />
      )}
      
      {currentStep === "step" && (
        <RecipeStep 
          stepNumber={recipeStepData.stepNumber}
          totalSteps={recipeStepData.totalSteps}
          title={recipeStepData.title}
          description={recipeStepData.description}
          imageUrl={recipeStepData.imageUrl}
        />
      )}
    </div>
  );
};

export default Page;
