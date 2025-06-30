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

  const hashtags = Array.from(
    new Set(feedbackItems.map(item => `#${item.company}`))
  ).sort();

  console.log("All IDs:", feedbackItems.map(item => item.id));

  useEffect(() => { // Fetch feedback items on mount
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

  const handleAddToList = async (feedbackData: TFeedbackCreate) => {
    if (submitting) return;
    setSubmitting(true);

    if (feedbackItems.some(item => item.content === feedbackData.content)) {
      setErrorMessage("Duplicate feedback is not allowed.");
      setSubmitting(false);
      return;
    }

    try {
      const newItem = await postFeedback(feedbackData);
      setFeedbackItems(prev => [...prev, newItem]);
    } catch (error) {
      setErrorMessage("Failed to add feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectHashtag = (tag: string) => {
    setSelectedHashtag(prev => prev === tag ? null : tag);
    setErrorMessage(""); 
  };

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
