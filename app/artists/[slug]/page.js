import ArtistLayout from "@/components/layouts/ArtistLayout";

export default function Page({params}){
    return(
        <ArtistLayout slug={params.slug} />
    )
}