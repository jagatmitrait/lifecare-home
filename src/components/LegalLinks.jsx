import { Link } from 'react-router-dom';

/** Inline Terms & Privacy links for form checkboxes (stops label from toggling when clicking link). */
export default function LegalLinks({ className = 'text-[#1B4B8A] font-semibold underline' }) {
  const stop = (e) => e.stopPropagation();

  return (
    <>
      <Link to="/terms" className={className} onClick={stop}>
        Terms & Conditions
      </Link>
      {' and '}
      <Link to="/privacy" className={className} onClick={stop}>
        Privacy Policy
      </Link>
    </>
  );
}
