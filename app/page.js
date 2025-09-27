import HomeLayout from "@/components/layouts/HomeLayout";
import {getHomePage} from "@/sanity/getSanity/getHomePage";

export default function Page() {

    return (
        <HomeLayout/>
    );
}


export async function generateMetadata() {

    const data = await getHomePage();

    if (!data) return {}

    return {
        title: data.seo.metaTitle,
        description: data.seo.metaDescription,
        keywords: data.seo.keywords.map((item) => item).join(", "),
    };


}