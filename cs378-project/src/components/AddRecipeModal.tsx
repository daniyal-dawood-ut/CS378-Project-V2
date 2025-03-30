// components/AddRecipeModal.tsx
"use client";
import { useState } from "react";
import styles from "./AddRecipeModal.module.css";

interface AddRecipeModalProps {
  onClose: () => void;
}

export default function AddRecipeModal({ onClose }: AddRecipeModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    // STUFF TO ADD LATER
    // try {
    //   const res = await fetch("/api/parseRecipe", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ url }),
    //   });
    //   const data = await res.json();
    //   if (res.ok) {
    //     // Ideally, update your recipe list state here so that the new card appears immediately.
    //     setMessage("Recipe added successfully!");
    //     // Optionally, call a prop callback to update the global recipe list.
    //     onClose();
    //   } else {
    //     setMessage(data.error || "Error adding recipe");
    //   }
    // } catch (error) {
    //   setMessage("Error adding recipe");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
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
        {/* Add later, will be loading screen while we add recipe */}
        {/* {loading && (
          <div className={styles.spinnerOverlay}>
            <div className={styles.spinner}>Uploading recipe...</div>
          </div>
        )} */}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
