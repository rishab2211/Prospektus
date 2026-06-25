// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    workspace?: any[];
    subscription?: any[];
}

export interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => string | null;
}
