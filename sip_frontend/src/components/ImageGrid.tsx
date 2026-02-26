import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import type { Image } from '../types/image';
import { SortableItem } from './SortableItem';

interface Props {
  images: Image[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (image: Image) => void;
  onReorder: (
    id: string,
    prevOrder: number | null,
    nextOrder: number | null
  ) => void;
  deletingIds: string[];
}

const ImageGrid = ({
  images,
  onDelete,
  onEdit,
  onReorder,
  deletingIds
}: Props) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);

    const newImages = arrayMove(images, oldIndex, newIndex);

    // Calculate prev and next order
    const movedItem = newImages[newIndex];
    const prev = newImages[newIndex - 1] || null;
    const next = newImages[newIndex + 1] || null;

    const prevOrder = prev ? prev.order : null;
    const nextOrder = next ? next.order : null;

    onReorder(movedItem.id, prevOrder, nextOrder);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.id)}
        strategy={rectSortingStrategy}
      >
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
            mt-6
          "
        >
          {images.map((image) => (
            <SortableItem
              key={image.id}
              image={image}
              onDelete={onDelete}
              onEdit={onEdit}
              deletingIds={deletingIds}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ImageGrid;
