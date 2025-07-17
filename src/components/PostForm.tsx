import { useZero } from "@rocicorp/zero/react";
import { useState } from "react";
import { Schema } from "../lib/zero/schema";
import type { Mutators } from "../lib/zero/mutators";
import { v4 as uuidv4 } from "uuid";

// Utility function to detect touch devices
function isTouchDevice() {
  return (
    (typeof window !== "undefined" && "ontouchstart" in window) ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}

export default function PostForm() {
  const z = useZero<Schema, Mutators>();
  const [postText, setPostText] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postText.trim()) return;

    const message = postText.trim();
    z.mutate.post
      .add({
        id: uuidv4(),
        message,
      })
      .server.catch((err) => {
        console.error("Error creating post:", err);
        setPostText(message);
        alert("Failed to save your post. Please try again.");
      });

    // Clear the input after submission
    setPostText("");
  }

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        name="message"
        placeholder="What's happening???"
        aria-label="Create a new post"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        onKeyDown={(e) => {
          // Submit on Enter (but not when Alt/Shift/Ctrl is pressed)
          if (
            e.key === "Enter" &&
            !e.altKey &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !isTouchDevice() // Disable Enter-to-post on touch devices
          ) {
            e.preventDefault();
            if (postText.trim()) {
              e.currentTarget.form?.requestSubmit(); // Submit the form programmatically
            }
          }
        }}
        maxLength={280}
      ></textarea>
      <div className="post-actions">
        <span className="char-count">
          {postText.length}/280
          {!isTouchDevice() && (
            <span className="keyboard-hint">
              Press Enter to post, Shift+Enter for line break
            </span>
          )}
        </span>
        <button type="submit" disabled={!postText.trim()}>
          Post
        </button>
      </div>
    </form>
  );
}
