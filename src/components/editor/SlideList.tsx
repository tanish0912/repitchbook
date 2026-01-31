'use client';

import { usePitchStore } from '@/store/usePitchStore';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableSlideItem = ({ slide, index, isSelected, onClick }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slide.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`
        group relative p-3 rounded-lg border mb-2 transition-colors cursor-pointer flex items-start gap-2
        ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-white bg-white hover:border-gray-200 hover:bg-gray-50'
                }
      `}
        >
            <div {...attributes} {...listeners} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                <GripVertical size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-400 font-mono mb-0.5 uppercase tracking-wider">Slide {index + 1}</div>
                <div className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                    {slide.title || 'Untitled Slide'}
                </div>
                {slide.speakerNotes && (
                    <div className="mt-1 text-[10px] text-gray-400 truncate">
                        📝 {slide.speakerNotes}
                    </div>
                )}
            </div>
        </div>
    )
}

export const SlideList = () => {
    const pitch = usePitchStore(state => state.pitch);
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const reorderSlides = usePitchStore(state => state.reorderSlides);
    const selectSlide = usePitchStore(state => state.selectSlide);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            reorderSlides(active.id as string, over?.id as string);
        }
    }

    if (!pitch) return null;

    return (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={pitch.slides}
                    strategy={verticalListSortingStrategy}
                >
                    {pitch.slides.map((slide, index) => (
                        <SortableSlideItem
                            key={slide.id}
                            slide={slide}
                            index={index}
                            isSelected={selectedSlideId === slide.id}
                            onClick={() => selectSlide(slide.id)}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
