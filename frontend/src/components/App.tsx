import { useEffect, useState } from "react";
import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashtagList from "./HashtagList";
import { TFeedbackItem, TFeedbackCreate } from "../lib/types";
import { getAllFeedbacks, postFeedback } from "./apis/feedbackApi";


function App() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Retrieve tags from user posts
  const hashtags = Array.from(
    new Set(feedbackItems.map(item => `#${item.company}`))
  ).sort();

  // Fetch feedback items
  useEffect(() => { 
    const fetchFeedbackItems = async () => {
      setLoading(true);
      try {
        const data = await getAllFeedbacks();
        setFeedbackItems(data);
      } catch (error) {
        setErrorMessage("Failed to fetch feedback items. Please try again.");
      }
      setLoading(false);
    };
    fetchFeedbackItems();
  }, []);

  // Add feedback item
  const handleAddToList = async (feedbackData: TFeedbackCreate) => {
    // Prevent button action if already submitting
    if (submitting) return;
    setSubmitting(true);

    // Check for duplicate feedback
    if (feedbackItems.some(item => item.content === feedbackData.content)) {
      setErrorMessage("Duplicate feedback is not allowed.");
      setSubmitting(false);
      return;
    }

    // Post feedback
    try {
      const newItem = await postFeedback(feedbackData);
      setFeedbackItems(prev => [...prev, newItem]);
    } catch (error) {
      setErrorMessage("Failed to add feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Select company tag
  const handleSelectHashtag = (tag: string) => {
    setSelectedHashtag(prev => prev === tag ? null : tag);
    setErrorMessage(""); 
  };

  // Filter feedback items by company tag
  const filteredItems = selectedHashtag
    ? feedbackItems.filter(item => `#${item.company}` === selectedHashtag)
    : feedbackItems;

  return (
    <div className="app">
      <Container
        feedbackItems={filteredItems}
        loading={loading}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handleAddToList={handleAddToList}
        submitting={submitting}
      />
      <HashtagList
        hashtags={hashtags}
        selectedHashtag={selectedHashtag}
        handleSelectHashtag={handleSelectHashtag}
      />
      <Footer />
    </div>
  );
}

export default App;
