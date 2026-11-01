import PolicyComponent from "@/components/PolicyComponent";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import {generateSEO, SITE_URL} from "@/lib/generateSEO";

export const revalidate = 60;

export default function Page(){
    return(
        <PolicyComponent type={"cookies"} />
    )
}


export async function generateMetadata() {
    const data = await getPolicyByType('cookies');

    if (!data) {
        return {
            title: "Cookies Policy - Galeria Mentis",
            description: "Learn about our Cookies Policy to understand how we use cookies to enhance your experience on our website.",
        };
    }

    const pageUrl = `${SITE_URL}/links/cookies`;
    return generateSEO(data, pageUrl);
}
