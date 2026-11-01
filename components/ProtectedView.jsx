import Navbar from "@/components/Navbar";
import MaintenanceGate from "@/components/MaintenanceGate";
import {getActiveMaintenance} from "@/lib/server/maintenance";

/**
 * Gdy przerwa techniczna nie jest aktywna, treść strony renderuje się od razu na serwerze
 * (widzą ją Google i odwiedzający bez czekania na JavaScript).
 */
export default async function ProtectedView({children}) {
    const maintenance = await getActiveMaintenance();

    if (maintenance) {
        return (
            <>
                <meta name="robots" content="noindex, nofollow"/>
                <MaintenanceGate maintenanceData={maintenance}>
                    <Navbar/>
                    {children}
                </MaintenanceGate>
            </>
        );
    }

    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}
