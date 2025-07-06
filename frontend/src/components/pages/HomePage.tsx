import Container from "../layout/Container";
import Footer from "../layout/Footer";
import HashtagList from "../HashtagList";
import { useFeedback } from "../../contexts/FeedbackContext";
import { useAuth } from "../../contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const { 
    filteredItems, 
    loading, 
    errorMessage, 
    setErrorMessage, 
    addFeedback, 
    submitting,
    hashtags,
    selectedHashtag,
    setSelectedHashtag
  } = useFeedback();

  // Select company tag
  const handleSelectHashtag = (tag: string) => {
    setSelectedHashtag(selectedHashtag === tag ? null : tag);
    setErrorMessage(""); 
  };

  return (
    <div className="app">
      <Container
        feedbackItems={filteredItems}
        loading={loading}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handleAddToList={addFeedback}
        submitting={submitting}
        user={user}
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
