import mongoose from "mongoose";
import dns from "dns";

// Use Cloudflare DNS for MongoDB Atlas SRV lookups
dns.setServers(["1.1.1.1", "1.0.0.1"]);

console.log("DNS Servers:", dns.getServers());

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  console.log("connectDB() called. URI present:", Boolean(MONGODB_URI));

  if (MONGODB_URI) {
    console.log("URI starts with:", MONGODB_URI.slice(0, 20) + "...");
  }

  if (!MONGODB_URI) {
    console.warn(
      "Warning: MONGODB_URI not set — slot availability checks will fail.",
    );
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected. ✅");
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error.message);

    if (error.cause) {
      console.error("Cause:", error.cause);
    }
  }
}

// Connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected.");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose runtime connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected.");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
