import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
    ...nextVitals,
    {
        rules: {
            // Nowe reguły React Compiler – istniejący kod do stopniowej poprawy (etap porządków)
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/refs": "warn",
        },
    },
    {
        ignores: [".next/**", ".next-build/**", "node_modules/**", "public/**", ".sanity/**", "backups/**"],
    },
];

export default config;
