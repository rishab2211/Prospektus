"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/services/api";

export interface VideoUser {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export interface VideoFolder {
    id: string;
    name: string;
}

export interface WorkspaceVideo {
    id: string;
    title: string | null;
    createdAt: string;
    source: string;
    processing: boolean;
    folder: VideoFolder | null;
    user: VideoUser | null;
}

export function useWorkspaceVideos(workspaceId: string) {
    const { accessToken } = useAuth();

    return useQuery<WorkspaceVideo[]>({
        queryKey: ["workspace-videos", workspaceId],
        queryFn: async () => {
            const res = await apiFetch(
                `/api/workspaces/${workspaceId}/videos`,
                accessToken
            );

            if (!res.ok) {
                if (res.status === 404) {
                    return [];
                }
                throw new Error("Failed to fetch videos");
            }

            const data = await res.json();
            return data.data;
        },
        enabled: !!accessToken && !!workspaceId,
    });
}
