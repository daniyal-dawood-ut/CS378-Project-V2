"use client";

import { useState, useEffect } from "react";
import RecipeStep from "../components/RecipeStep";
import Ingredients from "../components/Ingredients";
import StartRecipe from "../components/StartRecipe";
import LandingPage from "../components/LandingPage";
import styles from "../styles/page.module.css";
import { head } from "@vercel/blob";

// Define the interfaces needed (can be moved to a types file)
interface DemoIngredient {
  item: string;
  quantity?: string;
  substitutions?: { substitution: string }[];
}

interface DemoStep {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  imageUrl: string;
  timerDuration: number;
  demonstration: string;
  helpfulTip: string;
}

interface DemoRecipe {
  name: string;
  serving_size: number;
  ingredients: DemoIngredient[];
  steps: DemoStep[];
}

interface DemoRecipes {
  recipes: DemoRecipe[];
}

const BLOB_FILENAME = 'demo_recipes.json';

export default function Home() {
  const [allRecipeData, setAllRecipeData] = useState<DemoRecipes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<"landing" | "start" | "ingredients" | "steps">("landing");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasStartedRecipe, setHasStartedRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");

  // Fetch data from Blob on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const blobMetadata = await head(BLOB_FILENAME);
        const response = await fetch(blobMetadata.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.statusText}`);
        }
        const data: DemoRecipes = await response.json();
        // Basic validation
        if (!data || !Array.isArray(data.recipes)) {
            throw new Error("Fetched recipe data is invalid.");
        }
        setAllRecipeData(data);
      } catch (err) {
        console.error("Error fetching recipe data from Blob:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setAllRecipeData({ recipes: [] }); // Set empty data on error to prevent crashes downstream
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  // Updated function to use fetched data from state
  const getRecipeSteps = (recipeName: string): DemoStep[] => {
    if (!allRecipeData) return []; // Return empty if data not loaded
    const recipe = allRecipeData.recipes.find((r) => r.name === recipeName);
    return recipe ? recipe.steps : [];
  };

  // Load recipe steps dynamically using the updated function
  const recipeSteps = getRecipeSteps(selectedRecipe);
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

  const handleSelectRecipe = (recipeName: string) => {
    setSelectedRecipe(recipeName);
    setHasStartedRecipe(false);
    setCurrentStepIndex(0);
    setCurrentView("start");
  }

  // Timer state and functions
  const [timerStates, setTimerStates] = useState<{
    [stepNumber: number]: {
      timeRemaining: number;
      isPaused: boolean;
      isActive: boolean;
    };
  }>({});

  useEffect(() => {
    if (!recipeSteps || recipeSteps.length === 0) return; // Don't run if steps aren't loaded

    const initialTimerStates: {
      [key: number]: {
        timeRemaining: number;
        isPaused: boolean;
        isActive: boolean;
      };
    } = {};

    recipeSteps.forEach((step, index) => {
      initialTimerStates[index + 1] = {
        timeRemaining: step.timerDuration * 60 || 0,
        isPaused: false,
        isActive: step.timerDuration > 0
      };
    });
    setTimerStates(initialTimerStates);
  }, [selectedRecipe, recipeSteps]); // Re-run when selectedRecipe or recipeSteps change

  const pauseTimer = (stepNumber: number) => {
    setTimerStates(prev => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        isPaused: true
      }
    }));
  };

  const resumeTimer = (stepNumber: number) => {
    setTimerStates(prev => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        isPaused: false
      }
    }));
  };

  const updateTimer = (stepNumber: number, newTime: number) => {
    setTimerStates(prev => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        timeRemaining: newTime
      }
    }));
  };

  // Render Loading / Error states
  if (isLoading) {
      return <div className={styles.container}><p className={styles.loadingMessage}>Loading recipes...</p></div>;
  }

  if (error) {
      return <div className={styles.container}><p className={styles.errorMessage}>Error loading recipes: {error}</p></div>;
  }

  if (!allRecipeData) {
       return <div className={styles.container}><p className={styles.errorMessage}>No recipe data loaded.</p></div>;
  }

  return (
    <div className={styles.container}>
      {currentView === "landing" && (
        <LandingPage recipes={allRecipeData.recipes} onSelectRecipe={handleSelectRecipe} />
      )}
      {currentView === "start" && selectedRecipe && (
        <StartRecipe
          onStart={goToSteps}
          onShowIngredients={goToIngredients}
          onBack={goToLanding}
          hasStarted={hasStartedRecipe}
          selected={selectedRecipe}
        />
      )}
      {currentView === "ingredients" && selectedRecipe && (
        <Ingredients
          allRecipeData={allRecipeData}
          selected={selectedRecipe}
          onContinueToInstructions={goToSteps}
          onBack={goToStart}
        />
      )}
      {currentView === "steps" && totalSteps > 0 && currentStep && (
        <>
          <h1 className={styles.title}>{selectedRecipe}</h1>
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
              timerState={timerStates[currentStepIndex + 1] || { timeRemaining: 0, isPaused: false, isActive: false }}
              onPauseTimer={() => pauseTimer(currentStepIndex + 1)}
              onResumeTimer={() => resumeTimer(currentStepIndex + 1)}
              onUpdateTimer={(time) => updateTimer(currentStepIndex + 1, time)}
            />

          </div>
        </>
      )}
    </div>
  );
}
