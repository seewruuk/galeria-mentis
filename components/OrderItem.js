import React, {Fragment, useContext} from 'react';
import Link from "next/link";
import {Menu, MenuButton, MenuItem, MenuItems, Transition} from "@headlessui/react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {classNames, splitPhoneNumber, orderLabel, handleUpdateOrderStatus} from "@/utils";
import {AuthContext} from "@/context/AuthContext";

const OrderItem = ({item, selectedOrders, handleSelectOrder}) => {
    const isSelected = selectedOrders.includes(item._id);

    const statuses = {
        done: 'text-green-700 bg-green-50 ring-green-600/20 ',
        new: 'text-gray-600 bg-gray-50 ring-gray-500/10',
        paid: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
        cancelled: 'text-red-700 bg-red-50 ring-red-600/20',
    };

    const {userData} = useContext(AuthContext);


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

                    </div>
                </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
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

        </li>
    );
};

export default OrderItem;
