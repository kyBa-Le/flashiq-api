import cors from 'cors';

export const corsConfig = () => {
  const allowedOrigins = (process.env.FRONTEND_URLS || '').split(',');

  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
};
