let cashfreePromise = null;

/** Lazily loads the Cashfree Checkout JS SDK once and reuses the same instance. */
async function getCashfree() {
  if (!cashfreePromise) {
    cashfreePromise = import("@cashfreepayments/cashfree-js").then(({ load }) =>
      load({
        mode:
          import.meta.env.VITE_CASHFREE_MODE === "production"
            ? "production"
            : "sandbox",
      }),
    );
  }
  return cashfreePromise;
}

/**
 * Opens Cashfree's hosted checkout for the given payment session.
 * Because payment_methods was restricted to "upi" when the order was created,
 * this page shows a scan-and-pay QR code plus UPI-app intent links.
 * redirectTarget: '_self' means the browser navigates away and Cashfree sends the
 * customer back to your return_url once the payment finishes.
 */
export async function openCashfreeCheckout(paymentSessionId) {
  const cashfree = await getCashfree();
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
}
