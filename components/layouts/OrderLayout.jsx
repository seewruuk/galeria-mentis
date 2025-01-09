"use client"
import useSanity from "@/hooks/useSanity";
import {getOrder} from "@/sanity/getSanity/getOrder";
import {statuses} from "@/constans/styles";
import {Menu, MenuButton, MenuItem, MenuItems, Transition} from "@headlessui/react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {useState} from "react";
import toast from "react-hot-toast";
import {handleUpdateOrderStatus, orderLabel} from "@/utils";
import Link from "next/link";
import Layout from "@/components/Layout";
import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function OrderLayout({params}) {

    const {data: order, loading} = useSanity(getOrder, params.id);

    const [messageSend, setMessageSend] = useState(false);

    const resendEmail = async (order) => {

        setMessageSend(true);

        const emailResponse = await fetch("/api/sendEmailToCustomer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({order}),
        });

        const emailResult = await emailResponse.json();
        if (emailResult.status !== 200) {
            toast.error("Error sending message");
            setMessageSend(false);
        } else {
            toast.success("Message sent successfully");
            setMessageSend(false);
        }
    }

    if (!order || loading) return null;

    return (
        <PageTransition>


            <section className={"pt-[100px]"}>
                <Layout>
                    <main className="bg-white px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8">
                        <div className="">
                            <div className={"flex justify-between"}>

                                <div className="max-w-xl flex flex-col gap-4 items-start">
                                    <Link href={"/dashboard/orders"}
                                          className={"text-[12px] font-medium underline text-blue-600"}>Back to
                                        orders</Link>
                                    <h1 className="text-base font-medium text-gray-600">Order details</h1>
                                    <p className="mt-2 text-4xl font-bold tracking-tight">{params.id}</p>
                                    <p className="mt-2 text-base text-gray-500">{order.orderDate}</p>

                                    <dl className="text-sm font-medium flex flex-col items-start gap-3">
                                        <dd
                                            className={classNames(
                                                statuses[order.orderStatus],
                                                'mt-0.5 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                                            )}
                                        >{orderLabel(order.orderStatus)}</dd>
                                    </dl>

                                    <button
                                        onClick={() => resendEmail(order)}
                                        type="button"
                                        disabled={messageSend}
                                        className={`rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400`}
                                    >
                                        {
                                            messageSend ? "Sending..." : "Resend message"
                                        }
                                    </button>
                                </div>

                                <Menu as="div" className="relative flex-none">
                                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                        <span className="sr-only">Open options</span>
                                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true"/>
                                    </MenuButton>
                                    <Transition
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <MenuItems
                                            className="absolute right-0 z-10 mt-2 min-w-[300px] origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            <MenuItem>
                                                {({focus}) => (
                                                    <p
                                                        onClick={() => handleUpdateOrderStatus(order._id, "new")}
                                                        className={classNames(
                                                            focus ? 'bg-gray-50' : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                        )}
                                                    >
                                                        Mark as new<span className="sr-only">, {order._id}</span>
                                                    </p>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({focus}) => (
                                                    <p
                                                        onClick={() => handleUpdateOrderStatus(order._id, "paid")}
                                                        className={classNames(
                                                            focus ? 'bg-gray-50' : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                        )}
                                                    >
                                                        Mark as paid<span className="sr-only">, {order._id}</span>
                                                    </p>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({focus}) => (
                                                    <p
                                                        onClick={() => handleUpdateOrderStatus(order._id, "done")}
                                                        className={classNames(
                                                            focus ? 'bg-gray-50' : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                        )}
                                                    >
                                                        Mark as completed<span className="sr-only">, {order._id}</span>
                                                    </p>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({focus}) => (
                                                    <p
                                                        onClick={() => handleUpdateOrderStatus(order._id, "cancelled")}
                                                        className={classNames(
                                                            focus ? 'bg-gray-50' : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                        )}
                                                    >
                                                        Mark as cancelled<span className="sr-only">, {order._id}</span>
                                                    </p>
                                                )}
                                            </MenuItem>
                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </div>

                            <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
                                <h2 id="order-heading" className="sr-only">
                                    Order
                                </h2>

                                <h3 className="sr-only">Items</h3>
                                {order.products && order.products.map((item, index) => (
                                    <div key={item + index}
                                         className="flex space-x-[32px] border-b border-gray-200 py-10">
                                        <div className="flex flex-auto flex-col justify-center">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    <p>{item.name}</p>

                                                    <span className={"mt-2 text-gray text-[12px]"}>
                                                        Author: {item.author}
                                                    </span>
                                                </h4>
                                            </div>
                                            <div className="mt-6 flex">
                                                <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                                                    <div className="flex">
                                                        <dt className="font-medium text-gray-900">Quantity:</dt>
                                                        <dd className="ml-2 text-gray-700">{item.qty}</dd>
                                                    </div>
                                                    <div className="flex pl-4 sm:pl-6">
                                                        <dt className="font-medium text-gray-900">Price:</dt>
                                                        <dd className="ml-2 text-gray-700">{formatPrice(item.price)}</dd>
                                                    </div>

                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="sm:ml-40 sm:pl-6">
                                    <h4 className="sr-only">Buyer information</h4>
                                    <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                                        <div>
                                            <dt className="font-medium text-gray-900">Buyer details</dt>
                                            <dd className="mt-2 text-gray-700">
                                                <address className="not-italic">
                                                    <span
                                                        className="block">{order.personData.name} {order.personData.lastname}</span>
                                                    <span className="block">{order.personData.email}</span>
                                                    <span className="block">Phone: {order.personData.phone}</span>
                                                    <span
                                                        className="block">{order.personData.address}, {order.personData.apartment}</span>
                                                    <span
                                                        className="block">{order.personData.city}, {order.personData.country}</span>
                                                    <span
                                                        className="block">{order.personData.state}, {order.personData.postal}</span>
                                                    <span className="block">{order.personData.city}</span>
                                                </address>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">Delivery</dt>
                                            <dd className="mt-2 text-gray-700">
                                                <p>{
                                                    order.orderInfo.deliveryMethod
                                                }</p>

                                            </dd>
                                        </div>
                                    </dl>

                                    <h4 className="sr-only">Payment</h4>
                                    <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
                                        <div>
                                            <dt className="font-medium text-gray-900">Payment method</dt>
                                            <dd className="mt-2 text-gray-700">
                                                <p>Online payment</p>
                                            </dd>
                                        </div>

                                        {
                                            order.discountCode && (
                                                <div>
                                                    <dt className="font-medium text-gray-900">Discount code</dt>
                                                    <dd className="mt-2 text-gray-700">
                                                        <p>Code:</p>
                                                        <p className={"font-semibold"}>{order.discountCode}</p>
                                                    </dd>
                                                </div>
                                            )
                                        }
                                    </dl>

                                    <h3 className="sr-only">Summary</h3>
                                    <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">

                                        {/*<div className="flex justify-between">*/}
                                        {/*    <dt className="font-medium text-gray-900">Cart</dt>*/}
                                        {/*    <dd className="text-gray-700">{(order.totalPrice - 13.99).toFixed(2)} zł</dd>*/}
                                        {/*</div>*/}

                                        {/*<div className="flex justify-between">*/}
                                        {/*    <dt className="font-medium text-gray-900">Delivery</dt>*/}
                                        {/*    <dd className="text-gray-700">13.99 zł</dd>*/}
                                        {/*</div>*/}


                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-900">Total</dt>
                                            <dd className="text-gray-900">{formatPrice(parseInt(order.totalPrice))}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </section>
                        </div>
                    </main>
                </Layout>
            </section>

            <Footer/>
        </PageTransition>
    )
}
