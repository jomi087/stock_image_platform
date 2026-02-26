import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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

export const UploadModal = ({ onUpload, onClose }: Props) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map((file) => ({
      file,
      title: '',
      preview: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...mapped]);
    
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const handleTitleChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, title: value } : item
      )
    );
  };

  const handleRemove = (index: number) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload Images</h2>
          <button
            disabled={isUploading}
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">
              Drop the images here…
            </p>
          ) : (
            <p className="text-gray-600">
              Drag & drop images here, or click to select
            </p>
          )}
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
