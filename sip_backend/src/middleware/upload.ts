import multer from 'multer';
import { MAX_CAP_4_ALL_IMAGE } from '../constants/validation_constants';
import { VALIDATION_MESSAGES } from '../messages/validation_messages';

export const upload = multer({
  storage: multer.memoryStorage(),

  //global gateway protection for this platform,
  limits: {
    fileSize: MAX_CAP_4_ALL_IMAGE, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error(VALIDATION_MESSAGES.IMAGE_FILE_ALLOWED));
    } else {
      cb(null, true);
    }
  },
});
