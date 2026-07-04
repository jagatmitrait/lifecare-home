import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, FileText, Users } from 'lucide-react';
import LegalLinks from './components/LegalLinks';
import { API_BASE } from './config/api.js';

const MAX_RESUME_SIZE = 10 * 1024 * 1024;

export default function NursingCareers() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', experience: '', coverLetter: '', agree: false });
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState({ loading: false, success: null, message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_RESUME_SIZE) {
      e.target.value = '';
      setResume(null);
      setStatus({ loading: false, success: false, message: 'Resume must be 10 MB or smaller.' });
      return;
    }
    setResume(file);
    setStatus({ loading: false, success: null, message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.role || !resume || !form.agree) {
      setStatus({ loading: false, success: false, message: 'Please fill all required fields and attach your resume.' });
      return;
    }
    setStatus({ loading: true, success: null, message: '' });

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 70000);

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('role', form.role);
      fd.append('experience', form.experience);
      fd.append('coverLetter', form.coverLetter);
      fd.append('agree', form.agree ? 'true' : 'false');
      fd.append('resume', resume);

      const res = await fetch(`${API_BASE}/forms/careers/apply`, {
        method: 'POST',
        body: fd,
        signal: controller.signal,
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (e) { /* ignore parse error */ }
      if (!res.ok) throw new Error(data.message || `Server error (${res.status})`);
      setStatus({ loading: false, success: true, message: data.message || 'Application submitted. Thank you!' });
      setForm({ name: '', email: '', phone: '', role: '', experience: '', coverLetter: '', agree: false });
      setResume(null);
    } catch (err) {
      const message = err.name === 'AbortError'
        ? 'Submission timed out. Please check your connection and try again.'
        : err.message || 'Submission failed';
      setStatus({ loading: false, success: false, message });
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B4B8A] focus:ring-1 focus:ring-[#1B4B8A]';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-50 to-white pt-14 pb-20 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">Nursing Careers</h1>
          <p className="text-gray-600 max-w-2xl">Join LifeCare Polyclinic — we're hiring compassionate and skilled nursing professionals. Explore roles for General Duty Nurses, General Duty Assistants and Critical Care Nurses.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Why Join LifeCare Polyclinic</h2>
          <ul className="text-gray-700 space-y-3 list-disc pl-5">
            <li>Meaningful work delivering high-quality care at patients' homes.</li>
            <li>Structured training, clinical supervision and career growth.</li>
            <li>Competitive pay, flexible shifts and supportive team culture.</li>
            <li>Access to modern clinical protocols and continuous learning.</li>
          </ul>

          <div className="mt-8">
            <h3 className="font-bold text-lg text-blue-900 mb-3">Open Roles</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">General Duty Nurse (GDN)</h4>
                <p className="text-sm text-gray-600">Provides bedside nursing, wound care, medication administration, basic monitoring and mobility assistance.</p>
                <p className="text-sm text-gray-700 mt-2 font-semibold">Qualifications:</p>
                <ul className="text-sm text-gray-600 pl-5 list-disc">
                  <li>GNM / BSc Nursing</li>
                  <li>1+ years experience preferred</li>
                  <li>Compassionate, reliable, good communication</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">General Duty Assistant (GDA)</h4>
                <p className="text-sm text-gray-600">Assist nurses with ADLs, transfers, monitoring, and basic clinical tasks under supervision.</p>
                <p className="text-sm text-gray-700 mt-2 font-semibold">Qualifications:</p>
                <ul className="text-sm text-gray-600 pl-5 list-disc">
                  <li>Certificate in nursing assistance or relevant experience</li>
                  <li>Patient-centred and dependable</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Critical Care Nurse (CCN)</h4>
                <p className="text-sm text-gray-600">Experienced in high-dependency care: monitoring, IV therapy, oxygen management and post-ICU support.</p>
                <p className="text-sm text-gray-700 mt-2 font-semibold">Qualifications:</p>
                <ul className="text-sm text-gray-600 pl-5 list-disc">
                  <li>BSc Nursing / GNM with critical care experience</li>
                  <li>ICU / emergency care experience preferred</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-lg text-blue-900 mb-3">Our Recruitment Process</h3>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Application review by HR</li>
              <li>Phone screening</li>
              <li>Clinical assessment / interview</li>
              <li>Onboarding and training</li>
            </ol>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-lg text-blue-900 mb-3">Employee Benefits</h3>
            <ul className="pl-5 list-disc text-gray-700">
              <li>Competitive salary</li>
              <li>Paid leave and insurance</li>
              <li>Continuous training & certification support</li>
              <li>Supportive, growth-oriented workplace</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Apply Now</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full name <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role Applying For <span className="text-red-500">*</span></label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass} required>
                <option value="">Select role</option>
                <option value="General Duty Nurse">General Duty Nurse (GDN)</option>
                <option value="General Duty Assistant">General Duty Assistant (GDA)</option>
                <option value="Critical Care Nurse">Critical Care Nurse (CCN)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (years)</label>
              <input name="experience" value={form.experience} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Letter</label>
              <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={4} className={inputClass}></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Resume (PDF / DOC) <span className="text-red-500">*</span></label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="block w-full text-sm text-gray-600" required />
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 10 MB.</p>
            </div>

            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm text-gray-700">I agree to the terms and privacy policy.</span>
            </label>

            <div>
              <button type="submit" disabled={status.loading} className="w-full bg-blue-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-800">
                {status.loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>

            {status.message && (
              <div className={`text-sm p-3 rounded ${status.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{status.message}</div>
            )}

            <p className="text-xs text-gray-500 mt-3">Applications are sent to our recruitment team. We do not store application data in a database.</p>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-blue-900 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3 text-gray-700">
            <div>
              <strong>Q:</strong> How long before I hear back?
              <p>A: Our HR team typically responds within 5-7 business days.</p>
            </div>
            <div>
              <strong>Q:</strong> Are there full-time and part-time roles?
              <p>A: Yes — we offer flexible shift options depending on the role and location.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
