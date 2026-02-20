import { NextFunction, Request, Response } from 'express';
import { SUCCESS_MESSAGES } from '../messages/success_messages';
import { HTTP_STATUS } from '../constants/http_constants';

import { IImageService } from '../services/ImageServiceInterface';
import { AppError } from '../errors/AppError';
import { VALIDATION_MESSAGES } from '../messages/validation_messages';
import { imageTitleRequest } from '../validation/uploads/imageTitleSchema';
import { deleteImageRequest } from '../validation/uploads/deleteImageSchema';
import { ImageEntity, ImageResponseDto } from '../types/upload';
import { EditImageBody, EditImageParams } from '../validation/uploads/editImageSchema';
import { ReorderRequest } from '../validation/uploads/reorderImagesSchema';

export class ImageController {
  constructor(private readonly _imageService: IImageService) {}
  private mapImageEntityToResponseDto(image: ImageEntity): ImageResponseDto {
    const { id, title, imageUrl, order, createdAt, updatedAt } = image;

    return {
      id,
      title,
      imageUrl,
      order,
      createdAt,
      updatedAt,
    };
  }

  private mapImageEntitiesToResponseDtos(images: ImageEntity[]): ImageResponseDto[] {
    return images.map((image) => this.mapImageEntityToResponseDto(image));
  }

  uploadImage = async (
    req: Request<unknown, unknown, imageTitleRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const rawFiles = req.files as Express.Multer.File[];
      const { titles } = req.body;
      if (!rawFiles || rawFiles.length == 0) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, VALIDATION_MESSAGES.IMAGES_REQUIRED);
      }

      const files = rawFiles.map((file) => ({
        buffer: file.buffer,
        size: file.size,
        mimetype: file.mimetype,
      }));

      const imageData = await this._imageService.uploadImages(req.user!.userId, files, titles);
      const response: ImageResponseDto[] = this.mapImageEntitiesToResponseDtos(imageData);

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.IMAGE_UPLOADED,
        imageData: response,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const images = await this._imageService.getUserImages(req.user!.userId);

      const response: ImageResponseDto[] = this.mapImageEntitiesToResponseDtos(images);
      res.status(HTTP_STATUS.OK).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req: Request<deleteImageRequest>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this._imageService.deleteImage(req.user!.userId, id);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.IMAGE_DELETED,
      });
    } catch (error) {
      next(error);
    }
  };

  editImage = async (
    req: Request<EditImageParams, unknown, EditImageBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const fileInput = req.file
        ? {
            buffer: req.file.buffer,
            size: req.file.size,
            mimetype: req.file.mimetype,
          }
        : undefined;

      const updatedImage = await this._imageService.editImage(req.user!.userId, id, {
        title,
        file: fileInput,
      });

      const response: ImageResponseDto = this.mapImageEntityToResponseDto(updatedImage);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.IMAGE_UPDATED,
        imageData: response,
      });
    } catch (error) {
      next(error);
    }
  };

  reorderImages = async (
    req: Request<unknown, unknown, ReorderRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { imageId, prevOrder, nextOrder } = req.body;

      await this._imageService.reorderImage(req.user!.userId, imageId, prevOrder, nextOrder);

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.IMAGES_REORDERED,
      });
    } catch (error) {
      next(error);
    }
  };
}
