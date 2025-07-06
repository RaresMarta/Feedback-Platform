import FeedbackForm from "../feedback/FeedbackForm";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";
import { TFeedbackCreate, TUserResponse } from "../../lib/types";

type HeaderProps = {
  handleAddToList: (feedback: TFeedbackCreate) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  submitting: boolean;
  user: TUserResponse | null;
};

export default function Header({ handleAddToList, errorMessage, setErrorMessage, submitting, user }: HeaderProps) {
  return (
    <header className="page-header">
      <Pattern />
      <PageHeading />
      <FeedbackForm 
        onAddToList={handleAddToList} 
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage} 
        submitting={submitting}
        user={user}
      />
    </header>
  );
}
