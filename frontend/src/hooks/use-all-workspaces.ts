"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/services/api";

export interface WorkspaceInfo {
    id: string;
    name: string;
    type: string | null;
}

export interface WorkspacesData {
    subscription: { plan: string }[];
    workspace: WorkspaceInfo[];
    members: { workspace: WorkspaceInfo | null }[];
}

export function useAllWorkspaces() {
    const { accessToken } = useAuth();

    return useQuery<WorkspacesData | null>({
        queryKey: ["all-workspaces"],
        queryFn: async () => {
            const res = await apiFetch(
                `/api/workspaces`,
                accessToken
            );

            if (!res.ok) {
                if (res.status === 404) {
                    return null;
                }
                throw new Error("Failed to fetch workspaces");
            }

            const data = await res.json();
            return data.data;
        },
        enabled: !!accessToken,
    });
}
