import BlogLayout from "@/components/layouts/BlogLayout";
import {getBlogSettings} from "@/sanity/getSanity/getBlogSettings";
import {generateSEO} from "@/lib/generateSEO";

export default function Page(){
    return(
        <BlogLayout />
    )
}


export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const data = await getBlogSettings();

    if (!data) return {
        title: "Blog - Galeria Mentis",
        description: "Discover the latest articles about contemporary art at Galeria Mentis",
    };

    const pageUrl = `${baseUrl}/blog`;
    return generateSEO(data, pageUrl);

}

