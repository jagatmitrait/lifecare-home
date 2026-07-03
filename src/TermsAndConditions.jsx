import LegalPageLayout from './components/LegalPageLayout';

export default function TermsAndConditions() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using LifeCare Polyclinic services."
    >
      <section className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <p>
          Welcome to <strong className="text-[#1B4B8A]">LifeCare Polyclinic & Home Care Services</strong> (“LifeCare”, “we”, “us”, or “our”).
          By accessing our website, booking appointments, submitting forms, or using our medical and home care services,
          you agree to be bound by these Terms & Conditions.
        </p>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">1. Services</h2>
          <p>
            LifeCare provides outpatient consultations, diagnostic services, home visit care, physiotherapy, nursing,
            and related healthcare services at our facility located at DG-3/29, Charak Sadan road, Vikaspuri, New Delhi,
            and at patients’ homes where applicable. Services are subject to availability and medical suitability.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">2. Appointments & Home Visits</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Online appointment and home visit requests are subject to confirmation by our team.</li>
            <li>Please provide accurate personal and medical information when booking.</li>
            <li>We reserve the right to reschedule or cancel appointments due to emergencies, doctor availability, or safety concerns.</li>
            <li>Cancellation policies may apply for confirmed home visits; our team will inform you at the time of confirmation.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">3. Fees & Payment</h2>
          <p>
            Consultation fees, procedure costs, and home care packages will be communicated at the time of booking or
            during your visit. Payment terms accepted at the clinic include cash, UPI, and other methods as displayed
            at reception. You are responsible for any charges agreed upon for services rendered.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">4. Medical Disclaimer</h2>
          <p>
            Information on this website and through our chatbot is for general guidance only and does not replace
            professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician
            with questions regarding a medical condition. In case of emergency, call our 24x7 helpline{' '}
            <a href="tel:+919220783535, +919220783636" className="text-[#2E7D32] font-semibold">+91 92207 83535, +91 92207 83636</a> or visit the nearest emergency facility.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">5. User Conduct</h2>
          <p>You agree not to misuse our website, submit false information, harass staff, or use our services for unlawful purposes.</p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">6. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, LifeCare shall not be liable for indirect or consequential damages arising
            from use of the website. Our liability for clinical services is governed by applicable medical laws and
            professional standards of care.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">7. Intellectual Property</h2>
          <p>
            All content on this website, including logos, text, and images, is owned by LifeCare or its licensors
            and may not be copied without written permission.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">8. Changes to Terms</h2>
          <p>
            We may update these Terms & Conditions from time to time. Continued use of our services after changes
            constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">9. Governing Law</h2>
          <p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in New Delhi.</p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">10. Contact</h2>
          <p>
            For questions about these terms, contact us at{' '}
            <a href="mailto:info@lifecarepolyclinic.com" className="text-[#2E7D32] font-semibold">info@lifecarepolyclinic.com</a>
            {' '}or call <a href="tel:+919220783535, +919220783636" className="text-[#2E7D32] font-semibold">+91 92207 83535, +91 92207 83636</a>.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
