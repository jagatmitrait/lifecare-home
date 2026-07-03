import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from './assets/logo (2).png';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const links = [
    { name: 'ABOUT US', path: '/about' },
    { name: 'HOME CARE SERVICES', path: '/services/home-care' },
    { name: 'CAREERS', path: '/careers/nursing' },
    { name: 'BOOK HOME VISIT', path: '/home-visit' },
    { name: 'BOOK TELE-CONSULT', path: '/book-slot' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4  flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="LifeCare Logo" className="max-h-24 h-auto w-auto object-contain" style={{ display: 'block' }} />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-semibold transition-colors pb-1 ${isActive(l.path) ? 'text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-gray-700 hover:text-[#1B4B8A]'}`}
            >
              {l.name}
            </Link>
          ))}
        </div>

        <button className="lg:hidden text-[#1B4B8A]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="block py-2 text-sm font-semibold text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
