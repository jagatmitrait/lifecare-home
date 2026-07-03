import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Phone } from 'lucide-react';
import { API_BASE } from './config/api.js';

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20; // ~60s of polling before telling the user it's taking a while

export default function BookingStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('checking'); // checking | paid | pending | failed | error
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(`${API_BASE}/payments/status/${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Could not verify payment status.');
        }

        setDetails(data);

        if (data.status === 'PAID') {
          setStatus('paid');
          return; // done — stop polling
        }
        if (['EXPIRED', 'TERMINATED', 'TERMINATION_REQUESTED'].includes(data.status)) {
          setStatus('failed');
          return;
        }

        // Still ACTIVE — payment is mid-flight or the webhook hasn't landed yet. Keep checking.
        if (attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setStatus('pending');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [orderId]);

  const displayStatus = orderId ? status : 'error';

  if (displayStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[#1B4B8A]" size={40} />
          <h2 className="text-xl font-bold text-[#1B4B8A] mb-2">Verifying your payment...</h2>
          <p className="text-gray-500 text-sm">This usually takes just a few seconds.</p>
        </div>
      </div>
    );
  }

  if (displayStatus === 'paid') {
    const t = details?.tags || {};
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-[#2E7D32] mb-2">Your Slot is Booked!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Thank you{t.name ? `, ${t.name}` : ''}! Payment received and your slot is confirmed.
          </p>
       <div className="bg-gray-50 rounded-xl p-5 text-left text-sm space-y-2 mb-6">
            {t.dept && <div className="flex justify-between"><span className="text-gray-500">Department:</span><span className="font-semibold">{t.dept}</span></div>}
            {t.date && <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-semibold">{t.date}</span></div>}
            {t.time && <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-semibold">{t.time}</span></div>}
            {t.slotDuration && <div className="flex justify-between"><span className="text-gray-500">Slot:</span><span className="font-semibold">{t.slotDuration}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Amount Paid:</span><span className="font-bold text-[#2E7D32]">₹{details.amount?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Order ID:</span><span className="font-semibold text-xs">{orderId}</span></div>
          </div>

         {(() => {
            const t = details?.tags || {};
            const meetLink = details?.meetLink ||
              (t.dept && t.date && t.time && orderId
                ? `https://meet.google.com/new?hs=202&roomId=lifecare-${[t.dept, t.date, t.time, orderId].join('-').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,60)}`
                : null);
            if (!meetLink) return null;
            return (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5 mb-6 text-center">
                <p className="text-green-800 font-bold text-sm mb-1">🎥 Your Google Meet Link</p>
                <p className="text-gray-600 text-xs mb-3">Join this link at your appointment time to consult with the doctor</p>
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#1B4B8A] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#163d73] transition-colors"
                >
                  Join Meet
                </a>
                <p className="text-gray-400 text-[10px] mt-2 break-all">{meetLink}</p>
              </div>
            );
          })()}

          <p className="text-xs text-gray-500 mb-4 text-center">
            A confirmation email with the Meet link has been sent to your email address.
          </p>

          <Link to="/book-slot" className="block w-full bg-[#1B4B8A] text-white py-3 rounded-xl font-semibold hover:bg-[#163d73] transition-colors text-center">
            Book Another Slot
          </Link>
        </div>
      </div>
    );
  }

  if (displayStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-[#1B4B8A] mb-2">Still confirming your payment</h2>
          <p className="text-gray-500 text-sm mb-6">
            This is taking longer than usual. If money was deducted, your slot will still be
            confirmed automatically — refresh this page in a minute, or call us with your Order ID.
          </p>
          <p className="text-xs text-gray-400 mb-6">Order ID: {orderId}</p>
          <a href="tel:+919220783535" className="flex items-center justify-center gap-2 bg-[#1B4B8A] text-white py-3 rounded-xl font-semibold hover:bg-[#163d73] transition-colors">
            <Phone size={16} /> Call +91 92207 83535
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-red-600 mb-2">
          {displayStatus === 'failed' ? 'Payment Not Completed' : 'Something Went Wrong'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {displayStatus === 'failed'
            ? "It looks like the payment wasn't completed or the session expired."
            : "We couldn't verify your payment status."}{' '}
          Please try booking again, or call us if money was deducted from your account.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/book-slot" className="block w-full bg-[#1B4B8A] text-white py-3 rounded-xl font-semibold hover:bg-[#163d73] transition-colors">
            Try Again
          </Link>
          <a href="tel:+919220783535" className="flex items-center justify-center gap-2 border-2 border-[#1B4B8A] text-[#1B4B8A] py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            <Phone size={16} /> Call +91 92207 83535
          </a>
        </div>
      </div>
    </div>
  );
}
