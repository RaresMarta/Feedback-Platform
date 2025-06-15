import { useEffect, useState } from "react";
import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashtagList from "./HashtagList";
import { TFeedbackItem } from "../lib/types";


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
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        );
        // Check if the response is ok
        if (!response.ok) {
          throw new Error();
        }
        // Parse the JSON response
        const data = await response.json();
        

        setFeedbackItems(data.feedbacks);
      } catch (error) {
        setErrorMessage("Failed to fetch feedback items. Please try again.");
      }
      setLoading(false);
    };
    fetchFeedbackItems();
  }, []);

  const handleAddToList = async (text: string) => {
    if (submitting) return;
    setSubmitting(true);

    if (feedbackItems.some(item => item.text === text)) {
      setErrorMessage("Duplicate feedback is not allowed.");
      setSubmitting(false);
      return;
    }

    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);

    const newItem: TFeedbackItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName[0].toUpperCase(),
    };

    setFeedbackItems(prev => [...prev, newItem]);

    try {
      await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
        {
          method: "POST",
          body: JSON.stringify(newItem),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
        }
      );
    } catch (error) {
      setErrorMessage("Failed to add feedback. Please try again.");
      setFeedbackItems(prev => prev.filter(item => item.id !== newItem.id));
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
