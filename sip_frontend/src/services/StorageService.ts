import { API_ROUTES } from '../constants/api_constants';
import axiosInstance from './axiosConfig';

const { STORAGE } = API_ROUTES;

class StorageService {
  fetchImages() {
    return axiosInstance.get(STORAGE.GETIMAGE);
  }

  deleteImage(id: string) {
    return axiosInstance.delete(STORAGE.DELETEIMAGE(id));
  }

  updateImage(id: string, formData: FormData) {
    return axiosInstance.patch(STORAGE.EDITIMAGE(id), formData);
  }

  uploadImages(files: File[], titles: string[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('file', file);
    });

    titles.forEach((title) => {
      formData.append('titles', title);
    });

    return axiosInstance.post(STORAGE.UPLOADIMAGE, formData);
  }

  reorderImage(
    imageId: string,
    prevOrder: number | null,
    nextOrder: number | null
  ) {
    return axiosInstance.patch(STORAGE.RE_ARRANGEIMAGE, {
      imageId,
      prevOrder,
      nextOrder,
    });
  }
}

export default new StorageService();
