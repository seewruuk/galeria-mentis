"use client"
import {useContext, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import Button from "@/components/Button";
import {motion, AnimatePresence} from "framer-motion";
import {CartContext} from "@/context/CartContext";


export default function Gallery({images, artist, category, price, title, product}) {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const {addToCart} = useContext(CartContext)

    return (
        <>
            <section className={"pt-[180px] flex gap-4 relative h-[750px]"}>
                <div className={'w-[120px] flex flex-col gap-4 overflow-scroll'}>
                    {
                        images.map((image, index) => (
                            <div
                                key={index}
                                className={"w-[100%] min-h-[140px] group relative overflow-hidden cursor-pointer"}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <Image
                                    src={image}
                                    alt={title}
                                    layout={"fill"}
                                    className={`w-full h-full object-cover transition-all opacity-50 ${selectedImageIndex === index ? 'border-2 border-primary opacity-100' : 'border-2 border-white'} hover:opacity-100`}
                                />
                            </div>
                        ))
                    }
                </div>

                <div
                    className={"w-full group relative overflow-hidden isolate"}
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
                        <div className={"p-10 flex flex-col h-full"}>
                            <div className={"flex justify-end"}>
                                <div>Show Image</div>
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
                                    className={"flex gap-2 mt-[16px]"}
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
                                        onClick={() => console.log("Buy Now")}
                                    />

                                    <Button
                                        type={"button"}
                                        style={"black"}
                                        title={"Add to wishlist"}
                                        onClick={() => console.log("Add to wishlist")}
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