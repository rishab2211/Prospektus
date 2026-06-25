const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Authenticated fetch wrapper.
 * - Automatically attaches the Authorization header with the access token
 * - On 401, attempts a token refresh and retries the request once
 * - Redirects to /sign-in on complete auth failure
 *
 * @param endpoint - API path like "/api/users/me"
 * @param accessToken - Current access token
 * @param options - Standard fetch options
 */
export async function apiFetch(
    endpoint: string,
    accessToken: string | null,
    options: RequestInit = {}
): Promise<Response> {
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Always send cookies for refresh token
    });

    // If 401 and we had a token, try to refresh
    if (response.status === 401 && accessToken) {
        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (refreshRes.ok) {
            const { accessToken: newToken } = await refreshRes.json();

            // Retry the original request with the new token
            headers["Authorization"] = `Bearer ${newToken}`;

            return fetch(url, {
                ...options,
                headers,
                credentials: "include",
            });
        }

        // Refresh also failed — redirect to login
        if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
        }
    }

    return response;
}
