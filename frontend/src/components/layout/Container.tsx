import { TFeedbackItem, TFeedbackCreate, TUserResponse } from "../../lib/types";
import FeedbackList from "../feedback/FeedbackList";
import Header from "./Header";

type ContainerProps = {
  feedbackItems: TFeedbackItem[];
  loading: boolean;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  handleAddToList: (feedback: TFeedbackCreate) => void;
  submitting: boolean;
  user: TUserResponse | null;
};

export default function Container({
  feedbackItems,
  loading,
  errorMessage,
  setErrorMessage,
  handleAddToList,
  submitting,
  user
}: ContainerProps) {
  return (
    <main className="container">
      <Header 
        handleAddToList={handleAddToList} 
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        submitting={submitting}
        user={user}
      />
      <FeedbackList
        feedbackItems={feedbackItems}
        loading={loading}
      />
    </main>
  );
}
