"use client";

import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import type { User, AuthContextType } from "@/types/auth";

// ─── Context ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    const isAuthenticated = !!user && !!accessToken;

    /**
     * Schedule a token refresh 1 minute before the access token expires.
     * Access token is 15 min → refresh at 14 min.
     */
    const scheduleTokenRefresh = useCallback((token: string) => {
        // Clear any existing timer
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        // Decode JWT to get expiry (without verification — just for timing)
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiresAt = payload.exp * 1000; // Convert to ms
            const now = Date.now();
            const refreshIn = expiresAt - now - 60_000; // 1 minute before expiry

            if (refreshIn > 0) {
                refreshTimerRef.current = setTimeout(() => {
                    refreshAccessToken();
                }, refreshIn);
            }
        } catch {
            // If we can't decode, don't schedule
        }
    }, []);

    /**
     * Refresh the access token using the refresh token cookie.
     * The cookie is sent automatically with credentials: "include".
     */
    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/refresh`, {
                method: "POST",
                credentials: "include", // Sends the refreshToken cookie
            });

            if (!response.ok) {
                // Refresh failed — user needs to re-login
                setUser(null);
                setAccessToken(null);
                return null;
            }

            const data = await response.json();
            setAccessToken(data.accessToken);
            scheduleTokenRefresh(data.accessToken);
            return data.accessToken;
        } catch {
            setUser(null);
            setAccessToken(null);
            return null;
        }
    }, [scheduleTokenRefresh]);

    /**
     * On mount: try to restore the session by refreshing the token.
     * If the refresh token cookie exists and is valid, we get a new access token
     * without the user having to re-login.
     */
    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                const token = await refreshAccessToken();
                if (token) {
                    // Fetch user profile with the new access token
                    const profileRes = await fetch(`${API_URL}/api/users/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                        credentials: "include",
                    });

                    if (profileRes.ok) {
                        const data = await profileRes.json();
                        setUser(data.user);
                    }
                }
            } catch {
                // Silent fail — user is not logged in
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Cleanup refresh timer on unmount
        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, [refreshAccessToken]);

    /**
     * Login with email and password.
     */
    const login = async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Receives the refreshToken cookie
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login failed");
        }

        const data = await response.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
        scheduleTokenRefresh(data.accessToken);
    };

    /**
     * Sign up with name, email, and password.
     */
    const signup = async (name: string, email: string, password: string) => {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Signup failed");
        }

        const data = await response.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
        scheduleTokenRefresh(data.accessToken);
    };

    /**
     * Logout — clear tokens and user state.
     */
    const logout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // Even if the API call fails, clear local state
        }

        setUser(null);
        setAccessToken(null);

        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }
    };

    /**
     * Get the current access token (for use in API calls).
     */
    const getAccessToken = () => accessToken;

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isLoading,
                isAuthenticated,
                login,
                signup,
                logout,
                getAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
