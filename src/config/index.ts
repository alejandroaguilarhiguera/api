import Dotenv from 'dotenv';

Dotenv.config();
export default {
  APP_URL: process.env.APP_URL,
  API_URL: process.env.API_URL,
  WEBAPP_URL: process.env.WEBAPP_URL,
  API_REFRESH_TOKEN_EXPIRES_IN: process.env.API_REFRESH_TOKEN_EXPIRES_IN || '1w',
};
