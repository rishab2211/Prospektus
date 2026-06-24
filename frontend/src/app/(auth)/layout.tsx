"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Redirect authenticated users away from auth pages
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    // Show nothing while checking auth state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render auth pages if already logged in
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/5 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md px-4">
                {children}
            </div>
        </div>
    );
}
