'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/20/solid';
import { MdOutlineAdd, MdOutlineRemove } from 'react-icons/md';
import { formatPrice } from '@/lib/formatPrice';

export default function CartItemsList({
                                          cartItems,
                                          removeItem,
                                          preventChange,
                                          increaseQty,
                                          decreaseQty,
                                      }) {
    return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <ul role="list" className="divide-y divide-gray-200">
                {cartItems && cartItems.map((product) => (
                    <li key={product._id} className="flex px-4 py-6 sm:px-6 items-center">
                        <div className="shrink-0 border relative h-[120px] w-[100px]">
                            <Image
                                alt={product.imageAlt ? product.imageAlt : 'alt'}
                                src={product.image}
                                className="rounded-md object-cover"
                                fill
                            />
                        </div>
                        <div className="ml-6 flex flex-1 flex-col">
                            <div className="flex">
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="font-medium text-gray-700 hover:text-gray-800 hover:underline"
                                        >
                                            {product.name}
                                        </Link>
                                    </h4>
                                    <Link
                                        href={`/categories/${product.category.slug}`}
                                        className="mt-1 text-sm text-gray-500 hover:underline"
                                    >
                                        {product.category.title}
                                    </Link>
                                    <p className="mt-1 text-sm text-gray-500">Quantity: {product.qty}</p>
                                </div>
                                <div className="ml-4 flow-root shrink-0">
                                    <button
                                        onClick={() => removeItem(product._id)}
                                        type="button"
                                        disabled={preventChange}
                                        className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:text-gray-300 transition-all"
                                    >
                                        <TrashIcon aria-hidden="true" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/*<div className="flex flex-1 items-center justify-between pt-2 max-lg:flex-col max-lg:items-start max-lg:justify-start max-lg:gap-4">*/}
                            {/*    <p className="mt-1 text-sm font-medium text-gray-900">*/}
                            {/*        {formatPrice(product.price)}*/}
                            {/*    </p>*/}
                            {/*    <div className="bg-gray/10 min-w-[60px] flex gap-5 items-center justify-center p-2">*/}
                            {/*        <button*/}
                            {/*            disabled={preventChange}*/}
                            {/*            onClick={() => decreaseQty(product._id)}*/}
                            {/*            type="button"*/}
                            {/*            className="disabled:text-gray-500 text-black hover:text-primary transition-all"*/}
                            {/*        >*/}
                            {/*            <MdOutlineRemove />*/}
                            {/*        </button>*/}
                            {/*        <p className="flex-grow text-center">{product.qty}</p>*/}
                            {/*        <button*/}
                            {/*            disabled={preventChange}*/}
                            {/*            onClick={() => increaseQty(product._id)}*/}
                            {/*            type="button"*/}
                            {/*            className="disabled:text-gray-500 text-black hover:text-primary transition-all"*/}
                            {/*        >*/}
                            {/*            <MdOutlineAdd />*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </li>
                ))}

                {cartItems.length === 0 && (
                    <li className="flex px-4 py-6 sm:px-6 items-center">
                        <div className="flex flex-1 flex-col">
                            <div className="flex">
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm">Your cart is empty...</h4>
                                </div>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}
