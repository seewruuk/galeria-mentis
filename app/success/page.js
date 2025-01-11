import React, { Suspense } from "react";
import SuccessCancelLayout from "@/components/layouts/SuccessCancelLayout";

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessCancelLayout
                header={"Thank you for your purchase!"}
                subtitle={"Your order is confirmed and will be shipped soon. When we receive payment, we'll send you an email with the details. Remember to check your spam folder if you don't see it in your inbox."}
            />
        </Suspense>
    );
}

export async function generateMetadata() {
    return {
        title: `Thank you for your purchase!`,
        description: `Your order is confirmed and will be shipped soon. When we receive payment, we'll send you an email with the details.`,
    };
}
