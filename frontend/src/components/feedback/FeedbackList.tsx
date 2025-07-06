import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import { TFeedbackItem } from "../../lib/types";

type FeedbackListProps = {
  feedbackItems: TFeedbackItem[];
  loading: boolean;
};

export default function FeedbackList({
  feedbackItems,
  loading,
}: FeedbackListProps) {
  return (
    <ol className="feedback-list">
      {loading && <Spinner />}

      {/* Print feedback items */}
      {feedbackItems.map((feedbackItem: TFeedbackItem) => (
        <FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
      ))}
    </ol>
  );
}
