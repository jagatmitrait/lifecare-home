import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable right click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable DevTools shortcuts
document.addEventListener('keydown', (e) => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase())) ||
    (e.metaKey && e.altKey && ['I', 'J'].includes(e.key.toUpperCase()))
  ) {
    e.preventDefault();
    return false;
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 