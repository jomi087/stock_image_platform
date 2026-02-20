export interface ImageEntity {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  storageKey: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadImageInput {
  buffer: Buffer;
  size: number;
  mimetype: string;
}

export interface UpdateImageInput {
  title?: string;
  file?: UploadImageInput;
}

export interface CreateImageInput {
  userId: string;
  title: string;
  imageUrl: string;
  storageKey: string;
  order: number;
}

export interface ImageResponseDto {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
