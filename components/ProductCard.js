import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import {formatPrice} from "@/lib/formatPrice";

export default function ProductCard({
                                        image,
                                        title,
                                        artist,
                                        artistsLink,
                                        price,
                                        category,
                                        categoryLink,
                                        slug,
                                        index
                                    }) {


    return (
        <div className={"flex gap-[8px] flex-col items-start max-w-[350px]"} index={index}>
            <motion.a
                className={"w-full h-[420px] border-[3px] border-white relative transition-all hover:border-primary"}
                href={"/products/" + slug}

            >
                <Image
                    src={image}
                    alt={`${title}`}
                    layout={"fill"}
                    objectFit={"cover"}
                />
            </motion.a>

            <Link
                href={"/categories/" + categoryLink}
                className={"py-[5px] px-[15px] bg-primary text-primary-light text-[12px] hover:bg-black hover:text-white transition-all cursor-pointer"}
            >
                {
                    category
                }
            </Link>

            <div className={"flex flex-col gap-[3px]"}>
                <Link
                    href={
                        "/products/" + slug
                    }
                    className={"hover:underline"}
                >
                    {title}
                </Link>
                <Link
                    href={"/artists/" + artistsLink}
                    className={"text-[14px] text-primary hover:underline transition-all"}>
                    {artist}
                </Link>
                <div>
                    <span>{formatPrice(price)}</span>
                </div>
            </div>
        </div>
    )
}