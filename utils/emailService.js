import {formatPrice} from "@/lib/formatPrice";

export function generateOrderEmailHtml({
                                           orderNumber,
                                           personData,
                                           products,
                                           totalPrice,
                                           cartTotal,
                                           header,
                                           description,
                                       }) {


    const orderItemsHtml = products.map(item => `
                                <tr>
                                <!-- Product Details Column -->
                                <td style="vertical-align: top;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="font-size: 16px; font-weight: bold; color: #333333;">
                                                <a 
                                                href=${process.env.NEXT_PUBLIC_BASE_URL + "/products/" + item.slug} 
                                                style="text-decoration: none; color: #333333;" target="_blank">
                                                ${item.name}
                                                </a>
                                            </td>
                                        </tr>
                                         <tr>
                                              <td style="font-size: 14px; color: #666666;">
                                                <a 
                                                href=${process.env.NEXT_PUBLIC_BASE_URL + "/artists/" + item.authorSlug} 
                                                style="text-decoration: none; color: #333333;" target="_blank">
                                                Artist: ${item.author}
                                                </a>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="font-size: 14px; color: #666666;">Quantity: ${item.qty}</td>
                                        </tr>
                                    </table>
                                </td>
                                <!-- Price Column -->
                                <td style="vertical-align: top; text-align: right; font-size: 16px; font-weight: bold; color: #333333;">
                                    ${formatPrice(item.price)}
                                </td>
                            </tr>
    `).join("");

    return `
       <html lang="en">
<head>
    <title>${header}</title>
    <style>
        * {
            line-height: 170%;
        }
    </style>

</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fff; color: #333333;">

<table align="center" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; max-width: 650px;">
    <!-- Header Image -->
    <tr>
        <td style="padding: 0;">
            <img src="https://www.galeriamentis.com/galeriamentis_logo.svg"
                title="Galeria Mentis Logo"
                alt="Galeria Mentis Logo"
                 style="width: 100%; height: 200px; display: block; object-fit: contain;"/>
        </td>
    </tr>

    <!-- Subtitle and Description -->
    <tr>
        <td style="padding: 20px;">
            <h2 style="font-size: 24px; font-weight: bold; color: #333333;">${header}</h2>
            <p style="font-size: 14px; color: #666666; line-height: 1.5;">${description}</p>
        </td>
    </tr>

    <!-- Order Details -->
    <tr>
        <td style="padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="font-size: 14px; color: #333333;">Your order number:</td>
                </tr>
                <tr>
                    <td style="font-size: 14px; color: #1d4ed8;">${orderNumber}</td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Cart Items -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
<!--                    <td style="padding: 10px;">-->
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          ${orderItemsHtml}
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Price Breakdown -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #666666;">
                <tr>
                    <td>Payment</td>
                    <td style="text-align: right; color: #333333;">
                        Online Payment via
                        <a href="https://stripe.com/" style="color: #1d4ed8; text-decoration: none;">Stripe</a>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; color: #333333;">Total Price</td>
                    <td style="text-align: right; font-weight: bold; color: #333333;">${formatPrice(parseInt(totalPrice))}</td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Customer and Shipping Details -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="font-size: 14px; color: #333333;">
                        <strong>Customer Details</strong><br>
                        ${personData.name} ${personData.lastname}<br>
                        ${personData.email} <br>
                        ${personData.phone} <br>
                        ${personData.address}, ${personData.apartment} <br>
                        ${personData.city}, ${personData.country} <br>
                        ${personData.state}, ${personData.postal} <br>
                        ${personData.city}

                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Policy and Footer -->
    <tr>
        <td style="padding: 20px; font-size: 12px; color: #666666; line-height: 1.5;">
            <p>In case of concluding a contract, according to the Consumer Rights Act, you have the right to withdraw
                from the agreement within 14 days from the date of its conclusion. To exercise this right, you must
                submit an appropriate declaration in writing or electronically to the email address provided in the
                terms and conditions. For more information, please refer to the terms and conditions available on the
                website <a
                        href=${"https://galeria-mentis.vercel.app/links/shippingReturns"} target="_blank"
                        style="color: #1d4ed8; text-decoration: underline;">at this link.</a> Read it carefully before making
                a purchase.
                The withdrawal policy is available <a
                        href=${"https://galeria-mentis.vercel.app/links/privacyPolicy"} 
                        target="_blank"
                        style="color: #1d4ed8; text-decoration: underline;">at this link.</a>
            </p>
            <p style="margin-top: 10px; font-size: 10px; text-align: center;">
                Galeria Mentis | contact@galeriamentis.com
            </p>
        </td>
    </tr>

    <!-- Link to Site -->
    <tr>
        <td align="right" style="padding: 20px; border-top: 1px solid #dddddd;">
            <a 
            href=${process.env.NEXT_PUBLIC_BASE_URL}
            style="font-size: 14px; color: #1d4ed8; text-decoration: none;">Galeria Mentis
                <span aria-hidden="true"> &rarr;</span></a>
        </td>
    </tr>
</table>

</body>
</html>

    `;
}

