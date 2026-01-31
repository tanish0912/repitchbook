'use client';

import { usePitchStore } from '@/store/usePitchStore';
import { SlideCanvas } from './canvas/SlideCanvas';

export const SlideEditor = () => {
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const pitch = usePitchStore(state => state.pitch);
    const updateSlide = usePitchStore(state => state.updateSlide);
    const updatePitchDetails = usePitchStore(state => state.updatePitchDetails);

    const slide = pitch?.slides.find(s => s.id === selectedSlideId);

    if (!slide || !pitch) return <div>Loading...</div>;

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSlide(slide.id, { title: e.target.value });
    }

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSlide(slide.id, { speakerNotes: e.target.value });
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Top Bar: Title Edit */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shrink-0">
                <div className="flex items-center gap-4 flex-1">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Slide Title</span>
                    <input
                        type="text"
                        value={slide.title}
                        onChange={handleTitleChange}
                        className="flex-1 text-xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 focus:ring-0 bg-transparent"
                        placeholder="Slide Title"
                    />
                </div>
                <div className="text-xs text-gray-400 font-mono">
                    Auto-saving
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-hidden relative">
                <SlideCanvas />
            </div>

            {/* Bottom Bar: Speaker Notes (Collapsible or just small) */}
            <div className="h-32 bg-white border-t border-gray-200 p-4 shrink-0 flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Speaker Notes</label>
                <textarea
                    value={slide.speakerNotes}
                    onChange={handleNotesChange}
                    className="flex-1 w-full bg-yellow-50/30 border border-yellow-100 rounded p-2 text-sm text-gray-700 outline-none focus:border-yellow-300 resize-none"
                    placeholder="Add talking points..."
                />
            </div>
        </div>
    );
};
