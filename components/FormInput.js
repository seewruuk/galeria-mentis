'use client';
const commonInputStyles =
    'block w-full rounded-md border-2 border-stroke shadow-sm focus:border-primary focus:ring-0 focus:outline-none sm:text-sm bg-[#F8F8F8] px-[15px] py-[10px] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300';

export default function FormInput({
                                      label,
                                      id,
                                      type = 'text',
                                      autoComplete,
                                      disabled = false,
                                      required = false,
                                      value,
                                      onChange,
                                  }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={id}
                    name={id}
                    type={type}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    required={required}
                    className={commonInputStyles}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
