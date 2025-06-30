/**
 * Utility functions for API requests
 */

// Get authentication token from local storage
export function getAuthToken(): string | null {
    return localStorage.getItem("token");
}

// Create headers with authentication token
export function createAuthHeaders(): Headers {
    const headers = new Headers({
        "Content-Type": "application/json"
    });
    
    const token = getAuthToken();
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }
    
    return headers;
}

// Fetch with authentication
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getAuthToken();
    
    const headers = options.headers instanceof Headers 
        ? options.headers 
        : new Headers(options.headers as Record<string, string> || {});
    
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    
    return fetch(url, {
        ...options,
        headers
    });
}

// Handle API errors
export async function handleApiError(response: Response): Promise<never> {
    let errorMessage = "An error occurred";
    
    try {
        const errorData = await response.json();
        errorMessage = errorData.detail || `Error: ${response.status}`;
    } catch (e) {
        errorMessage = `Error: ${response.status} - ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
} 