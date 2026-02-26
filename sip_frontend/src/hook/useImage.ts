import { useEffect, useState } from 'react';
import StorageService from '../services/StorageService';
import type { Image } from '../types/image';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await StorageService.fetchImages();
        setImages(res.data.data);
      } catch (error) {
        let errorMsg = 'failed to get data';
        if (axios.isAxiosError(error)) {
          errorMsg = error.response?.data?.message || errorMsg;
        }
        toast.error(errorMsg);
      }
    }
    fetchImages();
  }, []);

  const deleteImage = async (id: string) => {
    if (deletingIds.includes(id)) return;
    setDeletingIds((prev) => [...prev, id]);

    try {
      await StorageService.deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success('Deleted');
    } catch (error) {
      let errorMsg = 'Delete failed';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      toast.error(errorMsg);
    } finally {
      setDeletingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const uploadImages = async (files: File[], titles: string[]) => {
    try {
      const res = await StorageService.uploadImages(files, titles);
      const newImages = res.data.imageData;

      setImages((prev) => [...prev, ...newImages]);

      toast.success(res.data.message);

      return true;
    } catch (error) {
      let errorMsg = 'Upload failed';

      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }

      toast.error(errorMsg);
      return false;
    }
  };

  const updateImage = async (id: string, formData: FormData) => {
    try {
      const res = await StorageService.updateImage(id, formData);
      const updatedData = res.data.imageData;
      toast.success(res.data.message);
      setImages((prev) =>
        prev.map((data) => {
          return data.id == id ? updatedData : data;
        })
      );
    } catch (error) {
      let errorMsg = 'upload failed';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      toast.error(errorMsg);
    }
  };

  const reorderImages = async (
    imageId: string,
    prevOrder: number | null,
    nextOrder: number | null
  ) => {
    try {
      await StorageService.reorderImage(
        imageId,
        prevOrder,
        nextOrder
      );
      const res = await StorageService.fetchImages();
      setImages(res.data.data);
    } catch (error) {
      let errorMsg = 'reorder failed';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      toast.error(errorMsg);
    }
  };

  return {
    images,
    uploadImages,
    deleteImage,
    updateImage,
    reorderImages,
    deletingIds,
  };
};
