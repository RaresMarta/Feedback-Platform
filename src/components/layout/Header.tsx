import FeedbackForm from "../feedback/FeedbackForm";
import Logo from "../Logo";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";

type HeaderProps = {
  handleAddToList: (text: string) => void;
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
