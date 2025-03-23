import { TriangleUpIcon } from "@radix-ui/react-icons";
import { TFeedbackItem } from "../../lib/types";
import { useState } from "react";

type itemProps = {
  feedbackItem: TFeedbackItem;
};

export default function FeedbackItem({ feedbackItem }: itemProps) {
  const [toggleUpvote, setToggleUpvote] = useState(false);
  const [upvotes, setUpvotes] = useState(feedbackItem.upvoteCount);

  const handleUpvote = () => {
    if (!toggleUpvote) {
      setUpvotes(upvotes + 1);
      setToggleUpvote(true);
    } else {
      setUpvotes(upvotes - 1);
      setToggleUpvote(false);
    }
  };

  return (
    <li className="feedback">
      <button onClick={handleUpvote}>
        <TriangleUpIcon />
        <span>{upvotes}</span>
      </button>

      <div>
        <p>{feedbackItem.badgeLetter}</p>
      </div>

      <div>
        <p>{feedbackItem.company}</p>
        <p>{feedbackItem.text}</p>
      </div>

      <p>{feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo} d`}</p>
    </li>
  );
}
