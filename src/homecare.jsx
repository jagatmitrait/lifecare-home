import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, HeartPulse, UserCheck, CheckSquare, Stethoscope, ClipboardList, BedDouble, RefreshCcw, Sparkles, Activity, Home } from 'lucide-react';
import bannerImg from './assets/indian_showing_checkup.jpg';
import medantaLogo from './assets/medanta lab.png';
import img1 from './assets/granma_doctor.jpg';
import img2 from './assets/uncle_doctor.jpg';
import img3 from './assets/rehab.jpg';
import img4 from './assets/indian_elderly.png';
import img5 from './assets/indian_korean.png';
import img6 from './assets/home lab.jpg';

const services = [
  { icon: '👨‍⚕️', name: 'Doctor Visit', desc: 'Consultation with experienced doctors at home for diagnosis, treatment and follow-up care.', image: img2 },
  { icon: '💉', name: 'Nursing Care', desc: 'Professional nursing support for wound care, injections, medicines, catheter care and vital monitoring.', image: img1 },

  { icon: '🔬', name: 'Home Lab', desc: 'Accurate sample collection at home and quick delivery of lab reports with complete reliability.', image: img6 },
  { icon: '🏃', name: 'Physiotherapy', desc: 'Expert physiotherapy for pain relief, mobility improvement, post-surgery recovery and rehabilitation.', image: img3 },
  { icon: '👴', name: 'Elderly Care', desc: 'Compassionate support for daily activities, personal care, companionship and overall well-being.', image: img4 },
  { icon: '📋', name: 'General Duty Assistant', desc: 'Assistance with hospital coordination, medication reminders, reports and health updates.', image: img5 },
];

export default function HomeCare() {
  const navigate = useNavigate();
  return (
    <div className="w-full font-sans text-gray-800 bg-gray-50">
      
      {/* Hero Section */}
      <div className="relative bg-blue-50/50 pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center">
          
          <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-blue-800">Home Care</span> <span className="text-green-600">Services</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl font-semibold text-blue-900 mb-6">Care at Clinic. Care at Home.</h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              Compassionate and professional healthcare at the comfort of your home. We bring expert care, so your loved ones receive the attention they deserve.
            </p>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm md:text-base text-gray-700">Professional<br/>Caregivers</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full text-green-700">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm md:text-base text-gray-700">Personalized<br/>Care</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full text-green-700">
                  <Home className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm md:text-base text-gray-700">Comfort<br/>at Home</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm md:text-base text-gray-700">24x7<br/>Monitoring</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
             <div className="absolute top-0 right-0 w-full h-full bg-blue-100 rounded-full blur-3xl opacity-50 transform translate-x-10 -translate-y-10"></div>
             <img src={bannerImg} alt="Home Care Hero" className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-xl" />
          </div>

        </div>
      </div>

      {/* Mid Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between">
          
          <div className="flex items-center space-x-4 mb-6 md:mb-0 flex-shrink-0 mr-4 lg:mr-8">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-blue-900 leading-tight">Expert Care.<br/>Right at Your Doorstep.</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-0 overflow-hidden">
            <div className="flex flex-col items-center">
              <Stethoscope className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-xs font-semibold text-gray-600">Request</span>
            </div>
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="flex flex-col items-center">
              <ClipboardList className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-xs font-semibold text-gray-600">Assessment</span>
            </div>
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="flex flex-col items-center">
              <BedDouble className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-xs font-semibold text-gray-600">Care Plan</span>
            </div>
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="flex flex-col items-center">
              <HeartPulse className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-xs font-semibold text-gray-600">Visit</span>
            </div>
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="flex flex-col items-center">
              <RefreshCcw className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-xs font-semibold text-gray-600">Follow-up</span>
            </div>
          </div>

          <Link to="/home-visit" className="bg-blue-900 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md flex items-center space-x-2 flex-shrink-0 ml-4 md:ml-8 whitespace-nowrap">
            <CheckSquare className="w-5 h-5" />
            <span>Book Home Visit</span>
          </Link>

        </div>
      </div>

      {/* Treatments Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="text-green-500 w-6 h-6" />
              <h2 className="text-4xl font-bold text-blue-900">Our Home Care Services</h2>
              <Sparkles className="text-green-500 w-6 h-6" />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive care delivered directly to your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((t, idx) => (
              <Link
                key={idx}
                to={`/treatment-details`}
                state={{ treatment: { name: t.name, desc: t.desc, img: t.image }, serviceName: 'Home Care Services' }}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="bg-gradient-to-br from-blue-50 to-green-50 h-48 flex items-center justify-center relative overflow-hidden">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                      {t.icon}
                    </span>
                  )}
                </div>
            <div className="p-5 bg-white flex flex-col flex-1">
                  <h3 className="font-bold text-[#1B4B8A] mb-1">{t.name}</h3>
                  {t.name === 'Home Lab' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-gray-400 font-medium">in association with</span>
                      <img
                        src={medantaLogo}
                        alt="Medanta Labs"
                        className="h-5 object-contain rounded-md"
                        style={{ maxWidth: '90px' }}
                      />
                    </div>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                    {t.desc}
                  </p>
                  <div className="flex items-center gap-1 text-[#2E7D32] text-sm font-semibold group-hover:gap-2 transition-all mt-auto">
                    Learn More <ArrowRight size={16} />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate('/home-visit'); }}
                      className="inline-flex items-center space-x-2 bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                      <span>Book Home Visit</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Professional Care at Home?</h3>
              <p className="text-gray-600">Book a home visit today and experience compassionate care in your comfort zone.</p>
              
              <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">Safe & Hygienic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">Qualified Professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">Advanced Equipment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">Timely & Reliable</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link to="/home-visit" className="bg-blue-900 text-white text-center px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md flex-shrink-0 flex items-center justify-center space-x-2">
              <CheckSquare className="w-5 h-5" />
              <span>Book Home Visit</span>
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
}