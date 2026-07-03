import { Link } from 'react-router-dom';

export default function LegalPageLayout({ title, subtitle, children }) {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-16">
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#1B4B8A]">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-[#1B4B8A] font-medium">{title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1B4B8A] mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
          <p className="text-xs text-gray-400 mt-3">Last updated: June 2026</p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 prose-legal">
          {children}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/terms" className="text-[#1B4B8A] font-semibold hover:underline">Terms & Conditions</Link>
          <span className="text-gray-300">|</span>
          <Link to="/privacy" className="text-[#1B4B8A] font-semibold hover:underline">Privacy Policy</Link>
          <span className="text-gray-300">|</span>
          <Link to="/contact" className="text-[#2E7D32] font-semibold hover:underline">Contact Us</Link>
        </div>
      </article>
    </div>
  );
}
