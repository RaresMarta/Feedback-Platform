import { TFeedbackItem, TUpvoteResponse, TFeedbackCreate } from "../../lib/types"
import { API_BASE_URL } from "../../lib/constants"
import { fetchWithAuth, handleApiError } from "./apiUtils"

const FEEDBACKS_URL = `${API_BASE_URL}/feedbacks`

// Get all feedback items
export async function getAllFeedbacks(): Promise<TFeedbackItem[]> {
    const response = await fetch(FEEDBACKS_URL);
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data.items as TFeedbackItem[];
}

// Create a feedback (handles both regular and anonymous feedback)
export async function postFeedback(feedback: TFeedbackCreate): Promise<TFeedbackItem> {
    const response = await fetchWithAuth(FEEDBACKS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(feedback)
    });
    
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data as TFeedbackItem;
}

// Upvote a feedback
export async function upvoteFeedback(feedbackId: number): Promise<TUpvoteResponse> {
    const response = await fetch(`${FEEDBACKS_URL}/${feedbackId}/upvote`, {
        method: "PUT"
    });
    
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data as TUpvoteResponse;
}

// Get user's feedbacks
export async function getUserFeedbacks(userId: number): Promise<TFeedbackItem[]> {
    const response = await fetchWithAuth(`${FEEDBACKS_URL}/user/${userId}`);
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data.items as TFeedbackItem[];
}
