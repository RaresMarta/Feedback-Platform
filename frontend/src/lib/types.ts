// Feedback types
export type TFeedbackItem = {
  id: number;
  upvoteCount: number;
  badgeLetter: string;
  company: string;
  content: string;
  daysAgo: number;
  is_anonymous?: boolean;
  user?: TUserResponse | null;
};

export type TFeedbackCreate = {
  content: string;
  company: string;
};

export type TUpvoteResponse = {
  upvoteCount: number;
};

// User types
export type TUserRegister = {
  username: string;
  email: string;
  password: string;
};

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserResponse = {
  id: number;
  username: string;
  email: string;
};

export type TAuthToken = {
  access_token: string;
  token_type: string;
};

// UI Component types
export type ErrorMessageProps = {
  message: string;
};