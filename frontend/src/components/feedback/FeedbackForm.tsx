import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";
import { TFeedbackCreate, TUserResponse } from "../../lib/types";

type FeedbackFormProps = {
  onAddToList: (feedback: TFeedbackCreate) => void;
  setErrorMessage: (message: string) => void;
  submitting: boolean;
  user: TUserResponse | null;
};

export default function FeedbackForm({ onAddToList, setErrorMessage, submitting, user }: FeedbackFormProps) {
  const [text, setText] = useState("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newText = event.target.value;
  
    if (newText.length > MAX_CHARACTERS) return;

    // Prevent basic script injections
    if (newText.includes("<script>")) {
      setErrorMessage("Scripts are not allowed");
      newText = newText.replace("<script>", "");
    } 
    else if (newText.includes("@")) {
      setErrorMessage("No @ symbol allowed");
      newText = newText.replace("@", "");
    } 
    else {
      setErrorMessage("");
    }
    setText(newText);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (text.trim() === "") {
      setErrorMessage("Feedback cannot be empty");
      return;
    }

    // Extract company from hashtag
    const hashtagMatch = text.match(/#(\w+)/);
    const company = hashtagMatch ? hashtagMatch[1] : "unknown";

    onAddToList({
      content: text,
      company
    });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <textarea
        value={text}
        onChange={handleInput}
        id="feedback-textarea"
        placeholder="Enter your feedback here, remember to #hashtag the company"
        spellCheck={false}
        maxLength={MAX_CHARACTERS}
      />

      <label htmlFor="feedback-textarea">
        {user ? (
          <>
            Hi {user.username}!<br />
            Enter your feedback and tag the #company
          </>
        ) : (
          "Enter your feedback and tag the #company"
        )}
      </label>

      <div className="form-controls">
        <div className="char-count">
          <p className="u-italic">{text.length} / {MAX_CHARACTERS}</p>
        </div>
        
        <div className="form-buttons">
          {/* Submit button */}
          <button 
            type="submit" 
            disabled={submitting} 
            className="submit-button"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
