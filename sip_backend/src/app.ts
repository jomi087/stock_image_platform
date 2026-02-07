import express from 'express';
import cors from 'cors';

import { corsOptions } from './config/cors';

export const app = express();

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: process.env.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_LIMIT }));

app.get('/test', (req, res) => {
  res.send('STOCK IMAGE API IS RUNNING');
});
