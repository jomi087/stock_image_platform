import { PASSWORD_MIN_LENGTH } from '../constants/validation_constants';

export const VALIDATION_MESSAGES = {
  MOBILE_INVALID: 'Invalid mobile number',
  MOBILE_REQUIRED: 'mobile number required',

  PASSWORD_MIN_LENGTH_REQUIRED: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_REQUIRED: 'Password is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',

  IMAGE_FILE_ALLOWED: 'Only image files are allowed',
  IMAGES_REQUIRED: 'Images are required',
};
