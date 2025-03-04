"use client";
import React, {useContext, useState, useEffect} from "react";
import {getOrders} from "@/sanity/getSanity/getOrders";
import {AuthContext} from "@/context/AuthContext";
import OrderList from "@/components/OrderList";
// import createExcel from "@/hooks/createExcel";
import {orderLabel} from "@/utils";
import toast from "react-hot-toast";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

const statusOptions = ["new", "paid", "done", "cancelled"];
const itemsPerPageOptions = [50, 100, 150, 200];

export default function OrdersLayout() {
    const {userData, logout} = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const {orders} = await getOrders();
                setOrders(orders);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(
        (order) => !filterStatus || order.orderStatus === filterStatus
    );

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(orderId)
                ? prevSelected.filter((id) => id !== orderId)
                : [...prevSelected, orderId]
        );
    };

    const handleSelectAllOrders = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]); // Deselect all
        } else {
            setSelectedOrders(filteredOrders.map((order) => order._id)); // Select all
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDownloadExcel = () => {
        const dataToDownload =
            selectedOrders.length > 0
                ? filteredOrders.filter((order) => selectedOrders.includes(order._id))
                : filteredOrders;
        createExcel(dataToDownload);
        toast.success("Downloading excel file...");
    };

    const handleUpdateOrderStatuses = async () => {
        if (selectedOrders.length === 0) {
            toast.error("No orders selected");
            return;
        }

        toast.loading("Updating orders...");
        for (const orderId of selectedOrders) {
            const response = await fetch("/api/updateOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({orderId, orderStatus: selectedStatus}),
            });

            const result = await response.json();
            if (result.status === "ok") {
                toast.success("Orders updated successfully");
            } else {
                toast.error("Error updating orders");
            }
        }
    };

    if (loading) return <Loading/>;
    if (error) return <div>Error loading orders: {error.message}</div>;

    return (
        <PageTransition>


            <section className={"pt-[200px]"}>
                <Layout>
                    <div className="min-h-screen">
                        <div className={"flex gap-2 pb-[32px] items-start border-b-2 border-gray/20 justify-between"}>
                            <div>
                                <h2 className={"text-3xl"}>Hello, <span className={"font-medium"}>{userData.name}</span>
                                </h2>
                                <p className={"text-[15px] my-[12px] font-medium"}>Orders: {orders.length}</p>
                            </div>
                            <div className="flex flex-col gap-5 items-end">
                                {
                                    orders.length !== 0 && (
                                        <button
                                            onClick={handleDownloadExcel}
                                            type="button"
                                            className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                                        >
                                            {selectedOrders.length > 0 ? "Download selected orders" : "Download all orders"}
                                        </button>
                                    )
                                }
                                <button
                                    onClick={logout}
                                    type="button"
                                    className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Nowa sekcja filtrów */}
                        <div className="flex gap-2 mb-4 mt-4 justify-end">
                            Filter orders:
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1); // Resetuj stronę do 1 po zmianie filtra
                                    setSelectedOrders([]); // Resetuj zaznaczenia po zmianie filtra
                                }}
                                className="rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="">All</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {orderLabel(status)}
                                    </option>
                                ))}
                            </select>
                            <p className={"font-semibold"}>
                                (
                                {
                                    filterStatus
                                        ? orders.filter((order) => order.orderStatus === filterStatus).length
                                        : orders.length
                                }
                                )
                            </p>

                        </div>

                        <div className="flex justify-between gap-2 mb-4 mt-4">
                            <div className={"flex-1 flex gap-3"}>
                                <button
                                    onClick={handleUpdateOrderStatuses}
                                    type="button"
                                    disabled={selectedOrders.length === 0}
                                    className="rounded-full bg-blue-500 px-2.5 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-200 disabled:ring-gray-200 transition-all"
                                >
                                    Update order status to
                                </button>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {orderLabel(status)}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className={"flex-1 flex justify-end gap-3"}>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="rounded-md border-gray-300 shadow-sm"
                                >
                                    {itemsPerPageOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option} per page
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleSelectAllOrders}
                                    type="button"
                                    className="rounded-full bg-blue-500 px-2.5 py-1 text-sm font-semibold text-white shadow-sm"
                                >
                                    {selectedOrders.length === filteredOrders.length ? "Deselect all" : "Select all"}
                                </button>
                            </div>
                        </div>

                        <OrderList
                            orders={currentOrders}
                            selectedOrders={selectedOrders}
                            handleSelectOrder={handleSelectOrder}
                            handlePageChange={handlePageChange}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </Layout>

            </section>

            <Footer/>
        </PageTransition>

    );
}