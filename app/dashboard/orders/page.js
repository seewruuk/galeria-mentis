import {redirect} from "next/navigation";
import OrdersLayout from "@/components/layouts/OrdersLayout";
import {getAdminUser} from "@/lib/server/auth";
import {getOrders} from "@/sanity/getSanity/getOrders";

export const dynamic = "force-dynamic";

export default async function Page() {
    if (!(await getAdminUser().catch(() => null))) redirect("/login");
    const {orders} = await getOrders();

    return (
        <>
            <OrdersLayout initialOrders={orders || []}/>
        </>
    )
}

export const metadata = {
    title: "Zamówienia",
    description: "Zamówienia ze strony",
    robots: {index: false, follow: false},
};
