import { TriangleUpIcon } from "@radix-ui/react-icons";
import { TFeedbackItem } from "../../lib/types";
import { useFeedback } from "../../contexts/FeedbackContext";

type itemProps = {
  feedbackItem: TFeedbackItem;
};

export default function FeedbackItem({ feedbackItem }: itemProps) {
  const { handleUpvote, upvotedItems } = useFeedback();
  const isUpvoted = upvotedItems.has(feedbackItem.id);

  return (
    <li className="feedback">
      <button 
        onClick={() => handleUpvote(feedbackItem.id)}
        className={isUpvoted ? "upvoted" : ""}
      >
        <TriangleUpIcon />
        <span>{feedbackItem.upvoteCount}</span>
      </button>

      <div>
        <p>{feedbackItem.badgeLetter}</p>
      </div>

      <div>
        <p>{feedbackItem.company}</p>
        <p>{feedbackItem.content}</p>
      </div>

      <p>{feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo} d`}</p>
    </li>
  );
}
