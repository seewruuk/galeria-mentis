import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";

export default function ProductCard({
                                        image,
                                        title,
                                        artist,
                                        artistsLink,
                                        price,
                                        category,
                                        slug,
                                        index
                                    }) {

    const currency = process.env.NEXT_PUBLIC_CURRENCY;

    return (
        <div className={"flex gap-[8px] flex-col items-start"} index={index}>
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

            <div
                className={"py-[5px] px-[15px] bg-primary text-primary-light text-[12px] hover:bg-black hover:text-white transition-all cursor-pointer"}
            >
                {
                    category
                }
            </div>

            <div className={"flex flex-col gap-[3px]"}>
                <Link
                    href={"/"}>
                    {title}
                </Link>
                <Link
                    href={"/artists/" + artistsLink}
                    className={"text-[14px] text-primary hover:underline transition-all"}>
                    {artist}
                </Link>
                <div>
                    <span>{currency}</span>
                    <span>{price}</span>
                </div>
            </div>
        </div>
    )
}