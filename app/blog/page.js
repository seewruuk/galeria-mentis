import BlogLayout from "@/components/layouts/BlogLayout";
import {getBlogSettings} from "@/sanity/getSanity/getBlogSettings";

export default function Page(){
    return(
        <BlogLayout />
    )
}


export async function generateMetadata() {

    const data = await getBlogSettings();

    return {
        title: data.seo && data.seo.metaTitle ? data.seo.metaTitle : "NO TITLE",
        description: data.seo && data.seo.metaDescription ? data.seo.metaDescription : "NO DESCRIPTION",
        keywords: data.seo && data.seo.keywords ? data?.seo?.keywords.map((item) => item).join(", ") : "NO KEYWORDS",
    };
}

