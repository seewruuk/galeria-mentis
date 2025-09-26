import CartLayout from "@/components/layouts/CartLayout";

export default function page() {
    return (
        <CartLayout/>
    )
}


export async function generateMetadata() {
    return {
        title: `Your Cart`,
        description: `Review the items in your cart and proceed to checkout when you're ready.`
    };
}
