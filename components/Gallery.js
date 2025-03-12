"use client"
import {useContext, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {AiOutlineFullscreen} from "react-icons/ai";
import {motion, AnimatePresence} from "framer-motion";

import {formatPrice} from "@/lib/formatPrice";
import Button from "@/components/Button";
import {CartContext} from "@/context/CartContext";
import {WishlistContext} from "@/context/WishlistContext";

export default function Gallery({
                                    images,
                                    artist,
                                    category,
                                    price,
                                    title,
                                    product,
                                    setOpenGallery,
                                    openGallery
                                }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const {addToCart} = useContext(CartContext);
    const {addItem} = useContext(WishlistContext);
    const router = useRouter();

    let aspectClass = "aspect-[1/1.2]"; // wartość domyślna
    if (product.imageAspectRatio === "landscape") {
        aspectClass = "aspect-video"; // 16:9
    } else if (product.imageAspectRatio === "portrait") {
        aspectClass = "aspect-[3/4]"; // lub inna wartość np. aspect-[9/16]
    } else if (product.imageAspectRatio === "square") {
        aspectClass = "aspect-square"; // 1:1
    }

    return (
        <section className="pt-[180px] mx-auto max-lg:pt-[120px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative">
                    <div className={`relative w-full bg-gray-100 overflow-hidden ${aspectClass}`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedImageIndex}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.3}}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[selectedImageIndex]}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        <button
                            onClick={() =>
                                setOpenGallery({
                                    ...openGallery,
                                    status: true
                                })
                            }
                            aria-label="Open gallery"
                            className="absolute top-3 right-3 bg-white/80 hover:bg-white transition-colors text-black p-2 rounded-md"
                        >
                            <AiOutlineFullscreen size={20}/>
                        </button>
                    </div>

                    <div className="mt-4 flex gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                            <div
                                key={index}
                                className={`relative w-20 h-20 flex-shrink-0 cursor-pointer border-2 transition-colors ${
                                    selectedImageIndex === index
                                        ? "border-primary"
                                        : "border-transparent hover:border-primary"
                                }`}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <Image
                                    src={img}
                                    alt={`${title} thumbnail ${index}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <div>
                        <Link
                            href={"/categories/" + category.slug}
                            className="inline-block bg-primary/10 text-primary px-3 py-1 text-sm uppercase tracking-wider mb-4"
                        >
                            {category.title}
                        </Link>

                        <h1 className="text-3xl font-semibold mb-2">{title}</h1>

                        <p className="text-sm text-gray-600 mb-4">
                            <span className="font-semibold">Artist: </span>
                            <Link
                                className="text-primary hover:underline"
                                href={"/artists/" + artist.slug}
                            >
                                {artist.name}
                            </Link>
                        </p>

                        <p className="text-2xl font-bold mb-6">{formatPrice(price)}</p>

                        {
                            product?.labels && (
                                <div className="text-sm text-gray-700 space-y-1">
                                    {
                                        product?.labels.map((label, index) => {
                                            return (
                                                <p
                                                    key={label + index}
                                                    className={`${index === product.labels.length - 1 ? "text-gray-400" : ""}`}
                                                >
                                                    {label}
                                                </p>
                                            )
                                        })}
                                </div>
                            )
                        }
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <Button
                            type="button"
                            style="primary"
                            title="Add to Cart"
                            onClick={() => addToCart(product)}
                        />
                        <Button
                            type="button"
                            style={"white"}
                            title="Buy Now"
                            onClick={() => {
                                addToCart(product);
                                router.push("/cart");
                            }}
                        />
                        <Button
                            type="button"
                            style="white"
                            title="Add to wishlist"
                            onClick={() => addItem(product)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
