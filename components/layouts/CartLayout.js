'use client';

import {useContext, useEffect, useState} from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import {CartContext} from "@/context/CartContext";
import Link from "next/link";
import {formatPrice} from "@/lib/formatPrice";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";


const deliveryMethods = [
    { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
    { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
];


const commonInputStyles =
    'block w-full rounded-md border-2 border-stroke shadow-sm focus:border-primary focus:ring-0 focus:outline-none sm:text-sm bg-[#F8F8F8] px-[15px] py-[10px] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300';

export default function CartLayout() {

    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
    const { cartItems = [] , removeItem, totalPrice, subtotal, shippingPrice, form, setForm, handleBuyEvent} = useContext(CartContext);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <PageTransition>
            <div className="pt-[200px]">
                <Layout>
                    <h2 className="sr-only">Checkout</h2>

                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleBuyEvent();
                        }}
                    >
                        {/* Left Column */}
                        <div>
                            {/* Contact Information */}
                            <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                {form.map((field, index) => {

                                    if(field.id !== 'email-address') return  null;

                                    return (
                                        <div key={field.id} className={field.colSpan}>
                                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                                {field.label}
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    disabled={field.disabled}
                                                    id={field.id}
                                                    name={field.id}
                                                    type={field.type}
                                                    autoComplete={field.autoComplete}
                                                    value={form[index].value}
                                                    className={commonInputStyles}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setForm(prevState => {
                                                            const updatedForm = [...prevState];
                                                            updatedForm[index] = {
                                                                ...updatedForm[index],
                                                                value: value,
                                                            };
                                                            return updatedForm;
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Shipping Information */}
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {form.slice(1).map((field, index) => (
                                        <div key={field.id} className={field.colSpan}>
                                            <label htmlFor={field.id}
                                                   className="block text-sm font-medium text-gray-700">
                                                {field.label}
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id={field.id}
                                                    name={field.id}
                                                    autoComplete={field.autoComplete}
                                                    className={commonInputStyles}
                                                    value={form[index + 1].value}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setForm(prevState => {
                                                            const updatedForm = [...prevState];
                                                            updatedForm[index + 1] = {
                                                                ...updatedForm[index + 1],
                                                                value: value,
                                                            };
                                                            return updatedForm;
                                                        });
                                                    }}
                                                    disabled={field.disabled}
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
                                                                  className="font-medium text-gray-700 hover:text-gray-800 hover:underline">
                                                                {product.name}
                                                            </Link>
                                                        </h4>

                                                        <Link href={`/categories/${product.category.slug}`}
                                                              className="mt-1 text-sm text-gray-500 hover:underline">
                                                            {product.category.title}
                                                        </Link>

                                                        <p className={"mt-1 text-sm text-gray-500"}>
                                                            Quantity: {product.qty}
                                                        </p>


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

                            {
                                cartItems.length !== 0 && (
                                    <section
                                        aria-labelledby="summary-heading"
                                        className="mt-16 rounded-lg py-6 lg:col-span-5 lg:mt-0"
                                    >
                                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                                            Order summary
                                        </h2>

                                        <dl className="mt-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                                <dd className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</dd>
                                            </div>
                                            <div
                                                className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <dt className="flex items-center text-sm text-gray-600">
                                                    <span>Shipping estimate</span>
                                                    <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                                                <span
                                                    className="sr-only">Learn more about how shipping is calculated</span>
                                                        {/*<QuestionMarkCircleIcon aria-hidden="true" className="size-5"/>*/}
                                                    </a>
                                                </dt>
                                                <dd className="text-sm font-medium text-gray-900">{formatPrice(shippingPrice)}</dd>
                                            </div>
                                            <div
                                                className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <dt className="flex text-sm text-gray-600">
                                                    <span>Tax estimate</span>
                                                    <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                                                        <span
                                                            className="sr-only">Learn more about how tax is calculated</span>
                                                        {/*<QuestionMarkCircleIcon aria-hidden="true" className="size-5"/>*/}
                                                    </a>
                                                </dt>
                                                <dd className="text-sm font-medium text-gray-900">{formatPrice(0)}</dd>
                                            </div>
                                            <div
                                                className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                                <dd className="text-base font-medium text-gray-900">{formatPrice(totalPrice)}</dd>
                                            </div>
                                        </dl>

                                        <div className="mt-6">
                                            <button
                                                type="submit"
                                                className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white hover:bg-black transition-all"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </section>
                                )
                            }

                        </div>

                    </form>
                </Layout>
            </div>

            <Footer />
        </PageTransition>
    );
}
