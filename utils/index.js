import toast from "react-hot-toast";


export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function splitPhoneNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function orderLabel(status) {
    const labels = {
        new: 'New',
        paid: 'Paid',
        done: 'Done',
        cancelled: 'Cancelled'
    };
    return labels[status] || status;
}


export const handleUpdateOrderStatus = async (orderId, status) => {
    const updateOrder = await fetch("/api/updateOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({orderId, orderStatus: status})
    });

    const sanityData = await updateOrder.json();
    if (sanityData.status === "ok") {
        toast.success("Order status has been updated");
        return {
            status: "ok",
            message: "Order status has been updated"
        }
    } else {
        toast.error("Order status has not been updated");
        return {
            status: "error",
            message: "Order status has not been updated"
        }
    }
}
