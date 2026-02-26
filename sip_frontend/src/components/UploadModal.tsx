//HERE YOU CAN INSTEAD OF DOING MANULY THERE IS A LIABRARY REACT_DROPZONE IT WILL HELP (exmaple chekc UploadModalWithDropZone component)
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface UploadItem {
  file: File;
  title: string;
  preview: string;
}

interface Props {
  onUpload: (files: File[], titles: string[]) => Promise<boolean>;
  onClose: () => void;
}

export const UploadModal: React.FC<Props> = ({
  onClose,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newItems = files.map(
      (file): UploadItem => ({
        file,
        title: '',
        preview: URL.createObjectURL(file),
      })
    );

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!droppedFiles.length) return;

    const validFiles = droppedFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length !== droppedFiles.length) {
      toast('Some files were ignored (not images)');
    }

    const newItems = validFiles.map(
      (file): UploadItem => ({
        file,
        title: '',
        preview: URL.createObjectURL(file),
      })
    );
    setItems((prev) => [...prev, ...newItems]);
  };

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const handleRemove = (index: number) => {
    setItems((prev) => {
      const item = prev[index];
      URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleTitleChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, title: value } : item
      )
    );
  };

  const handleUpload = async () => {
    if (!items.length) return;

    if (items.some((item) => !item.title.trim())) {
      toast('All images must have a title');
      return;
    }

    setIsUploading(true);

    const success = await onUpload(
      items.map((i) => i.file),
      items.map((i) => i.title)
    );

    setIsUploading(false);

    if (success) {
      setItems([]);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between  py-1 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
              Upload Image
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Upload Multiple Images with apropriate title
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleFileChange}
            hidden
          />
          <div
            onClick={handleButtonClick}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="relative cursor-pointer rounded-lg border-2 border-dashed transition-all active:scale-99"
            style={{
              borderColor: isDragging
                ? '#3b82f6'
                : items.length > 0
                  ? '#10b981'
                  : '#e5e7eb',
              backgroundColor: isDragging
                ? '#eff6ff'
                : items.length > 0
                  ? '#f0fdf4'
                  : '#fafafa',
            }}
          >
            <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center">
              {items.length > 0 ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-emerald-600"
                    >
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {items.length === 1
                        ? items[0].file.name
                        : `${items.length} files selected`}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      Click or drag to add more
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gray-500"
                    >
                      <path
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 hover:scale-98">
                      <span className="text-blue-500 ">
                        Click to upload
                      </span>{' '}
                      or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      PNG, JPG, GIF, WEBP supported
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-2 space-y-2 bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={item.preview}
                      alt="preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      disabled={isUploading}
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded"
                    >
                      ✕
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter title"
                    disabled={isUploading}
                    value={item.title}
                    onChange={(e) =>
                      handleTitleChange(index, e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {isUploading
                ? 'Uploading...'
                : `Upload ${items.length} image${items.length > 1 ? 's' : ''}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
