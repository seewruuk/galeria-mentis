import {redirect} from "next/navigation";
import {getAdminUser} from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export const metadata = {
    robots: {index: false, follow: false},
};

// Dostęp do panelu sprawdzany na serwerze (sesja w ciasteczku httpOnly + rola z Sanity)
export default async function DashboardLayout({children}) {
    const admin = await getAdminUser().catch(() => null);
    if (!admin) redirect("/login");

    return <section>{children}</section>;
}
