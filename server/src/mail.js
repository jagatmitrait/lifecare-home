import nodemailer from 'nodemailer';

function getMailTo() {
  return (process.env.MAIL_TO || 'info@lifecarepolyclinic.com').trim();
}

function getMailFrom() {
  return process.env.MAIL_FROM || 'LifeCare Website <noreply@lifecarepolyclinic.com>';
}

// A resume attachment can take substantially longer than a text-only message
// to upload to Gmail, especially on a slower connection.
const SMTP_TIMEOUT_MS = 60000;
const SMTP_ATTACHMENT_TIMEOUT_MS = 5 * 60 * 1000;
const SMTP_CONNECTION_TIMEOUT_MS = 30000;

function isHostedServer() {
  return Boolean(
    process.env.RENDER === 'true' ||
    process.env.RENDER_SERVICE_ID ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NODE_ENV === 'production',
  );
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function cleanSmtpPass(pass) {
  return (pass || '').trim().replace(/["']/g, '').replace(/\s/g, '');
}

function flattenFields(fields) {
  const flat = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    flat[key] = String(value);
  }
  return flat;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: cleanSmtpPass(process.env.SMTP_PASS),
    },
    connectionTimeout: SMTP_CONNECTION_TIMEOUT_MS,
    greetingTimeout: SMTP_CONNECTION_TIMEOUT_MS,
    socketTimeout: SMTP_ATTACHMENT_TIMEOUT_MS,
  });
}

function formatFieldsHtml(fields) {
  return Object.entries(flattenFields(fields))
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      return `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`;
    })
    .join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatFieldsText(fields) {
  return Object.entries(flattenFields(fields))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

async function sendViaSmtp(subject, fields, attachments = []) {
  const transporter = createTransporter();
  const flat = flattenFields(fields);

  await transporter.sendMail({
    from: getMailFrom(),
    to: getMailTo(),
    replyTo: flat.email || flat.patientEmail || flat.contactEmail || undefined,
    subject,
    text: formatFieldsText(flat),
    attachments,
    html: `
    <div style="font-family:Arial,sans-serif;max-width:640px;">
      <h2 style="color:#1B4B8A;">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse;width:100%;">${formatFieldsHtml(flat)}</table>
    </div>`,
  });
}

async function sendViaWeb3Forms(subject, fields) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return null;

  const flat = flattenFields(fields);
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
  return result;
}

