import admin from 'firebase-admin';
import { ENV } from './env';

let firebaseApp: admin.app.App | null = null;

export function getFirebase() {
  if (!firebaseApp) {
    try {
      const serviceAccount = {
        type: 'service_account',
        project_id: ENV.FIREBASE_PROJECT_ID,
        private_key_id: ENV.FIREBASE_PRIVATE_KEY_ID,
        private_key: ENV.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(
          /"/g,
          ''
        ),
        client_email: ENV.FIREBASE_CLIENT_EMAIL,
        client_id: ENV.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
      });
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    }
  }

  return firebaseApp;
}

export const getMessaging = () => getFirebase().messaging();
