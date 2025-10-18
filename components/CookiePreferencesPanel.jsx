"use client";

import { useState } from "react";

export default function CookiePreferencesPanel({ consent, onSave, onCancel }) {
    const [prefs, setPrefs] = useState(consent);

    const handleToggle = (key) => {
        setPrefs({ ...prefs, [key]: !prefs[key] });
    };

    const handleSave = () => {
        onSave(prefs);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white text-gray-900 p-6 rounded-lg max-w-md w-full shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Cookie Preferences
                </h2>

                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                        <span>Essential Cookies (always active)</span>
                        <span className="text-green-600 font-semibold">ON</span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                        <span>Analytics Cookies</span>
                        <input
                            type="checkbox"
                            checked={prefs.analytics}
                            onChange={() => handleToggle("analytics")}
                            className="w-5 h-5"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Marketing Cookies</span>
                        <input
                            type="checkbox"
                            checked={prefs.marketing}
                            onChange={() => handleToggle("marketing")}
                            className="w-5 h-5"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-primary hover:bg-black text-white px-4 py-2 rounded"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
}
