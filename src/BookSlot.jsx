import { useState, useEffect } from "react";
import bannerSlot from "./assets/book_your_slot.png";
import {
  User,
  Phone,
  Mail,
  ChevronDown,
  CalendarCheck,
  Clock,
  Loader2,
} from "lucide-react";
import LegalLinks from "./components/LegalLinks";
import { API_BASE } from "./config/api.js";
import { openCashfreeCheckout } from "./utils/cashfree.js";

const departments = [
  "General Medicine",
  "Psychiatry",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "General Family Physician",
  "Cosmetology & Aesthetic",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Physiotherapy",
  "Dental Care",
  "Skin Care",
  "Hair Loss Treatment",
  "Geriatric Care",
];

const doctorMap = {
  Psychiatry: { name: "Dr. Nashat Usman Ghani", qualification: "Psychiatrist" },
  "Obstetrics & Gynaecology": {
    name: "Dr. Srishti Jaiswal",
    qualification: "Obstetrician & Gynaecologist",
  },
  Paediatrics: { name: "Dr. Neha Gupta", qualification: "Paediatrician" },
  "General Family Physician": {
    name: "Dr. Sarabjeet Kaur",
    qualification: "General Family Physician",
  },
  "Cosmetology & Aesthetic": {
    name: "Dr. Gaurav Aggarwal",
    qualification: "Cosmetologist & Aesthetic Physician",
  },
};

const slotOptions = [
  {
    duration: "5 min",
    charge: 1000,
    label: "5 Min Slot — ₹1,000",
    desc: "Quick consultation for follow-ups or simple queries",
  },
  {
    duration: "15 min",
    charge: 1500,
    label: "15 Min Slot — ₹1,500",
    desc: "Detailed consultation for new concerns",
  },
];

const defaultForm = {
  name: "",
  mobile: "",
  email: "",
  dob: "",
  dept: "",
  date: "",
  time: "",
  reason: "",
  agree: false,
};

// Master list of all bookable times — kept separate from the filtered/disabled version below.
const allTimes = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

