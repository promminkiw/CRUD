import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let app: admin.app.App | null = null;

export function getFirebaseApp() {
  if (app) return app;

  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!envPath) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_PATH in .env');
  }

  const absolutePath = path.isAbsolute(envPath)
    ? envPath
    : path.resolve(process.cwd(), envPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Service account file not found: ${absolutePath}\n` +
      `Tip: Put serviceAccountKey.json in backend/ and set FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json`,
    );
  }

  const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return app;
}

export function getFirestore() {
  const app = getFirebaseApp();
  return app.firestore();
}
