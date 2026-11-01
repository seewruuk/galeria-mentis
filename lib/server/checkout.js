import "server-only";
import crypto from "node:crypto";
import groq from "groq";
import Stripe from "stripe";
import {fetchFresh, writeClient} from "@/lib/server/sanity";
import {privateId} from "@/sanity/privateIds";
import {SITE_URL} from "@/lib/generateSEO";

let stripeClient = null;
export function getStripe() {
    if (!stripeClient) {
        if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
        stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeClient;
}

export class CheckoutError extends Error {
    constructor(code, message, status = 400, extra = {}) {
        super(message);
        this.code = code;
        this.status = status;
        this.extra = extra;
    }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (value, max = 200) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const PERSON_FIELDS = [
    ["email", true], ["name", true], ["lastname", true], ["address", true], ["apartment", false],
    ["city", true], ["country", true], ["state", true], ["postal", true], ["phone", true],
];

export function validatePerson(input) {
    const person = {};
    for (const [key, required] of PERSON_FIELDS) {
        person[key] = str(input?.[key]);
        if (required && !person[key]) throw new CheckoutError("invalid_form", "Please fill in all fields in the form.");
    }
    if (!EMAIL_RE.test(person.email)) throw new CheckoutError("invalid_form", "Please enter a valid email address.");
    return person;
}

const EMPTY_INVOICE = {
    status: false,
    companyType: "",
    companyData: {companyName: "", nip: "", phone: "", address: "", companyPostal: "", companyCity: "", companyCountry: ""},
};

export function sanitizeInvoice(input) {
    if (!input || input.status !== true) return EMPTY_INVOICE;
    const data = input.companyData || {};
    return {
        status: true,
        companyType: str(input.companyType, 50),
        companyData: {
            companyName: str(data.companyName),
            nip: str(data.nip, 50),
            phone: str(data.phone, 50),
            address: str(data.address),
            companyPostal: str(data.companyPostal, 30),
            companyCity: str(data.companyCity),
            companyCountry: str(data.companyCountry),
        },
    };
}

/**
 * Wylicza koszyk wyłącznie na podstawie danych z Sanity (cena, dostępność).
 * Przeglądarka przesyła tylko ID produktów.
 */
export async function priceCart(rawItems) {
    if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 50) {
        throw new CheckoutError("empty_cart", "Your cart is empty.");
    }
    const ids = [...new Set(rawItems.map((item) => (typeof item?._id === "string" ? item._id : null)).filter(Boolean))];
    if (ids.length === 0) throw new CheckoutError("empty_cart", "Your cart is empty.");

    const products = await fetchFresh(groq`*[_type == "product" && _id in $ids && !(_id in path("drafts.**"))]{
        _id,
        name,
        "slug": slug.current,
        price,
        quantity,
        artist->{name, "slug": slug.current},
        productCategory->{title},
    }`, {ids});

    const byId = new Map((products || []).map((p) => [p._id, p]));
    const unavailable = [];
    const lines = [];

    for (const id of ids) {
        const product = byId.get(id);
        const price = Number(product?.price);
        // Każde dzieło jest unikatowe – w koszyku zawsze 1 sztuka (jak w interfejsie)
        if (!product || !(Number(product.quantity) > 0) || !Number.isFinite(price) || price <= 0) {
            unavailable.push(id);
            continue;
        }
        lines.push({product, qty: 1, unitAmount: Math.round(price * 100)});
    }

    if (unavailable.length) {
        throw new CheckoutError("unavailable", "Some artworks in your cart are no longer available.", 409, {unavailable});
    }

    const totalAmount = lines.reduce((sum, line) => sum + line.unitAmount * line.qty, 0);
    return {lines, totalAmount};
}

/** Tworzy zamówienie (ukryte ID) i sesję Stripe z cenami z serwera. */
export async function createCheckout({items, person, invoice, newsletter, expectedTotal}) {
    const {lines, totalAmount} = await priceCart(items);

    if (expectedTotal !== undefined && expectedTotal !== null) {
        const expected = Math.round(Number(expectedTotal) * 100);
        if (!Number.isFinite(expected) || expected !== totalAmount) {
            const prices = Object.fromEntries(lines.map((line) => [line.product._id, line.product.price]));
            throw new CheckoutError("price_changed", "Prices in your cart have changed. Please review your cart.", 409, {prices});
        }
    }

    const orderNumber = crypto.randomBytes(12).toString("hex");
    const orderId = privateId("order", orderNumber);
    const encodedNumber = encodeURIComponent(orderNumber);

    const session = await getStripe().checkout.sessions.create({
        client_reference_id: orderNumber,
        customer_email: person.email,
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lines.map((line) => ({
            price_data: {
                currency: "gbp",
                product_data: {name: line.product.name},
                unit_amount: line.unitAmount,
            },
            quantity: line.qty,
        })),
        metadata: {orderNumber},
        success_url: `${SITE_URL}/success?orderId=${encodedNumber}`,
        cancel_url: `${SITE_URL}/cancel?orderId=${encodedNumber}`,
    }, {idempotencyKey: `checkout-${orderNumber}`});

    await writeClient.create({
        _id: orderId,
        _type: "order",
        orderStatus: "new",
        orderDate: new Date().toLocaleString("en-GB", {timeZone: "UTC"}),
        orderNumber,
        personData: person,
        orderInfo: {deliveryMethod: "standard"},
        totalPrice: (totalAmount / 100).toFixed(2),
        products: lines.map((line) => ({
            _key: crypto.randomUUID(),
            id: line.product._id,
            name: line.product.name,
            slug: line.product.slug,
            author: line.product.artist?.name || "",
            authorSlug: line.product.artist?.slug || "",
            price: line.product.price,
            qty: line.qty,
            category: line.product.productCategory?.title || "",
        })),
        stripeSessionId: session.id,
        amountTotal: totalAmount,
        invoice,
        newsletter: !!newsletter,
    });

    return {orderNumber, url: session.url};
}
