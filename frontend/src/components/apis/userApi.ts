import { API_BASE_URL } from "../../lib/constants";
import { fetchWithAuth, handleApiError, removeAuthToken } from "./apiUtils";
import { TUserRegister, TUserLogin, TUserResponse, TAuthToken } from "../../lib/types";

const USERS_URL = `${API_BASE_URL}/users`;

/* 
    Register a new user
    Returns the user data
*/
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

/* 
    Login a user
    Returns the auth token
*/
export async function loginUser(credentials: TUserLogin): Promise<TAuthToken> {
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
    return data as TAuthToken;  
}

/* 
    Get the current user
    Returns the user data
*/
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
