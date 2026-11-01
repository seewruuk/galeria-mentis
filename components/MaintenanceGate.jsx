"use client";
import {useEffect, useState} from "react";
import Timeout from "@/components/Timeout";

/**
 * Przerwa techniczna: do czasu sprawdzenia nic nie wyświetlamy (jak dotychczas),
 * potem treść strony albo ekran z hasłem. Hasło weryfikuje serwer.
 */
export default function MaintenanceGate({maintenanceData, children}) {
    const [state, setState] = useState("checking");

    useEffect(() => {
        let cancelled = false;
        fetch("/api/maintenance/unlock", {cache: "no-store"})
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) setState(data?.unlocked ? "unlocked" : "locked");
            })
            .catch(() => {
                if (!cancelled) setState("locked");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (state === "checking") return null;
    if (state === "locked") return <Timeout maintenanceData={maintenanceData}/>;
    return children;
}
