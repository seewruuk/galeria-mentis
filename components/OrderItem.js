import React, {Fragment, useContext, useState} from 'react';
import Link from "next/link";
import {Menu, MenuButton, MenuItem, MenuItems, Transition} from "@headlessui/react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {classNames, splitPhoneNumber, orderLabel, handleUpdateOrderStatus} from "@/utils";
import {AuthContext} from "@/context/AuthContext";
import toast from "react-hot-toast";

const OrderItem = ({item, selectedOrders, handleSelectOrder}) => {
    const isSelected = selectedOrders.includes(item._id);
    const [showParcelModal, setShowParcelModal] = useState(false);
    const [parcelData, setParcelData] = useState({
        carrier: item.parcelDelivery?.carrier || "",
        trackingNumber: item.parcelDelivery?.trackingNumber || "",
        shipmentDate: item.parcelDelivery?.shipmentDate || "",
    });
    const [isSending, setIsSending] = useState(false);

    const statuses = {
        done: 'text-green-700 bg-green-50 ring-green-600/20 ',
        new: 'text-gray-600 bg-gray-50 ring-gray-500/10',
        paid: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
        cancelled: 'text-red-700 bg-red-50 ring-red-600/20',
    };

    const {userData} = useContext(AuthContext);

    const handleSendParcelDelivery = async () => {
        if (!parcelData.carrier || !parcelData.shipmentDate) {
            toast.error("Carrier and shipment date are required");
            return;
        }

        setIsSending(true);
        toast.loading("Sending parcel delivery message...");

        try {
            const response = await fetch("/api/sendParcelDelivery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: item._id,
                    carrier: parcelData.carrier,
                    trackingNumber: parcelData.trackingNumber,
                    shipmentDate: parcelData.shipmentDate,
                }),
            });

            const result = await response.json();

            if (result.status === 200) {
                toast.success("Parcel delivery message sent successfully!");
                setShowParcelModal(false);
                // Optionally refresh the page or update the order data
                window.location.reload();
            } else {
                toast.error(result.message || "Error sending message");
            }
        } catch (error) {
            console.error("Error sending parcel delivery:", error);
            toast.error("Error sending parcel delivery message");
        } finally {
            setIsSending(false);
        }
    };


    return (
        <li className="flex items-center justify-between gap-x-6 py-5 hover:bg-black-100/5 px-4 transition-all">

            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOrder(item._id)}
                    className="mr-2"
                />
                <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                        <Link
                            href={`/dashboard/orders/${item._id}`}
                            className="text-sm font-semibold leading-6 hover:underline">
                            {
                                item.invoice?.status === true && (
                                    <span className={""}>***</span>
                                )
                            }

                            {item.personData.name} {item.personData.lastname}
                        </Link>
                        <p
                            className={classNames(
                                statuses[item.orderStatus],
                                'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                            )}
                        >
                            {orderLabel(item.orderStatus)}
                        </p>
                        {item.parcelDelivery?.parcelDeliverySentAt && (
                            <div className="flex items-center gap-1 mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" title={`Parcel delivery sent: ${new Date(item.parcelDelivery.parcelDeliverySentAt).toLocaleString('pl-PL')}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Parcel Sent</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-1 flex items-center gap-x-5 text-xs leading-5 text-gray ">
                        <p>{item.orderNumber}</p>

                        <p>
                            <time dateTime={item.orderDate}>{item.orderDate}</time>
                        </p>

                        <p>
                            <span>Qty: </span>
                            <span className="font-semibold">{item.products.length}</span>
                        </p>


                        <p>{item.orderInfo.deliveryMethod}</p>

                        <p>{splitPhoneNumber(item.personData.phone)}</p>

                        <p>{item.personData.email}</p>

                        {item.parcelDelivery?.parcelDeliverySentAt && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-800 font-semibold" title={`Parcel delivery sent: ${new Date(item.parcelDelivery.parcelDeliverySentAt).toLocaleString('pl-PL')}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Parcel Sent</span>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
                <button
                    onClick={() => setShowParcelModal(true)}
                    className="hidden rounded-md bg-blue-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-600 sm:block"
                >
                    Send Parcel Delivery Message
                </button>
                <Link href={`/dashboard/orders/${item._id}`}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">See more</Link>
                <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true"/>
                    </MenuButton>
                    <Transition enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                        <MenuItems
                            className="absolute right-0 z-10 mt-2 min-w-[300px] origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem>{({focus}) => (
                                <p onClick={() => handleUpdateOrderStatus(item._id, "new")}
                                   className={classNames(focus ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                                    Mark as New<span className="sr-only">, {item._id}</span>
                                </p>
                            )}</MenuItem>
                            <MenuItem>{({focus}) => (
                                <p onClick={() => handleUpdateOrderStatus(item._id, "paid")}
                                   className={classNames(focus ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                                    Mark as Paid<span className="sr-only">, {item._id}</span>
                                </p>
                            )}</MenuItem>
                            <MenuItem>{({focus}) => (
                                <p onClick={() => handleUpdateOrderStatus(item._id, "done")}
                                   className={classNames(focus ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                                    Mark as Done<span className="sr-only">, {item._id}</span>
                                </p>
                            )}</MenuItem>
                            <MenuItem>{({focus}) => (
                                <p onClick={() => handleUpdateOrderStatus(item._id, "cancelled")}
                                   className={classNames(focus ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>
                                    Mark as Cancelled<span className="sr-only">, {item._id}</span>
                                </p>
                            )}</MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>

            {/* Parcel Delivery Modal */}
            {showParcelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={() => setShowParcelModal(false)}>
                    <div className="bg-white text-gray-900 p-6 rounded-lg max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Send Parcel Delivery Message
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order Number
                                </label>
                                <input
                                    type="text"
                                    value={item.orderNumber}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Carrier <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={parcelData.carrier}
                                    onChange={(e) => setParcelData({...parcelData, carrier: e.target.value})}
                                    placeholder="e.g., Inpost, DHL, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tracking Number (optional)
                                </label>
                                <input
                                    type="text"
                                    value={parcelData.trackingNumber}
                                    onChange={(e) => setParcelData({...parcelData, trackingNumber: e.target.value})}
                                    placeholder="Enter tracking number if available"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Shipment <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={parcelData.shipmentDate}
                                    onChange={(e) => setParcelData({...parcelData, shipmentDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowParcelModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                disabled={isSending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendParcelDelivery}
                                disabled={isSending || !parcelData.carrier || !parcelData.shipmentDate}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSending ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </li>
    );
};

export default OrderItem;
