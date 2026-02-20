import { Router } from 'express';

import authRoutes from './authRoute';
import uploadRoutes from './uploadRoute';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/image', uploadRoutes);
