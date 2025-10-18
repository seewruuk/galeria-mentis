"use client";

import { useState } from "react";

export default function Timeout({ onUnlock }) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const correctPassword = process.env.NEXT_PUBLIC_PAGE_PASSWORD || "";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === correctPassword) {
            onUnlock();
        } else {
            setError(true);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-gray-800 rounded-2xl shadow-lg text-center"
            >
                <input
                    type="password"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Password"
                    className="px-4 py-2 rounded w-full text-black"
                />
                <button
                    type="submit"
                    className="mt-4 bg-gray-600 hover:bg-black-700 px-6 py-2 rounded text-white"
                >
                    Unlock
                </button>
                {error && <p className="mt-3 text-red-400">
                    Wrong password. Please try again.
                </p>}
            </form>
        </div>
    );
}
