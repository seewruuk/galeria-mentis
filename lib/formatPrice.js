export function formatPrice(price) {

    const currency = process.env.NEXT_PUBLIC_CURRENCY;

    if (typeof price !== "number") return "Invalid price";
    return currency + " " + price.toLocaleString("en-US");
}
