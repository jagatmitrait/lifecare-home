import crypto from "crypto";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_ENV = (process.env.CASHFREE_ENV || "sandbox").toLowerCase();
const CASHFREE_API_VERSION = "2023-08-01";

const BASE_URL =
  CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

function assertConfigured() {
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    throw new Error(
      "Cashfree is not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in your .env file.",
    );
  }
}

function cashfreeHeaders() {
  return {
    "Content-Type": "application/json",
    "x-client-id": CASHFREE_APP_ID,
    "x-client-secret": CASHFREE_SECRET_KEY,
    "x-api-version": CASHFREE_API_VERSION,
  };
}

/**
 * Creates a Cashfree order. The amount is decided entirely on the server —
 * never trust an amount sent from the browser.
 *
 * `tags` (order_tags) lets us stash the booking details (name, dept, date...)
 * on the Cashfree order itself, so the webhook can retrieve them later
 * without needing a database.
 */
export async function createCashfreeOrder({
  orderId,
  amountInRupees,
  customerId,
  customerName,
  customerPhone,
  customerEmail,
  returnUrl,
  notifyUrl,
  note,
  tags,
}) {
  assertConfigured();

  const payload = {
    order_id: orderId,
    order_amount: amountInRupees,
    order_currency: "INR",
    customer_details: {
      customer_id: customerId,
      customer_name: customerName || undefined,
      customer_phone: customerPhone,
      customer_email: customerEmail || undefined,
    },
    order_meta: {
      return_url: returnUrl, // must contain the literal placeholder {order_id}
      notify_url: notifyUrl, // webhook URL — can also be set from the Cashfree dashboard instead
      // Restrict checkout to UPI only, so the customer always lands on a scan-and-pay QR
      // (plus UPI-app intent links). Remove this line if you also want cards/netbanking.
      payment_methods: "upi",
    },
    order_note: note,
    order_tags: tags, // up to 10 string key/value pairs, max ~50 chars each
  };

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: cashfreeHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message || `Cashfree order creation failed (HTTP ${res.status})`,
    );
  }
  return data; // contains payment_session_id, order_id, order_status, ...
}

/** Fetches the current state of an order — the source of truth for "did they actually pay". */
export async function getCashfreeOrder(orderId) {
  assertConfigured();
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: cashfreeHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.message || `Could not fetch Cashfree order (HTTP ${res.status})`,
    );
  }
  return data;
}

/**
 * Verifies the `x-webhook-signature` header Cashfree sends with every webhook.
 *
 * IMPORTANT: `rawBody` must be the exact, unparsed request body (the raw string/bytes
 * Cashfree sent), not the JSON-parsed object — re-serializing it changes the bytes
 * and the signature will never match. See index.js for how rawBody is captured.
 */
export function verifyCashfreeWebhookSignature({
  rawBody,
  timestamp,
  signature,
}) {
  if (!CASHFREE_SECRET_KEY || !rawBody || !timestamp || !signature)
    return false;

  const signedPayload = timestamp + rawBody;
  const expected = crypto
    .createHmac("sha256", CASHFREE_SECRET_KEY)
    .update(signedPayload)
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false; // mismatched lengths etc. — definitely not a valid signature
  }
}

export const CASHFREE_ENVIRONMENT = CASHFREE_ENV;
