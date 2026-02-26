import { useState } from 'react';
import ImageGrid from '../../components/ImageGrid';
import { EditImageModal } from '../../components/EditImageModal';
import type { Image } from '../../types/image';
import { useImages } from '../../hook/useImage';
import { UploadModal } from '../../components/UploadModal';

const MyImagesPage = () => {
  const {
    images,
    uploadImages,
    deleteImage,
    updateImage,
    reorderImages,
    deletingIds,
  } = useImages();

  const [selectedImage, setSelectedImage] = useState<Image | null>(
    null
  );
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="p-6 flex-1 flex flex-col  ">
      {/* Upload button */}
      {images.length === 0 ? (
        <div className="flex-1 flex items-center justify-center ">
          <div className=" text-center">
            <p className="text-lg font-medium">
              No images uploaded yet
            </p>
            <p className="text-sm mt-1">
              Upload your first image to get started
            </p>
            <div className=" mt-4  ">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="
                bg-blue-600 hover:bg-blue-700
                text-white px-3 py-2 rounded-lg
                transform transition-transform duration-150 ease-out
                active:scale-97
              "
              >
                + Upload Images
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className=" text-end  ">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="
                bg-blue-600 hover:bg-blue-700
                text-white px-3 py-2 rounded-lg
                transform transition-transform duration-150 ease-out
                active:scale-97
              "
            >
              + Upload Images
            </button>
          </div>
          {/* Image grid */}
          <ImageGrid
            images={images}
            onDelete={deleteImage}
            onEdit={(img) => setSelectedImage(img)}
            onReorder={reorderImages}
            deletingIds={deletingIds}
          />
          {/* Edit modal */}
          {selectedImage && (
            <EditImageModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onSave={updateImage}
            />
          )}
        </>
      )}

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUpload={uploadImages}
        />
      )}
    </div>
  );
};

export default MyImagesPage;
