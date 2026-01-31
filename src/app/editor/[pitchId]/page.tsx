'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePitchStore } from '@/store/usePitchStore';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { PreviewView } from '@/components/editor/PreviewView';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const pitchId = params.pitchId as string;

    const pitch = usePitchStore(state => state.pitch);
    const savedPitches = usePitchStore(state => state.savedPitches);
    const loadPitch = usePitchStore(state => state.loadPitch);
    const isPreviewMode = usePitchStore(state => state.isPreviewMode);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (pitch && pitch.id === pitchId) {
            setIsLoaded(true);
            return;
        }

        if (savedPitches[pitchId]) {
            loadPitch(pitchId);
            setIsLoaded(true);
        } else {
            // Fallback or wait
        }
    }, [pitchId, pitch, savedPitches, loadPitch]);

    if (isPreviewMode) {
        return <PreviewView />;
    }

    return <EditorLayout />;
}
