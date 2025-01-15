'use client';

import FormInput from './FormInput';

export default function ContactInformation({ form, setForm }) {
    // Filtrujemy/pobieramy pole email z tablicy form
    const emailFieldIndex = form.findIndex((f) => f.id === 'email-address');
    const emailField = form[emailFieldIndex];

    if (!emailField) return null;

    const handleChange = (e) => {
        const value = e.target.value;
        setForm((prevState) => {
            const updated = [...prevState];
            updated[emailFieldIndex] = {
                ...updated[emailFieldIndex],
                value,
            };
            return updated;
        });
    };

    return (
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <FormInput
                label={emailField.label}
                id={emailField.id}
                type={emailField.type}
                autoComplete={emailField.autoComplete}
                disabled={emailField.disabled}
                required={emailField.required}
                value={emailField.value}
                onChange={handleChange}
            />
        </div>
    );
}
