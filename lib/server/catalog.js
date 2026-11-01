import "server-only";
import {getProductsByCategory} from "@/sanity/getSanity/getProductsByCategory";
import {getProductOptions} from "@/sanity/getSanity/getProductOptions";
import {getProductCategories} from "@/sanity/getSanity/getProductCategories";

function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/** Dane listingu prac. Losowa kolejność jest liczona na serwerze (odświeżana razem z ISR). */
export async function getCatalogData(category) {
    const [products, productOptions, productCategories] = await Promise.all([
        getProductsByCategory(category),
        getProductOptions(),
        getProductCategories(),
    ]);
    return {
        products: shuffle(products || []),
        productOptions: productOptions || [],
        productCategories: productCategories || [],
    };
}
