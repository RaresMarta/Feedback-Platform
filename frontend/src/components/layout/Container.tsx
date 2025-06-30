import { TFeedbackItem } from "../../lib/types";
import FeedbackList from "../feedback/FeedbackList";
import Header from "./Header";

type ContainerProps = {
  feedbackItems: TFeedbackItem[];
  loading: boolean;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  handleAddToList: (text: string) => void;
  submitting: boolean;
};

export default function Container({
  feedbackItems,
  loading,
  errorMessage,
  setErrorMessage,
  handleAddToList,
  submitting,
}: ContainerProps) {
  return (
    <main className="container">
      <Header 
        handleAddToList={handleAddToList} 
        setErrorMessage={setErrorMessage}
        submitting={submitting}
      />
      <FeedbackList
        feedbackItems={feedbackItems}
        loading={loading}
        errorMessage={errorMessage}
      />
    </main>
  );
}
