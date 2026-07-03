import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import SlotBooking from "./models/SlotBooking.js";
import {
  createCashfreeOrder,
  getCashfreeOrder,
  verifyCashfreeWebhookSignature,
} from "./cashfree.js";
import { sendFormEmail, sendPatientConfirmationEmail } from "./mail.js";

const router = Router();

// Single source of truth for slot pricing — mirrors slotOptions in src/BookSlot.jsx.
// Keeping it here means the browser can never influence the amount that gets charged.
const SLOT_PRICING = {
  "5 min": 1000,
  "15 min": 1500,
};
function generateMeetLink(dept, date, time, orderId) {
  const slug = [dept, date, time, orderId]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 60);
  return `https://meet.google.com/new?hs=202&roomId=lifecare-${slug}`;
}
function cleanFrontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(
    /\/$/,
    "",
  );
}


function cleanBackendUrl(req) {
  // Falls back to inferring from the incoming request if BACKEND_URL isn't set —
  // works for most single-service deployments (Render, Railway, etc.)
  if (process.env.BACKEND_URL)
    return process.env.BACKEND_URL.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

router.post("/create-order", async (req, res) => {
  try {
    const { name, mobile, email, dept, date, time, slotDuration, reason } =
      req.body;

    if (!name?.trim() || !mobile?.trim() || !dept?.trim() || !date || !time) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields." });
    }

    const amount = SLOT_PRICING[slotDuration];
    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Please select a valid slot." });
    }

    // Block at creation time too — without this, two people can both reach
    // "Proceed to Payment" for the same already-confirmed slot, even though
    // the dropdown greyed it out (e.g. stale page, or they never refetched).
    const existing = await SlotBooking.findOne({
      dept: dept.trim(),
      date: String(date),
      time: String(time),
      status: "confirmed",
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Sorry, this slot was just booked by someone else. Please choose another time.",
      });
    }

    const orderId = `LCP${Date.now()}${uuidv4().slice(0, 6)}`;

    const order = await createCashfreeOrder({
      orderId,
      amountInRupees: amount,
      customerId: mobile.trim(),
      customerName: name.trim(),
      customerPhone: mobile.trim(),
      customerEmail: email?.trim() || undefined,
      returnUrl: `${cleanFrontendUrl()}/booking-status?order_id={order_id}`,
      notifyUrl: `${cleanBackendUrl(req)}/api/payments/webhook`,
      note: `Slot booking — ${dept.trim()}`,
      tags: {
        name: name.trim().slice(0, 50),
        mobile: mobile.trim().slice(0, 50),
        email: (email || "").trim().slice(0, 50),
        dept: dept.trim().slice(0, 50),
        date: String(date).slice(0, 50),
        time: String(time).slice(0, 50),
        slotDuration,
        reason: (reason || "").trim().slice(0, 50),
      },
    });

    // Also fetch meetLink from DB
   res.json({
      success: true,
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount,
    });
  } catch (error) {
    console.error("CASHFREE CREATE ORDER ERROR:", error.message);
    res.status(500).json({
      success: false,
      message:
        "Could not start payment right now. Please try again or call +91 92207 83535.",
    });
  }
});

// GET /api/payments/booked-slots?dept=Paediatrics&date=2026-06-25
// Frontend calls this whenever dept/date changes, to grey out taken times.
router.get("/booked-slots", async (req, res) => {
  try {
    const { dept, date } = req.query;
    if (!dept || !date) {
      return res
        .status(400)
        .json({ success: false, message: "dept and date are required." });
    }

    const bookings = await SlotBooking.find(
      { dept, date, status: "confirmed" },
      { time: 1, _id: 0 },
    );

    res.json({ success: true, bookedTimes: bookings.map((b) => b.time) });
  } catch (error) {
    console.error("BOOKED SLOTS LOOKUP ERROR:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch slot availability." });
  }
});

// Polled by the booking-status page after the user is redirected back from Cashfree.
// This is what actually decides whether to show "your slot is booked" — never trust
// query params alone, since a return_url can be hit without a real payment.
router.get("/status/:orderId", async (req, res) => {
  try {
    const order = await getCashfreeOrder(req.params.orderId);
    const booking = await SlotBooking.findOne(
      { orderId: req.params.orderId },
      { meetLink: 1 }
    );
    res.json({
      success: true,
      status: order.order_status,
      amount: order.order_amount,
      tags: order.order_tags || {},
      meetLink: booking?.meetLink || '',
    });
  } catch (error) {
    console.error("CASHFREE STATUS ERROR:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Could not check payment status." });
  }
});

