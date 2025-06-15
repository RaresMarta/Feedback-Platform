import { ErrorMessageProps } from '../lib/types';

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <div>{message}</div>;
}
