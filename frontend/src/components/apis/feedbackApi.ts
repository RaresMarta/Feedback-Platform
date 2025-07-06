import { TFeedbackItem, TUpvoteResponse, TFeedbackCreate } from "../../lib/types"
import { API_BASE_URL } from "../../lib/constants"
import { fetchWithAuth, handleApiError, getAuthToken } from "./apiUtils"

const FEEDBACKS_URL = `${API_BASE_URL}/feedbacks`

/* 
    Get all feedbacks
    Returns the feedback data
*/
export async function getAllFeedbacks(): Promise<TFeedbackItem[]> {
    const response = await fetch(FEEDBACKS_URL);
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data as TFeedbackItem[];
}

/* 
    Post a new feedback
    Returns the feedback data
*/
export async function postFeedback(feedback: TFeedbackCreate): Promise<TFeedbackItem> {
    const response = await fetchWithAuth(FEEDBACKS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(feedback)
    });
    
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data as TFeedbackItem;
}

/* 
    Upvote a feedback
    Returns the upvote data
*/
export async function upvoteFeedback(feedbackId: number): Promise<TUpvoteResponse> {
    const response = await fetch(`${FEEDBACKS_URL}/${feedbackId}/upvote`, { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_upvoted: false }) // Default to false to increment upvote
    });
    
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data as TUpvoteResponse;
}

/* 
    Get user's feedbacks
    Returns the feedback data
*/
export async function getUserFeedbacks(userId: number): Promise<TFeedbackItem[]> {
    const response = await fetchWithAuth(`${FEEDBACKS_URL}/user/${userId}`);
    if (!response.ok) {
        await handleApiError(response);
    }
    const data = await response.json();
    return data.items as TFeedbackItem[];
}
