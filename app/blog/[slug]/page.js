import SingleBlogPostLayout from "@/components/layouts/SingleBlogPostLayout";
import {getSingleBlogPost} from "@/sanity/getSanity/getSingleBlogPost";

export default async function Page({params}){

    const slug = await params.slug;

    return(
        <SingleBlogPostLayout slug={slug}/>
    )
}



export async function generateMetadata({ params }) {
    const data = await getSingleBlogPost(params.slug);

    if (!data) return {
        title: "No artist found",
        description: "Unfortunately, the artist you are looking for does not exist."
    };

    return {
        title: data.seo !== null && data.seo.metaTitle ? data.seo.metaTitle : "NO TITLE",
        description:  data.seo !== null && data.seo.metaDescription ? data.seo.metaDescription : "NO DESCRIPTION",
        keywords: data.seo !== null && data.seo.keywords ? data?.seo?.keywords.map((item) => item).join(", ") : "NO KEYWORDS",
    };
}
