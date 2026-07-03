import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import logoImg from './assets/logo (2).png';



function HealthForAllIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M16 8C13 8 10 10.5 10 14c0 5 6 10 6 10s6-5 6-10c0-3.5-3-6-6-6z" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M13 14h6M16 11v6" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10 22c-2 1-3 2-3 2h18s-1-1-3-2" stroke="#1B4B8A" strokeWidth="1.2" fill="none"/>
    </svg>
  );
}

function CareForCommunityIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M16 20s-6-3.5-6-8a4 4 0 0 1 6-3.46A4 4 0 0 1 22 12c0 4.5-6 8-6 8z" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M16 20s-6-3.5-6-8a4 4 0 0 1 6-3.46A4 4 0 0 1 22 12c0 4.5-6 8-6 8z" stroke="#4CAF50" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M10 23c1.5-1 3.5-1.5 6-1.5s4.5.5 6 1.5" stroke="#1B4B8A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function CompassionIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M16 22s-7-4-7-9a5 5 0 0 1 7-4.58A5 5 0 0 1 23 13c0 5-7 9-7 9z" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M13 15l2 2 4-4" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BetterTomorrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="#1B4B8A" strokeWidth="1.5" fill="none"/>
      <path d="M16 22V14" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 18c0 0 1-4 4-4s4 4 4 4" stroke="#4CAF50" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M14 14c0-2 1-4 2-5 1 1 2 3 2 5" stroke="#1B4B8A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M10 22h12" stroke="#1B4B8A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 22c1-1 2-2 3-3M24 22c-1-1-2-2-3-3" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

const VALUES = [
  { Icon: HealthForAllIcon,     text: 'Health for All',           sub: 'Quality healthcare for everyone.' },
  { Icon: CareForCommunityIcon, text: 'Care for Community',       sub: 'We care beyond treatment.' },
  { Icon: CompassionIcon,       text: 'Compassion in Action',     sub: 'Empathy. Respect. Dignity.' },
  { Icon: BetterTomorrowIcon,   text: 'Building a Better Tomorrow', sub: 'Together for a healthier tomorrow.' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1B4B8A] text-white">
      {/* Values Bar */}
<div className="border-b border-gray-200 py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {VALUES.map(({ Icon, text, sub }, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-blue-100">
             <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Icon />
              </span>
              <div>
               <div className="font-semibold text-sm text-[#1B4B8A]">{text}</div>
<div className="text-gray-500 text-xs">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6 bg-white inline-block p-2 rounded-xl">
              <img src={logoImg} alt="LifeCare Logo" className="max-h-20 h-auto w-auto object-contain" style={{display: 'block'}} />
            </div>
            <p className="text-blue-200 text-xs leading-relaxed mb-4">
              Compassionate Care, Complete Health.<br />
              At clinic. At home. Always with you.
            </p>
            <div className="flex gap-3 mb-4">
              {[
                { Icon: Facebook,  href: 'https://www.facebook.com/people/Lifecare-Polyclinic/pfbid0384ZFd5YLQiMGAAwQhWbs5tKggrY1DzCr1RZsZn66HAXcAG4ahbxh7JNp4Qn7LNqXl/?mibextid=wwXIfr' },
                { Icon: Instagram, href: 'https://www.instagram.com/lifecarepolyclinic28?utm_source=qr' },
                { Icon: Youtube,   href: 'https://www.youtube.com/channel/UCIKpHXx0TKXvGi_Br0zjc5g' },
                { Icon: Linkedin,  href: 'https://www.linkedin.com/in/dr-gaurav-aggarwal-2b0a298' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-[#2E7D32] transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home',              to: '/' },
                { label: 'About Us',          to: '/about' },
                { label: 'Home Care Services', to: '/services/home-care' },
                { label: 'Book Home Visit',   to: '/home-visit' },
                { label: 'Book Tele-Consult', to: '/book-slot' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-blue-200 text-xs hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-bold text-sm mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['OPD Services', 'Home Care Services', '24x7 Support', 'Health Packages', 'Corporate Tie-ups'].map(s => (
                <li key={s} className="text-blue-200 text-xs flex items-center gap-1">
                  <span className="text-[#4CAF50]">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — no emergency box */}
          <div>
            <h4 className="font-bold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-blue-200 text-xs">
                <MapPin size={12} className="mt-0.5 shrink-0 text-[#4CAF50]" />
                DG-3/29, Charak Sadan road, Vikaspuri, New Delhi
              </li>
              <li className="flex items-center gap-2 text-blue-200 text-xs">
                <Phone size={12} className="shrink-0 text-[#4CAF50]" />
                +91 92207 83535
              </li>
              <li className="flex items-center gap-2 text-blue-200 text-xs">
                <Mail size={12} className="shrink-0 text-[#4CAF50]" />
                info@lifecarepolyclinic.com
              </li>
              <li className="flex items-center gap-2 text-blue-200 text-xs">
                <Globe size={12} className="shrink-0 text-[#4CAF50]" />
                www.lifecarepolyclinic.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-700 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-blue-300">
          <span>© 2026 LifeCare Polyclinic &amp; Home Care Services. All Rights Reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}