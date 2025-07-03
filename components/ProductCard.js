// /components/ProductCard.jsx
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/formatPrice";
import LazyImage from "@/components/LazyImage";

export default function ProductCard({
                                        image,
                                        title,
                                        artist,
                                        artistsLink,
                                        price,
                                        category,
                                        categoryLink,
                                        slug,
                                        index,
                                    }) {
    return (
        <motion.div className="flex flex-col items-start w-full">
            {/* Główny link do produktu */}
            <motion.a
                href={`/products/${slug}`}
                className="w-full relative overflow-hidden"
                whileHover={{ filter: "sepia(1)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {/* Zamiast Next.js <Image layout="fill" />, używamy prostego <img>
            żeby wysokość auto dopasowywała się naturalnie do szerokości kolumny */}
                <LazyImage
                    src={image}
                    alt={title}
                    className="w-full"

                    />
            </motion.a>

            {/* Kategoria */}
            <Link
                href={`/categories/${categoryLink}`}
                className="mt-2 py-[5px] px-[15px] bg-primary text-primary-light text-[12px] hover:bg-black hover:text-white transition-all cursor-pointer rounded-md"
            >
                {category}
            </Link>

            {/* Tytuł, artysta i cena */}
            <div className="flex flex-col gap-[3px] mt-2">
                <Link href={`/products/${slug}`} className="hover:underline">
                    {title}
                </Link>
                <Link
                    href={`/artists/${artistsLink}`}
                    className="text-[14px] text-primary hover:underline transition-all"
                >
                    {artist}
                </Link>
                <div className="font-semibold">
                    <span>{formatPrice(price)}</span>
                </div>
            </div>
        </motion.div>
    );
}