export function generateParcelDeliveryEmailHtml({
    orderNumber,
    personData,
    products,
    totalPrice,
    carrier,
    trackingNumber,
    shipmentDate,
}) {
    const trackingInfoHtml = trackingNumber 
        ? `
            <tr>
                <td style="font-size: 14px; color: #333333;">Tracking Number:</td>
                <td style="font-size: 14px; color: #1d4ed8; font-weight: bold;">${trackingNumber}</td>
            </tr>
        `
        : '';

    const orderItemsHtml = products.map(item => `
        <tr>
            <td style="vertical-align: top;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="font-size: 16px; font-weight: bold; color: #333333;">
                            <a 
                            href=${process.env.NEXT_PUBLIC_BASE_URL + "/products/" + item.slug} 
                            style="text-decoration: none; color: #333333;" target="_blank">
                            ${item.name}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #666666;">
                            <a 
                            href=${process.env.NEXT_PUBLIC_BASE_URL + "/artists/" + item.authorSlug} 
                            style="text-decoration: none; color: #333333;" target="_blank">
                            Artist: ${item.author}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #666666;">Quantity: ${item.qty}</td>
                    </tr>
                </table>
            </td>
            <td style="vertical-align: top; text-align: right; font-size: 16px; font-weight: bold; color: #333333;">
                ${formatPrice(item.price)}
            </td>
        </tr>
    `).join("");

    return `
       <html lang="en">
<head>
    <title>Your order has been dispatched</title>
    <style>
        * {
            line-height: 170%;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fff; color: #333333;">
<table align="center" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; max-width: 650px;">
    <!-- Header Image -->
    <tr>
        <td style="padding: 0;">
            <img src="https://www.galeriamentis.com/galeriamentis_logo.svg"
                title="Galeria Mentis Logo"
                alt="Galeria Mentis Logo"
                 style="width: 100%; height: 200px; display: block; object-fit: contain;"/>
        </td>
    </tr>

    <!-- Subtitle and Description -->
    <tr>
        <td style="padding: 20px;">
            <h2 style="font-size: 24px; font-weight: bold; color: #333333;">Your order has been dispatched</h2>
            <p style="font-size: 14px; color: #666666; line-height: 1.5;">
                Great news! Your order has been shipped and is on its way to you. Below you will find all the shipping details and tracking information.
            </p>
        </td>
    </tr>

    <!-- Order Details -->
    <tr>
        <td style="padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="font-size: 14px; color: #333333;">Your order number:</td>
                </tr>
                <tr>
                    <td style="font-size: 14px; color: #1d4ed8; font-weight: bold;">${orderNumber}</td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Shipping Information -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #333333;">
                <tr>
                    <td style="font-weight: bold; padding-bottom: 10px;">Shipping Information</td>
                </tr>
                <tr>
                    <td style="font-size: 14px; color: #333333;">Carrier:</td>
                    <td style="font-size: 14px; color: #1d4ed8; font-weight: bold;">${carrier}</td>
                </tr>
                ${trackingInfoHtml}
                <tr>
                    <td style="font-size: 14px; color: #333333;">Date of Shipment:</td>
                    <td style="font-size: 14px; color: #333333; font-weight: bold;">${shipmentDate}</td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Cart Items -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          ${orderItemsHtml}
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Price Breakdown -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #666666;">
                <tr>
                    <td style="font-weight: bold; color: #333333;">Total Price</td>
                    <td style="text-align: right; font-weight: bold; color: #333333;">${formatPrice(parseInt(totalPrice))}</td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Customer Details -->
    <tr>
        <td style="padding: 20px; border-top: 1px solid #dddddd;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="font-size: 14px; color: #333333;">
                        <strong>Shipping Address</strong><br>
                        ${personData.name} ${personData.lastname}<br>
                        ${personData.address}, ${personData.apartment} <br>
                        ${personData.city}, ${personData.country} <br>
                        ${personData.state}, ${personData.postal} <br>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Policy and Footer -->
    <tr>
        <td style="padding: 20px; font-size: 12px; color: #666666; line-height: 1.5;">
            <p>If you have any questions about your shipment, please contact our customer support team at contact@galeriamentis.com.</p>
            <p style="margin-top: 10px; font-size: 10px; text-align: center;">
                Galeria Mentis | contact@galeriamentis.com
            </p>
        </td>
    </tr>

    <!-- Link to Site -->
    <tr>
        <td align="right" style="padding: 20px; border-top: 1px solid #dddddd;">
            <a 
            href=${process.env.NEXT_PUBLIC_BASE_URL}
            style="font-size: 14px; color: #1d4ed8; text-decoration: none;">Galeria Mentis
                <span aria-hidden="true"> &rarr;</span></a>
        </td>
    </tr>
</table>
</body>
</html>
    `;
}

