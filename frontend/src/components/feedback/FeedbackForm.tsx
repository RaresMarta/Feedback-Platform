import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";
import { TFeedbackCreate } from "../../lib/types";

type FeedbackFormProps = {
  onAddToList: (feedback: TFeedbackCreate) => void;
  setErrorMessage: (message: string) => void;
  submitting: boolean;
};

export default function FeedbackForm({ onAddToList, setErrorMessage, submitting }: FeedbackFormProps) {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const charCount = MAX_CHARACTERS - text.length;

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
      company,
      is_anonymous: isAnonymous
    });
    setText("");
  };

  const toggleAnonymous = () => {
    setIsAnonymous(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <textarea
        value={text}
        onChange={handleInput}
        id="feedback-textarea"
        placeholder="label"
        spellCheck={false}
        maxLength={MAX_CHARACTERS}
      />

      <label htmlFor="feedback-textarea">
        Enter your feedback here, remember to #hashtag the company
      </label>

      <div className="form-controls">
        <div className="char-count">
          <p className="u-italic">{charCount}</p>
        </div>
        
        <div className="form-buttons">
          <div className="anonymous-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={toggleAnonymous}
                className="toggle-checkbox"
              />
              <span className="toggle-text">Post anonymously</span>
            </label>
          </div>
          <button disabled={submitting} className="submit-button">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
