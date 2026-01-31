import { useEffect } from 'react';
import { usePitchStore } from '@/store/usePitchStore';

export const useEditorHotkeys = () => {
    const selectedSlideId = usePitchStore(state => state.selectedSlideId);
    const selectedElementId = usePitchStore(state => state.selectedElementId);
    const pitch = usePitchStore(state => state.pitch);
    const updateElement = usePitchStore(state => state.updateElement);
    const removeElement = usePitchStore(state => state.removeElement);
    const selectSlide = usePitchStore(state => state.selectSlide);
    const selectElement = usePitchStore(state => state.selectElement);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Context
            const activeTag = document.activeElement?.tagName.toLowerCase();
            const isTyping = activeTag === 'input' || activeTag === 'textarea';

            if (!pitch || !selectedSlideId) return;

            const currentSlide = pitch.slides.find(s => s.id === selectedSlideId);
            if (!currentSlide) return;

            // --- Element Actions (Only if not typing) ---
            if (selectedElementId && !isTyping) {
                const element = currentSlide.elements?.find(el => el.id === selectedElementId);
                if (!element) return;

                // Move
                const step = e.shiftKey ? 10 : 1;
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        updateElement(selectedSlideId, selectedElementId, { y: element.y - step });
                        return;
                    case 'ArrowDown':
                        e.preventDefault();
                        updateElement(selectedSlideId, selectedElementId, { y: element.y + step });
                        return;
                    case 'ArrowLeft':
                        e.preventDefault();
                        updateElement(selectedSlideId, selectedElementId, { x: element.x - step });
                        return;
                    case 'ArrowRight':
                        e.preventDefault();
                        updateElement(selectedSlideId, selectedElementId, { x: element.x + step });
                        return;
                    case 'Backspace':
                    case 'Delete':
                        e.preventDefault();
                        removeElement(selectedSlideId, selectedElementId);
                        selectElement(null);
                        return;
                    case 'Escape':
                        e.preventDefault();
                        selectElement(null);
                        return;
                }
            }

            // --- Slide Navigation (If no element selected or explicitly navigating) ---
            if (!selectedElementId && !isTyping) {
                const currentIndex = pitch.slides.findIndex(s => s.id === selectedSlideId);

                switch (e.key) {
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        if (currentIndex > 0) {
                            e.preventDefault();
                            selectSlide(pitch.slides[currentIndex - 1].id);
                        }
                        return;
                    case 'ArrowDown':
                    case 'ArrowRight':
                        if (currentIndex < pitch.slides.length - 1) {
                            e.preventDefault();
                            selectSlide(pitch.slides[currentIndex + 1].id);
                        }
                        return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pitch, selectedSlideId, selectedElementId, updateElement, removeElement, selectSlide, selectElement]);
};
