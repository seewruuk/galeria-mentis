import {generateStructuredData} from "@/lib/generateSEO";

/**
 * JSON-LD renderowany na serwerze (od razu w HTML, widoczny dla Google bez wykonywania JS).
 * @param {Object} props
 * @param {Object} props.data - Dane strony (produkt, artykuł, artysta, etc.)
 * @param {string} props.type - Typ structured data (Product, Article, Person, etc.)
 */
export default function StructuredData({data, type}) {
    if (!data) return null;
    const structuredData = generateStructuredData(data, type);
    if (!structuredData) return null;

    // Escapujemy "<", żeby treść z CMS nie mogła zamknąć tagu <script>
    const json = JSON.stringify(structuredData).replace(/</g, "\\u003c");

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: json}}
        />
    );
}
