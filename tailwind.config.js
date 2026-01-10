/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#AE8974",
                    light: "#E7E0DC",
                },
                black: "#181818",
                gray: {
                    DEFAULT: "#666666",
                    dark: "#8A8A8A",
                },
                stroke : {
                    DEFAULT: "#E2E2E2",
                },

                foreground: "var(--foreground)",
            },
            maxWidth: {
                'screen-xl': '1450px',
                'column' : '800px',
            }
        },
        fontFamily: {
            serif: ["var(--font-merriweather)", "serif"],
            freightBig: ["freight-big-pro", "serif"],
        },
    },
    plugins: [],
};