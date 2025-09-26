import Link from "next/link";

export default function Page() {

    return (
        <div className={"h-screen w-screen grid place-items-center"}>

            <Link href={"/dashboard/orders"} className={"text-center"}>Orders</Link>

        </div>
    )
}


export async function generateMetadata() {
    return {
        title: `Dashboard`,
        description: `Admin dashboard to manage orders and products.`
    }
}

