"use client";

import {generateStructuredData} from "@/lib/generateSEO";
import {useEffect, useState} from "react";

/**
 * Komponent do dodawania JSON-LD structured data do strony
 * @param {Object} props
 * @param {Object} props.data - Dane strony (produkt, artykuł, artysta, etc.)
 * @param {string} props.type - Typ structured data (Product, Article, Person, etc.)
 */
export default function StructuredData({data, type}) {
    const [structuredData, setStructuredData] = useState(null);

    useEffect(() => {
        if (data) {
            const jsonLd = generateStructuredData(data, type);
            setStructuredData(jsonLd);
        }
    }, [data, type]);

    if (!structuredData || !data) {
        return null;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
    );
}

