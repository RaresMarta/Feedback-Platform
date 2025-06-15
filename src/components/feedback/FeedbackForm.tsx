import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";

type FeedbackFormProps = {
  onAddToList: (text: string) => void;
  setErrorMessage: (message: string) => void;
  submitting: boolean;
};

export default function FeedbackForm({ onAddToList, setErrorMessage, submitting }: FeedbackFormProps) {
  const [text, setText] = useState("");
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

    onAddToList(text);
    setText("");
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

      <div>
        <p className="u-italic">{charCount}</p>
        <button disabled={submitting}>Submit</button>
      </div>
    </form>
  );
}
