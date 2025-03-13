import { useEffect } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import firebaseApp from "../firebaseConfig"; // Ensure Firebase is configured correctly

const AllWords = () => {
  useEffect(() => {
    observeDOMChanges();
  },);

  // Function to collect text from all rendered components
  const collectTextFromDOM = () => {
    let allText = [];
    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, button, label, a").forEach(el => {
      let text = el.innerText.trim();
      if (text) allText.push(text);
    });
    return allText;
  };

  // Function to fetch existing words and update Firebase with new ones
  const updateWordsInFirebase = async () => {
    const db = getDatabase(firebaseApp);
    const wordsRef = ref(db, "allWords");

    try {
      const snapshot = await get(wordsRef);
      let existingWords = snapshot.exists() ? Object.values(snapshot.val()).map(obj => obj.word) : [];

      // Get new words not already stored
      let newWords = collectTextFromDOM().filter(word => !existingWords.includes(word));

      // Update Firebase if new words exist
      if (newWords.length > 0) {
        newWords.forEach(word => {
          set(ref(db, `allWords/${word.replace(/\s+/g, "_")}`), { word });
        });
      }
    } catch (error) {
      console.error("Error updating words in Firebase:", error);
    }
  };

  // Observe changes in the DOM (detects dynamically added words)
  const observeDOMChanges = () => {
    const observer = new MutationObserver(() => updateWordsInFirebase());
    observer.observe(document.body, { childList: true, subtree: true });
  };

  return null; // No UI needed, runs silently in the background
};

export default AllWords;
