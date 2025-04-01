"use client";
import { useState } from "react";
import styles from "./AddRecipeModal.module.css";

interface AddRecipeModalProps {
  onClose: () => void;
}

export default function AddRecipeModal({ onClose }: AddRecipeModalProps) {
  const [url, setUrl] = useState("");
  // Removed 'loading' since it's not used.
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    // Future API call will go here
    // Example:
    // try {
    //   const res = await fetch("/api/parseRecipe", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ url }),
    //   });
    //   const data = await res.json();
    //   if (res.ok) {
    //     setMessage("Recipe added successfully!");
    //     onClose();
    //   } else {
    //     setMessage(data.error || "Error adding recipe");
    //   }
    // } catch (error) {
    //   setMessage("Error adding recipe");
    // }
  };

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
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}