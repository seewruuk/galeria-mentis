"use client"
import {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import generateOrderNumber from "@/lib/generateOrderNumber";
import createOrder from "@/lib/createOrder";
import {useRouter} from "next/navigation";
import {getOrder} from "@/sanity/getSanity/getOrder";


export const CartContext = createContext({});


export default function CartContextProvider({children}) {

    const [cartItems, setCartItems] = useState(
        Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : []
    );
    const [totalQty, setTotalQty] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    let totalPrice = subtotal;
    const router = useRouter();

    const [preventChange, setPreventChange] = useState(false)

    const [form, setForm] = useState([
        {
            id: 'email-address',
            label: 'Email address',
            type: 'email',
            autoComplete: 'email',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'first-name',
            label: 'First name',
            type: 'text',
            autoComplete: 'given-name',
            colSpan: '',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'last-name',
            label: 'Last name',
            type: 'text',
            autoComplete: 'family-name',
            colSpan: '',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'address',
            label: 'Address',
            type: 'text',
            autoComplete: 'street-address',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'apartment',
            label: 'Apartment, suite, etc.',
            type: 'text',
            autoComplete: '',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'city',
            label: 'City',
            type: 'text',
            autoComplete: 'address-level2',
            colSpan: '',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'country',
            label: 'Country',
            type: 'text',
            autoComplete: 'country-name',
            colSpan: '',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'region',
            label: 'State / Province',
            type: 'text',
            autoComplete: 'address-level1',
            colSpan: '',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'postal-code',
            label: 'Postal code',
            type: 'text',
            autoComplete: 'postal-code',
            colSpan: '',
            value: '',
            disabled: preventChange,
        },
        {
            id: 'phone',
            label: 'Phone',
            type: 'text',
            autoComplete: 'tel',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
        },
    ]);


    useEffect(() => {
        setTotalQty(cartItems.reduce((acc, item) => acc + item.qty, 0));
        setSubtotal(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0));
        Cookies.set("cart", JSON.stringify(cartItems));
    }, [cartItems])


    const handleBuyEvent = async () => {

        const isFormValid = form.every(input => input.value !== "");
        if (!isFormValid) {
            toast.error("Please fill in all fields in the form.");
            setForm(
                form.map(input => {
                    if (input.value === "") {
                        return {...input, error: true};
                    }
                    return input;
                })
            );
            setPreventChange(true);
            return;
        }

        const disableFormState = form.map(input => ({...input, disabled: true}));
        toast.loading("Processing order...");
        setForm(disableFormState);
        setPreventChange(true);

        const orderNumber = generateOrderNumber(`${form[1].value}${form[2].value}`, form[9].value);


        const stripeResponse = await fetch("/api/createStripeSession", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartItems: cartItems,
                orderNumber: orderNumber
            })
        });

        const stripeResult = await stripeResponse.json();


        if (stripeResult.status === 200) {

            const stripeRedirectUrl = stripeResult.url
            const stripeSessionId = stripeResult.sessionId


            const response = await createOrder({
                orderNumber: orderNumber,
                form: form,
                fullDate: new Date().toLocaleString('en-GB', {timeZone: 'UTC'}),
                deliveryMethod: "standard",
                totalPrice: totalPrice.toFixed(2),
                products: cartItems,
                stripeSessionId: stripeSessionId,
                // invoice: invoiceForm && invoiceForm.status ? {
                //     status: invoiceForm.status,
                //     companyType: invoiceForm.companyType,
                //     companyData: {
                //         companyName: invoiceInputs.some(input => input.name === "companyName") ? invoiceInputs.find(input => input.name === "companyName").value : invoiceInputs.find(input => input.name === "name").value,
                //         nip: invoiceInputs.some(input => input.name === "nip") ? invoiceInputs.find(input => input.name === "nip").value : invoiceInputs.find(input => input.name === "lastname").value,
                //         phone: invoiceInputs.find(input => input.name === "phone").value,
                //         address: invoiceInputs.find(input => input.name === "address").value,
                //         companyPostal: invoiceInputs.find(input => input.name === "postalCode").value,
                //         companyCity: invoiceInputs.find(input => input.name === "city").value,
                //     }
                // } : {
                //     status: false,
                //     companyType: "",
                //     companyData: {
                //         companyName: "",
                //         nip: "",
                //         phone: "",
                //         address: "",
                //         companyPostal: "",
                //         companyCity: ""
                //     }
                // },
            });

            if (response.status === 200) {

                const sendEmail = await fetch("/api/sendEmailToCustomer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        order: await getOrder(orderNumber)
                    })
                });

                const emailResult = await sendEmail.json();

                if (emailResult.status !== 200) {
                    toast.error("There was an error sending the email. Please contact us to confirm your order.");
                } else {
                    router.push(stripeRedirectUrl);
                }
            } else {
                toast.error("There was an error processing your order. Please try again later.");
            }
        } else {
            toast.error("There was an error processing your order. Please try again later.");
        }
    }


    const addToCart = (item) => {
        const exist = cartItems.find(x => x._id === item._id);

        if (exist) {
            setCartItems(
                cartItems.map(x =>
                    x._id === item._id
                        ? {...exist, qty: exist.qty + 1}
                        : x
                )
            );
            toast.success("Successfully increased the amount of product in the shopping cart.");
        } else {
            setCartItems([
                ...cartItems,
                {
                    _id: item._id,
                    name: item.name,
                    slug: item.slug,
                    price: item.price, // Cena oryginalna
                    discount: null, // Zniżki nie stosujemy na początku
                    discountValue: null, // Wartość zniżki
                    category: item.productCategory,
                    artist: item.artist,
                    image: item.images[0],
                    qty: 1,
                }
            ]);
            toast.success("Successfully added product to cart.");
        }
    };

    const increaseQty = (id) => {
        const newCartItems = cartItems.map((item) => {
            if (item._id === id) {
                return {...item, qty: item.qty + 1};
            }
            return item;
        });

        setCartItems(newCartItems);
        // toast.success("The quantity of the product has been increased.");
    };


    const decreaseQty = (id) => {
        const newCartItems = cartItems.map((item) => {
            if (item._id === id && item.qty > 1) {
                return {...item, qty: item.qty - 1};
            }
            return item;
        });
        setCartItems(newCartItems);
        // toast.success("The quantity of the product has been decreased.");
    };


    const removeItem = (id) => {
        const newCartItems = cartItems.filter((item) => item._id !== id);
        setCartItems(newCartItems);
    };


    return (
        <CartContext.Provider value={{
            cartItems,
            setCartItems,
            totalQty,
            setTotalQty,
            totalPrice,
            subtotal,
            form,
            setForm,
            preventChange,


            handleBuyEvent,
            addToCart,
            increaseQty,
            decreaseQty,
            removeItem
        }}>
            {children}
        </CartContext.Provider>
    );
}