import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Users, Heart, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import homeVisitImg from './assets/Home visit.jpg';
import { submitForm } from './utils/submitForm';
import LegalLinks from './components/LegalLinks';

export default function HomeVisitForm() {
 const HV_KEY = 'lc_homevisit_form';
  const hvDefault = {
    patientName: '', age: '', gender: '', dob: '', patientPhone: '', patientEmail: '',
    address: '', contactName: '', relationship: '', contactPhone: '', contactEmail: '',
    serviceRequired: '', preferredDate: '', preferredTime: '', preferredDuration: '', preferredTimeExact: '', purpose: '', symptoms: '', nurseType: '',
    medicalConditions: '', medications: '', allergies: '', agreeToTerms: false
  };

  const [formData, setFormData] = useState(() => {
    try { const saved = sessionStorage.getItem(HV_KEY); return saved ? JSON.parse(saved) : hvDefault; } catch { return hvDefault; }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      sessionStorage.setItem(HV_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Compose payload for server: if Nursing Care, combine duration and exact time into preferredTime
      const payload = { ...formData };
      if (payload.serviceRequired === 'Nursing Care') {
        const dur = payload.preferredDuration || '';
        const exact = payload.preferredTimeExact || '';
        payload.preferredTime = dur && exact ? `${dur} - ${exact}` : (dur || exact || payload.preferredTime);
      }
      await submitForm('home-visit', payload);
      setSubmitted(true);
      sessionStorage.removeItem(HV_KEY);
      setFormData(hvDefault);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B4B8A] focus:ring-1 focus:ring-[#1B4B8A]";
  const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5";

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white pt-10 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl text-[#2E7D32]">🏡</div>
              <h1 className="text-4xl font-bold text-[#1B4B8A]">
                Home Visit <span className="text-[#2E7D32]">Request Form</span>
              </h1>
            </div>
            <p className="text-gray-600 font-medium max-w-md text-sm leading-relaxed">
              Fill in the details below and our care team will get in touch with you to confirm your home visit.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <img src={homeVisitImg} alt="Home Visit Care" className="w-full max-w-lg rounded-3xl shadow-lg object-cover h-64" />
          </div>
        </div>
      </div>

      {/* Main Form container with negative margin */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-[#2E7D32] mb-2">Request Submitted!</h2>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              Thank you! Your home visit request has been sent to our team. We will contact you within 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/services/home-care" className="px-8 py-3 rounded-xl border-2 border-[#2E7D32] text-[#2E7D32] font-bold text-sm hover:bg-green-50">
                Back to Home Care
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 rounded-xl bg-[#2E7D32] text-white font-bold text-sm hover:bg-[#256629]"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: Patient & Caregiver Info */}
            <div className="space-y-6">

              {/* Patient Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                  <User className="text-[#1B4B8A]" size={22} />
                  <h2 className="text-[#1B4B8A] font-bold text-lg">Patient Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Patient Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="patientName" placeholder="Enter patient full name" required value={formData.patientName} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Age <span className="text-red-500">*</span></label>
                    <input type="number" name="age" placeholder="Enter age" required value={formData.age} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                    <select name="gender" required value={formData.gender} onChange={handleChange} className={inputClass}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex">
                      <div className="border border-gray-200 border-r-0 rounded-l-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 shrink-0">+91</div>
                      <input type="tel" name="patientPhone" placeholder="Enter mobile number" required value={formData.patientPhone} onChange={handleChange} className={`${inputClass} rounded-l-none`} />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Email Address</label>
                    <input type="email" name="patientEmail" placeholder="Enter email address" value={formData.patientEmail} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Address for Home Visit <span className="text-red-500">*</span></label>
                    <textarea name="address" placeholder="House / Flat No., Building, Street, Area, Landmark, City, Pincode" required rows={3} value={formData.address} onChange={handleChange} className={inputClass}></textarea>
                  </div>
                </div>
              </div>

              {/* Caregiver Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                  <Users className="text-[#1B4B8A]" size={22} />
                  <h2 className="text-[#1B4B8A] font-bold text-lg">Caregiver / Contact Person Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Contact Person Name <span className="text-red-500">*</span></label>
                    <input type="text" name="contactName" placeholder="Enter contact person name" required value={formData.contactName} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Relationship with Patient <span className="text-red-500">*</span></label>
                    <select name="relationship" required value={formData.relationship} onChange={handleChange} className={inputClass}>
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex">
                      <div className="border border-gray-200 border-r-0 rounded-l-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 shrink-0">+91</div>
                      <input type="tel" name="contactPhone" placeholder="Enter mobile number" required value={formData.contactPhone} onChange={handleChange} className={`${inputClass} rounded-l-none`} />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Email Address</label>
                    <input type="email" name="contactEmail" placeholder="Enter email address" value={formData.contactEmail} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Request Info & Medical Info */}
            <div className="space-y-6">

              {/* Request Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                  <Calendar className="text-[#1B4B8A]" size={22} />
                  <h2 className="text-[#1B4B8A] font-bold text-lg">Request Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Service Required <span className="text-red-500">*</span></label>
                    <select name="serviceRequired" required value={formData.serviceRequired} onChange={handleChange} className={inputClass}>
                      <option value="">Select a service</option>
                      <option value="Doctor Visit">Doctor Visit</option>
                      <option value="Nursing Care">Nursing Care</option>
                      <option value="Physiotherapy">Physiotherapy</option>
                      <option value="Elderly Care">Elderly Care</option>
                      <option value="Lab Test at Home">Lab Test at Home</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Preferred Visit Date <span className="text-red-500">*</span></label>
                    <input type="date" name="preferredDate" required value={formData.preferredDate} onChange={handleChange} className={inputClass} />
                  </div>
                  {formData.serviceRequired === 'Nursing Care' && (
                    <>
                      <div>
                        <label className={labelClass}>Visit Duration <span className="text-red-500">*</span></label>
                        <select name="preferredDuration" required value={formData.preferredDuration} onChange={handleChange} className={inputClass}>
                          <option value="">Select duration</option>
                          <option value="4hr">4 hours</option>
                          <option value="8hr">8 hours</option>
                          <option value="12hr">12 hours</option>
                          <option value="24hr">24 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Preferred Time <span className="text-red-500">*</span></label>
                        <input
                          type="time"
                          name="preferredTimeExact"
                          required
                          value={formData.preferredTimeExact}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <label className={labelClass}>Purpose of Visit <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 mt-3">
                      {['Doctor Consultation', 'Physiotherapy', 'Nursing Care', 'Elderly Care', 'Lab Test at Home', 'Other'].map(option => (
                        <label key={option} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-[#1B4B8A]">
                          <input type="radio" name="purpose" value={option} checked={formData.purpose === option} onChange={handleChange} required className="text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4 border-gray-300" />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.serviceRequired === 'Nursing Care' && formData.purpose === 'Nursing Care' && (
                    <div className="col-span-1 sm:col-span-2 mt-3">
                      <label className={labelClass}>Type of Nurse <span className="text-red-500">*</span></label>
                      <select name="nurseType" required value={formData.nurseType} onChange={handleChange} className={inputClass}>
                        <option value="">Select nurse type</option>
                        <option value="General duty nurse">General duty nurse</option>
                        <option value="Critical care nurse">Critical care nurse</option>
                        <option value="General duty assistant">General duty assistant</option>
                      </select>
                    </div>
                  )}

                  <div className="col-span-1 sm:col-span-2 mt-3">
                    <label className={labelClass}>Brief Description / Symptoms</label>
                    <textarea name="symptoms" placeholder="Please describe the reason for the visit or patient's current condition" rows={3} value={formData.symptoms} onChange={handleChange} className={inputClass}></textarea>
                  </div>
                </div>
              </div>

              {/* Patient Medical Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                  <Heart className="text-[#1B4B8A]" size={22} />
                  <h2 className="text-[#1B4B8A] font-bold text-lg">Patient Medical Information</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Known Medical Conditions</label>
                    <textarea name="medicalConditions" placeholder="E.g. Diabetes, Hypertension, Arthritis etc." rows={2} value={formData.medicalConditions} onChange={handleChange} className={inputClass}></textarea>
                  </div>
                  <div>
                    <label className={labelClass}>Current Medications (if any)</label>
                    <textarea name="medications" placeholder="List current medications" rows={2} value={formData.medications} onChange={handleChange} className={inputClass}></textarea>
                  </div>
                  <div>
                    <label className={labelClass}>Any Allergies</label>
                    <textarea name="allergies" placeholder="Mention any allergies" rows={2} value={formData.allergies} onChange={handleChange} className={inputClass}></textarea>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Information & Submit Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 border border-green-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-center mt-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full border border-[#2E7D32] text-[#2E7D32] flex items-center justify-center text-xs font-bold">i</div>
                <h3 className="text-[#2E7D32] font-bold text-sm">Important Information</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>Our care team will contact you within 30 minutes to confirm your request.</li>
                <li>Please ensure someone is available at the time of the visit.</li>
                <li>For emergencies, please call our 24x7 helpline: <span className="font-bold text-black">+91 92207 83535</span></li>
              </ul>
            </div>
            <div className="flex items-center gap-4 bg-white px-6 py-5 rounded-xl border border-green-100 shadow-sm md:max-w-sm w-full md:w-auto">
              <ShieldCheck className="text-[#2E7D32] shrink-0" size={36} />
              <div>
                <p className="text-sm font-bold text-gray-800">Your information is safe with us.</p>
                <p className="text-xs text-gray-500 mt-1">We respect your privacy and data security.</p>
              </div>
            </div>
          </div>

          {/* Terms & Submit Buttons */}
          <div className="text-center mt-10">
            <label className="inline-flex items-center gap-3 text-sm text-gray-700 cursor-pointer mb-8">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required className="rounded border-gray-300 text-[#1B4B8A] focus:ring-[#1B4B8A] w-5 h-5" />
              <span>
                I confirm that the above information is correct and I agree to the{' '}
                <LegalLinks className="text-[#1B4B8A] font-bold hover:underline" />.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/services/home-care" className="px-8 py-3.5 rounded-xl border-2 border-[#2E7D32] text-[#2E7D32] font-bold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft size={18} /> Go Back
              </Link>
              <button type="submit" disabled={isSubmitting} className={`px-8 py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-[#256629]'}`}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'} <Send size={18} />
              </button>
            </div>
          </div>

        </form>
        )}
      </div>
    </div>
  );
}
