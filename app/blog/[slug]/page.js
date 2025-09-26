import SingleBlogPostLayout from "@/components/layouts/SingleBlogPostLayout";
import {getSingleBlogPost} from "@/sanity/getSanity/getSingleBlogPost";
import {generateSEO} from "@/lib/generateSEO";

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

    return generateSEO(data);

}
