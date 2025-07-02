import { TriangleUpIcon } from "@radix-ui/react-icons";
import { TFeedbackItem } from "../../lib/types";
import { useState } from "react";
import { upvoteFeedback } from "../apis/feedbackApi";

type itemProps = {
  feedbackItem: TFeedbackItem;
};

export default function FeedbackItem({ feedbackItem }: itemProps) {
  const [toggleUpvote, setToggleUpvote] = useState(false);
  const [upvotes, setUpvotes] = useState(feedbackItem.upvoteCount);

  const handleUpvote = async () => {
    try {
      await upvoteFeedback(feedbackItem.id);
      setUpvotes(upvotes + 1);
      setToggleUpvote(true);
    } catch (error) {
      console.error("Failed to upvote feedback:", error);
    }
  };

  return (
    <li className="feedback">
      <button 
        onClick={handleUpvote}
        className={toggleUpvote ? "upvoted" : ""}
      >
        <TriangleUpIcon />
        <span>{upvotes}</span>
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
