"use client"
import {useContext, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import Button from "@/components/Button";
import {motion, AnimatePresence} from "framer-motion";
import {CartContext} from "@/context/CartContext";
import {WishlistContext} from "@/context/WishlistContext";
import {useRouter} from "next/navigation";
import { AiOutlineFullscreen } from "react-icons/ai";


export default function Gallery({images, artist, category, price, title, product, setOpenGallery, openGallery}) {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const {addToCart} = useContext(CartContext)
    const {addItem} = useContext(WishlistContext)
    const router = useRouter();


    return (
        <>
            <section className={"pt-[180px] flex gap-4 relative h-[750px] max-lg:flex-col max-lg:pt-[100px] max-lg:h-full"}>
                <div className={'w-[120px] flex flex-col gap-4 overflow-scroll max-lg:order-2 max-lg:w-full min-lg:min-h-[300px] max-lg:flex-row'}>
                    {
                        images.map((image, index) => (
                            <div
                                key={index}
                                className={"w-[100%] min-h-[140px] group relative overflow-hidden cursor-pointer max-lg:min-w-[120px] max-lg:max-h-[120px] max-lg:max-w-[120px]"}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <Image
                                    src={image}
                                    alt={title}
                                    layout={"fill"}
                                    className={`w-full h-full object-cover transition-all ${selectedImageIndex === index ? 'border-2 border-primary opacity-100' : 'border-2 border-white opacity-50'} hover:opacity-100`}
                                />
                            </div>
                        ))
                    }
                </div>

                <div
                    className={"w-full group relative overflow-hidden isolate max-lg:h-[750px] max-lg:order-1"}
                >

                    {/* Tło */}
                    <AnimatePresence>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            key={selectedImageIndex}
                            className={"absolute w-full h-full -z-10"}
                            style={{
                                backgroundImage: `url(${images[selectedImageIndex]})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    </AnimatePresence>

                    {/* Content */}
                    <div className={"transition-all bg-black/80 w-full h-full text-white flex flex-col"}>
                        <div className={"p-10 flex flex-col h-full max-lg:p-5"}>
                            <div className={"flex justify-end"}>

                                <button
                                    className={"bg-white/20 aspect-square grid place-items-center p-3 hover:bg-primary transition-all"}
                                    onClick={() => setOpenGallery({
                                        ...openGallery,
                                        status: true,
                                    })}
                                    aria-label={"Open gallery"}
                                >
                                    <AiOutlineFullscreen  size={24}/>
                                </button>

                            </div>
                            <div className={"flex-grow flex flex-col items-start justify-end gap-2"}>
                                <Link href={"/categories/" + category.slug}
                                      className={"py-[5px] px-[15px] bg-primary text-primary-light text-[12px] hover:bg-black hover:text-white transition-all cursor-pointer"}>
                                    {category.title}
                                </Link>
                                <h2 className={"text-[32px]"}>{title}</h2>
                                <div className={"text-[14px]"}>
                                    <span className={"text-white/70"}>Artist: </span>
                                    <Link className={"text-primary hover:underline"}
                                          href={"/artists/" + artist.slug}>{artist.name}</Link>
                                </div>

                                <div className={"text-[23px]"}>
                                    {formatPrice(price)}
                                </div>

                                <div
                                    className={"flex gap-2 mt-[16px] max-lg:flex-col max-lg:w-full"}
                                >
                                    {/*Buttons Section*/}
                                    <Button
                                        type={"button"}
                                        style={"primary"}
                                        title={"Add to Cart"}
                                        onClick={() => addToCart(product)}
                                    />

                                    <Button
                                        type={"button"}
                                        style={"black"}
                                        title={"Buy Now"}
                                        onClick={() => {
                                            addToCart(product)
                                            router.push("/cart")
                                        }}
                                    />

                                    <Button
                                        type={"button"}
                                        style={"black"}
                                        title={"Add to wishlist"}
                                        onClick={() => addItem(product)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </section>
        </>
    )
}