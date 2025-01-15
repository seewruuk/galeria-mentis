'use client';

import React from 'react';
import TermsAcceptance from './TermsAcceptance';

export default function CheckoutSummary({
                                            cartItems,
                                            totalPrice,
                                            termsAccepted,
                                            handleCheckboxChange,
                                            termsDisabled,
                                            preventChange,
                                            summaryButtonDisabled
                                        }) {
    return (
        <>
            {cartItems.length !== 0 && (
                <section
                    aria-labelledby="summary-heading"
                    className="mt-16 rounded-lg py-6 lg:col-span-5 lg:mt-0"
                >
                    <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                        Order summary
                    </h2>

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Total Price</dt>
                            <dd className="text-sm font-medium text-gray-900">{totalPrice}</dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        {/* Ten button możesz obsłużyć w komponencie nadrzędnym, stąd np. type="submit" */}
                        <button
                            disabled={summaryButtonDisabled}
                            type="submit"
                            className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white hover:bg-black transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            Checkout
                        </button>
                    </div>

                    {/* Checkboxy Terms */}
                    <TermsAcceptance
                        termsAccepted={termsAccepted}
                        handleCheckboxChange={handleCheckboxChange}
                        termsDisabled={termsDisabled}
                        preventChange={preventChange}
                    />

                    <div className="mt-[12px] text-gray hover:text-black transition-all">
                        <p className="text-[12px] font-medium">
                            The administrator of personal data collected through the online store is the
                            Seller
                            GALERIA MENTIS. The data are or may be processed for the purposes and on the
                            grounds
                            indicated in detail in the privacy policy(e.g. contract performance, direct
                            marketing).
                            The privacy policy contains full information on the processing of data by
                            the controller
                            along with the rights of the data subject. Quick contact with the
                            controller:
                            email: contact@galeriamentis.com or phone: 123 123 123
                        </p>
                    </div>

                    <div className="mt-[12px] text-gray hover:text-black transition-all">
                        <p className="text-[12px] font-medium">
                            *Fields marked with an asterisk <span className="underline">are required.</span>
                        </p>
                    </div>
                </section>
            )}
        </>
    );
}
