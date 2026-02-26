import { useRef, useState } from 'react';
import type { Image } from '../types/image';
import toast from 'react-hot-toast';

interface Props {
  image: Image;
  onClose: () => void;
  onSave: (id: string, formData: FormData) => Promise<void>;
}

export const EditImageModal = ({ image, onClose, onSave }: Props) => {
  const [title, setTitle] = useState(image.title);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast('Title is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);

    if (file) {
      formData.append('file', file);
    }

    setIsSaving(true);
    await onSave(image.id, formData);
    setIsSaving(false);
    onClose();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
              Edit Image
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Update title or replace the image file
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

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Replace Image */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Replace Image{' '}
              <span className="normal-case text-gray-400">
                (optional)
              </span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
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
              className="relative cursor-pointer rounded-lg border-2 border-dashed transition-all"
              style={{
                borderColor: isDragging
                  ? '#3b82f6'
                  : file
                    ? '#10b981'
                    : '#e5e7eb',
                backgroundColor: isDragging
                  ? '#eff6ff'
                  : file
                    ? '#f0fdf4'
                    : '#fafafa',
              }}
            >
              
              <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center">
                {file ? (
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
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-55">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Click to change file
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
                      <p className="text-sm font-medium text-gray-600">
                        <span className="text-blue-500">
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            disabled={isSaving}
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 flex items-center gap-2"
            style={{
              backgroundColor: isSaving ? '#93c5fd' : '#2563eb',
            }}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
