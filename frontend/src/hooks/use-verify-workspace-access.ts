"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/services/api";

export function useVerifyWorkspaceAccess(workspaceId: string) {
    const { accessToken } = useAuth();

    return useQuery<boolean>({
        queryKey: ["workspace-access", workspaceId],
        queryFn: async () => {
            const res = await apiFetch(
                `/api/users/workspace/${workspaceId}/access`,
                accessToken
            );

            if (!res.ok) {
                return false;
            }

            return true;
        },
        enabled: !!accessToken && !!workspaceId,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes — access doesn't change often
    });
}
