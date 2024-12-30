"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Page({ children }) {
    const { isLogged, userData, isLoading } = useContext(AuthContext);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isLogged) {
                router.push("/login");
            } else if (userData?.role !== process.env.NEXT_PUBLIC_ADMIN_ROLE_CODE) {
                router.push("/login");
            } else {
                setMounted(true);
            }
        }
    }, [isLogged, userData?.role, isLoading, router]);

    if (isLoading || !mounted) {
        return null;
    }

    return <section>{children}</section>;
}
