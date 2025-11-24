import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"shippingReturns"} />
    )
}


export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('shippingReturns');

    if (!data) {
        return {
            title: "Shipping & Returns - Galeria Mentis",
            description: "Learn about our Shipping & Returns policy, including shipping methods, delivery times, and return procedures.",
        };
    }

    const pageUrl = `${baseUrl}/links/shippingReturns`;
    return generateSEO(data, pageUrl);
}
