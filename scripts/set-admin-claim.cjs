/* Run only on a trusted developer machine. Never ship service-account credentials to the browser. */
const { initializeApp, applicationDefault } = require('../functions/node_modules/firebase-admin/app');
const { getAuth } = require('../functions/node_modules/firebase-admin/auth');
const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
const email = process.argv[2];
if (!projectId || !email) {
  console.error('Usage: GCLOUD_PROJECT=your-project-id GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json npm run set-admin -- admin@example.com');
  process.exit(1);
}
initializeApp({ credential: applicationDefault(), projectId });
(async () => {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  console.log(`Admin claim set for ${email}. Ask the user to sign out and sign back in to refresh the ID token.`);
  process.exit(0);
})().catch((error) => { console.error(error.message); process.exit(1); });