// Cashfree calls this server-to-server the moment a payment settles — this is the
// reliable path (works even if the customer closes the browser tab before being
// redirected back). Configure this exact URL in the Cashfree dashboard too:
// Settings → Webhooks → Payments → https://<your-backend>/api/payments/webhook
router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = req.rawBody; // captured in index.js, see express.json({ verify })

    if (!verifyCashfreeWebhookSignature({ rawBody, timestamp, signature })) {
      console.warn("CASHFREE WEBHOOK: signature did not match — ignoring.");
      return res.status(401).json({ success: false });
    }

    const event = req.body;
    const orderId = event?.data?.order?.order_id;
    const paymentStatus = event?.data?.payment?.payment_status;

    if (
      event?.type === "PAYMENT_SUCCESS_WEBHOOK" &&
      paymentStatus === "SUCCESS" &&
      orderId
    ) {
      // The webhook payload's own order_tags is often null — fetch the order to get it reliably.
      const order = await getCashfreeOrder(orderId);
      const t = order.order_tags || {};

      try {
        // THIS is the line that actually persists the booking so future
        // lookups (booked-slots route, create-order guard) can see it.
        await SlotBooking.create({
          name: t.name || "Not provided",
          mobile: t.mobile || "Not provided",
          email: t.email || undefined,
          dept: t.dept,
          date: t.date,
          time: t.time,
          slotDuration: t.slotDuration,
          slotCharge: order.order_amount,
          orderId,
          status: "confirmed",
        });

    const meetLink = generateMeetLink(t.dept, t.date, t.time, orderId);

        // 1. Email to clinic
        sendFormEmail(
          "New Slot Booking — LifeCare Polyclinic (Paid via Cashfree)",
          {
            name: t.name || "Not provided",
            mobile: t.mobile || "Not provided",
            email: t.email || "Not provided",
            department: t.dept || "Not provided",
            preferredDate: t.date || "Not provided",
            preferredTime: t.time || "Not provided",
            slotDuration: t.slotDuration || "Not provided",
            reasonForVisit: t.reason || "Not provided",
            amountPaid: `₹${order.order_amount}`,
            cashfreeOrderId: orderId,
            bookingType: "Slot Booking (Paid)",
            googleMeetLink: meetLink,
          },
        ).catch((err) =>
          console.error("Clinic email failed:", err.message),
        );

        // 2. Email to patient
        if (t.email) {
          sendPatientConfirmationEmail({
            to: t.email,
            patientName: t.name,
            dept: t.dept,
            date: t.date,
            time: t.time,
            slotDuration: t.slotDuration,
            amountPaid: order.order_amount?.toLocaleString(),
            orderId,
            meetLink,
          }).catch((err) =>
            console.error("Patient email failed:", err.message),
          );
        }

        // 3. Store meetLink in DB for the status page to retrieve
        await SlotBooking.updateOne({ orderId }, { $set: { meetLink } });
        
      } catch (err) {
        if (err.code === 11000) {
          // Someone else paid for and confirmed this exact dept+date+time first.
          // Money was already collected from THIS customer too — flag for refund,
          // don't silently drop it.
          console.error(
            `DOUBLE-BOOKING CONFLICT: order ${orderId} paid but slot ${t.dept} ${t.date} ${t.time} was already taken. Manual refund needed.`,
          );
          sendFormEmail("URGENT: Slot Booking Conflict — Refund Needed", {
            name: t.name || "Not provided",
            mobile: t.mobile || "Not provided",
            department: t.dept || "Not provided",
            preferredDate: t.date || "Not provided",
            preferredTime: t.time || "Not provided",
            cashfreeOrderId: orderId,
            amountPaid: `₹${order.order_amount}`,
            note: "This slot was already booked by someone else moments earlier. Customer paid successfully — please refund and contact them to rebook.",
          }).catch((e) =>
            console.error("Conflict alert email failed:", e.message),
          );
        } else {
          console.error("SLOT BOOKING SAVE ERROR:", err.message);
        }
      }
    }

    // Acknowledge everything else (FAILED, USER_DROPPED, etc.) too — Cashfree just
    // needs a 200 OK or it will keep retrying the same webhook.
    res.json({ success: true });
  } catch (error) {
    console.error("CASHFREE WEBHOOK ERROR:", error.message);
    res.status(500).json({ success: false });
  }
});

export default router;
