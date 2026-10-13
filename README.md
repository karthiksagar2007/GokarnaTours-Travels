# Gokarna Darshana Holidays — Vite + React + Firebase

This project is a modern React (Vite) single-page homepage for Gokarna Darshana Holidays plus a separate, admin-only React dashboard. The homepage shows real destination photography (Om Beach, Murudeshwar, Udupi, Agumbe, Kudremukh, Honnemaradu, Yana, Mirjan, Kudle, Paradise Beach), transparent **per-day fleet pricing** with no hidden charges, a Quick Enquiry form (no vehicle-type picker), and live tour packages. The admin dashboard (Firebase Authentication with an `admin: true` custom claim) manages packages, places (with images and details) and booking enquiries.

## Requirements
- Node.js 20 LTS or newer
- npm
- A Firebase project you own
- Firebase CLI for deployment: `npm install -g firebase-tools`

## 1. Run locally
```bash
npm install
npm run dev
```
Open the local URL Vite prints. Admin dashboard: `/admin.html` (or `/admin` when hosted with the included Firebase Hosting rewrite).

## 2. Connect Firebase
1. In Firebase Console, create/select your project.
2. Register a **Web App** and copy its web configuration.
3. Enable **Authentication → Email/Password**. Do not enable public admin registration in the website.
4. Create a Cloud Firestore database.
5. Enable Firebase Storage if you plan to upload images.
6. Copy `.env.example` to `.env` and replace the placeholder values with your web app config. Set `VITE_FIREBASE_FUNCTIONS_REGION=asia-south1` unless you deploy the function in a different region.
7. Configure Firebase App Check for the web app using reCAPTCHA Enterprise, and set `VITE_FIREBASE_APPCHECK_SITE_KEY`. Do not enforce App Check on production services until you have verified that valid traffic is receiving tokens.
8. Restart `npm run dev` after editing `.env`.

Firebase web config values are public by design; they are not service-account credentials. Security must be enforced by Firebase rules, custom claims, App Check, and trusted backend validation. Never put a service-account JSON file or Admin SDK private key in `.env` or frontend code.

## 3. Deploy backend rules and Cloud Function
Log in and select the project:
```bash
firebase login
firebase use --add
```
Install function dependencies and deploy:
```bash
cd functions
npm install
cd ..
firebase deploy --only firestore:rules,storage,functions
```
Then deploy the Vite site:
```bash
npm run build
firebase deploy --only hosting
```

## 4. Create the first admin securely
1. In Firebase Console → Authentication, manually create the admin email/password account. There is no public registration route.
2. Create a service-account credential only for a trusted server/developer machine, store it outside this project, and set `GOOGLE_APPLICATION_CREDENTIALS` to its full path. Never commit it.
3. Install function dependencies first so the Firebase Admin SDK is available.
4. Run from the project root (PowerShell example):
```powershell
$env:GCLOUD_PROJECT="your-firebase-project-id"
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\secure\path\service-account.json"
npm run set-admin -- admin@example.com
```
5. Sign out and back in at `/admin.html`. The dashboard checks for the server-issued `admin: true` custom claim. Authentication alone does not grant admin rights.

## 5. Firestore data
- `places`: admin-managed destinations shown on the homepage with `name`, `sub`, `description`, `imageUrl`, `published`, `updatedAt`, and `updatedBy`. Only `published: true` docs are readable by the public.
- `packages`: admin-managed tour packages with `name`, `region`, `description`, `price`, `duration`, `imageUrl`, `published`, `updatedAt`, and `updatedBy`. Published packages replace the curated fallback cards on the homepage automatically (live listener).
- `bookings`: private booking/contact enquiries created only by the `createBooking` callable Cloud Function (homepage Quick Enquiry submits here).
- `_publicRateLimits`: backend-only rate-limit documents.

The homepage ships curated fallback packages; as soon as an admin publishes a package in the dashboard it appears on the site without a redeploy. Fleet prices are transparent per-day rates (₹/day, all-inclusive: fuel, driver bata, tolls, parking).

## 6. Security included
- No public admin registration.
- Admin dashboard checks the server-issued Firebase custom claim `admin: true`.
- Firestore denies writes to all public clients except admin-claim-protected package management; bookings cannot be written directly from browsers.
- Booking submission goes through an App-Check-enforced Cloud Function with input allowlisting/length limits, contact validation, honeypot support, and a basic request rate limit.
- Storage public-read uploads are admin-only, restricted to image MIME types and 8 MB per file.
- Unknown Firestore paths and unknown Storage paths are denied.
- Admin pages request `noindex,nofollow`.

**No website can be guaranteed impossible to hack.** Keep dependencies updated, monitor Firebase/Cloud Function logs, rotate credentials if exposed, use strong unique admin passwords and MFA where available, configure App Check correctly, and test rules before production. The rate limit here is a basic layer, not a substitute for monitoring or a mature abuse-prevention system.

## 7. Validate before publishing
- `npm run build`
- Use Firebase Emulator Suite to test that anonymous users cannot read private bookings, create/update packages, upload files, or access unknown paths.
- Confirm an authenticated non-admin is denied admin actions.
- Confirm the admin custom claim is present after signing out and back in.
- Test all enquiry form fields on Android and desktop. If the original form field names differ from common name/phone/email labels, update the field mapping in `functions/index.js` before production.
- Confirm business phone/email/address, package prices, and itineraries before advertising them as verified.

## Project structure
```text
index.html                  Vite entry for the public single-page site
admin.html                  Separate secure admin entry
src/main.jsx                Homepage: hero, quick enquiry, places, fleet, packages, gallery…
src/site.css                Homepage styles (responsive, reveal animations)
src/firebase.js             Firebase app setup (Auth/Firestore/Storage/Functions/App Check)
src/admin.jsx               React admin login and dashboard (Packages · Places · Bookings)
src/admin.css               Responsive admin dashboard styles
functions/index.js          Validated createBooking Cloud Function (App Check enforced)
firestore.rules             Default-deny Firestore access rules (places, packages, bookings)
storage.rules               Restricted image storage rules
scripts/set-admin-claim.cjs Trusted local admin-claim setup script
```
