'use client';

import { usePitchStore } from '@/store/usePitchStore';
import { DraggableWrapper } from './DraggableWrapper';
import { Image, Type, Plus } from 'lucide-react';
import { SlideElement } from '@/types';

export const SlideCanvas = () => {
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const pitch = usePitchStore(state => state.pitch);
    const addElement = usePitchStore(state => state.addElement);
    const selectElement = usePitchStore(state => state.selectElement);

    const slide = pitch?.slides.find(s => s.id === selectedSlideId);

    if (!slide) return <div className="flex-1" />;



    const handleCanvasClick = (e: React.MouseEvent) => {
        // Deselect if clicking blank canvas
        if (e.target === e.currentTarget) {
            selectElement(null);
        }
    }

    return (
        <div
            className="relative w-[1280px] h-[720px] bg-white shadow-2xl shrink-0 overflow-hidden"
            style={{
                transform: 'scale(0.85)',
                transformOrigin: 'center center',
            }}
            onClick={handleCanvasClick}
        >
            {/* Grid/Guides could go here */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {slide.elements?.map(el => (
                <DraggableWrapper key={el.id} element={el} slideId={slide.id} />
            ))}

            {(!slide.elements || slide.elements.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-4 opacity-10">
                        <div className="w-16 h-16 border-2 border-black rounded-lg border-dashed"></div>
                        <div className="font-bold text-4xl text-black">Slide {selectedSlideId?.slice(0, 4)}</div>
                    </div>
                </div>
            )}

            {/* Quick Add Overlay (Floating on Canvas?) */}
            {/* Actually, EditorLayout has a toolbar. We might prefer drag/drop from there. 
                For now, let's keep a subtle floating plus if empty? No, adhere to layout. */}

            {/* Quick Add Overlay removed as per request for Toolbar-only workflow */}
        </div>
    );
}
