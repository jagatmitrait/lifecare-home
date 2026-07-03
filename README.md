# LifeCare Polyclinic — Home Care Services (Standalone)

This is a standalone extract of the **Home Care Services** feature from the
LifeCare Polyclinic website: the Home Care Services page, the "Book Home
Visit" form, the "Book Tele-Consult" (paid slot booking with Cashfree
payments) flow, and an "About Us" page.

## What's included

- `/` and `/services/home-care` — Home Care Services landing page
- `/about` — About Us page
- `/home-visit` — Book Home Visit form
- `/book-slot` — Book Tele-Consult (select department, date, time, pay via
  Cashfree UPI checkout)
- `/booking-status` — payment confirmation / status page (where Cashfree
  redirects back to after checkout)
- `/terms`, `/privacy` — legal pages linked from the forms
- A minimal Express backend (`/server`) with:
  - form email routes (Home Visit)
  - tele-consult slot booking + Cashfree payment routes
  - MongoDB-backed double-booking protection

## How each feature sends data

**Home Visit form** uses `src/utils/submitForm.js`, which tries, in order:
1. Web3Forms (if `VITE_WEB3FORMS_ACCESS_KEY` is set) — no backend needed.
2. `formsubmit.co` fallback in production builds — no backend needed.
3. Your local backend at `/api/forms/:formType` in development.

**Tele-Consult booking** always needs the backend, because it creates a real
Cashfree payment order and needs MongoDB to prevent two people booking the
same slot. See "Configuration" below.

## Quick start (frontend only — Home Care page, About Us, Home Visit form)

```bash
npm install
npm run dev
```

## Quick start (frontend + backend, needed for Tele-Consult booking)

```bash
npm install
cd server && npm install && cd ..
npm run dev:all
```

Or run them separately:

```bash
npm run dev:server   # API on :8080
npm run dev          # frontend on :5173
```

## Configuration

Copy the example env files and fill in what you need:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

### Home Visit form (optional, works without a backend)
Get a free access key at https://web3forms.com and set
`VITE_WEB3FORMS_ACCESS_KEY` in `.env` — or for a backend + Gmail SMTP set
`USE_SMTP_ON_SERVER=true` and `SMTP_USER`/`SMTP_PASS` in `server/.env`
(use a Gmail App Password).

### Tele-Consult booking (required for `/book-slot` to work)
1. **MongoDB** — create a free cluster at https://www.mongodb.com/atlas and
   put the connection string in `server/.env` as `MONGODB_URI`.
2. **Cashfree** — sign up at https://www.cashfree.com, grab your **sandbox**
   App ID / Secret Key from the dashboard, and set in `server/.env`:
   ```
   CASHFREE_APP_ID=...
   CASHFREE_SECRET_KEY=...
   CASHFREE_ENV=sandbox
   ```
   In the Cashfree dashboard, also set the webhook URL to
   `https://<your-backend>/api/payments/webhook` (Settings → Webhooks →
   Payments) so bookings get confirmed reliably even if the customer closes
   the tab.
3. When you're ready to accept real payments, switch to live keys, set
   `CASHFREE_ENV=production` in `server/.env`, and `VITE_CASHFREE_MODE=production`
   in `.env`.
4. Email confirmations to the clinic + patient use the same SMTP/Web3Forms
   setup as the Home Visit form (see above).

## Production build

```bash
npm run build
```

Outputs static files to `dist/` — upload to any static host (Hostinger,
Vercel, Netlify, etc.). Deploy `/server` separately (Render, Railway, etc.)
and point `VITE_API_URL` in `.env` at it before building, e.g.:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Project structure

```
├── src/
│   ├── homecare.jsx          # Home Care Services page
│   ├── about.jsx              # About Us page
│   ├── HomeVisitForm.jsx     # Book Home Visit form
│   ├── BookSlot.jsx           # Book Tele-Consult form + Cashfree checkout
│   ├── BookingStatus.jsx      # Payment status / confirmation page
│   ├── TreatmentDetails.jsx  # "Learn More" detail page (incl. Home Lab KPI cards)
│   ├── TermsAndConditions.jsx
│   ├── PrivacyPolicy.jsx
│   ├── Navbar.jsx / Footer.jsx / Logo.jsx
│   ├── components/           # LegalLinks, LegalPageLayout
│   ├── config/api.js         # API base URL resolution
│   ├── utils/submitForm.js   # Home Visit form submission (3-tier fallback)
│   ├── utils/cashfree.js     # Loads Cashfree Checkout JS SDK
│   ├── data/treatmentDetailsData.js
│   └── assets/                # Images used by the pages above
└── server/
    ├── index.js               # Express app
    └── src/
        ├── formRoutes.js      # POST /api/forms/home-visit
        ├── paymentRoutes.js   # Tele-consult slot booking + Cashfree order/webhook
        ├── cashfree.js        # Cashfree API client + webhook signature check
        ├── models/SlotBooking.js  # Mongoose model (double-booking guard)
        ├── db.js              # MongoDB connection
        ├── mail.js            # Email sending (SMTP / Web3Forms / FormSubmit)
        └── cors.js            # CORS config
```
