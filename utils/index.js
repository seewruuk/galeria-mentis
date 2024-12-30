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


export const createSummary = (products) => {
    const totals = {};
    const order = [];

    products.forEach(product => {
        const code = product.inpostCode;
        const qty = product.qty;

        if (totals[code]) {
            totals[code] += qty;
        } else {
            totals[code] = qty;
            order.push(code);
        }
    });

    return order
        .map(code => `${totals[code]}x ${code}`)
        .join(' ');
}




export function generateOrderEmailHtml({
                                           orderNumber,
                                           personData,
                                           products,
                                           totalPrice,
                                           deliveryMethod,
                                           deliveryAddress,
                                           cartTotal,
                                           header,
                                           description,
                                       }) {


    const orderItemsHtml = products.map(item => `
                                <tr>
                                <!-- Image Column -->
                                <td style="width: 100px; padding-right: 10px;">
                                    <img src="https://www.joinero.pl/email-images/${item.slug}.png" alt="image"
                                         style="width: 80px; height: 80px; border-radius: 8px; background-color: #f3f4f6; display: block;">
                                </td>
                                <!-- Product Details Column -->
                                <td style="vertical-align: top;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="font-size: 16px; font-weight: bold; color: #333333;">
                                                <a href="https://www.joinero.pl/produkty/${item.slug}" style="text-decoration: none; color: #333333; target="_blank">
                                                ${item.name}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 14px; color: #666666;">${item.category}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 14px; color: #666666;">Ilość: ${item.qty}</td>
                                        </tr>
                                    </table>
                                </td>
                                <!-- Price Column -->
                                <td style="vertical-align: top; text-align: right; font-size: 16px; font-weight: bold; color: #333333;">
                                    ${item.price} PLN
                                </td>
                            </tr>
    `).join("");

    return `
       <html lang="pl">
            <head>
            <title>${header}</title>
            <style>
                * {
                    line-height: 170%;
                  }
            </style>

            </head>

            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333;">

                <table align="center" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; max-width: 650px;">
                    <!-- Header Image -->
                    <tr>
                        <td style="padding: 0;">
                            <img src="https://www.joinero.pl/email-image.svg" alt="TODO"
                                 style="width: 100%; height: 200px; display: block; object-fit: cover;"/>
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
                                    <td style="font-size: 14px; color: #333333;">Numer twojego zamówienia:</td>
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
                                    <td style="padding: 10px;">
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
                                    <td>Wartość koszyka</td>
                                    <td style="text-align: right; color: #333333;">${cartTotal} PLN</td>
                                </tr>
                                <tr>
                                    <td>Dostawa</td>
                                    <td style="text-align: right; color: #333333;">13.99 PLN</td>
                                </tr>
                                <tr>
                                    <td>Płatność</td>
                                    <td style="text-align: right; color: #333333;">Przelewy24</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; color: #333333;">Suma całkowita</td>
                                    <td style="text-align: right; font-weight: bold; color: #333333;">${totalPrice} PLN</td>
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
                                        <strong>Dane kupującego</strong><br>
                                        ${personData.name} ${personData.lastname}<br>
                                        ${personData.email} <br>
                                        ${personData.phone} <br>
                                        ${personData.address} <br>
                                        ${personData.postal} , ${personData.city}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px; color: #333333; padding-top: 21px;">
                                        <strong>Sposób dostawy</strong><br>
                                        ${
        deliveryMethod === "inpost" ? "Paczkomat InPost" : "Kurier InPost"
    } 
                                        <br>
                                        ${deliveryAddress}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                
                    <!-- Policy and Footer -->
                    <tr>
                        <td style="padding: 20px; font-size: 12px; color: #666666; line-height: 1.5;">
                            <p>W przypadku zawarcia umowy, zgodnie z ustawą o prawach konsumenta, przysługuje Ci prawo do odstąpienia
                                od umowy w terminie 14 dni od dnia jej zawarcia. Aby skorzystać z tego prawa, należy złożyć stosowne
                                oświadczenie na piśmie lub drogą elektroniczną na adres e-mail podany w regulaminie. Więcej informacji
                                na ten temat znajdziesz w regulaminie, który dostępny jest na stronie internetowej <a
                                        href="https://www.joinero.pl/regulamin.pdf" target="_blank"
                                        style="color: #1d4ed8; text-decoration: underline;">pod tym
                                    linkiem.</a> Przeczytaj go uważnie przed dokonaniem zakupu.
                                    Prawo do odstąpienia od umowy znajduje się <a
                                        href="https://www.joinero.pl/odstapienie-od-umowy" target="_blank"
                                        style="color: #1d4ed8; text-decoration: underline;">pod tym
                                    linkiem.</a>
                                    </p>
                            <p style="margin-top: 10px; font-size: 10px;">JOINEROO MARCEL NOWAKOWSKI / NIP: 5941612784 / Oraczewice 99a, 73-200
                                Oraczewice</p>
                        </td>
                    </tr>
                
                    <!-- Link to Site -->
                    <tr>
                        <td align="right" style="padding: 20px; border-top: 1px solid #dddddd;">
                            <a href="https://www.joinero.pl/" style="font-size: 14px; color: #1d4ed8; text-decoration: none;">Joinero.pl
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


    const {
        orderNumber,
        personData,
        products,
        totalPrice,
        orderStatus,
        orderInfo: {deliveryMethod, deliveryAddress},
    } = order;

    let header;
    let description;

    switch (orderStatus) {
        case "paid" : {
            header = "Twoja płatność przebiegła pomyślnie!";
            description = `Otrzymaliśmy potwierdzenie twojej płatności. Twoje zamówienie jest w trakcie realizacji.
             W razie pytań prosimy o kontakt z naszym działem obsługi klienta. Dziękujemy za zakupy w naszym sklepie!
            `;
            break;
        }
        case "new" : {
            header = "Potwierdzenie przyjęcia zamówienia";
            description = `Twoje zamówienie zostało przyjęte. Jeżeli płatność przebiegnie pomyślnie, zamówienie zostanie zrealizowane, a ty otrzymasz e-mail z potwierdzeniem.
            W razie pytań prosimy o kontakt z naszym działem obsługi klienta. Dziękujemy za zakupy w naszym sklepie!
            `;
            break;
        }
        case "cancelled" : {
            header = "Anulowanie zamówienia";
            description = `Twoje zamówienie zostało anulowane. W razie pytań prosimy o kontakt z naszym działem obsługi klienta.`;
            break;
        }
        case "done" : {
            header = "Zamówienie zrealizowane";
            description = `Twoje zamówienie zostało zrealizowane. W razie pytań prosimy o kontakt z naszym działem obsługi klienta.`;
            break;
        }
    }

    const htmlContent = generateOrderEmailHtml({
        orderNumber,
        personData,
        products,
        totalPrice,
        deliveryMethod,
        deliveryAddress,
        orderStatus,
        header,
        description,
        cartTotal: (totalPrice - 13.99).toFixed(2),

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





