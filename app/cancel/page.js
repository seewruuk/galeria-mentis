import React, { Suspense } from "react";
import SuccessCancelLayout from "@/components/layouts/SuccessCancelLayout";

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessCancelLayout
                header={"There was a problem with your payment..."}
                subtitle={"We received your order, but there was a problem with your payment. Please try again or contact us for help."}
            />
        </Suspense>
    );
}

export async function generateMetadata() {
    return {
        title: `There was a problem with your payment...`,
        description: `We received your order, but there was a problem with your payment. Please try again or contact us for help.`,
    };
}
