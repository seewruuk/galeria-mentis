import SingleBlogPostLayout from "@/components/layouts/SingleBlogPostLayout";

export default async function Page({params}){

    const slug = await params.slug;

    return(
        <SingleBlogPostLayout slug={slug}/>
    )
}