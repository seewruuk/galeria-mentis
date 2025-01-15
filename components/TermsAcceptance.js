'use client';

import React from 'react';

export default function TermsAcceptance({
                                            termsAccepted,
                                            handleCheckboxChange,
                                            termsDisabled,
                                            preventChange
                                        }) {
    return (
        <div className="flex flex-col gap-2 mt-4">
            {termsAccepted.map((term, index) => (
                <div key={index} className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <div className="inline-flex items-center">
                            <label className="flex items-center cursor-pointer relative">
                                <input
                                    id={term.name}
                                    name={term.name}
                                    type="checkbox"
                                    checked={term.value}
                                    disabled={preventChange}
                                    onChange={(e) =>
                                        handleCheckboxChange(e.target.name, e.target.checked)
                                    }
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                                />
                                <span
                                    className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                >
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
                            htmlFor={term.name}
                            className={`
                select-none font-medium  cursor-pointer
                ${term.value ? 'text-black' : 'text-gray'}
              `}
                        >
                            {term.label}
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
}
