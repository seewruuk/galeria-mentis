'use client';

import React from 'react';
import FormInput from './FormInput';

export default function InvoiceForm({
                                        invoiceForm,
                                        setInvoiceForm,
                                        invoiceInputs,
                                        setInvoiceInputs,
                                        preventChange
                                    }) {
    const handleInvoiceCheckbox = () => {
        setInvoiceForm((prev) => ({...prev, status: !prev.status}));
    };

    const handleCompanyTypeChange = (e) => {
        setInvoiceForm((prev) => ({...prev, companyType: e.target.value}));
    };

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        setInvoiceInputs((prevState) => {
            const updatedForm = [...prevState];
            updatedForm[index] = {
                ...updatedForm[index],
                value,
            };
            return updatedForm;
        });
    };

    return (
        <div className="mt-[42px]">
            <h2 className="text-lg font-medium text-gray-900">Invoice details</h2>

            <div className="relative flex items-start mt-[16px]">
                <div className="flex h-6 items-center">
                    <div className="inline-flex items-center">
                        <label className="flex items-center cursor-pointer relative">
                            <input
                                type="checkbox"
                                disabled={preventChange}
                                checked={invoiceForm.status}
                                onChange={handleInvoiceCheckbox}
                                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:border-primary checked:bg-primary disabled:bg-slate-100 disabled:border-slate-300"
                            />
                            <span
                                className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            >
                {/* ikona check */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                >
                  <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                  ></path>
                </svg>
              </span>
                        </label>
                    </div>
                </div>

                <div className="min-w-0 flex-1 text-sm leading-6 ml-2">
                    <label
                        className={`
              select-none font-medium cursor-pointer
              ${invoiceForm.status ? 'text-black' : 'text-gray'}
            `}
                        onClick={handleInvoiceCheckbox}
                    >
                        I want to receive an invoice.
                    </label>
                </div>
            </div>

            {/* Radio buttony */}
            {invoiceForm.status && (
                <div className="mt-[16px]">
                    <div className="flex gap-2 items-center">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative flex items-center justify-center h-5 w-5">
                                <input
                                    type="radio"
                                    name="companyType"
                                    value="individual"
                                    disabled={preventChange}
                                    checked={invoiceForm.companyType === 'individual'}
                                    onChange={handleCompanyTypeChange}
                                    className="peer h-full w-full cursor-pointer appearance-none rounded-full border border-slate-300 checked:bg-primary transition-all"
                                />
                            </div>
                            <span
                                className={`
                  ml-2 text-sm select-none font-medium cursor-pointer
                  ${invoiceForm.companyType === 'individual' ? 'text-black' : 'text-gray'}
                `}
                            >
                Individual
              </span>
                        </label>
                    </div>
                    <div className="flex gap-2 items-center mt-[8px]">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative flex items-center justify-center h-5 w-5">
                                <input
                                    disabled={preventChange}
                                    type="radio"
                                    name="companyType"
                                    value="company"
                                    checked={invoiceForm.companyType === 'company'}
                                    onChange={handleCompanyTypeChange}
                                    className="peer h-full w-full cursor-pointer appearance-none rounded-full border border-slate-300 checked:bg-primary transition-all"
                                />
                            </div>
                            <span
                                className={`
                  ml-2 text-sm select-none font-medium cursor-pointer
                  ${invoiceForm.companyType === 'company' ? 'text-black' : 'text-gray'}
                `}
                            >
                Company
              </span>
                        </label>
                    </div>
                </div>
            )}

            {/* Pola dodatkowe */}
            {invoiceForm.status && (
                <div className="mt-[16px] bg-white-clear rounded-2xl grid grid-cols-2 gap-[8px] max-md:grid-cols-1">
                    {invoiceInputs.map((input, index) => (
                        <div key={input.name}>
                            <FormInput
                                label={input.placeholder}
                                id={input.name}
                                value={input.value}
                                disabled={preventChange}
                                onChange={(e) => handleInputChange(e, index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
