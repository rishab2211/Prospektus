"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaceFolders } from "@/hooks/use-workspace-folders";
import { useWorkspaceVideos } from "@/hooks/use-workspace-videos";
import { useAllWorkspaces, WorkspaceInfo } from "@/hooks/use-all-workspaces";
import { useVerifyWorkspaceAccess } from "@/hooks/use-verify-workspace-access";
import { useNotification } from "@/hooks/use-notification";
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Folder,
  Video,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
  Plus,
  Compass,
} from "lucide-react";

type Props = {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
};

const Layout = ({ children, params }: Props) => {
  const { workspaceId } = React.use(params);
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verify workspace access via React Query
  const { data: hasAccess, isLoading: accessLoading } =
    useVerifyWorkspaceAccess(workspaceId);

  // Prefetch all data
  useWorkspaceFolders(workspaceId);
  useWorkspaceVideos(workspaceId);
  useAllWorkspaces();
  useNotification(); // Prefetch user notifications

  const { data: folders } = useWorkspaceFolders(workspaceId);
  const { data: workspacesData } = useAllWorkspaces();

  // Merge owned and member workspaces
  const ownedWorkspaces = workspacesData?.workspace ?? [];
  const memberWorkspaces = (workspacesData?.members ?? [])
    .map((m) => m.workspace)
    .filter((w): w is WorkspaceInfo => !!w);
  const allWorkspaces = [...ownedWorkspaces, ...memberWorkspaces];

  const currentWorkspace = allWorkspaces.find((w) => w.id === workspaceId);

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

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/sign-in");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0c0c14] border-r border-white/[0.06]">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow duration-300">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">
            Prospektus
          </span>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="px-4 py-4 border-b border-white/[0.04]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-between gap-2 px-3 py-2 text-[13px] font-medium text-gray-300 hover:text-white bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition-all duration-200">
              <span className="truncate">
                {currentWorkspace?.name || "Select Workspace"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 bg-[#0c0c14]/95 backdrop-blur-xl border-white/[0.08] text-gray-300"
          >
            <DropdownMenuLabel className="text-[11px] font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
              Workspaces
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            {allWorkspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => router.push(`/dashboard/${ws.id}`)}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-white/[0.04] focus:bg-white/[0.04] text-[13px] ${
                  ws.id === workspaceId ? "text-violet-400 bg-violet-500/5 font-medium" : "text-gray-300"
                }`}
              >
                {ws.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Nav */}
        <div className="space-y-1">
          <Link
            href={`/dashboard/${workspaceId}`}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
              pathname === `/dashboard/${workspaceId}`
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>All Videos</span>
          </Link>
        </div>

        {/* Folders list */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              Folders
            </span>
          </div>
          <div className="space-y-1">
            {folders && folders.length > 0 ? (
              folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.02] group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  {folder._count.videos > 0 && (
                    <span className="text-[10px] bg-white/[0.06] text-gray-400 px-1.5 py-0.5 rounded-md">
                      {folder._count.videos}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-600 px-3 py-2 italic">
                No folders created
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[13px] font-bold border border-white/[0.1]">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] text-white">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:block shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-[-44px] p-2 rounded-xl bg-[#0c0c14] border border-white/[0.06] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-full">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/[0.06] bg-[#0c0c14]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-white/[0.04] text-gray-400 hover:text-white md:hidden transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-medium text-gray-400 md:block hidden">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <NotificationsDropdown />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[13px] font-bold border border-white/[0.1] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500/40">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#0c0c14]/95 backdrop-blur-xl border-white/[0.08] text-gray-300"
              >
                <div className="px-3 py-2 text-[12px] text-gray-500">
                  Logged in as <span className="text-white font-medium block truncate">{user?.email}</span>
                </div>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg cursor-pointer text-red-400 focus:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 text-[13px] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-auto bg-[#0a0a0f] relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

