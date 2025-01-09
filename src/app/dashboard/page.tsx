"use client";

import { useAuth } from "@/hooks/use-auth";

const DashboardPage = () => {
    const { user, isLoading } = useAuth() // Will redirect to login if not authenticated

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!user) {
        return <div>Not authenticated</div>
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <p>This is the dashboard page.</p>
        </div>
    );
}

export default DashboardPage;