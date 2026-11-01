"use client"
import {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {saveToNewsletter} from "@/lib/saveToNewsletter";


export const CartContext = createContext({});


export default function CartContextProvider({children}) {

    // Koszyk z ciasteczka wczytujemy po załadowaniu strony (HTML z serwera i pierwszy render w przeglądarce są identyczne)
    const [cartItems, setCartItems] = useState([]);
    const [cartLoaded, setCartLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = Cookies.get("cart");
            const parsed = saved ? JSON.parse(saved) : [];
            if (Array.isArray(parsed) && parsed.length) setCartItems(parsed);
        } catch {
            Cookies.remove("cart");
        }
        setCartLoaded(true);
    }, []);
    const [totalQty, setTotalQty] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    let totalPrice = subtotal;
    const router = useRouter();

    const [preventChange, setPreventChange] = useState(false)
    const [summaryButtonDisabled, setSummaryButtonDisabled] = useState(true);


    const [form, setForm] = useState([
        {
            id: 'email-address',
            label: 'Email address',
            type: 'email',
            autoComplete: 'email',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
            required: true
        },
        {
            id: 'first-name',
            label: 'First name',
            type: 'text',
            autoComplete: 'given-name',
            colSpan: '',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'last-name',
            label: 'Last name',
            type: 'text',
            autoComplete: 'family-name',
            colSpan: '',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'address',
            label: 'Address',
            type: 'text',
            autoComplete: 'street-address',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'apartment',
            label: 'Street Address line 2',
            type: 'text',
            autoComplete: '',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
            required: false
        },
        {
            id: 'city',
            label: 'City',
            type: 'text',
            autoComplete: 'address-level2',
            colSpan: '',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'country',
            label: 'Country',
            type: 'text',
            autoComplete: 'country-name',
            colSpan: '',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'region',
            label: 'State / Province',
            type: 'text',
            autoComplete: 'address-level1',
            colSpan: '',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'postal-code',
            label: 'Postal code',
            type: 'text',
            autoComplete: 'postal-code',
            colSpan: '',
            value: '',
            disabled: preventChange,
            required: true

        },
        {
            id: 'phone',
            label: 'Phone',
            type: 'text',
            autoComplete: 'tel',
            colSpan: 'sm:col-span-2',
            value: '',
            disabled: preventChange,
            required: true

        },
    ]);

    const individualInvoiceFields = [
        {
            placeholder: "First Name",
            type: "text",
            name: "name",
            value: "",
            required: true,
        },
        {
            placeholder: "Last Name",
            type: "text",
            name: "lastname",
            value: "",
            required: true,
        },
        {
            placeholder: "Phone",
            type: "text",
            name: "phone",
            value: "",
            required: true,
        },
        {
            placeholder: "Address",
            type: "text",
            name: "address",
            value: "",
            required: true,

        },
        {
            placeholder: "Postal Code",
            type: "text",
            name: "postalCode",
            value: "",
            required: true,
        },
        {
            placeholder: "City",
            type: "text",
            name: "city",
            value: "",
            required: true,
        },
        {
            placeholder: "Country",
            type: "text",
            name: "country",
            value: "",
            required: true,
        },
    ];

    const companyInvoiceFields = [
        {
            placeholder: "Company Name",
            type: "text",
            name: "companyName",
            value: "",
            required: true,
        },
        {
            placeholder: "NIP",
            type: "text",
            name: "nip",
            value: "",
            required: true,
        },
        {
            placeholder: "Phone",
            type: "text",
            name: "phone",
            value: "",
            required: true,
        },
        {
            placeholder: "Company Address",
            type: "text",
            name: "address",
            value: "",
            required: true,
        },
        {
            placeholder: "Postal Code",
            type: "text",
            name: "postalCode",
            value: "",
            required: true,
        },
        {
            placeholder: "City",
            type: "text",
            name: "city",
            value: "",
            required: true,
        },
        {
            placeholder: "Country",
            type: "text",
            name: "country",
            value: "",
            required: true,
        },
    ];

    const [invoiceForm, setInvoiceForm] = useState({
        status: false,
        companyType: "individual",
    });
    const [invoiceInputs, setInvoiceInputs] = useState([]);

    useEffect(() => {
        if (invoiceForm.status) {
            if (invoiceForm.companyType === "individual") {
                setInvoiceInputs([...individualInvoiceFields]);
            } else {
                setInvoiceInputs([...companyInvoiceFields]);
            }
        } else {
            setInvoiceInputs([]);
        }
    }, [invoiceForm.status, invoiceForm.companyType]);

    const [termsAccepted, setTermsAccepted] = useState([
        {
            name: "all",
            label: "Select All",
            value: false
        },
        {
            name: "terms",
            label: (
                <>
                    *I accept the <Link
                    href={"/terms-and-conditions.pdf"}
                    target={"_blank"}
                    className={"underline"}>
                    Terms and Conditions
                </Link> of the store.
                </>
            ),
            value: false,
            required: true
        },
        {
            name: "privacy",
            label: (
                <>
                    *I accept the <Link
                    href={"/privacy-policy.pdf"}
                    target={"_blank"}
                    className={"underline"}>
                    Privacy Policy
                </Link>.
                </>
            ),
            value: false,
            required: true
        },
        {
            name: "newsletter",
            label: (
                <>
                    I agree to receive promotional offers and updates via email.
                    <br/>
                    You can unsubscribe at any time.
                </>
            ),
            value: false
        },
    ]);
    const [termsDisabled, setTermsDisabled] = useState(false)

    useEffect(() => {
        const requiredInputs = form.filter(input => input.required);
        const isFormValid = requiredInputs.every(input => input.value !== "");

        const filledInputs = requiredInputs.filter(input => input.value.length > 0);

        // Sprawdzamy, czy wszystkie pola faktury są wypełnione i poprawne, gdy status faktury jest aktywny
        const areInvoiceInputsValid = invoiceForm.status
            ? invoiceInputs.every(input => input.value !== "")
            : true;

        if (requiredInputs.length === filledInputs.length && isFormValid && termsAccepted[1].value && termsAccepted[2].value && areInvoiceInputsValid) {
            setSummaryButtonDisabled(false);
        } else {
            setSummaryButtonDisabled(true);
        }
    }, [form, termsAccepted, invoiceForm.status, invoiceInputs]);


    useEffect(() => {
        setTotalQty(cartItems.reduce((acc, item) => acc + item.qty, 0));
        setSubtotal(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0));
        if (cartLoaded) Cookies.set("cart", JSON.stringify(cartItems), {sameSite: "lax", secure: window.location.protocol === "https:"});
    }, [cartItems, cartLoaded])


    const handleBuyEvent = async () => {

        const isRequiredFilled = form.every(input => input.required ? input.value !== "" : true);
        if (!isRequiredFilled) {
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
        const loadingToast = toast.loading("Processing order...");

        if (termsAccepted[3].value === true) {
            const saveNewsletter = await saveToNewsletter(form[0].value);

            if (saveNewsletter.status !== 200) {
                toast.error("There was an error saving to newsletter.");
            }
        }

        setTermsDisabled(true);
        setForm(disableFormState);
        setPreventChange(true);
        setSummaryButtonDisabled(true);

        const unlockForm = () => {
            setTermsDisabled(false);
            setForm(form.map(input => ({...input, disabled: false})));
            setPreventChange(false);
            setSummaryButtonDisabled(false);
        };

        const invoiceValue = (name) => invoiceInputs.find(input => input.name === name)?.value || "";

        // Cena, dostępność i numer zamówienia są ustalane na serwerze – wysyłamy tylko ID prac i dane klienta
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({_id: item._id, qty: item.qty})),
                    expectedTotal: Number(totalPrice.toFixed(2)),
                    person: {
                        email: form[0].value,
                        name: form[1].value,
                        lastname: form[2].value,
                        address: form[3].value,
                        apartment: form[4].value,
                        city: form[5].value,
                        country: form[6].value,
                        state: form[7].value,
                        postal: form[8].value,
                        phone: form[9].value,
                    },
                    invoice: invoiceForm && invoiceForm.status ? {
                        status: true,
                        companyType: invoiceForm.companyType,
                        companyData: {
                            companyName: invoiceInputs.some(input => input.name === "companyName") ? invoiceValue("companyName") : invoiceValue("name"),
                            nip: invoiceInputs.some(input => input.name === "nip") ? invoiceValue("nip") : invoiceValue("lastname"),
                            phone: invoiceValue("phone"),
                            address: invoiceValue("address"),
                            companyPostal: invoiceValue("postalCode"),
                            companyCity: invoiceValue("city"),
                            companyCountry: invoiceValue("country"),
                        }
                    } : {status: false},
                    newsletter: termsAccepted[3].value
                })
            });

            const result = await response.json().catch(() => ({}));
            toast.dismiss(loadingToast);

            if (response.ok && result.status === "ok" && result.url) {
                window.location.assign(result.url);
                return;
            }

            if (result.code === "unavailable" && Array.isArray(result.unavailable)) {
                setCartItems(cartItems.filter(item => !result.unavailable.includes(item._id)));
            }
            if (result.code === "price_changed" && result.prices) {
                setCartItems(cartItems.map(item => result.prices[item._id] !== undefined ? {...item, price: result.prices[item._id]} : item));
            }
            toast.error(result.message || "There was an error processing your order. Please try again later.");
            unlockForm();
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("There was an error processing your order. Please try again later.");
            unlockForm();
        }
    }


    const addToCart = (item) => {
        const exist = cartItems.find(x => x._id === item._id);

        if (exist) {
            // setCartItems(
            //     cartItems.map(x =>
            //         x._id === item._id
            //             ? {...exist, qty: exist.qty + 1}
            //             : x
            //     )
            // );
            // toast.success("Successfully increased the amount of product in the shopping cart.");
            toast.error("The product is already in the cart.");

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
                    image: item.thumbnail ? item.thumbnail : item.images[0],
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

    const handleAcceptAll = (checked) => {
        setTermsAccepted(
            termsAccepted.map(term => ({...term, value: checked}))
        );
    };

    const handleCheckboxChange = (name, checked) => {
        if (name === "all") {
            handleAcceptAll(checked);
        } else {
            setTermsAccepted(
                termsAccepted.map((term) =>
                    term.name === name ? {...term, value: checked} : term
                )
            );
        }
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
            termsAccepted,
            setTermsAccepted,
            termsDisabled,
            setTermsDisabled,
            invoiceForm,
            setInvoiceForm,
            invoiceInputs,
            setInvoiceInputs,
            individualInvoiceFields,
            companyInvoiceFields,
            summaryButtonDisabled,


            handleAcceptAll,
            handleCheckboxChange,
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