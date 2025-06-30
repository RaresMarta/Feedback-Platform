import { useEffect, useState } from "react";
import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashtagList from "./HashtagList";
import { TFeedbackItem } from "../lib/types";

const API_BASE_URL = "http://localhost:8000/api";

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
        const response = await fetch(`${API_BASE_URL}/feedbacks`);
        // Check if the response is ok
        if (!response.ok) {
          throw new Error();
        }
        // Parse the JSON response
        const data = await response.json();
        setFeedbackItems(data);
      } catch (error) {
        setErrorMessage("Failed to fetch feedback items. Please try again.");
      }
      setLoading(false);
    };
    fetchFeedbackItems();
  }, []);

  const handleAddToList = async (content: string) => {
    if (submitting) return;
    setSubmitting(true);

    if (feedbackItems.some(item => item.content === content)) {
      setErrorMessage("Duplicate feedback is not allowed.");
      setSubmitting(false);
      return;
    }

    const companyName = content
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);

    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          company: companyName,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const newItem = await response.json();
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
