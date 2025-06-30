export type TFeedbackItem = {
  id: number;
  upvoteCount: number;
  badgeLetter: string;
  company: string;
  content: string;
  daysAgo: number;
};

export type ErrorMessageProps = {
  message: string;
};