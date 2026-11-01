import {notFound, redirect} from "next/navigation";
import OrderLayout from "@/components/layouts/OrderLayout";
import {getAdminUser} from "@/lib/server/auth";
import {getOrder} from "@/sanity/getSanity/getOrder";

export const dynamic = "force-dynamic";

export default async function Page({params}) {
    if (!(await getAdminUser().catch(() => null))) redirect("/login");
    const resolved = await params;
    const id = decodeURIComponent(resolved.id);
    const order = await getOrder(id);
    if (!order) notFound();

    return (
        <OrderLayout params={{id}} order={order}/>
    )
}

export async function generateMetadata({params}) {
    const {id} = await params;
    return {
        title: `Order ${decodeURIComponent(id).replace(/^private\.order\./, "")}`,
        robots: {index: false, follow: false},
    };
}
