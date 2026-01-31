'use client';

import { ImageElement } from '@/types';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { usePitchStore } from '@/store/usePitchStore';

interface ImageBlockProps {
    element: ImageElement;
    slideId: string;
}

export const ImageBlock = ({ element, slideId }: ImageBlockProps) => {
    const updateElement = usePitchStore(state => state.updateElement);

    const onResizeStop = (e: any, data: any) => {
        updateElement(slideId, element.id, { w: data.size.width, h: data.size.height });
    };

    // We wrap the content in ResizableBox, but the Dragging is handled by the parent Canvas wrapper.
    // We need to ensure pointer events propagate correctly.

    return (
        <div className="w-full h-full relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={element.src}
                alt=""
                className="w-full h-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow pointer-events-none select-none"
            />

            {/* Visual resize hint overlay could go here */}
        </div>
    );
};
