import type { Image } from '../types/image';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface Props {
  image: Image;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
  onEdit: (image: Image) => void;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
}

const ImageCard = ({
  image,
  onDelete,
  isDeleting,
  onEdit,
  dragAttributes,
  dragListeners,
}: Props) => {
  return (
    <div className="group relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
      {/* 🔹 Drag Handle (TOP LEFT CORNER) */}
      <button
        {...dragAttributes}
        {...dragListeners}
        type="button"
        className="absolute top-2 left-2 z-10 bg-white/80 px-2 py-1 rounded text-xs cursor-grab active:cursor-grabbing shadow"
      >
        ⠿
      </button>

      {/* 🔹 Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="
            w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* 🔹 Hover overlay */}
      <div
        className="
          absolute inset-0 bg-black/40
          opacity-0 group-hover:opacity-100
          transition
          flex items-center justify-center gap-3
        "
      >
        <button
          type="button"
          onClick={() => onEdit(image)}
          className="bg-white text-sm px-3 py-1 rounded-lg shadow hover:bg-gray-100"
        >
          Edit
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(image.id)}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg shadow hover:bg-red-600"
        >
          {isDeleting ? 'Deleting' : 'Delete'}
        </button>
      </div>

      {/* 🔹 Title */}
      <div className="p-2">
        <p className="text-sm font-medium line-clamp-2">
          {image.title || 'Untitled'}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
