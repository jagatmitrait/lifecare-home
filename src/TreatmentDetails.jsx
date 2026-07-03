import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, CheckCircle2, Info, Target, Sparkles } from 'lucide-react';
import { treatmentDetailsData } from './data/treatmentDetailsData';
import medantaLogo from './assets/medanta lab.png';

export default function TreatmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const treatment = location.state?.treatment;
  const serviceName = location.state?.serviceName || 'Services';

  // Fallback if accessed directly without state
  useEffect(() => {
    if (!treatment) {
      navigate('/services/home-care');
    }
  }, [treatment, navigate]);

  if (!treatment) return null;

  const detailedData = treatmentDetailsData[treatment.name] || {
    longDescription: treatment.desc,
    benefits: [
      "Personalized care tailored to your unique condition",
      "Conducted by highly trained and experienced professionals",
      "Utilizes modern, safe, and effective technology",
      "Focuses on long-term health and well-being",
      "Minimal downtime with fast recovery protocols",
      "Comprehensive pre and post-treatment support"
    ],
    whatToExpect: "Our experienced professionals will guide you through every step of the process. We tailor the approach to your specific needs to ensure maximum effectiveness and comfort.",
    idealFor: "Anyone looking to improve their health and well-being with our specialized care."
  };

  return (
    <div className="w-full font-sans text-gray-800 bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-green-50 pt-12 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm font-semibold text-blue-800 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {serviceName}
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2 tracking-tight">
              {treatment.name}
            </h1>

            {treatment.name === 'Home Lab' && (
              <div className="flex items-center gap-4 mb-5 mt-3">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">in association with</span>
                <img
                  src={medantaLogo}
                  alt="Medanta Labs"
                  className="h-16 object-contain rounded-2xl shadow-md"
                  style={{ maxWidth: '180px' }}
                />
              </div>
            )}

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {treatment.desc}
            </p>

            {treatment.name !== 'Home Lab' && (
              <Link
                to="/home-visit"
                className="inline-flex items-center space-x-2 bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Home Visit</span>
              </Link>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden shadow-xl border-4 border-white h-64 md:h-80">
              <img
                src={treatment.img}
                alt={treatment.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medanta Labs Awareness Section — only for Home Lab */}
      {treatment.name === 'Home Lab' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

            {/* Section Header */}
            <div className="flex items-center gap-4 mb-3">
              <img
                src={medantaLogo}
                alt="Medanta Labs"
                className="h-12 object-contain rounded-2xl shadow-md bg-white p-1 border border-orange-200"
                style={{ maxWidth: '120px' }}
              />
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Medanta Labs Health Packages</h2>
                <p className="text-sm text-gray-500 mt-0.5">Trusted diagnostics, brought to your doorstep</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-base border-l-4 border-orange-400 pl-4 bg-orange-50 py-3 rounded-r-xl">
              As part of our Home Lab service in association with <strong>Medanta Labs</strong>, we offer a wide range of health packages — from full body checkups to specialised fever panels and hair loss diagnostics. Book once, get everything done at home.
            </p>

            {/* Lab Test KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Card 1 - Hair Loss Package */}
              <div className="rounded-2xl border border-orange-100 bg-orange-50 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">💇</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Hair Loss Package</h3>
                    <p className="text-xs text-orange-500 font-semibold">Basic ₹2,199 · Advance ₹12,999</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✔ Hemogram · Serum Ferritin</li>
                  <li>✔ Vitamin D · Vitamin B12</li>
                  <li>✔ Thyroid (TSH, T3, T4)</li>
                  <li>✔ DHEAS · Prolactin (for females)</li>
                </ul>
              </div>

              {/* Card 2 - Full Body MedCheck Basic */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">🏥</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">MedCheck Basic</h3>
                    <p className="text-xs text-blue-500 font-semibold">From ₹900 to ₹1,400</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✔ Diabetes Check · Liver Health</li>
                  <li>✔ Heart Health · Kidney Health</li>
                  <li>✔ Infection · Thyroid Health</li>
                  <li>✔ Urine Analysis · Bone Health</li>
                </ul>
              </div>

              {/* Card 3 - Swasthya Extended */}
              <div className="rounded-2xl border border-green-100 bg-green-50 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">🌿</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Swasthya Extended</h3>
                    <p className="text-xs text-green-600 font-semibold">₹1,600</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✔ Diabetes · Thyroid · Heart Health</li>
                  <li>✔ Kidney · Liver Health</li>
                  <li>✔ Anemia Check · Urine Analysis</li>
                  <li>✔ Bone Health · Infection Screen</li>
                </ul>
              </div>

              {/* Card 4 - Comprehensive ₹2,700 */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">🔬</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">MedCheck Comprehensive</h3>
                    <p className="text-xs text-purple-500 font-semibold">From ₹2,700 to ₹4,320</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✔ Diabetes · Heart · Liver · Kidney</li>
                  <li>✔ Thyroid · Urine Analysis</li>
                  <li>✔ Bone Health · Infection Screen</li>
                  <li>✔ Anemia Check</li>
                </ul>
              </div>

              {/* Card 5 - Monsoon Fever Panel */}
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-xl">🌧️</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Monsoon Fever Panels</h3>
                    <p className="text-xs text-cyan-600 font-semibold">From ₹700 to ₹2,400</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✔ Dengue IgM/IgG/NS1 Antigen</li>
                  <li>✔ Malaria Parasite · Blood Smear</li>
                  <li>✔ CBC · Typhoid IgM/IgG</li>
                  <li>✔ Chikungunya · Widal Test</li>
                </ul>
              </div>

              {/* Card 6 - Platinum / Complete Care */}
              <div className="rounded-2xl border border-yellow-100 bg-yellow-50 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">⭐</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Swasthya Complete Care</h3>
                    <p className="text-xs text-yellow-600 font-semibold">From ₹3,000 to ₹4,800</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✔ Full Diabetes · Heart · Liver Panel</li>
                  <li>✔ Kidney · Thyroid · Bone Health</li>
                  <li>✔ Urine Analysis · Infection</li>
                  <li>✔ Cancer Screening Markers</li>
                </ul>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <div>
                <p className="font-bold text-gray-800 text-lg">Interested in a package?</p>
                <p className="text-sm text-gray-500 mt-1">Book your Home Lab appointment and our team will guide you to the right Medanta package.</p>
              </div>
              <Link
                to="/book-slot"
                className="flex-shrink-0 inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-xl font-semibold transition-colors shadow-md"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Now</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Detailed Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">Detailed Overview</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              {detailedData.longDescription}
            </p>
          </div>

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-50 p-2 rounded-lg text-green-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Key Benefits</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {detailedData.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                <CalendarCheck className="w-5 h-5 mr-2 text-blue-600" />
                What to Expect
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {detailedData.whatToExpect}
              </p>
            </div>
            <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Ideal Candidate
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {detailedData.idealFor}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
