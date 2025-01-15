const createOrder = async (orderData) => {

    const item = {
        orderNumber: orderData.orderNumber,
        form: orderData.form,
        fullDate: orderData.fullDate,
        deliveryMethod: orderData.deliveryMethod,
        totalPrice: orderData.totalPrice,
        products: orderData.products,
        stripeSessionId: orderData.stripeSessionId,
        newsletter: orderData.newsletter,
        invoice: orderData.invoice,
    }

    return await fetch('/api/createOrder', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({item})
    });

}

export default createOrder;