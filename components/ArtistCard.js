import Image from "next/image";
import Link from "next/link";

export default function ArtistCard({avatar, artistLink, artistName, location, index, description}) {

    return (
        <div className={"flex flex-col max-w-[350px]"} index={index}>

            <Link href={"/artists/" + artistLink}
                  className={" relative h-[220px] mb-[28px] max-lg:aspect-square max-lg:w-[220px] max-lg:mx-auto"}>
                <Image src={`${avatar}`} alt={"Artist Avatar"} layout={"fill"} objectFit={"cover"}
                       className={"max-lg:rounded-full max-lg:border-8 max-lg:border-gray/30 border-white border-[3px]  hover:border-primary transition-all"}/>
            </Link>

            <div className={"flex flex-col gap-2 max-lg:text-center"}>
                <Link
                    href={"/artists/" + artistLink}
                    className={"text-[16px] text-black hover:underline transition-all"}>
                    {artistName}
                </Link>
                <div
                    className={"text-[14px] text-primary transition-all"}>
                    {location?.city && location?.country
                        ? `${location.city}, ${location.country}`
                        : "Location unavailable"}
                </div>
                <p className={"text-[15px] leading-[170%] text-gray"}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                    malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum.
                    Ut ac ligula sapien. Suspendisse cursus
                </p>
            </div>

            <Link href={
                "/artists/" + artistLink
            } className={"text-primary hover:underline transition-all text-[14px] mt-[20px] max-lg:text-center"
            }>
                View Profile
            </Link>


        </div>
    )
}