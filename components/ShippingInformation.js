'use client';

import React from 'react';
import FormInput from './FormInput';

export default function ShippingInformation({ form, setForm }) {
    // Pomijamy pierwsze pole (email), dlatego slice(1)
    const shippingFields = form.slice(1);

    const handleChange = (e, index) => {
        const value = e.target.value;
        setForm((prevState) => {
            const updatedForm = [...prevState];
            updatedForm[index + 1] = {
                ...updatedForm[index + 1],
                value: value,
            };
            return updatedForm;
        });
    };

    return (
        <div className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {shippingFields.map((field, index) => (
                    <div key={field.id}>
                        <FormInput
                            label={field.label}
                            id={field.id}
                            autoComplete={field.autoComplete}
                            disabled={field.disabled}
                            required={field.required}
                            value={field.value}
                            onChange={(e) => handleChange(e, index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
