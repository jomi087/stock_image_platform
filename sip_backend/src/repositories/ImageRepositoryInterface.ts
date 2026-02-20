import { CreateImageInput, ImageEntity } from '../types/upload';

export interface IImageRepository {
  createImages(images: CreateImageInput[]): Promise<ImageEntity[]>;
  getMaxOrder(userId: string): Promise<number>;
  countImages(userId: string): Promise<number>;
  findImagesByUserIdPaginated(userId: string, skip: number, limit: number): Promise<ImageEntity[]>;
  findAllImagesByUserId(userId: string): Promise<ImageEntity[]>;
  findImageById(imageId: string): Promise<ImageEntity | null>;
  deleteImageById(imageId: string): Promise<void>;
  updateImage(
    imageId: string,
    updates: {
      title?: string;
      imageUrl?: string;
      storageKey?: string;
    },
  ): Promise<ImageEntity>;
  updateOrder(userId: string, imageId: string, newOrder: number): Promise<void>;
}