async function sendViaFormSubmit(subject, fields, attachments = []) {
  const flat = flattenFields(fields);
  const payload = {
    _subject: subject,
    _captcha: 'false',
    _template: 'table',
    _replyto: flat.email || flat.patientEmail || flat.contactEmail || '',
    ...flat,
  };

  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) body.append(key, value);
  for (const attachment of attachments) {
    body.append(
      'attachment',
      new Blob([attachment.content], { type: attachment.contentType || 'application/octet-stream' }),
      attachment.filename,
    );
  }

  const siteUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    // Keep FormSubmit as a last-resort notification path. SMTP is used first
    // for career applications because it reliably carries the attachment.
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(getMailTo())}`;
    const response = await fetch(
      endpoint,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Origin: siteUrl,
          Referer: `${siteUrl}/`,
        },
        body,
        signal: controller.signal,
      },
    );

    const text = await response.text();
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    if (!response.ok) {
      throw new Error(`FormSubmit HTTP ${response.status}: ${text.slice(0, 200)}`);
    }

    if (parsed.success === 'false' || parsed.success === false) {
      throw new Error(parsed.message || 'FormSubmit rejected the request');
    }

    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    }),
  ]);
}
export async function sendPatientConfirmationEmail({ to, patientName, dept, date, time, slotDuration, amountPaid, orderId, meetLink }) {
  if (!to || !hasSmtpConfig()) return null;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: getMailFrom(),
      to: to.trim(),
      subject: `✅ Tele-Consult Confirmed — ${date} at ${time} | LifeCare Polyclinic`,
      html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#1B4B8A;padding:24px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:22px;">LifeCare Polyclinic</h1>
          <p style="color:#93c5fd;margin:6px 0 0;font-size:14px;">Tele-Consult Booking Confirmed ✅</p>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;">Dear <strong>${escapeHtml(patientName || 'Patient')}</strong>,</p>
          <p style="color:#374151;font-size:14px;">Your tele-consult appointment has been successfully booked and payment confirmed. Here are your details:</p>

          <table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;">
            <tr><td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;width:40%;">Department</td><td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(dept || '')}</td></tr>
            <tr><td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;">Date</td><td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(date || '')}</td></tr>
            <tr><td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;">Time</td><td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(time || '')}</td></tr>
            <tr><td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;">Slot Duration</td><td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(slotDuration || '')}</td></tr>
            <tr><td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;">Amount Paid</td><td style="padding:10px 12px;border:1px solid #e5e7eb;color:#2E7D32;font-weight:bold;">₹${amountPaid}</td></tr>
            <tr><td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;">Order ID</td><td style="padding:10px 12px;border:1px solid #e5e7eb;font-size:12px;">${escapeHtml(orderId || '')}</td></tr>
          </table>

          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;padding:20px;margin:20px 0;text-align:center;">
            <p style="color:#166534;font-weight:bold;font-size:16px;margin:0 0 12px;">🎥 Your Google Meet Link</p>
            <p style="color:#374151;font-size:13px;margin:0 0 16px;">Click the button below at your appointment time to join your consultation with the doctor:</p>
            <a href="${meetLink}" style="background:#1B4B8A;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
              Join Meet Now
            </a>
            <p style="color:#6b7280;font-size:11px;margin:12px 0 0;word-break:break-all;">${meetLink}</p>
          </div>

          <p style="color:#6b7280;font-size:13px;margin-top:20px;">For any help, call us at <strong>+91 92207 83535</strong> or reply to this email.</p>
          <p style="color:#6b7280;font-size:12px;">LifeCare Polyclinic, DG-3/29, Charak Sadan Road, Vikaspuri, New Delhi</p>
        </div>
      </div>`,
    });
    return true;
  } catch (err) {
    console.error('Patient email failed:', err.message);
    return null;
  }
}
export async function sendFormEmail(subject, fields, { attachments = [] } = {}) {
  const normalized = flattenFields(fields);
  const safeSubject = subject.replace(/[^\x20-\x7E]/g, '-');

 const useSmtpOnServer = process.env.USE_SMTP_ON_SERVER === 'true';
  const trySmtpFirst = (useSmtpOnServer || attachments.length > 0) && hasSmtpConfig();

  const errors = [];

  try {
    const web3 = attachments.length === 0
      ? await sendViaWeb3Forms(safeSubject, normalized)
      : null;
    if (web3) return { method: 'web3forms' };
  } catch (err) {
    console.error('Web3Forms error:', err.message);
    errors.push(`Web3Forms: ${err.message}`);
  }

  if (trySmtpFirst) {
    try {
      const timeout = attachments.length > 0 ? SMTP_ATTACHMENT_TIMEOUT_MS : SMTP_TIMEOUT_MS;
      await withTimeout(sendViaSmtp(safeSubject, normalized, attachments), timeout, 'SMTP');
      return { method: 'smtp' };
    } catch (err) {
      console.error('SMTP error:', err.message);
      errors.push(`SMTP: ${err.message}`);
      // FormSubmit's AJAX endpoint does not reliably forward binary files.
      // Do not make a career application wait through two more delivery attempts.
      if (attachments.length > 0) {
        throw new Error(`Could not email the resume: ${err.message}`);
      }
    }
  }

  try {
    await withTimeout(sendViaFormSubmit(safeSubject, normalized, attachments), 25000, 'FormSubmit');
    return { method: 'formsubmit' };
  } catch (err) {
    console.error('FormSubmit error:', err.message);
    errors.push(`FormSubmit: ${err.message}`);
  }

  if (hasSmtpConfig()) {
    try {
      await withTimeout(sendViaSmtp(safeSubject, normalized, attachments), SMTP_TIMEOUT_MS, 'SMTP');
      return { method: 'smtp-fallback' };
    } catch (err) {
      console.error('SMTP fallback error:', err.message);
      errors.push(`SMTP: ${err.message}`);
    }
  }

  throw new Error(errors.join(' | ') || 'All email methods failed');
}
