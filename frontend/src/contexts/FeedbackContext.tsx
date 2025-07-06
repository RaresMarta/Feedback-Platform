import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TFeedbackItem, TFeedbackCreate } from '../lib/types';
import { getAllFeedbacks, postFeedback, upvoteFeedback } from '../components/apis/feedbackApi';
import { isLoggedIn } from '../components/apis/apiUtils';
import { useToast } from './ToastContext';

interface FeedbackContextType {
  feedbackItems: TFeedbackItem[];
  loading: boolean;
  submitting: boolean;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  addFeedback: (feedback: TFeedbackCreate) => Promise<void>;
  handleUpvote: (feedbackId: number) => Promise<void>;
  upvotedItems: Set<number>;
  selectedHashtag: string | null;
  setSelectedHashtag: (hashtag: string | null) => void;
  filteredItems: TFeedbackItem[];
  hashtags: string[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Helper function to process feedback items and ensure required fields
const processFeedbackItem = (item: TFeedbackItem): TFeedbackItem => {
  return {
    ...item,
    daysAgo: typeof item.daysAgo === 'number' ? item.daysAgo : 0,
    badgeLetter: item.company ? item.company.charAt(0).toUpperCase() : 'C'
  };
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [upvotedItems, setUpvotedItems] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  // Fetch feedback items on mount
  useEffect(() => {
    const fetchFeedbackItems = async () => {
      setLoading(true);
      try {
        const data = await getAllFeedbacks();
        // Process each feedback item to ensure required fields
        const processedData = data.map(processFeedbackItem);
        setFeedbackItems(processedData);
      } catch (error) {
        showToast("Failed to load feedback items", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedbackItems();
  }, [showToast]);

  // Add feedback item
  const addFeedback = async (feedbackData: TFeedbackCreate) => {
    // Prevent button action if already submitting
    if (submitting) return;
    
    // Check if user is logged in
    if(!isLoggedIn()) {
        setErrorMessage("Please log in to submit feedback");
        return;
    }

    setSubmitting(true);
    setErrorMessage("");

    // Check for duplicate feedback
    if (feedbackItems.some(item => item.content === feedbackData.content)) {
      setErrorMessage("Duplicate feedback is not allowed.");
      setSubmitting(false);
      return;
    }

    // Post feedback
    try {
      const newItem = await postFeedback(feedbackData);
      
      // Process the new item to ensure all required fields
      const processedItem = processFeedbackItem(newItem);
      
      setFeedbackItems(prev => [...prev, processedItem]);
      showToast("Feedback submitted successfully", "success");
    } catch (error) {
      setErrorMessage("Failed to add feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle upvoting a feedback item
  const handleUpvote = async (feedbackId: number) => {
    // Prevent duplicate upvotes
    if (upvotedItems.has(feedbackId)) {
      return;
    }

    try {
      await upvoteFeedback(feedbackId);
      
      // Update the feedback item's upvote count
      setFeedbackItems(prevItems => 
        prevItems.map(item => 
          item.id === feedbackId 
            ? { ...item, upvoteCount: item.upvoteCount + 1 } 
            : item
        )
      );
      
      // Add to upvoted items set
      setUpvotedItems(prev => new Set(prev).add(feedbackId));
      
    } catch (error) {
      showToast("Failed to upvote feedback", "error");
    }
  };

  // Derive hashtags from feedback items
  const hashtags = Array.from(
    new Set(feedbackItems.map(item => `#${item.company}`))
  ).sort();

  // Filter feedback items by company tag
  const filteredItems = selectedHashtag
    ? feedbackItems.filter(item => `#${item.company}` === selectedHashtag)
    : feedbackItems;

  return (
    <FeedbackContext.Provider 
      value={{ 
        feedbackItems, 
        loading, 
        submitting, 
        errorMessage, 
        setErrorMessage, 
        addFeedback,
        handleUpvote,
        upvotedItems,
        selectedHashtag,
        setSelectedHashtag,
        filteredItems,
        hashtags
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}