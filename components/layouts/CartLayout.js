'use client';

import {useContext, useEffect, useState} from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import {CartContext} from "@/context/CartContext";
import Link from "next/link";
import {formatPrice} from "@/lib/formatPrice";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";


const deliveryMethods = [
    { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
    { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
];

const contactInformationFields = [
    { id: 'email-address', label: 'Email address', type: 'email', autoComplete: 'email', colSpan: 'sm:col-span-2' },
];

const inputFields = [
    { id: 'first-name', label: 'First name', type: 'text', autoComplete: 'given-name', colSpan: '' },
    { id: 'last-name', label: 'Last name', type: 'text', autoComplete: 'family-name', colSpan: '' },
    { id: 'address', label: 'Address', type: 'text', autoComplete: 'street-address', colSpan: 'sm:col-span-2' },
    { id: 'apartment', label: 'Apartment, suite, etc.', type: 'text', autoComplete: '', colSpan: 'sm:col-span-2' },
    { id: 'city', label: 'City', type: 'text', autoComplete: 'address-level2', colSpan: '' },
    { id: 'country', label: 'Country', type: 'text', autoComplete: 'country-name', colSpan: '' },
    { id: 'region', label: 'State / Province', type: 'text', autoComplete: 'address-level1', colSpan: '' },
    { id: 'postal-code', label: 'Postal code', type: 'text', autoComplete: 'postal-code', colSpan: '' },
    { id: 'phone', label: 'Phone', type: 'text', autoComplete: 'tel', colSpan: 'sm:col-span-2' },
];

const commonInputStyles =
    'block w-full rounded-md border-2 border-stroke shadow-sm focus:border-primary focus:ring-0 focus:outline-none sm:text-sm bg-[#F8F8F8] px-[15px] py-[10px]';

export default function CartLayout() {
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);

    const { cartItems = [] , removeItem} = useContext(CartContext);

    // Ensure client-side rendering for dynamic data
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent SSR mismatches

    return (
        <PageTransition>
            <div className="pt-[120px]">
                <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Checkout</h2>

                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        {/* Left Column */}
                        <div>
                            {/* Contact Information */}
                            <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                {contactInformationFields.map((field) => (
                                    <div key={field.id} className={field.colSpan}>
                                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                            {field.label}
                                        </label>
                                        <div className="mt-1">
                                            <input

                                                id={field.id}
                                                name={field.id}
                                                type={field.type}
                                                autoComplete={field.autoComplete}
                                                className={commonInputStyles}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Information */}
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {inputFields.map((field) => (
                                        <div key={field.id} className={field.colSpan}>
                                            <label htmlFor={field.id}
                                                   className="block text-sm font-medium text-gray-700">
                                                {field.label}
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id={field.id}
                                                    name={field.id}
                                                    type={field.type}
                                                    autoComplete={field.autoComplete}
                                                    className={commonInputStyles}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Method */}
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <fieldset>
                                    <legend className="text-lg font-medium text-gray-900">Delivery method</legend>
                                    <RadioGroup
                                        value={selectedDeliveryMethod}
                                        onChange={setSelectedDeliveryMethod}
                                        className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                                    >
                                        {deliveryMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none"
                                                onClick={() => setSelectedDeliveryMethod(method)}
                                            >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">{method.title}</span>
                          <span className="mt-1 text-sm text-gray-500">{method.turnaround}</span>
                          <span className="mt-6 text-sm font-medium text-gray-900">{method.price}</span>
                        </span>
                      </span>
                                                {selectedDeliveryMethod.id === method.id && (
                                                    <CheckCircleIcon className="w-5 h-5 text-indigo-600"/>
                                                )}
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </fieldset>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {cartItems && cartItems.map((product, index) => (
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
                                                        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                                        <p className="mt-1 text-sm text-gray-500">{product.size}</p>
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

                                    {
                                        cartItems.length === 0 && (
                                            <li className="flex px-4 py-6 sm:px-6 items-center">
                                                <div className="flex flex-1 flex-col">
                                                    <div className="flex">
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-sm">
                                                                Your cart is empty...
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
}
