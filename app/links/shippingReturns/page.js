import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"shippingReturns"} />
    )
}


export async function generateMetadata() {
    const data = await getPolicyByType('shippingReturns');

    if (!data) {
        return {
            title: "Shipping & Returns - Galeria Mentis",
            description: "Learn about our Shipping & Returns policy, including shipping methods, delivery times, and return procedures.",
        };
    }

    const pageUrl = `${SITE_URL}/links/shippingReturns`;
    return generateSEO(data, pageUrl);
}
