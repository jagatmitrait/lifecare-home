import mongoose from "mongoose";

const slotBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    dept: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    slotDuration: { type: String },
    slotCharge: { type: Number },
    orderId: { type: String },
    meetLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

// The actual double-booking guard: MongoDB itself rejects a second confirmed
// booking for the same doctor + date + time, even under concurrent requests.
slotBookingSchema.index(
  { dept: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: "confirmed" } },
);

export default mongoose.model("SlotBooking", slotBookingSchema);
