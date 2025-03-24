"use client"

import { useState } from 'react';
import RecipeStep from '../components/RecipeStep';
import Ingredients from '../components/Ingredients';
import StartRecipe from '../components/StartRecipe';
import styles from '../styles/page.module.css';

// Sample recipe data
const recipeSteps = [
  {
    id: 1,
    title: "Mix ingredients",
    description: "In a medium bowl, stir together the bananas, pineapple, sugar, butter, milk, and egg. Set aside.",
    imageUrl: "/images/mix-ingredients.jpg",
    timerDuration: 92 // 1 min 32 sec
  },
  {
    id: 2,
    title: "Combine dry ingredients",
    description: "In a large bowl, combine flour, baking powder, baking soda, salt, and cinnamon.",
    imageUrl: "/images/dry-ingredients.jpg"
  },
  // Add more steps as needed
];

export default function Home() {
  // We now have three states: start, ingredients, and steps.
  const [currentView, setCurrentView] = useState<'start' | 'ingredients' | 'steps'>('start');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const currentStep = recipeSteps[currentStepIndex];
  const totalSteps = recipeSteps.length;
  
  const goToIngredients = () => setCurrentView('ingredients');
  const goToStart = () => setCurrentView('start');
  const goToSteps = () => setCurrentView('steps');
  
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
      {currentView === 'start' && (
        <StartRecipe onStart={goToSteps} onShowIngredients={goToIngredients} />
      )}
      {currentView === 'ingredients' && (
        <Ingredients onContinueToInstructions={goToSteps} onBack={goToStart} />
      )}
      {currentView === 'steps' && (
        <>
          <h1 className={styles.title}>Hummingbird Muffins</h1>
          <div className={styles.stepWrapper}>
            <RecipeStep
              stepNumber={currentStep.id}
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
