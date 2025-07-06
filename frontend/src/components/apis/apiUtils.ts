/**
 * Utility functions for API requests
 */

// Get authentication token from local storage or session storage
export function getAuthToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// Set authentication token
export function setAuthToken(token: string, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);
}

// Remove authentication token
export function removeAuthToken(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
}

// Check if user is logged in
export function isLoggedIn(): boolean {
    return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
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

    // LOGGING: Log the request details
    console.log("[API REQUEST]", { url, options: { ...options, headers: Object.fromEntries(headers.entries()) } });

    const response = await fetch(url, {
        ...options,
        headers
    });

    // LOGGING: Log the response status
    console.log("[API RESPONSE]", { url, status: response.status });

    return response;
}

// Handle API errors
export async function handleApiError(response: Response): Promise<never> {
    let errorMessage = "An error occurred";
    try {
        const errorData = await response.json();
        errorMessage = errorData.detail || `Error: ${response.status}`;
        // LOGGING: Log the error details
        console.error("[API ERROR]", { status: response.status, errorData });
    } catch (e) {
        errorMessage = `Error: ${response.status} - ${response.statusText}`;
        // LOGGING: Log the error details
        console.error("[API ERROR]", { status: response.status, statusText: response.statusText });
    }
    throw new Error(errorMessage);
}
