"use client";

import { useState, useEffect } from "react";
import Timeout from "@/components/Timeout";

export default function ProtectedView({ children }) {
    const [unlocked, setUnlocked] = useState(false);
    const requirePassword =
        process.env.NEXT_PUBLIC_REQUIRE_PASSWORD === "true";


    const handleUnlock = () => {
        // localStorage.setItem("page_unlocked", "true");
        setUnlocked(true);
    };

    if (requirePassword && !unlocked) {
        return <Timeout onUnlock={handleUnlock} />;
    }

    return children;
}
