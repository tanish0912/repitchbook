'use client';

import { SlideElement } from '@/types';
import { usePitchStore } from '@/store/usePitchStore';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { ResizableBox } from 'react-resizable';
import { useState, useRef } from 'react';
import { GripHorizontal, Trash2, Layers } from 'lucide-react';

interface DraggableWrapperProps {
    element: SlideElement;
    slideId: string;
}

export const DraggableWrapper = ({ element, slideId }: DraggableWrapperProps) => {
    const updateElement = usePitchStore(state => state.updateElement);
    const removeElement = usePitchStore(state => state.removeElement);
    const selectElement = usePitchStore(state => state.selectElement);
    const selectedElementId = usePitchStore(state => state.selectedElementId);

    const isSelected = selectedElementId === element.id;

    // Simple Drag Logic
    const handlePointerDown = (e: React.PointerEvent) => {
        // Select element on click
        selectElement(element.id);

        // Check if clicking the Drag Handle
        const isDragHandle = (e.target as HTMLElement).closest('.custom-drag-handle');

        // If NOT drag handle, allow default behavior (text selection etc) normally
        // But we still want to select the element
        if (!isDragHandle) {
            return;
        }

        // If Drag Handle, prevent default and start drag
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = element.x;
        const startTop = element.y;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            updateElement(slideId, element.id, { x: startLeft + dx, y: startTop + dy });
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    const handleResize = (e: any, { size }: any) => {
        updateElement(slideId, element.id, { w: size.width, h: size.height });
    }

    // Handles to improve
    const bringToFront = () => updateElement(slideId, element.id, { zIndex: (element.zIndex || 1) + 1 });
    const sendToBack = () => updateElement(slideId, element.id, { zIndex: Math.max(0, (element.zIndex || 1) - 1) });

    return (
        <div
            className="absolute"
            style={{
                left: element.x,
                top: element.y,
                zIndex: element.zIndex,
                width: element.w,
                height: element.h || 'auto'
            }}
            onPointerDown={handlePointerDown}
        >
            <ResizableBox
                width={element.w}
                height={element.h || 200}
                axis="both"
                onResize={handleResize}
                resizeHandles={['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']}
                handle={(handleAxis: any, ref: any) => (
                    <div
                        ref={ref}
                        className={`absolute z-40 ${isSelected ? 'opacity-100' : 'opacity-0'}
                            ${handleAxis === 'n' ? 'top-0 left-0 w-full h-1 cursor-ns-resize hover:bg-blue-400/50' : ''}
                            ${handleAxis === 's' ? 'bottom-0 left-0 w-full h-1 cursor-ns-resize hover:bg-blue-400/50' : ''}
                            ${handleAxis === 'e' ? 'top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-400/50' : ''}
                            ${handleAxis === 'w' ? 'top-0 left-0 w-1 h-full cursor-ew-resize hover:bg-blue-400/50' : ''}
                            ${handleAxis === 'ne' ? '-top-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-ne-resize' : ''}
                            ${handleAxis === 'nw' ? '-top-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-nw-resize' : ''}
                            ${handleAxis === 'se' ? '-bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-se-resize' : ''}
                            ${handleAxis === 'sw' ? '-bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-sw-resize' : ''}
                        `}
                    />
                )}
                draggableOpts={{ enableUserSelectHack: false }}
            >
                <div className={`
                    group/wrapper relative w-full h-full transition-all rounded-lg overflow-visible
                    ${isSelected ? 'ring-1 ring-blue-500 bg-white/5' : 'hover:ring-1 hover:ring-blue-300/50'}
                `}>

                    {/* Floating Controls - Visible when selected */}
                    {isSelected && (
                        <div
                            className="absolute -top-8 left-0 h-7 bg-obsidian-light text-white border border-white/10 rounded-md px-2 flex items-center gap-2 shadow-xl z-[60]"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{element.type}</span>
                            <div className="w-px h-3 bg-white/20 mx-1" />
                            <button onClick={sendToBack} title="Send Backward" className="hover:text-blue-400 p-1"><Layers size={12} className="rotate-180" /></button>
                            <button onClick={bringToFront} title="Bring Forward" className="hover:text-blue-400 p-1"><Layers size={12} /></button>
                            <div className="w-px h-3 bg-white/20 mx-1" />
                            <button onClick={() => removeElement(slideId, element.id)} className="hover:text-red-400 p-1"><Trash2 size={12} /></button>
                        </div>
                    )}

                    {/* Drag Handle - Top Center */}
                    <div
                        className={`custom-drag-handle absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-gray-200 hover:bg-blue-500 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-opacity z-50 ${isSelected || 'group-hover/wrapper:opacity-100 opacity-0'}`}
                    >
                        <GripHorizontal size={12} className="text-gray-500 hover:text-white" />
                    </div>

                    {/* Content */}
                    <div className="w-full h-full overflow-hidden">
                        {element.type === 'image' && <ImageBlock element={element as any} slideId={slideId} />}
                        {element.type === 'text-list' && <TextBlock element={element as any} slideId={slideId} />}
                    </div>
                </div>
            </ResizableBox>
        </div>
    );
}
