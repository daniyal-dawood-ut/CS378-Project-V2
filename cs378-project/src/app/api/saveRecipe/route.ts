import { NextResponse } from 'next/server';
import { put, head } from '@vercel/blob'; // Import blob functions

// Define the structure of the recipe data file
interface RecipeData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recipes: any[]; // Using 'any' for simplicity, define a stricter type if needed
}

// Define the path/name for the blob file
const BLOB_FILENAME = 'https://ddalzhihftsbuuka.public.blob.vercel-storage.com/demo_recipes.json';

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

    // 3. Read the existing data from Vercel Blob
    let existingData: RecipeData = { recipes: [] };
    try {
      // Check if the blob exists first and get its metadata (including URL)
      const blobMetadata = await head(BLOB_FILENAME); // Throws error if not found

      // If it exists, fetch its content using the URL from metadata
      const response = await fetch(blobMetadata.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch blob content: ${response.statusText}`);
      }
      const fileContent = await response.text();

      if (fileContent) {
          existingData = JSON.parse(fileContent);
          // Ensure existingData has the correct structure
          if (!Array.isArray(existingData.recipes)) {
              console.warn('Blob data was malformed. Resetting.');
              existingData = { recipes: [] };
          }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // If the blob doesn't exist (head throws a 404-like error), we start with an empty array.
      // Check if the error indicates 'not found'. The Vercel Blob SDK might throw specific error types,
      // or you might need to check error properties like status or code if available.
      // For now, we log a general warning for any error during head/fetch.
      if (error.status === 404) { // Example check, adjust based on actual error structure
          console.warn(`Blob ${BLOB_FILENAME} not found. Starting with empty recipes.`);
      } else {
          console.error(`Error reading blob ${BLOB_FILENAME}:`, error);
          // Consider if you should return 500 here or proceed with empty data
      }
      // existingData remains { recipes: [] }
    }

    // 4. Append the new recipe object to the existing recipes array
    existingData.recipes.push(newRecipeObject);

    // 5. Write the updated data back to Vercel Blob
    await put(BLOB_FILENAME, JSON.stringify(existingData, null, 2), {
        access: 'public', // Set access level ('public' makes it accessible via URL)
        addRandomSuffix: false // Ensure we overwrite the same file
    });

    // 6. Return a success response
    return NextResponse.json({ message: 'Recipe saved successfully via Blob' }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/saveRecipe:', error);
    // Check if the error is related to JSON parsing specifically
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Failed to parse incoming JSON data' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
