export interface IImageStorageService {
  uploadImage(buffer: Buffer, folder?: string): Promise<{ secureUrl: string; storageKey: string }>;
  deleteImage(storageKey: string): Promise<void>;
}
