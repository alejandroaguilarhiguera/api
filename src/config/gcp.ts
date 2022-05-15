/* eslint-disable */
/* prettier-disable */
import dotenv from 'dotenv';
dotenv.config();

export default {
  projectId: process.env.GCP_PROJECT_ID || 'projectId',
  storage: {
    bucketName: process.env.GCP_STORAGE_BUCKET_NAME || 'my-bucket',
  },
  databaseURL: process.env.FIREBASE_DB,
  credentials: {
    type: process.env.GCP_CREDENTIALS_TYPE,
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.GCP_CREDENTIALS_KEY_ID,
    private_key: String(process.env.GCP_CREDENTIALS_KEY).replace(/\\n/g, '\n'),
    client_email: process.env.GCP_CREDENTIALS_CLIENT_EMAIL,
    client_id: process.env.GCP_CREDENTIALS_CLIENT_ID,
    auth_uri: process.env.GCP_CREDENTIALS_AUTH_URI,
    token_uri: process.env.GCP_CREDENTIALS_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GCP_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GCP_CREDENTIALS_CLIENT_X509_CERT_URL,
  },
  firestore: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
};
