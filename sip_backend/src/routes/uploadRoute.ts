import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { ImageController } from '../controllers/ImageController';
import { upload } from '../middleware/upload';
import { imageTitleSchema } from '../validation/uploads/imageTitleSchema';
import { validateRequest } from '../middleware/validateRequest';
import { ImageService } from '../services/ImageService';
import { ImageRepository } from '../repositories/ImageRepository';
import { CloudinaryImageStorageService } from '../infrastructure/storage/CloudinaryImageStorageService';
import { deleteImageSchema } from '../validation/uploads/deleteImageSchema';
import { editImageSchema } from '../validation/uploads/editImageSchema';
import { reorderImagesSchema } from '../validation/uploads/reorderImagesSchema';

const imageStorageService = new CloudinaryImageStorageService();
const imageRepository = new ImageRepository();
const imageService = new ImageService(imageStorageService, imageRepository);
const imageController = new ImageController(imageService);

const router = Router();

router.post(
  '/upload',
  authMiddleware,
  upload.array('files'),
  validateRequest(imageTitleSchema),
  imageController.uploadImage,
);

router.get('/', authMiddleware, imageController.getUserImages);

router.delete(
  '/:id',
  authMiddleware,
  validateRequest(deleteImageSchema),
  imageController.deleteImage,
);

router.patch(
  '/:id',
  authMiddleware,
  upload.single('file'),
  validateRequest(editImageSchema),
  imageController.editImage,
);

router.patch(
  '/reorder',
  authMiddleware,
  validateRequest(reorderImagesSchema),
  imageController.reorderImages,
);

export default router;
