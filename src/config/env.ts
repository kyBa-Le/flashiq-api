const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  DATABASE_URL: getEnv('DATABASE_URL'),

  BCRYPT_SALT_ROUNDS: Number(getEnv('BCRYPT_SALT_ROUNDS', '10')),
  EMAIL_VERIFY_EXPIRE_MINUTES: Number(
    getEnv('EMAIL_VERIFY_EXPIRE_MINUTES', '15')
  ),

  MAIL_USER: getEnv('MAIL_USER'),
  MAIL_PASS: getEnv('MAIL_PASS'),

  PORT: Number(getEnv('PORT', '3000')),
  BACKEND_URL: getEnv('BACKEND_URL', 'http://localhost:3000'),

  MAX_REQUEST: getEnv('MAX_REQUEST', '20'),
  MAX_AUTH_REQUEST: getEnv('MAX_AUTH_REQUEST', '5'),

  GEMINI_API_KEY: getEnv('GEMINI_API_KEY'),
  GEMINI_MODEL: getEnv('GEMINI_MODEL', 'gemini-2.5-flash'),
};
