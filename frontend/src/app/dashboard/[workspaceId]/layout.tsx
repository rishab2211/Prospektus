"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaceFolders } from "@/hooks/use-workspace-folders";
import { useWorkspaceVideos } from "@/hooks/use-workspace-videos";
import { useAllWorkspaces } from "@/hooks/use-all-workspaces";
import { useVerifyWorkspaceAccess } from "@/hooks/use-verify-workspace-access";

type Props = {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
};

const Layout = ({ children, params }: Props) => {
  const { workspaceId } = React.use(params);
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Verify workspace access via React Query
  const { data: hasAccess, isLoading: accessLoading } =
    useVerifyWorkspaceAccess(workspaceId);

  // Prefetch all data — hooks are called unconditionally (rules of hooks),
  // but each hook's `enabled` option prevents fetching until accessToken is ready
  useWorkspaceFolders(workspaceId);
  useWorkspaceVideos(workspaceId);
  useAllWorkspaces();

  // Redirect if access check completes and user doesn't have access
  useEffect(() => {
    if (!accessLoading && hasAccess === false) {
      router.replace("/dashboard");
    }
  }, [hasAccess, accessLoading, router]);

  // Show loading while auth or access check is in progress
  if (authLoading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <div>{children}</div>;
};

export default Layout;
