import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <PolicyComponent type={"cookies"} />
    )
}


export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getPolicyByType('cookies');

    if (!data) {
        return {
            title: "Cookies Policy - Galeria Mentis",
            description: "Learn about our Cookies Policy to understand how we use cookies to enhance your experience on our website.",
        };
    }

    const pageUrl = `${baseUrl}/links/cookies`;
    return generateSEO(data, pageUrl);
}
