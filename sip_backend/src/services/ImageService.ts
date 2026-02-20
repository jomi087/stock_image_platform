import { IImageService } from './ImageServiceInterface';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/http_constants';
import { CreateImageInput, ImageEntity, UpdateImageInput, UploadImageInput } from '../types/upload';
import { MAX_CAP_IMAGE } from '../constants/validation_constants';
import { IImageStorageService } from '../infrastructure/storage/ImageStorageServiceInterface';
import { IImageRepository } from '../repositories/ImageRepositoryInterface';
import { UPLOAD_IMAGE_MESSAGES } from '../messages/upload_message';

export class ImageService implements IImageService {
  constructor(
    private readonly _imageStorageService: IImageStorageService,
    private readonly _imageRepository: IImageRepository,
  ) {}

  async uploadImages(
    userId: string,
    files: UploadImageInput[],
    titles: string[],
  ): Promise<ImageEntity[]> {
    if (files.length !== titles.length) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, UPLOAD_IMAGE_MESSAGES.TITLE_MISMATCH);
    }

    const currentMaxOrder = await this._imageRepository.getMaxOrder(userId);

    const uploadedImages: CreateImageInput[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_CAP_IMAGE) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, UPLOAD_IMAGE_MESSAGES.IMAGE_TOO_LARGE);
      }

      const { secureUrl, storageKey } = await this._imageStorageService.uploadImage(
        files[i].buffer,
      );
      uploadedImages.push({
        userId,
        title: titles[i],
        imageUrl: secureUrl,
        storageKey,
        order: currentMaxOrder + i + 1,
      });
    }
    return await this._imageRepository.createImages(uploadedImages);
  }

  async getUserImages(userId: string): Promise<ImageEntity[]> {
    const images = await this._imageRepository.findAllImagesByUserId(userId);
    return images;
  }

  async deleteImage(userId: string, imageId: string): Promise<void> {
    const image = await this._imageRepository.findImageById(imageId);

    if (!image) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, UPLOAD_IMAGE_MESSAGES.IMAGE_NOT_FOUND);
    }

    if (image.userId !== userId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, UPLOAD_IMAGE_MESSAGES.DELETE_FORBIDDEN);
    }

    await this._imageStorageService.deleteImage(image.storageKey);

    await this._imageRepository.deleteImageById(imageId);
  }

  async editImage(userId: string, imageId: string, input: UpdateImageInput): Promise<ImageEntity> {
    const image = await this._imageRepository.findImageById(imageId);

    if (!image) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, UPLOAD_IMAGE_MESSAGES.IMAGE_NOT_FOUND);
    }

    if (image.userId !== userId) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, UPLOAD_IMAGE_MESSAGES.EDIT_FORBIDDEN);
    }

    if (!input.file && !input.title) {
      return image;
    }

    const updates: {
      title?: string;
      imageUrl?: string;
      storageKey?: string;
    } = {};

    if (input.title && input.title !== image.title) {
      updates.title = input.title;
    }

    if (input.file) {
      if (input.file.size > MAX_CAP_IMAGE) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, UPLOAD_IMAGE_MESSAGES.IMAGE_TOO_LARGE);
      }

      const { secureUrl, storageKey } = await this._imageStorageService.uploadImage(
        input.file.buffer,
      );

      await this._imageStorageService.deleteImage(image.storageKey);

      updates.imageUrl = secureUrl;
      updates.storageKey = storageKey;
    }

    return await this._imageRepository.updateImage(imageId, updates);
  }

  async reorderImage(
    userId: string,
    imageId: string,
    prevOrder: number | null,
    nextOrder: number | null,
  ): Promise<void> {
    const image = await this._imageRepository.findImageById(imageId);

    if (!image || image.userId !== userId) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, UPLOAD_IMAGE_MESSAGES.INVALID_REORDER_IDS);
    }

    let newOrder: number;

    if (prevOrder === null && nextOrder === null) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid reorder operation');
    }

    if (prevOrder === null) {
      // moved to top
      newOrder = nextOrder! - 1;
    } else if (nextOrder === null) {
      // moved to bottom
      newOrder = prevOrder + 1;
    } else {
      // moved between two
      newOrder = (prevOrder + nextOrder) / 2;
    }

    await this._imageRepository.updateOrder(userId, imageId, newOrder);
  }
}
