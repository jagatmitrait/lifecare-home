import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createCorsOptions } from "./src/cors.js";
import formRoutes from "./src/formRoutes.js";
import paymentRoutes from "./src/paymentRoutes.js";
import { connectDB } from "./src/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Server-only credentials live beside this file. Shared project settings may
// still be supplied by the root .env file.
dotenv.config({ path: join(__dirname, ".env") });
dotenv.config({ path: join(__dirname, "..", ".env") });

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors(createCorsOptions()));

// Capture the raw request body so the Cashfree webhook signature can be
// verified against the exact bytes Cashfree sent (re-serialized JSON won't match).
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ service: "LifeCare Home Care API", status: "running" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "running" });
});

app.use("/api/forms", formRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/test-email", async (_req, res) => {
  try {
    const { sendFormEmail } = await import("./src/mail.js");
    await sendFormEmail("Test Email — LifeCare Home Care Forms", {
      message: "SMTP / email delivery is working correctly!",
      timestamp: new Date().toISOString(),
    });
    res.json({ success: true, message: "Test email sent!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const host = process.env.HOST || "0.0.0.0";

connectDB().finally(() => {
  app.listen(PORT, host, () => {
    console.log(`LifeCare Home Care API running on http://${host}:${PORT}`);
    if (process.env.FRONTEND_URL) {
      console.log(`CORS allowed for: ${process.env.FRONTEND_URL}`);
    }
  });
});
