import Timeout from "@/components/Timeout";
import Navbar from "@/components/Navbar";
import {getActiveMaintenance} from "@/lib/server/maintenance";

/**
 * Przerwa techniczna sprawdzana na serwerze. Gdy nie jest aktywna, treść strony renderuje się od razu
 * (widzą ją Google i odwiedzający bez czekania na JavaScript).
 */
export default async function ProtectedView({children}) {
    const maintenance = await getActiveMaintenance();

    if (maintenance) {
        return (
            <>
                <meta name="robots" content="noindex, nofollow"/>
                <Timeout maintenanceData={maintenance}/>
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
