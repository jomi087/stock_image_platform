import { Schema, model, Document, Types } from 'mongoose';

export interface IImage extends Document {
  userId: Types.ObjectId;
  title: string;
  imageUrl: string;
  storageKey: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    storageKey: {
      //unique key of stored as image key
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

imageSchema.index({ userId: 1, order: 1 });

const ImageModel = model<IImage>('Image', imageSchema);

export default ImageModel;
