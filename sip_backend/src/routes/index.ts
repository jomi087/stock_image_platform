import { Router } from 'express';

import authRoutes from './authRoute';

export const router = Router();

router.use('/auth', authRoutes);
