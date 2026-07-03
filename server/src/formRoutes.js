import { Router } from 'express';
import multer from 'multer';
import { sendFormEmail } from './mail.js';

const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ success: false, message });
}

router.post('/contact', async (req, res) => {
  try {
    const { name, mobile, email, subject, message, agree } = req.body;

    if (!name?.trim() || !mobile?.trim() || !email?.trim() || !message?.trim()) {
      return badRequest(res, 'Please fill all required fields.');
    }
    if (!agree) {
      return badRequest(res, 'Please agree to the terms and conditions.');
    }

    await sendFormEmail('New Contact Message — LifeCare Polyclinic', {
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      subject: subject?.trim() || 'General Enquiry',
      message: message.trim(),
      agree: true,
    });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('CONTACT FORM ERROR:', error.message);
    res.status(500).json({
      success: false,
      message:
        'Could not send email right now. Please call +91 92207 83535 or email info@lifecarepolyclinic.com directly.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.post('/appointment', async (req, res) => {
  try {
    const { name, mobile, email, dob, dept, doctor, date, time, reason, agree } = req.body;

    if (!name?.trim() || !mobile?.trim() || !dept?.trim() || !date || !time) {
      return badRequest(res, 'Please fill all required fields.');
    }
    if (!agree) {
      return badRequest(res, 'Please agree to the terms and conditions.');
    }

  const { slotDuration, slotCharge, txnId, type } = req.body;
const isSlotBooking = type === 'slot-booking';

await sendFormEmail(
  isSlotBooking ? 'New Slot Booking — LifeCare Polyclinic' : 'New Appointment Booking — LifeCare Polyclinic',
  {
    name: name.trim(),
    mobile: mobile.trim(),
    email: email?.trim() || 'Not provided',
    dateOfBirth: dob || 'Not provided',
    department: dept.trim(),
    doctor: doctor?.trim() || 'Any available',
    preferredDate: date,
    preferredTime: time,
    reasonForVisit: reason?.trim() || 'Not provided',
    ...(isSlotBooking && {
      slotDuration: slotDuration || 'Not specified',
      slotCharge: slotCharge ? `₹${slotCharge}` : 'Not specified',
      upiTransactionId: txnId || 'Not provided',
      bookingType: 'Slot Booking (Paid)',
    }),
    agree: true,
  }
);

    res.json({ success: true, message: 'Appointment request sent successfully.' });
  } catch (error) {
    console.error('APPOINTMENT FORM ERROR:', error.message);
    res.status(500).json({
      success: false,
      message:
        'Could not send appointment request. Please call +91 92207 83535 to book directly.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.post('/home-visit', async (req, res) => {
  try {
    const data = req.body;

    const required = [
      'patientName',
      'age',
      'gender',
      'patientPhone',
      'address',
      'contactName',
      'relationship',
      'contactPhone',
      'serviceRequired',
      'preferredDate',
      'purpose',
    ];

    for (const field of required) {
      if (!data[field]?.toString().trim()) {
        return badRequest(res, 'Please fill all required fields.');
      }
    }
    // If Nursing Care is requested both as service and purpose, require nurseType
    if (data.serviceRequired === 'Nursing Care' && data.purpose === 'Nursing Care') {
      if (!data.nurseType?.toString().trim()) {
        return badRequest(res, 'Please select the type of nurse required.');
      }
    }
    // Require preferred time only when Nursing Care is requested
    if (data.serviceRequired === 'Nursing Care') {
      if (!data.preferredTime?.toString().trim()) {
        return badRequest(res, 'Please provide preferred visit time and duration for Nursing Care.');
      }
    }
    if (!data.agreeToTerms) {
      return badRequest(res, 'Please agree to the terms and conditions.');
    }

    await sendFormEmail('New Home Visit Request — LifeCare Polyclinic', {
      patientName: data.patientName.trim(),
      age: data.age,
      gender: data.gender,
      dateOfBirth: data.dob || 'Not provided',
      patientPhone: data.patientPhone.trim(),
      patientEmail: data.patientEmail?.trim() || 'Not provided',
      visitAddress: data.address.trim(),
      contactPersonName: data.contactName.trim(),
      relationship: data.relationship,
      contactPhone: data.contactPhone.trim(),
      contactEmail: data.contactEmail?.trim() || 'Not provided',
      serviceRequired: data.serviceRequired,
      ...(data.nurseType ? { nurseType: data.nurseType } : {}),
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      purposeOfVisit: data.purpose,
      symptoms: data.symptoms?.trim() || 'Not provided',
      medicalConditions: data.medicalConditions?.trim() || 'None',
      medications: data.medications?.trim() || 'None',
      allergies: data.allergies?.trim() || 'None',
      agreeToTerms: true,
    });

    res.json({ success: true, message: 'Home visit request sent successfully.' });
  } catch (error) {
    console.error('HOME VISIT FORM ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request. Please try again or call +91 92207 83535.',
    });
  }
});

router.post('/careers', async (req, res) => {
  res.status(400).json({ success: false, message: 'Use /careers with form-data to upload resume' });
});

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const allowedResumeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (allowedResumeTypes.has(file.mimetype)) return callback(null, true);
    callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  },
});

function uploadResume(req, res, next) {
  upload.single('resume')(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Resume must be 10 MB or smaller.'
        : 'Please attach one resume in PDF, DOC, or DOCX format.';
      return res.status(400).json({ success: false, message });
    }

    console.error('RESUME UPLOAD ERROR:', error);
    return res.status(500).json({ success: false, message: 'Could not upload the resume.' });
  });
}

router.post('/careers/apply', uploadResume, async (req, res) => {
  try {
    const { name, email, phone, role, experience, coverLetter, agree } = req.body;
    if (!name || !email || !phone || !role || !req.file || agree !== 'true') {
      return badRequest(res, 'Please fill all required fields and attach resume.');
    }

    const sanitize = (v) => (v === undefined || v === null ? '' : String(v).trim());
    const fields = {
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(phone),
      role: sanitize(role),
      experience: sanitize(experience),
      coverLetter: sanitize(coverLetter),
      agree: sanitize(agree),
      resumeFilename: sanitize(req.file.originalname).replace(/[\u0000-\u001F\u007F]/g, ''),
    };

    const delivery = sendFormEmail('New Nursing Careers Application', fields, {
      attachments: [{
        filename: fields.resumeFilename,
        content: req.file.buffer,
        contentType: req.file.mimetype,
      }],
    });

    // The application has been validated and accepted. Large attachments can
    // take a while to upload to Gmail, so finish delivery without holding the
    // applicant's browser open for several minutes.
    delivery.catch((error) => {
      console.error('CAREERS EMAIL DELIVERY ERROR:', error);
    });

    res.status(202).json({
      success: true,
      message: 'Application submitted successfully. Your resume is being delivered to our recruitment team.',
    });
  } catch (err) {
    console.error('CAREERS APPLY ERROR:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to submit application.' });
  }
});

export default router;
