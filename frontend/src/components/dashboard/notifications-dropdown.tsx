"use client";

import React from "react";
import { Bell } from "lucide-react";
import { useNotification } from "@/hooks/use-notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function NotificationsDropdown() {
  const { data, isLoading } = useNotification();

  const notifications = data?.notification ?? [];
  const count = data?._count?.notification ?? notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 focus-visible:ring-violet-500/50"
        >
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-[#0c0c14]/95 backdrop-blur-xl border-white/[0.08] text-gray-200 p-2 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold text-white">Notifications</span>
          {count > 0 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {count} new
            </span>
          )}
        </div>
        <DropdownMenuSeparator className="bg-white/[0.06] my-1" />

        <div className="max-h-64 overflow-y-auto space-y-1 py-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center mb-2.5">
                <Bell className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-[13px] font-medium text-gray-400">All caught up!</p>
              <p className="text-[11px] text-gray-600 mt-0.5">No new notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start gap-1 p-2.5 rounded-lg hover:bg-white/[0.04] focus:bg-white/[0.04] transition-all duration-150 cursor-pointer"
              >
                <p className="text-[13px] leading-relaxed text-gray-300">
                  {notif.content}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
