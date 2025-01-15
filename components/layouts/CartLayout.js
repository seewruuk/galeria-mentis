'use client';

import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context/CartContext';
import PageTransition from '@/components/PageTransition';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';

import { formatPrice } from '@/lib/formatPrice';
import ContactInformation from "@/components/ContactInformation";
import ShippingInformation from "@/components/ShippingInformation";
import InvoiceForm from "@/components/InvoiceForm";
import CartItemsList from "@/components/CartItemsList";
import CheckoutSummary from "@/components/CheckoutSummary";

export default function CartLayout() {
    const {
        cartItems = [],
        removeItem,
        totalPrice,
        preventChange,
        form,
        setForm,
        handleBuyEvent,
        increaseQty,
        decreaseQty,
        termsAccepted,
        termsDisabled,
        handleCheckboxChange,
        invoiceForm,
        setInvoiceForm,
        invoiceInputs,
        setInvoiceInputs,
        summaryButtonDisabled
    } = useContext(CartContext);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    return (
        <PageTransition>
            <div className="pt-[200px]">
                <Layout>
                    <h2 className="sr-only">Checkout</h2>

                    {/* Cały formularz wrapujemy w <form>, żeby obsłużyć onSubmit */}
                    <form
                        className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleBuyEvent();
                        }}
                    >
                        {/* Left Column */}
                        <div>
                            {/* Contact Information */}
                            <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                            <ContactInformation form={form} setForm={setForm} />

                            {/* Shipping Information */}
                            <ShippingInformation form={form} setForm={setForm} />

                            {/* Invoice details */}
                            <InvoiceForm
                                invoiceForm={invoiceForm}
                                setInvoiceForm={setInvoiceForm}
                                invoiceInputs={invoiceInputs}
                                setInvoiceInputs={setInvoiceInputs}
                                preventChange={preventChange}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900">Cart summary</h2>

                            {/* Lista produktów w koszyku */}
                            <CartItemsList
                                cartItems={cartItems}
                                removeItem={removeItem}
                                preventChange={preventChange}
                                increaseQty={increaseQty}
                                decreaseQty={decreaseQty}
                            />

                            {/* Podsumowanie zamówienia (checkout, terms) */}
                            <CheckoutSummary
                                summaryButtonDisabled={summaryButtonDisabled}
                                cartItems={cartItems}
                                totalPrice={formatPrice(totalPrice)}
                                termsAccepted={termsAccepted}
                                handleCheckboxChange={handleCheckboxChange}
                                preventChange={preventChange}
                            />
                        </div>
                    </form>
                </Layout>
            </div>
            <Footer />
        </PageTransition>
    );
}
