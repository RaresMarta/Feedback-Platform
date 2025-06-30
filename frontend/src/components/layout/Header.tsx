import FeedbackForm from "../feedback/FeedbackForm";
import Logo from "../Logo";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";
import { TFeedbackCreate } from "../../lib/types";

type HeaderProps = {
  handleAddToList: (feedback: TFeedbackCreate) => void;
  setErrorMessage: (message: string) => void;
  submitting: boolean;
};

export default function Header({ handleAddToList, setErrorMessage, submitting }: HeaderProps) {
  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      <FeedbackForm 
        onAddToList={handleAddToList} 
        setErrorMessage={setErrorMessage} 
        submitting={submitting}
      />
    </header>
  );
}
