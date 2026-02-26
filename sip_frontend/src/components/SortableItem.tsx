import type { Image } from '../types/image';
import ImageCard from './ImageCard';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface SortableProps {
  image: Image;
  onDelete: (id: string) => Promise<void>;
  deletingIds: string[];
  onEdit: (image: Image) => void;
}

export const SortableItem = ({
  image,
  onDelete,
  onEdit,
  deletingIds,
}: SortableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ImageCard
        image={image}
        onDelete={onDelete}
        isDeleting={deletingIds.includes(image.id)}
        onEdit={onEdit}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
    </div>
  );
};
