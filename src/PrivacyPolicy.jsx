import LegalPageLayout from './components/LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How LifeCare Polyclinic collects, uses, and protects your personal information."
    >
      <section className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <p>
          <strong className="text-[#1B4B8A]">LifeCare Polyclinic & Home Care Services</strong> (“LifeCare”) is committed
          to protecting your privacy. This policy explains how we handle information when you use our website, submit forms,
          book appointments, or receive care from us.
        </p>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contact forms:</strong> name, mobile number, email, subject, and message.</li>
            <li><strong>Appointment forms:</strong> name, contact details, date of birth, department, preferred date/time, and health-related notes you provide.</li>
            <li><strong>Home visit forms:</strong> patient details, address, caregiver contact, medical history, symptoms, medications, and allergies.</li>
            <li><strong>Website usage:</strong> basic technical data such as browser type and pages visited (where analytics are enabled).</li>
            <li><strong>Chatbot:</strong> messages you send to our assistant for triage and support (session-based).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To respond to enquiries and confirm appointments or home visits.</li>
            <li>To provide medical and home care services you request.</li>
            <li>To contact you regarding your booking, follow-up care, or billing.</li>
            <li>To improve our website and patient experience.</li>
            <li>To comply with legal and regulatory obligations.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">3. Sharing of Information</h2>
          <p>
            We do not sell your personal data. We may share information only with authorised staff, healthcare providers
            involved in your care, service partners necessary for home visits or diagnostics, and authorities when
            required by law.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">4. Data Security</h2>
          <p>
            We take reasonable technical and organisational measures to protect your data. Form submissions are
            transmitted securely to our systems. No method of transmission over the internet is 100% secure; we
            encourage you to share only information necessary for your request.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">5. Data Retention</h2>
          <p>
            We retain personal and medical records as needed to provide care, meet legal requirements, and maintain
            accurate health documentation. Enquiry data is kept for a reasonable period to handle follow-ups.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">6. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of personal information we hold (subject to medical record
            retention rules). To exercise these rights, email{' '}
            <a href="mailto:info@lifecarepolyclinic.com" className="text-[#2E7D32] font-semibold">info@lifecarepolyclinic.com</a>
            {' '}or visit our clinic.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">7. Cookies</h2>
          <p>
            Our website may use essential cookies for functionality. If we use analytics cookies in the future,
            we will update this policy accordingly.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">8. Third-Party Services</h2>
          <p>
            We may use third-party services for email delivery, maps, or AI-assisted chat. These providers process
            data only as needed to perform their function and under appropriate safeguards.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">9. Children’s Privacy</h2>
          <p>
            Paediatric services may involve information about minors provided by parents or guardians. Such information
            is handled with extra care and only for legitimate healthcare purposes.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. The “Last updated” date at the top reflects the latest revision.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1B4B8A] mb-2">11. Contact Us</h2>
          <p>
            <strong>LifeCare Polyclinic & Home Care Services</strong><br />
            DG-3/29, Charak Sadan road, Vikaspuri, New Delhi<br />
            Email: <a href="mailto:info@lifecarepolyclinic.com" className="text-[#2E7D32] font-semibold">info@lifecarepolyclinic.com</a><br />
            Phone: <a href="tel:+919220783535, +919220783636" className="text-[#2E7D32] font-semibold">+91 92207 83535, +91 92207 83636</a>
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
