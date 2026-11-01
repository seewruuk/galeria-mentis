import "server-only";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dane GetResponse są wyłącznie po stronie serwera (wcześniej token trafiał do przeglądarki).
// Zapasowe wartości = dotychczasowa konfiguracja, żeby nie trzeba było zmieniać zmiennych na Vercelu.
const FALLBACK_CREDENTIALS = "5f33e827-ac5b-11f0-8acb-00163e45cec4:77959697040f09915ed65266bc65d5baa5c10f4e";
const FALLBACK_CAMPAIGN_ID = "XKpP3";

let cachedToken = null;

async function getAccessToken() {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

    const credentials = process.env.GET_RESPONSE_CREDENTIALS || FALLBACK_CREDENTIALS;
    const response = await fetch("https://api.getresponse.com/v3/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
        cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!data.access_token) throw new Error("GetResponse token error");

    cachedToken = {value: data.access_token, expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000};
    return cachedToken.value;
}

/** Zwraca true, jeśli adres został dodany (lub już był na liście). */
export async function subscribeToNewsletter(email) {
    if (typeof email !== "string" || email.length > 200 || !EMAIL_RE.test(email.trim())) {
        return {ok: false, reason: "invalid"};
    }
    const token = await getAccessToken();
    const response = await fetch("https://api.getresponse.com/v3/contacts", {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify({
            campaign: {campaignId: process.env.GET_RESPONSE_CAMPAIGNID || FALLBACK_CAMPAIGN_ID},
            email: email.trim(),
        }),
        cache: "no-store",
    });
    // 202 = dodano, 409 = kontakt już istnieje
    return {ok: response.status === 202 || response.status === 409, status: response.status};
}
