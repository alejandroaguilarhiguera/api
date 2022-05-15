declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_PORT: string;
    API_PREFIX: string;
    API_UPLOADS_PATH: string;
    API_UPLOADS_URL: string;
    API_STATICS_PATH: string;
    API_STATICS_URL: string;
    API_DOMAIN: string;
    API_SECURITY_SALT: string;
    API_SECURITY_CYPHER: string;
    API_REFRESH_TOKEN_EXPIRES_IN: string;
    API_EMAIL_NOREPLY: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
  }
}
