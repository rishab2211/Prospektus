"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
            router.replace("/sign-in");
            return;
        }

        if (user.workspace && user.workspace.length > 0) {
            router.replace(`/dashboard/${user.workspace[0].id}`);
        }
    }, [isLoading, isAuthenticated, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

