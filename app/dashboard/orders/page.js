import OrdersLayout from "@/components/layouts/OrdersLayout";

export default function Page(){
    return(
        <>
            <OrdersLayout />
        </>
    )
}

export async function generateMetadata({ params }) {


    return {
        title: "Zamówienia",
        description: "Zamówienia ze strony",
    };
}
