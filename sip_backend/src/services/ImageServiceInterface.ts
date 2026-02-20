import { ImageEntity, UpdateImageInput, UploadImageInput } from '../types/upload';

export interface IImageService {
  uploadImages(userId: string, files: UploadImageInput[], titles: string[]): Promise<ImageEntity[]>;
  getUserImages(userId: string): Promise<ImageEntity[]>;
  deleteImage(userId: string, imageId: string): Promise<void>;
  editImage(userId: string, imageId: string, input: UpdateImageInput): Promise<ImageEntity>;
  reorderImage(
    userId: string,
    imageId: string,
    prevOrder: number | null,
    nextOrder: number | null,
  ): Promise<void>;
}
