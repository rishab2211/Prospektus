"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/services/api";

export interface WorkspaceFolder {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    workspaceId: string | null;
    _count: {
        videos: number;
    };
}

export function useWorkspaceFolders(workspaceId: string) {
    const { accessToken } = useAuth();

    return useQuery<WorkspaceFolder[]>({
        queryKey: ["workspace-folders", workspaceId],
        queryFn: async () => {
            const res = await apiFetch(
                `/api/workspaces/${workspaceId}/folders`,
                accessToken
            );

            if (!res.ok) {
                // 404 means no folders — return empty array instead of throwing
                if (res.status === 404) {
                    return [];
                }
                throw new Error("Failed to fetch folders");
            }

            const data = await res.json();
            return data.data;
        },
        enabled: !!accessToken && !!workspaceId,
    });
}
