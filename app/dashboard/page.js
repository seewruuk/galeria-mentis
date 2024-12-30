"use client"
import Link from "next/link";
import {useRouter} from "next/navigation";


export default function Page() {

    const router = useRouter();
    // useEffect(() => {
    //     router.push("/dashboard/orders");
    // }, []);


    return (
        <div>

            <Link href={"/dashboard/orders"} className={"text-center"}>Orders</Link>

        </div>
    )
}

