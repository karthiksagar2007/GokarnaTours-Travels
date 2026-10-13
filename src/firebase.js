import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const env = import.meta.env;
const required = ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_AUTH_DOMAIN','VITE_FIREBASE_PROJECT_ID','VITE_FIREBASE_APP_ID'];
export const firebaseConfigured = required.every((key) => Boolean(env[key] && !String(env[key]).startsWith('replace_')));

let app = null;
if (firebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });
  if (env.VITE_FIREBASE_APPCHECK_SITE_KEY && !window.__gokarnaAppCheckInitialized) {
    try {
      initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(env.VITE_FIREBASE_APPCHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
      window.__gokarnaAppCheckInitialized = true;
    } catch (error) { console.warn('Firebase App Check initialization needs configuration.', error); }
  }
}

export const firebaseApp = app;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const functions = app ? getFunctions(app, env.VITE_FIREBASE_FUNCTIONS_REGION || 'asia-south1') : null;
