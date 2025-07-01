import { API_BASE_URL } from "../../lib/constants";
import { fetchWithAuth, handleApiError, setAuthToken, removeAuthToken } from "./apiUtils";
import { TUserRegister, TUserLogin, TUserResponse, TAuthToken } from "../../lib/types";

const USERS_URL = `${API_BASE_URL}/users`;

// Register a new user
export async function registerUser(userData: TUserRegister): Promise<TUserResponse> {
    const response = await fetch(`${USERS_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        await handleApiError(response);
    }
    
    const data = await response.json();
    return data as TUserResponse;
}

// Login user
export async function loginUser(credentials: TUserLogin): Promise<TAuthToken> {
    // Convert to form data as required by OAuth2
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);
    
    const response = await fetch(`${USERS_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    });
    
    if (!response.ok) {
        await handleApiError(response);
    }
    
    const data = await response.json();
    // Store the token in localStorage
    setAuthToken(data.access_token);
    return data as TAuthToken;
}

// Get current user information
export async function getCurrentUser(): Promise<TUserResponse> {
    const response = await fetchWithAuth(`${USERS_URL}/me`);
    
    if (!response.ok) {
        if (response.status === 401) {
            removeAuthToken();
            throw new Error("Session expired. Please login again.");
        }
        await handleApiError(response);
    }
    
    const data = await response.json();
    return data as TUserResponse;
}
