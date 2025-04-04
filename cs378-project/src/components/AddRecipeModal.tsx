"use client";
import { useState } from "react";
import styles from "./AddRecipeModal.module.css";
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import OpenAI from 'openai';

interface AddRecipeModalProps {
  onClose: () => void;
}

export default function AddRecipeModal({ onClose }: AddRecipeModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const processWithChatGPT = async (scrapedContent: string) => {
    // NOTE: In production, API keys should be stored securely on the server-side
    const openai = new OpenAI({
      apiKey: "HIDDEN",
      dangerouslyAllowBrowser: true // Required for client-side use
    });

    const prompt = `Extract the recipe details and format them as JSON in the following format:
    {
      "recipes": [
        {
          "name": "<recipe name>",
          "ingredients": [
            {
              "item": "<ingredient>",
              "quantity": "<quantity>",
              "substitutions": [
                { "substitution": "<alternative>" }
              ]
            },
            ...
          ],
          "steps": [
            {
              "stepNumber": <number>,
              "totalSteps": <total>,
              "title": "<step title>",
              "description": "<step description>",
              "imageUrl": "INTENTIONALLY LEAVE NULL",
              "timerDuration": <duration in seconds>,
              "demonstration": "<demonstration text>",
              "helpfulTip": "<helpful tip text>"
            },
            ...
          ]
        }
      ]
    }
    Provide only the JSON output. You will need to make up your own substitutions, demonstration, and helpfulTip texts based on what you think would work. Create the imageURL field but leave it null.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that extracts recipe information." },
          { role: "user", content: prompt },
          { role: "user", content: scrapedContent }
        ],
        temperature: 0.7,
      });

      // Extract the JSON recipe data from the response
      const recipeJson = response.choices[0].message.content;
      console.log('Processed Recipe JSON:', recipeJson);
      return recipeJson;
    } catch (error) {
      console.error('Error processing with ChatGPT:', error);
      throw error;
    }
  };

  const saveRecipeToFile = async (recipeJson: string) => {
    try {
      const response = await fetch('/api/saveRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe: recipeJson }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      const app = new FirecrawlApp({apiKey: "HIDDEN"});
      
      // Make API call to scrape the URL
      const scrapeResult = await app.scrapeUrl(url, { formats: ['markdown'] }) as ScrapeResponse;
      
      // Handle API response
      if (!scrapeResult.success) {
        setMessage(`Failed to scrape: ${scrapeResult.error || 'Unknown error'}`);
        console.error('Scraping failed:', scrapeResult.error);
      } else {
        // Log the scraped content
        console.log('Scraped Content:', scrapeResult.markdown);
        
        // Process the content with ChatGPT
        setMessage("URL scraped successfully! Processing with ChatGPT...");
        const recipeJson = await processWithChatGPT(scrapeResult.markdown || '');
        
        // TODO: Uncomment this when we have the server-side endpoint
        // Add null check before passing to saveRecipeToFile
        // if (recipeJson) {
        //   setMessage("Recipe processed! Saving to file...");
        //   await saveRecipeToFile(recipeJson);
        //   setMessage("Recipe saved successfully! Check browser console (F12) for structured recipe data.");
        // } else {
        //   setMessage("Failed to process recipe. Please try again with a different URL.");
        // }
      }
    } catch (error) {
      console.error('Error processing recipe:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Simple modal with just a form and status message
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2>Upload Custom Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Paste your recipe URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        {message && <p className={styles.statusMessage}>{message}</p>}
      </div>
    </div>
  );
}