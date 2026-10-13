const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');
const crypto = require('node:crypto');

initializeApp();
const db = getFirestore();
const REGION = 'asia-south1';
const clean = (value, max = 500) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';
const normalizePhone = (value) => clean(value, 30).replace(/[^+0-9()\-\s]/g, '');

exports.createBooking = onCall({ region: REGION, enforceAppCheck: true, cors: true, maxInstances: 10 }, async (request) => {
  const body = request.data || {};
  // Honeypot: silently accept the call but do not persist spam.
  if (clean(body.honeypot, 200)) return { ok: true };
  const fields = body.fields && typeof body.fields === 'object' && !Array.isArray(body.fields) ? body.fields : {};
  const entries = Object.entries(fields).slice(0, 40);
  const safe = {};
  for (const [key, value] of entries) {
    const safeKey = clean(key, 60).replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!safeKey || /password|token|secret|credit.?card|otp/i.test(safeKey)) continue;
    if (typeof value === 'string') safe[safeKey] = clean(value, 1000);
  }
  const getField = (...names) => {
    for (const name of names) {
      const key = Object.keys(safe).find((candidate) => candidate.toLowerCase() === name.toLowerCase());
      if (key && safe[key]) return safe[key];
    }
    return '';
  };
  const name = getField('name', 'full_name', 'fullname', 'customer_name');
  const phone = normalizePhone(getField('phone', 'mobile', 'phone_number', 'contact_number'));
  const email = clean(getField('email', 'email_address'), 254).toLowerCase();
  const summary = clean(getField('message', 'trip', 'destination', 'tour', 'enquiry', 'inquiry', 'package'), 1000);
  if (name.length < 2) throw new HttpsError('invalid-argument', 'Please enter your name.');
  if (phone.replace(/\D/g, '').length < 7) throw new HttpsError('invalid-argument', 'Please enter a valid contact number.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpsError('invalid-argument', 'Please enter a valid email address.');
  // Basic per-session/IP window guard; App Check remains required. This is a defense-in-depth control, not a substitute for abuse monitoring.
  const ip = clean(request.rawRequest?.ip || 'unknown', 80);
  const rateKey = crypto.createHash('sha256').update(`${ip}|${request.app?.appId || 'no-app'}`).digest('hex');
  const rateRef = db.collection('_publicRateLimits').doc(rateKey);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(rateRef);
    const now = Date.now();
    const windowStart = snap.exists ? Number(snap.get('windowStart') || 0) : 0;
    const count = snap.exists ? Number(snap.get('count') || 0) : 0;
    const nextCount = now - windowStart > 60_000 ? 1 : count + 1;
    if (nextCount > 5) throw new HttpsError('resource-exhausted', 'Too many requests. Please try again later.');
    tx.set(rateRef, { windowStart: nextCount === 1 ? now : windowStart, count: nextCount, expiresAt: Timestamp.fromMillis(now + 2 * 60 * 60 * 1000) });
  });
  await db.collection('bookings').add({
    name, phone, email, summary,
    fields: safe,
    page: clean(body.page, 200),
    status: 'new',
    createdAt: FieldValue.serverTimestamp(),
    privacyNoticeVersion: '2026-10-01'
  });
  return { ok: true };
});
