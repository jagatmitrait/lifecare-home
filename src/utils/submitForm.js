import { API_BASE } from '../config/api.js';

const REQUEST_TIMEOUT_MS = 55000;
const MAIL_TO = 'info@lifecarepolyclinic.com';

const FORM_SUBJECTS = {
  contact: 'New Contact Message - LifeCare Polyclinic',
  appointment: 'New Appointment Booking - LifeCare Polyclinic',
  'home-visit': 'New Home Visit Request - LifeCare Polyclinic',
};

function flattenFormData(data) {
  const flat = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'boolean') {
      flat[key] = value ? 'Yes' : 'No';
    } else {
      flat[key] = String(value);
    }
  }
  return flat;
}

/** Send from browser — works on Vercel without Render email */
async function submitViaFormSubmit(formType, data) {
  const subject = FORM_SUBJECTS[formType] || `LifeCare Form: ${formType}`;
  const flat = flattenFormData(data);

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(MAIL_TO)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      _captcha: 'false',
      _template: 'table',
      _form_type: formType,
      ...flat,
    }),
  });

  const text = await response.text();
  let result = {};
  try {
    result = JSON.parse(text);
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(`Email service error (${response.status}). Please call +91 92207 83535.`);
  }

  if (result.success === 'false' || result.success === false) {
    throw new Error(result.message || 'Email service rejected the request.');
  }

  return { success: true, message: 'Message sent successfully.', method: 'formsubmit-client' };
}

/** Web3Forms — optional, very reliable if you add a free key at web3forms.com */
async function submitViaWeb3Forms(formType, data) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return null;

  const flat = flattenFormData(data);
  const subject = FORM_SUBJECTS[formType] || `LifeCare ${formType}`;

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject,
      from_name: flat.name || flat.patientName || 'LifeCare Website',
      email: flat.email || flat.patientEmail || flat.contactEmail || 'noreply@lifecarepolyclinic.com',
      ...flat,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Web3Forms failed');
  }

  return { success: true, message: 'Message sent successfully.', method: 'web3forms' };
}

async function submitViaBackend(formType, data) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/forms/${formType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || `Server error (${response.status})`);
    }

    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Production: email sent directly from browser (FormSubmit / Web3Forms).
 * Development: uses local backend proxy.
 */
export async function submitForm(formType, data) {
  try {
    if (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) {
      try {
        return await submitViaWeb3Forms(formType, data);
      } catch (web3Err) {
        console.warn('Web3Forms failed, trying FormSubmit:', web3Err.message);
      }
    }

    if (import.meta.env.PROD) {
      return await submitViaFormSubmit(formType, data);
    }

    return await submitViaBackend(formType, data);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again or call +91 92207 83535.');
    }

    if (import.meta.env.PROD && !import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) {
      throw new Error(
        error.message ||
          'Could not send message. Please call +91 92207 83535 or email info@lifecarepolyclinic.com.',
      );
    }

    if (import.meta.env.DEV) {
      try {
        return await submitViaFormSubmit(formType, data);
      } catch {
        throw new Error(
          error.message || 'Failed to send. Start backend (npm run dev:server) or use production build.',
        );
      }
    }

    throw error;
  }
}
