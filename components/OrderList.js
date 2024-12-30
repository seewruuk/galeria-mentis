import React, {Fragment} from 'react';
import OrderItem from "@/components/OrderItem";
import OrderPagination from "@/components/OrderPagination";

const OrderList = ({orders, selectedOrders, handleSelectOrder, handlePageChange, currentPage, totalPages}) => {
    return (
        <div className={""}>
            <ul role="list" className="divide-y divide-gray-100 h-full">
                {orders.map((item) => (
                    <OrderItem
                        key={item._id}
                        item={item}
                        selectedOrders={selectedOrders}
                        handleSelectOrder={handleSelectOrder}
                    />
                ))}
            </ul>
            {
                orders && orders.length !== 0 && (
                    <OrderPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
                )
            }
        </div>
    );
};

export default OrderList;
