import ImageModel from '../models/imageModel';
import { CreateImageInput, ImageEntity } from '../types/upload';
import { IImageRepository } from './ImageRepositoryInterface';

export class ImageRepository implements IImageRepository {
  async createImages(images: CreateImageInput[]): Promise<ImageEntity[]> {
    const docs = await ImageModel.insertMany(images);

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      imageUrl: doc.imageUrl,
      storageKey: doc.storageKey,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async getMaxOrder(userId: string): Promise<number> {
    const lastImage = await ImageModel.findOne({ userId }).sort({ order: -1 }).select('order');

    return lastImage ? lastImage.order : -1;
  }

  async countImages(userId: string): Promise<number> {
    return ImageModel.countDocuments({ userId });
  }

  async findImagesByUserIdPaginated(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<ImageEntity[]> {
    const docs = await ImageModel.find({ userId }).sort({ order: 1 }).skip(skip).limit(limit);

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      imageUrl: doc.imageUrl,
      storageKey: doc.storageKey,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findAllImagesByUserId(userId: string): Promise<ImageEntity[]> {
    const docs = await ImageModel.find({ userId }).sort({ order: 1 });

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      imageUrl: doc.imageUrl,
      storageKey: doc.storageKey,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findImageById(imageId: string): Promise<ImageEntity | null> {
    const doc = await ImageModel.findById(imageId);
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      imageUrl: doc.imageUrl,
      storageKey: doc.storageKey,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async deleteImageById(imageId: string): Promise<void> {
    await ImageModel.findByIdAndDelete(imageId);
  }

  async updateImage(
    imageId: string,
    updates: {
      title?: string;
      imageUrl?: string;
      storageKey?: string;
    },
  ): Promise<ImageEntity> {
    const doc = await ImageModel.findByIdAndUpdate(imageId, { $set: updates }, { new: true });

    if (!doc) {
      throw new Error('Image not found after update');
    }

    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      imageUrl: doc.imageUrl,
      storageKey: doc.storageKey,
      order: doc.order,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async updateOrder(userId: string, imageId: string, newOrder: number): Promise<void> {
    await ImageModel.updateOne({ _id: imageId, userId }, { $set: { order: newOrder } });
  }
}
