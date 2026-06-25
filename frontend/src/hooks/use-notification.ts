"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/services/api";

export interface Notification {
    id: string;
    userId: string | null;
    content: string;
}

export interface NotificationsData {
    notification: Notification[];
    _count: {
        notification: number;
    };
}

export function useNotification() {
    const { accessToken } = useAuth();

    return useQuery<NotificationsData | null>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await apiFetch(
                `/api/users/notification`,
                accessToken
            );

            if (!res.ok) {
                if (res.status === 404) {
                    return null;
                }
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();
            return data.data;
        },
        enabled: !!accessToken,
    });
}