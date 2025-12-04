"use client";

import { useState, useEffect } from "react";
import Timeout from "@/components/Timeout";
import useSanity from "@/hooks/useSanity";
import { getMaintenanceMode } from "@/sanity/getSanity/getMaintenanceMode";
import Navbar from "@/components/Navbar";

export default function ProtectedView({ children }) {
    const [unlocked, setUnlocked] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: maintenanceData, loading } = useSanity(getMaintenanceMode);

    useEffect(() => {
        setMounted(true);
        // Check if user has already unlocked the site
        const isUnlocked = localStorage.getItem("maintenance_unlocked") === "true";
        if (isUnlocked) {
            setUnlocked(true);
        }
    }, []);

    const handleUnlock = () => {
        setUnlocked(true);
    };

    // Show nothing while loading or not mounted
    if (!mounted || loading) {
        return null;
    }

    // Check if maintenance mode is active (default to false if data is not available)
    const isMaintenanceActive = maintenanceData?.isActive === true;

    // If maintenance is active and user hasn't unlocked, show timeout screen
    if (isMaintenanceActive && !unlocked) {
        return <Timeout onUnlock={handleUnlock} maintenanceData={maintenanceData || {}} />;
    }

    return (
        <>
        <Navbar/>
        {children}
        </>
    )
}