export async function sendEmailToCustomer(order) {

    const emailAccessToken = process.env.EMAILJS_PRIVATE_KEY;
    const emailServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailUserId = process.env.EMAILJS_PUBLISH_KEY;



    let header;
    let description;

    const {
        orderNumber,
        personData,
        products,
        totalPrice,
        orderStatus,
    } = order;

    switch (orderStatus) {
        case "paid": {
            header = "Your payment was successful!";
            description = `Your order has been received. If the payment is successful, the order will be processed, and you will receive an email once the item has been dispatched. If you have any questions, please contact our customer support team. Thank you for shopping with us!`;
            break;
        }
        case "new": {
            header = "Order Confirmation";
            description = `Your order has been received. If the payment is successful, the order will be processed, and you will receive a confirmation email. 
        If you have any questions, please contact our customer support team. Thank you for shopping with us!`;
            break;
        }
        case "cancelled": {
            header = "Order Cancelled";
            description = `Your order has been cancelled. If you have any questions, please contact our customer support team.`;
            break;
        }
        case "done": {
            header = "Order Completed";
            description = `Your order has been completed. If you have any questions, please contact our customer support team.`;
            break;
        }
        case "parcelDelivery" : {
            header = "Your order has been dispatched";
            description = `Great news! Your order has been shipped and is on its way to you.`;
            break;
        }
    }

    const htmlContent = generateOrderEmailHtml({
        orderNumber,
        personData,
        products,
        totalPrice,
        orderStatus,
        header,
        description,
    });

    const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            service_id: emailServiceId,
            template_id: emailTemplateId,
            user_id: emailUserId,
            template_params: {
                htmlContent,
                header: header,
                email: personData.email,
            },
            accessToken: emailAccessToken,
        }),
    });

    const emailResultText = await emailResponse.text();
    if (emailResultText.trim() !== "OK") {
        return {
            status: 500,
            message: "Błąd podczas wysyłania e-maila",
            emailResultText,
        }
    }

    return {
        status: 200,
        message: "E-mail został wysłany"
    }
}

export async function sendParcelDeliveryEmail(order, parcelData) {
    const emailAccessToken = process.env.EMAILJS_PRIVATE_KEY;
    const emailServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailUserId = process.env.EMAILJS_PUBLISH_KEY;

    const {
        orderNumber,
        personData,
        products,
        totalPrice,
    } = order;

    const {
        carrier,
        trackingNumber,
        shipmentDate,
    } = parcelData;

    const htmlContent = generateParcelDeliveryEmailHtml({
        orderNumber,
        personData,
        products,
        totalPrice,
        carrier,
        trackingNumber,
        shipmentDate,
    });

    const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            service_id: emailServiceId,
            template_id: emailTemplateId,
            user_id: emailUserId,
            template_params: {
                htmlContent,
                header: "Your order has been dispatched",
                email: personData.email,
            },
            accessToken: emailAccessToken,
        }),
    });

    const emailResultText = await emailResponse.text();
    if (emailResultText.trim() !== "OK") {
        return {
            status: 500,
            message: "Błąd podczas wysyłania e-maila",
            emailResultText,
        }
    }

    return {
        status: 200,
        message: "E-mail został wysłany"
    }
}
