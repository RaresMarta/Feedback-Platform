import FeedbackForm from "../feedback/FeedbackForm";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";
import { TFeedbackCreate, TUserResponse } from "../../lib/types";

type HeaderProps = {
  handleAddToList: (feedback: TFeedbackCreate) => void;
  setErrorMessage: (message: string) => void;
  submitting: boolean;
  user: TUserResponse | null;
};

export default function Header({ handleAddToList, setErrorMessage, submitting, user }: HeaderProps) {
  return (
    <header>
      <Pattern />
      <PageHeading />
      <FeedbackForm 
        onAddToList={handleAddToList} 
        setErrorMessage={setErrorMessage} 
        submitting={submitting}
        user={user}
      />
    </header>
  );
}
