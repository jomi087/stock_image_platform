import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { IImageStorageService } from './ImageStorageServiceInterface';

export class CloudinaryImageStorageService implements IImageStorageService {
  constructor() {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error('image upload configuration missing');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    buffer: Buffer,
    folder: string = 'Stock_Imag',
  ): Promise<{ secureUrl: string; storageKey: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error || !result) {
          return reject(error as Error);
        }
        resolve({
          secureUrl: result.secure_url,
          storageKey: result.public_id,
        });
      });

      Readable.from(buffer).pipe(stream);
    });
  }

  async deleteImage(storageKey: string): Promise<void> {
    await cloudinary.uploader.destroy(storageKey);
  }
}
