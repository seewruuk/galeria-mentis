import PolicyComponent from "@/components/PolicyComponent";

export default function Page(){
    return(
        <PolicyComponent type={"shippingReturns"} />
    )
}


export async function generateMetadata() {

    return {
        title: "Shipping & Returns",
        description: "Learn about our Shipping & Returns policy, including shipping methods, delivery times, and return procedures.",
        keywords: ["Shipping Policy", "Returns Policy", "Shipping & Returns"],
    };
}
