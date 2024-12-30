"use client"
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import {TrashIcon} from "@heroicons/react/20/solid";
import {formatPrice} from "@/lib/formatPrice";
import {useContext, useEffect, useState} from "react";
import {WishlistContext} from "@/context/WishlistContext";
import PageTransition from "@/components/PageTransition";

export default function WhishlistLayout() {

    const [mounted, setMounted] = useState(false);
    const {items, removeItem, itemsQty} = useContext(WishlistContext)


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;


    return (
        <PageTransition>

            <section className={"pt-[200px]"}>
                <Layout>
                    <div className="mt-10 lg:mt-0">
                        <h2 className="text-lg font-medium text-gray-900">Your Wishlist ({itemsQty})</h2>
                        <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                            <ul role="list" className="divide-y divide-gray-200">

                                {items && items.map((product, index) => (
                                    <li key={product._id} className="flex px-4 py-6 sm:px-6 items-center">
                                        <div className="shrink-0 border relative h-[120px] w-[100px]">
                                            <Image alt={product.imageAlt ? product.imageAlt : "alt"}
                                                   src={product.image} className="rounded-md object-cover"
                                                   layout={"fill"}/>
                                        </div>
                                        <div className="ml-6 flex flex-1 flex-col">
                                            <div className="flex">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-sm">
                                                        <Link href={`/products/${product.slug}`}
                                                              className="font-medium text-gray-700 hover:text-gray-800">
                                                            {product.name}
                                                        </Link>
                                                    </h4>

                                                    <Link href={`/categories/${product.category.slug}`}
                                                          className="mt-1 text-sm text-gray-500">
                                                        {product.category.title}
                                                    </Link>


                                                    {/*<p className="mt-1 text-sm text-gray-500">{product.size}</p>*/}
                                                </div>
                                                <div className="ml-4 flow-root shrink-0">
                                                    <button
                                                        onClick={() => removeItem(product._id)}
                                                        type="button"
                                                        className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                                                    >
                                                        <TrashIcon aria-hidden="true" className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between pt-2">
                                                <p className="mt-1 text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>


                    </div>
                </Layout>
            </section>
        </PageTransition>

    )
}