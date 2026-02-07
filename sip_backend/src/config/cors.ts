import { CorsOptions } from 'cors';

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // allow server-to-server & postman

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // allow
    } else {
      callback(new Error('Not allowed by CORS')); // block
    }
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
