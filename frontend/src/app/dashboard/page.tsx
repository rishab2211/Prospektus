"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogOut, Video, FolderOpen, Settings, Bell } from "lucide-react";

export default function DashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/sign-in");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Top Navigation */}
            <nav className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                        Prospektus
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-medium">
                                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-200">{user?.name || "User"}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            id="dashboard-logout"
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.06]"
                            title="Sign out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">
                        Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
                    </h2>
                    <p className="text-gray-400 mt-1">Here&apos;s your workspace overview</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: Video, label: "Videos", value: "0", color: "violet" },
                        { icon: FolderOpen, label: "Folders", value: "0", color: "indigo" },
                        { icon: Settings, label: "Plan", value: "Free", color: "fuchsia" },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div
                            key={label}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] transition-all duration-200"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-3`}>
                                <Icon className={`w-5 h-5 text-${color}-400`} />
                            </div>
                            <p className="text-2xl font-bold text-white">{value}</p>
                            <p className="text-sm text-gray-400">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                <div className="text-center py-20 bg-white/[0.02] border border-white/[0.04] rounded-2xl border-dashed">
                    <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No videos yet</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Install the Prospektus desktop app to start recording personalized videos for your prospects.
                    </p>
                </div>
            </div>
        </div>
    );
}
