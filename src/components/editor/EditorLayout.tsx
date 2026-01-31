'use client';

import { usePitchStore } from '@/store/usePitchStore';
import { SlideCanvas } from './canvas/SlideCanvas';
import { useEditorHotkeys } from '@/hooks/useEditorHotkeys';
import { ChevronRight, Settings, Plus, Layout, Type, Image as LucideImage, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { GlobalToolbar } from './GlobalToolbar';

export const EditorLayout = () => {
    useEditorHotkeys();

    const pitch = usePitchStore(state => state.pitch);
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const selectSlide = usePitchStore(state => state.selectSlide);
    const addSlide = usePitchStore(state => state.addSlide);

    if (!pitch) return <div className="min-h-screen bg-obsidian flex items-center justify-center text-white">Loading...</div>;

    const handleAddSlide = () => {
        addSlide({
            id: crypto.randomUUID(),
            title: 'New Slide',
            elements: [],
            speakerNotes: '',
        });
    }

    return (
        <div className="flex h-screen w-screen bg-obsidian overflow-hidden text-white font-sans">
            {/* 1. Left Sidebar: Thumbnails */}
            <div className="w-64 flex flex-col border-r border-white/5 bg-obsidian-light shrink-0">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                    </Link>
                    <h1 className="font-display font-bold truncate text-sm text-gray-200">{pitch.pitchTitle}</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {pitch.slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            onClick={() => selectSlide(slide.id)}
                            className={`
                                group relative aspect-video rounded-lg border transition-all cursor-pointer
                                ${selectedSlideId === slide.id
                                    ? 'border-blue-500 shadow-[0_0_15px_-5px_rgba(37,99,235,0.5)]'
                                    : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'}
                            `}
                        >
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur text-[10px] flex items-center justify-center font-mono">
                                {index + 1}
                            </div>
                            <div className="w-full h-full bg-white rounded-[7px] overflow-hidden p-2">
                                <div className="text-[6px] text-black font-bold truncate">{slide.title}</div>
                                {/* Mini thumbnail preview logic could go here */}
                                <div className="mt-1 w-full h-px bg-gray-100" />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddSlide}
                        className="w-full py-4 border border-dashed border-white/10 rounded-lg text-gray-500 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest"
                    >
                        <Plus size={14} /> New Slide
                    </button>
                </div>
            </div>

            {/* 2. Main Canvas Area */}
            <div className="flex-1 flex flex-col relative bg-[#1c1c1f]">
                {/* Toolbar */}
                <GlobalToolbar />

                {/* Canvas Viewport */}
                <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-transparent">
                    <SlideCanvas />
                </div>
            </div>

            {/* 3. Right Sidebar: Properties (Contextual) - Placeholder for now */}
            <div className="w-64 border-l border-white/5 bg-obsidian-light p-4 hidden xl:block">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Properties</div>
                <p className="text-sm text-gray-600">Select an element to edit properties.</p>
            </div>
        </div>
    );
};
