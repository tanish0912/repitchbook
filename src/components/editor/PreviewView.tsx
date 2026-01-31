'use client';

import { usePitchStore } from '@/store/usePitchStore';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { SlideElement } from '@/types';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to render elements read-only
const ReadOnlyElement = ({ element }: { element: SlideElement }) => {
    if (element.type === 'image') {
        const imgEl = element as any;
        return (
            <div
                className="absolute"
                style={{
                    left: element.x, top: element.y,
                    width: element.w, height: element.h || 'auto',
                    zIndex: element.zIndex
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgEl.src} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
        );
    }

    if (element.type === 'text-list') {
        const textEl = element as any;
        return (
            <div
                className="absolute p-4"
                style={{
                    left: element.x, top: element.y,
                    width: element.w, height: element.h || 'auto',
                    zIndex: element.zIndex
                }}
            >
                {/* Render HTML content if available, else legacy bullets */}
                {textEl.html ? (
                    <div
                        className="prose prose-xl max-w-none text-gray-800 leading-normal"
                        dangerouslySetInnerHTML={{ __html: textEl.html }}
                    />
                ) : (
                    <div className="space-y-3">
                        {textEl.content?.map((text: string, i: number) => (
                            <div key={i} className="flex items-start">
                                <div className="mt-2 mr-3 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                <div className="text-xl text-gray-800 leading-normal">{text}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return null;
}

export const PreviewView = () => {
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const pitch = usePitchStore(state => state.pitch);
    const selectSlide = usePitchStore(state => state.selectSlide);
    const setPreviewMode = usePitchStore(state => state.setPreviewMode);

    // Fullscreen ref
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Request fullscreen on mount
        const enterFullscreen = async () => {
            try {
                if (containerRef.current && !document.fullscreenElement) {
                    await containerRef.current.requestFullscreen();
                }
            } catch (e) {
                console.error("Fullscreen failed:", e);
            }
        };
        enterFullscreen();

        // Exit handler
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // If user exited fullscreen via ESC, we should probably close preview mode too, 
                // BUT let's keep it open to allow re-entry or just simple close.
                // Actually, common behavior is to exit preview.
                setPreviewMode(false);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [setPreviewMode]);


    if (!pitch || !selectedSlideId) return null;

    const slide = pitch.slides.find(s => s.id === selectedSlideId);
    const currentIndex = pitch.slides.findIndex(s => s.id === selectedSlideId);

    if (!slide) return null;

    const hasNext = currentIndex < pitch.slides.length - 1;
    const hasPrev = currentIndex > 0;

    const goToNext = () => {
        if (hasNext) selectSlide(pitch.slides[currentIndex + 1].id);
    };

    const goToPrev = () => {
        if (hasPrev) selectSlide(pitch.slides[currentIndex - 1].id);
    };

    // Keyboard support
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'Escape') setPreviewMode(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev, setPreviewMode]);

    return (
        <div ref={containerRef} className="flex-1 flex flex-col bg-black overflow-hidden relative z-[9999] h-screen w-screen">
            <button
                onClick={() => setPreviewMode(false)}
                className="absolute top-4 right-4 z-[100] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors opacity-0 hover:opacity-100"
            >
                <X size={24} />
            </button>

            {/* Slideshow View */}
            <div className="flex-1 flex items-center justify-center bg-black relative">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="aspect-[16/9] w-full max-w-full h-full md:h-auto md:max-w-[90%] bg-white shadow-2xl overflow-hidden relative flex flex-col"
                    >
                        {/* Slide Header */}
                        <div className="h-24 px-12 flex items-center border-b border-gray-100 shrink-0">
                            <h2 className="text-4xl font-bold text-gray-900 font-display">{slide.title}</h2>
                        </div>

                        {/* Slide Body - Canvas */}
                        <div className="flex-1 relative bg-white overflow-hidden">
                            {slide.elements?.map(el => (
                                <ReadOnlyElement key={el.id} element={el} />
                            ))}

                            {(!slide.elements || slide.elements.length === 0) && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-6xl font-bold opacity-20">
                                    {pitch.pitchTitle}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="h-16 border-t border-gray-100 flex items-center justify-between px-12 text-sm text-gray-400 uppercase tracking-widest shrink-0 bg-gray-50">
                            <span>CONFIDENTIAL</span>
                            <span>{pitch.pitchTitle}</span>
                            <span>{currentIndex + 1} / {pitch.slides.length}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Overlay Buttons (Hidden in Present Mode mostly, accessible on hover) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                        onClick={goToPrev}
                        disabled={!hasPrev}
                        className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 backdrop-blur-md"
                    >
                        <ArrowLeft size={32} />
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={!hasNext}
                        className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 backdrop-blur-md"
                    >
                        <ArrowRight size={32} />
                    </button>
                </div>
            </div>
        </div>
    )
}
