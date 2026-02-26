import { useState, useEffect } from 'react';

interface UploadItem {
  file: File;
  title: string;
  preview: string;
}

interface Props {
  onUpload: (files: File[], titles: string[]) => void;
}

const UploadSection = ({ onUpload }: Props) => {
  const [items, setItems] = useState<UploadItem[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newItems = selectedFiles.map((file) => ({
      file,
      title: '',
      preview: URL.createObjectURL(file),
    }));

    setItems(newItems);
  };

  const handleTitleChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, title: value } : item
      )
    );
  };

  const handleUpload = () => {
    if (!items.length) return;

    onUpload(
      items.map((i) => i.file),
      items.map((i) => i.title)
    );

    setItems([]);
  };

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [items]);

  return (
    <div className="border p-4 rounded shadow">
      <input type="file" multiple onChange={handleFileChange} />

      {items.map((item, index) => (
        <div key={index} className="mt-3 space-y-2">
          <p className="text-sm font-medium">{item.file.name}</p>

          <img
            src={item.preview}
            alt={item.file.name}
            className="w-32 h-32 object-cover rounded"
          />

          <input
            type="text"
            placeholder="Enter title"
            value={item.title}
            onChange={(e) => handleTitleChange(index, e.target.value)}
            className="border p-1 w-full"
          />
        </div>
      ))}

      {items.length > 0 && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default UploadSection;
