import Image from "next/image";
import Link from "next/link";

export default function ArtistCard({avatar, artistLink, artistName, location, index, description}) {

    return (
        <div className={"flex flex-col lg:max-w-[300px] items-start max-lg:items-center"} index={index}>


        <Link href={"/artists/" + artistLink}
                  className={"relative h-[220px] mb-[28px] aspect-square rounded-full overflow-hidden border-8 hover:border-primary transition-all"}>
                <Image
                    src={`${avatar}`}
                    alt={"Artist Avatar"}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={""}
                />
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
                    {
                        description.length > 100
                            ? description.substring(0, 100) + "..."
                            : description
                    }
                </p>
            </div>

            <Link href={
                "/artists/" + artistLink
            } className={"transition-all text-[14px] mt-[20px] max-lg:text-white max-lg:bg-primary max-lg:w-full max-lg:text-center max-lg:py-4 max-lg:max-w-[350px] lg:text-primary"
            }>
                View Profile
            </Link>


        </div>
    )
}