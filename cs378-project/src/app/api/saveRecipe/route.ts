import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the structure of the recipe data file
interface RecipeData {
  recipes: any[]; // Using 'any' for simplicity, define a stricter type if needed
}

// Define the path to the user recipes file
const userRecipesPath = path.join(process.cwd(), 'demo_recipes.json');

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming request body
    const body = await request.json();
    const recipeJsonString = body.recipe; // The stringified JSON from the frontend

    if (!recipeJsonString || typeof recipeJsonString !== 'string') {
      return NextResponse.json({ message: 'Invalid recipe data received' }, { status: 400 });
    }

    // 2. Parse the recipe JSON string itself
    let newRecipeData;
    try {
        newRecipeData = JSON.parse(recipeJsonString);
    } catch (parseError) {
        console.error('Error parsing recipe JSON string:', parseError);
        return NextResponse.json({ message: 'Invalid JSON format in recipe data' }, { status: 400 });
    }

    // Ensure the parsed data has the expected structure { recipes: [...] }
    if (!newRecipeData || !Array.isArray(newRecipeData.recipes) || newRecipeData.recipes.length === 0) {
        console.error('Parsed recipe data is missing the recipes array or is empty:', newRecipeData);
        return NextResponse.json({ message: 'Parsed recipe data structure is invalid' }, { status: 400 });
    }
    
    // Extract the actual recipe object (assuming only one recipe is sent per request)
    const newRecipeObject = newRecipeData.recipes[0];

    // 3. Read the existing user_recipes.json file
    let existingData: RecipeData = { recipes: [] };
    try {
      const fileContent = await fs.readFile(userRecipesPath, 'utf-8');
      existingData = JSON.parse(fileContent);
      // Ensure existingData has the correct structure
      if (!Array.isArray(existingData.recipes)) {
          console.warn('user_recipes.json was malformed. Resetting.');
          existingData = { recipes: [] };
      }
    } catch (error: any) {
      // If the file doesn't exist (ENOENT), we start with an empty array, which is fine.
      // Log other errors.
      if (error.code !== 'ENOENT') {
        console.error('Error reading user_recipes.json:', error);
        // Decide if you want to proceed with an empty array or return an error
        // return NextResponse.json({ message: 'Error reading existing recipes file' }, { status: 500 });
      }
      // If file doesn't exist or is empty/invalid JSON, existingData remains { recipes: [] }
    }

    // 4. Append the new recipe object to the existing recipes array
    existingData.recipes.push(newRecipeObject);

    // 5. Write the updated data back to user_recipes.json
    await fs.writeFile(userRecipesPath, JSON.stringify(existingData, null, 2), 'utf-8'); // Pretty print JSON

    // 6. Return a success response
    return NextResponse.json({ message: 'Recipe saved successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/saveRecipe:', error);
    // Check if the error is related to JSON parsing specifically
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Failed to parse incoming JSON data' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
