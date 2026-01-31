import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pitch, Slide, SlideElement } from '@/types';
import { arrayMove } from '@dnd-kit/sortable';

interface PitchState {
    pitch: Pitch | null;
    selectedSlideId: string | null;
    selectedElementId: string | null;
    activeEditor: any; // Using any to avoid importing Tiptap types here directly if possible, or we import Editor
    isPreviewMode: boolean;
    savedPitches: Record<string, Pitch>;

    // Actions
    setPitch: (pitch: Pitch) => void;
    updatePitchDetails: (updates: Partial<Pitch>) => void;
    updateSlide: (slideId: string, updates: Partial<Slide>) => void;
    addSlide: (slide: Slide) => void;
    deleteSlide: (slideId: string) => void;
    reorderSlides: (activeId: string, overId: string) => void;
    selectSlide: (slideId: string) => void;
    selectElement: (elementId: string | null) => void;
    setActiveEditor: (editor: any) => void;
    setPreviewMode: (isOpen: boolean) => void;

    // Element Actions
    updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
    addElement: (slideId: string, element: SlideElement) => void;
    removeElement: (slideId: string, elementId: string) => void;

    // Persistence actions
    loadPitch: (id: string) => void;
    deletePitch: (id: string) => void;

    reset: () => void;
}

export const usePitchStore = create<PitchState>()(
    persist(
        (set) => ({
            pitch: null,
            selectedSlideId: null,
            selectedElementId: null,
            activeEditor: null,
            isPreviewMode: false,
            savedPitches: {},


            setPitch: (pitch) => set((state) => ({
                pitch,
                selectedSlideId: pitch.slides[0]?.id ?? null,
                savedPitches: { ...state.savedPitches, [pitch.id]: pitch }
            })),

            updatePitchDetails: (updates) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const updatedPitch = { ...state.pitch, ...updates };
                    return {
                        pitch: updatedPitch,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            updateSlide: (slideId, updates) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const newSlides = state.pitch.slides.map((slide) =>
                        slide.id === slideId ? { ...slide, ...updates } : slide
                    );
                    const updatedPitch = { ...state.pitch, slides: newSlides };
                    return {
                        pitch: updatedPitch,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            addSlide: (slide) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const updatedPitch = { ...state.pitch, slides: [...state.pitch.slides, slide] };
                    return {
                        pitch: updatedPitch,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            deleteSlide: (slideId) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const newSlides = state.pitch.slides.filter((s) => s.id !== slideId);
                    const newSelectedId =
                        state.selectedSlideId === slideId
                            ? newSlides[0]?.id ?? null
                            : state.selectedSlideId;

                    const updatedPitch = { ...state.pitch, slides: newSlides };
                    return {
                        pitch: updatedPitch,
                        selectedSlideId: newSelectedId,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            reorderSlides: (activeId, overId) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const oldIndex = state.pitch.slides.findIndex((s) => s.id === activeId);
                    const newIndex = state.pitch.slides.findIndex((s) => s.id === overId);

                    if (oldIndex === -1 || newIndex === -1) return {};

                    const newSlides = arrayMove(state.pitch.slides, oldIndex, newIndex);
                    const updatedPitch = { ...state.pitch, slides: newSlides };
                    return {
                        pitch: updatedPitch,
                        slides: newSlides,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            selectSlide: (slideId) => set({ selectedSlideId: slideId, selectedElementId: null, activeEditor: null }),
            selectElement: (elementId) => set({ selectedElementId: elementId }), // Don't clear activeEditor here, let rich text component handle focus
            setActiveEditor: (editor) => set({ activeEditor: editor }),

            setPreviewMode: (isOpen) => set({ isPreviewMode: isOpen }),

            // --- Element Actions ---

            updateElement: (slideId, elementId, updates) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const slideIndex = state.pitch.slides.findIndex(s => s.id === slideId);
                    if (slideIndex === -1) return {};

                    const slide = state.pitch.slides[slideIndex];
                    const currentElements = slide.elements || [];
                    const newElements = currentElements.map(el =>
                        el.id === elementId ? { ...el, ...updates } : el
                    ) as SlideElement[]; // Cast safe here as we discriminate by type inside if needed

                    const newSlides = [...state.pitch.slides];
                    newSlides[slideIndex] = { ...slide, elements: newElements };

                    const updatedPitch = { ...state.pitch, slides: newSlides };
                    return {
                        pitch: updatedPitch,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            addElement: (slideId, element) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const slideIndex = state.pitch.slides.findIndex(s => s.id === slideId);
                    if (slideIndex === -1) return {};

                    const slide = state.pitch.slides[slideIndex];
                    const currentElements = slide.elements || [];
                    const newElements = [...currentElements, element];

                    const newSlides = [...state.pitch.slides];
                    newSlides[slideIndex] = { ...slide, elements: newElements };

                    const updatedPitch = { ...state.pitch, slides: newSlides };
                    return {
                        pitch: updatedPitch,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            removeElement: (slideId, elementId) =>
                set((state) => {
                    if (!state.pitch) return {};
                    const slideIndex = state.pitch.slides.findIndex(s => s.id === slideId);
                    if (slideIndex === -1) return {};

                    const slide = state.pitch.slides[slideIndex];
                    const currentElements = slide.elements || [];
                    const newElements = currentElements.filter(el => el.id !== elementId);

                    const newSlides = [...state.pitch.slides];
                    newSlides[slideIndex] = { ...slide, elements: newElements };

                    const updatedPitch = { ...state.pitch, slides: newSlides };
                    return {
                        pitch: updatedPitch,
                        savedPitches: { ...state.savedPitches, [updatedPitch.id]: updatedPitch }
                    };
                }),

            // --- Persistence ---

            loadPitch: (id) => set((state) => ({
                pitch: state.savedPitches[id] || null,
                selectedSlideId: state.savedPitches[id]?.slides[0]?.id ?? null
            })),

            deletePitch: (id) => set((state) => {
                const { [id]: deleted, ...rest } = state.savedPitches;
                return {
                    savedPitches: rest,
                    pitch: state.pitch?.id === id ? null : state.pitch,
                    selectedSlideId: state.pitch?.id === id ? null : state.selectedSlideId
                };
            }),

            reset: () => set({ pitch: null, selectedSlideId: null, selectedElementId: null, isPreviewMode: false }),
        }),
        {
            name: 'repitchbook-storage',
            partialize: (state) => ({
                pitch: state.pitch,
                savedPitches: state.savedPitches,
                selectedSlideId: state.selectedSlideId,
                // Exclude activeEditor, selectedElementId, and isPreviewMode from persistence
            }),
        }
    )
);