export default function BookSlot() {
  const [form, setForm] = useState(defaultForm);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);

  const doctor = doctorMap[form.dept] || null;

  // Fetch already-booked times for this doctor/department + date combo,
  // every time either one changes.
  useEffect(() => {
    if (!form.dept || !form.date) {
      setBookedTimes([]);
      return;
    }
    const controller = new AbortController();

    fetch(
      `${API_BASE}/payments/booked-slots?dept=${encodeURIComponent(form.dept)}&date=${form.date}`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookedTimes(data.bookedTimes);
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          console.error("Failed to fetch booked slots", err);
      });

    return () => controller.abort();
  }, [form.dept, form.date]);

  // If the user already picked a time and it just became unavailable
  // (e.g. someone else booked it a moment ago), clear the stale selection.
  useEffect(() => {
    if (form.time && bookedTimes.includes(form.time)) {
      setForm((prev) => ({ ...prev, time: "" }));
    }
  }, [bookedTimes]);

  // Final list rendered in the dropdown: each time annotated with whether it's taken.
 // Parse a time string like "02:30 PM" into minutes since midnight for comparison
  const parseTime = (timeStr) => {
    const [time, meridiem] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Get current time in minutes if today is selected, else allow all
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isToday = form.date === todayStr;
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

  // Final list: disabled if booked OR if it's today and time has passed
  const timeOptions = allTimes.map((t) => {
    const isPast = isToday && parseTime(t) <= currentMinutes;
    const isBooked = bookedTimes.includes(t);
    const disabled = isPast || isBooked;
    const label = isBooked
      ? `${t} — Unavailable`
      : isPast
      ? `${t} — Passed`
      : t;
    return { value: t, disabled, label };
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.mobile ||
      !form.dept ||
      !form.date ||
      !form.time ||
      !selectedSlot ||
      !form.agree
    ) {
      alert(
        "Please fill all required fields, select a slot, and agree to terms.",
      );
      return;
    }

    // Check if same person already has a booking at same date+time
    const existingBookings = JSON.parse(sessionStorage.getItem('lc_my_bookings') || '[]');
    const conflict = existingBookings.find(
      (b) => b.date === form.date && b.time === form.time
    );
    if (conflict) {
      alert(`You already have a booking on ${form.date} at ${form.time} for ${conflict.dept}. Please choose a different time.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          email: form.email,
          dept: form.dept,
          date: form.date,
          time: form.time,
          reason: form.reason,
          slotDuration: selectedSlot.duration,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentSessionId) {
        throw new Error(
          data.message || "Could not start payment. Please try again.",
        );
      }

     sessionStorage.setItem(
        "lifecarePendingSlotOrder",
        JSON.stringify({
          orderId: data.orderId,
          ...form,
          slotDuration: selectedSlot.duration,
          slotCharge: selectedSlot.charge,
        }),
      );

      // Track this person's bookings to prevent double-booking at same time
      const myBookings = JSON.parse(sessionStorage.getItem('lc_my_bookings') || '[]');
      myBookings.push({ date: form.date, time: form.time, dept: form.dept });
      sessionStorage.setItem('lc_my_bookings', JSON.stringify(myBookings));

      await openCashfreeCheckout(data.paymentSessionId);
    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (isSubmitting) {
      return;
    }
    setSelectedSlot(slot);
  };

  // MAIN FORM
  return (
    <div>
      <section className="w-full">
        <img
          src={bannerSlot}
          alt="Book Your Slot"
          className="w-full object-cover"
          style={{ maxHeight: "500px" }}
        />
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-[#1B4B8A] mb-5 flex items-center gap-2">
                <CalendarCheck size={20} /> Slot Booking Details
              </h2>

              <form onSubmit={handleProceedToPayment}>
                {/* Name + Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="input-field pl-9"
                        placeholder="Enter your full name"
                      />
                      <User
                        size={14}
                        className="absolute left-3 top-3.5 text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        className="input-field pl-9"
                        placeholder="10-digit mobile number"
                      />
                      <Phone
                        size={14}
                        className="absolute left-3 top-3.5 text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        className="input-field pl-9"
                        placeholder="Enter your email"
                      />
                      <Mail
                        size={14}
                        className="absolute left-3 top-3.5 text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Date of Birth
                    </label>
                    <input
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      type="date"
                      className="input-field"
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Select Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="dept"
                      value={form.dept}
                      onChange={handleChange}
                      className="select-field pr-9"
                    >
                      <option value="">Choose a department</option>
                      {departments.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Doctor Card */}
                {doctor && (
                  <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1B4B8A] flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {doctor.name.split(" ")[1]?.[0]}
                      {doctor.name.split(" ")[2]?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#1B4B8A] text-sm">
                        {doctor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doctor.qualification}
                      </p>
                      <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        Available for booking
                      </span>
                    </div>
                  </div>
                )}

                {/* Date + Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      type="date"
                      className="input-field"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className="select-field pr-9 pl-9"
                      >
                        <option value="">Select time</option>
                        {timeOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Clock
                        size={14}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                      />
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Slot Selection */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Select Slot Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slotOptions.map((slot) => (
                      <button
                        type="button"
                        key={slot.duration}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={isSubmitting}
                        className={`border-2 rounded-xl p-4 text-left transition-all ${isSubmitting ? "cursor-not-allowed opacity-70" : ""} ${selectedSlot?.duration === slot.duration ? "border-[#1B4B8A] bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#1B4B8A] text-sm">
                            {slot.duration}
                          </span>
                          <span className="font-bold text-[#2E7D32] text-base">
                            ₹{slot.charge.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{slot.desc}</p>
                        {selectedSlot?.duration === slot.duration && (
                          <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            ✓ Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Reason / Symptoms (Optional)
                  </label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="input-field h-24 resize-none"
                    placeholder="Describe your concern briefly"
                  />
                </div>

                {/* Terms */}
              {/* Refund & Reschedule Policy */}
                <div className="mb-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-[#1B4B8A] mb-2">📋 Cancellation & Reschedule Policy</p>
                  <ul className="text-[11px] text-gray-600 space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>If you are <strong>unable to join</strong> the tele-consult, please call us at <a href="tel:+919220783535" className="text-[#1B4B8A] font-semibold underline">+91 92207 83535</a> before your appointment time.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>If the <strong>doctor is unable to join</strong>, our team will contact you and reschedule your tele-consult within <strong>24 hours</strong> at no extra charge.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Refund requests must be raised within <strong>24 hours</strong> of the missed appointment by calling <a href="tel:+919220783535" className="text-[#1B4B8A] font-semibold underline">+91 92207 83535</a>.</span>
                    </li>
                  </ul>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 mb-5">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                    id="agree"
                  />
                  <label htmlFor="agree" className="text-xs text-gray-600">
                    I agree to the{" "}
                    <LegalLinks className="text-[#2E7D32] underline" />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full justify-center py-4 text-base flex items-center gap-2 rounded-xl text-white font-bold transition-colors ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#1B4B8A] hover:bg-[#163d73]"}`}
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <CalendarCheck size={20} />
                  )}
                  {isSubmitting
                    ? "Opening Secure Payment..."
                    : "Proceed to Payment"}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-sm text-[#1B4B8A] mb-4">
                Slot Charges
              </h3>
              {slotOptions.map((s) => (
                <div
                  key={s.duration}
                  className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-bold text-xs text-[#1B4B8A]">
                      {s.duration} Slot
                    </p>
                    <p className="text-[11px] text-gray-500">{s.desc}</p>
                  </div>
                  <span className="font-bold text-[#2E7D32]">
                    ₹{s.charge.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-sm text-[#1B4B8A] mb-4">
                Our Doctors
              </h3>
              {Object.values(doctorMap).map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B4B8A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {d.name.split(" ")[1]?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B4B8A]">{d.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {d.qualification}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1B4B8A] text-white rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-1">Need Help?</h3>
              <p className="text-blue-200 text-xs mb-3">
                Call us for assistance
              </p>
              <a
                href="tel:+919220783535"
                className="flex items-center gap-2 text-white font-bold text-base hover:text-green-300 transition-colors"
              >
                <Phone size={18} /> +91 92207 83535
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
