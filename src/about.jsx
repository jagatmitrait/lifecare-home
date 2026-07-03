import { Link } from 'react-router-dom';
import { CalendarCheck, Phone, Stethoscope, Heart, Users, Smartphone, Clock, ShieldCheck, Calendar, Hospital, HeartPulse, Timer, BadgeCheck, Target, Eye, HeartHandshake } from 'lucide-react';
import hospitalBg from './assets/banner1.png';
const whyChoose = [
  { Icon: Stethoscope, title: 'Expert Doctors', desc: 'Experienced and qualified specialists across multiple disciplines.' },
  { Icon: Heart, title: 'Comprehensive Care', desc: 'Wide range of OPD services and complete home care solutions.' },
  { Icon: Users, title: 'Patient First Approach', desc: 'Personalized care plans focused on your health and comfort.' },
  { Icon: Smartphone, title: 'Advanced Technology', desc: 'Modern infrastructure and technology for accurate diagnosis and treatments.' },
  { Icon: Clock, title: '24x7 Support', desc: 'Round-the-clock assistance for emergencies and home care needs.' },
  { Icon: ShieldCheck, title: 'Trusted & Reliable', desc: 'A legacy of care built on trust, transparency and ethical practices.' },
];

const stats = [
  { Icon: Calendar, val: '1997', label: 'Year Established' },
  { Icon: Hospital, val: '5+', label: 'Specialties' },
  { Icon: Stethoscope, val: '50+', label: 'Expert Doctors' },
  { Icon: HeartPulse, val: '10K+', label: 'Happy Patients' },
  { Icon: Timer, val: '24x7', label: 'Care & Support' },
  { Icon: BadgeCheck, val: '100%', label: 'Commitment' },
];
export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-[#1B4B8A]">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-[#1B4B8A] font-medium">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#1B4B8A]">About </span><span className="text-[#2E7D32]">LifeCare</span>
            </h1>
            <p className="font-semibold text-[#1B4B8A] text-lg mb-3">Compassionate Care. Complete Health.</p>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              At LifeCare Polyclinic & Home Care Services, we are committed to delivering compassionate, personalized and comprehensive healthcare for every stage of life. From expert OPD consultations to 24x7 home care support, your well-being is our mission.
            </p>
            <div className="flex gap-4">
              <div className="border border-gray-200 rounded-xl p-4 text-center min-w-24">
                <div className="text-2xl font-bold text-[#1B4B8A]">5+</div>
                <div className="text-xs text-gray-500">Specialties</div>
              </div>
              <div className="border border-[#2E7D32] rounded-xl p-4 text-center min-w-24">
                <div className="text-2xl font-bold text-[#2E7D32]">24x7</div>
                <div className="text-xs text-gray-500">Care & Support</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
  src={hospitalBg}
  alt="LifeCare Hospital"
  className="w-full h-full object-cover"
/>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[#2E7D32]">🌿</span>
            <h2 className="text-3xl font-bold text-[#1B4B8A]">Our Story</h2>
            <span className="text-[#2E7D32]">🌿</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Founded in 1997 under the umbrella of Jagatmitra Foundation, LifeCare began with a simple vision –<br />
            to make quality healthcare accessible, affordable and compassionate for all.<br />
            Today, we are a trusted name in patient care, combining advanced medical practices with the warmth of human touch.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
                 <img
  src={hospitalBg}
  alt="LifeCare Hospital"
  className="w-full h-full object-cover"
/>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8">
              <span className="text-[#1B4B8A]">Our Mission, Vision</span><br />
              <span className="text-[#1B4B8A]">& </span><span className="text-[#2E7D32]">Values</span>
            </h2>
            {[
              { Icon: Target, title: 'Our Mission', desc: 'To provide accessible, affordable and comprehensive healthcare services with compassion, innovation and excellence.' },
              { Icon: Eye, title: 'Our Vision', desc: 'To be the most trusted healthcare partner, empowering healthier communities and happier lives.' },
              { Icon: HeartHandshake, title: 'Our Values', desc: 'Compassion • Integrity • Excellence • Respect\nTeamwork • Innovation • Accountability' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1B4B8A] rounded-full flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1B4B8A] mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      {/* Why Choose */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[#2E7D32] text-xl">🌿</span>
              <h2 className="text-3xl font-bold text-[#1B4B8A]">Why Choose <span className="text-[#2E7D32]">LifeCare?</span></h2>
              <span className="text-[#2E7D32] text-xl">🌿</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {whyChoose.map(({ Icon, title, desc }, i) => (
              <div key={i} className="text-center p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100 bg-blue-50">
                  <Icon size={28} className="text-[#1B4B8A]" />
                </div>
                <h3 className="font-bold text-[#1B4B8A] text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* Stats */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[#2E7D32] text-xl">🌿</span>
              <h2 className="text-3xl font-bold text-[#1B4B8A]">Our Journey in <span className="text-[#2E7D32]">Numbers</span></h2>
              <span className="text-[#2E7D32] text-xl">🌿</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map(({ Icon, val, label }, i) => (
              <div key={i} className="text-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center mb-2">
                  <Icon size={28} className="text-[#1B4B8A]" />
                </div>
                <div className="text-2xl font-bold text-[#1B4B8A]">{val}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* CTA */}
      <div className="text-white py-10 rounded-2xl mx-4 my-4" style={{ background: 'linear-gradient(to right, #2E7D32, #1B4B8A)' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center shrink-0">
              <Stethoscope size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">We're Here for You, Always</h3>
              <p className="text-white/80 text-sm mt-1">Whether it's a clinic visit or care at your doorstep,<br />LifeCare is just a call or click away.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/book-slot" className="flex items-center gap-2 bg-white text-[#1B4B8A] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              <CalendarCheck size={16} /> Book Tele-Consult
            </Link>
            <a href="tel:+919220783535, +919220783636" className="flex flex-col items-center border border-white/60 text-white px-6 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors">
              <span className="text-xs text-white/70 mb-0.5">24x7 Support</span>
              <span className="flex items-center gap-2 font-bold"><Phone size={14} /> +91 92207 83535</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}