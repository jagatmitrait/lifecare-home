export default function Logo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#1B4B8A"/>
      {/* Cross symbol */}
      <rect x="20" y="12" width="8" height="24" rx="2" fill="white"/>
      <rect x="12" y="20" width="24" height="8" rx="2" fill="white"/>
      {/* Leaf/heart accent */}
      <circle cx="36" cy="12" r="5" fill="#2E7D32"/>
      <path d="M33 12 C33 9 36 7 38 9 C40 11 38 14 36 14 C34 14 33 13 33 12Z" fill="#4CAF50"/>
    </svg>
  );
}
