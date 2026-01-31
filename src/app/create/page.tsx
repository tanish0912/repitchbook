'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PitchType } from '@/types';
import { usePitchStore } from '@/store/usePitchStore';
import { generatePitchAction } from '@/app/actions/generatePitchAction';
import { motion, AnimatePresence } from 'framer-motion';
import { LuxuryInput, LuxuryTextArea } from '@/components/create/LuxuryInput';
import { TypeSelector } from '@/components/create/TypeSelector';

export default function CreatePage() {
    const router = useRouter();
    const setPitch = usePitchStore((state) => state.setPitch);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        pitchTitle: '',
        pitchType: 'STARTUP' as PitchType,
        audience: '',
        goal: '',
        location: '',
        highlights: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Steps configuration
    const TOTAL_STEPS = 3;

    const nextStep = () => {
        if (step < TOTAL_STEPS) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Using the Server Action with the God-Level Prompt
            const pitch = await generatePitchAction({
                ...formData,
                highlights: formData.highlights.split('\n').filter(line => line.trim().length > 0),
            });

            setPitch(pitch);
            router.push(`/editor/${pitch.id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to generate pitch. Please check API Key or try again.');
            setIsSubmitting(false);
        }
    };

    // Render Step Content
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Define Context</h2>
                            <p className="text-xl text-gray-500">What are we building today?</p>
                        </div>

                        <div className="space-y-12">
                            <LuxuryInput
                                label="Project Name"
                                placeholder="e.g. Acme Corp Series A"
                                value={formData.pitchTitle}
                                onChange={(e) => setFormData({ ...formData, pitchTitle: e.target.value })}
                                autoFocus
                            />

                            <div className="space-y-4">
                                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500">Pitch Strategy</label>
                                <TypeSelector
                                    value={formData.pitchType}
                                    onChange={(val) => setFormData({ ...formData, pitchType: val })}
                                />
                            </div>

                            {formData.pitchType === 'REAL_ESTATE' && (
                                <LuxuryInput
                                    label="Property Location"
                                    placeholder="e.g. 123 Austin Blvd, TX"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            )}
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Strategic Focus</h2>
                            <p className="text-xl text-gray-500">Who are we talking to, and what do we want?</p>
                        </div>

                        <div className="space-y-12">
                            <LuxuryInput
                                label="Target Audience"
                                sublabel="Be specific. e.g. 'Partner-level VCs at Tier-1 firms' or 'Enterprise CTOs'"
                                placeholder="Who is in the room?"
                                value={formData.audience}
                                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                autoFocus
                            />

                            <LuxuryInput
                                label="Primary Goal"
                                sublabel="What is the one thing you want them to do after this meeting?"
                                placeholder="e.g. Term sheet for $5M"
                                value={formData.goal}
                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                            />
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Substance</h2>
                            <p className="text-xl text-gray-500">Dump your raw thoughts. We'll structure them.</p>
                        </div>

                        <div className="space-y-8">
                            <LuxuryTextArea
                                label="Key Highlights / Brain Dump"
                                sublabel="Paste metrics, team background, unique insights, traction points. Don't worry about formatting."
                                placeholder="- 3x YoY growth&#10;- Ex-Google Team&#10;- Signed pilot with NASA"
                                value={formData.highlights}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, highlights: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </motion.div>
                );
        }
    }

    return (
        <div className="min-h-screen bg-obsidian text-white font-sans flex flex-col">
            {/* Header */}
            <div className="p-8 flex items-center justify-between shrink-0">
                <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft size={20} /> <span className="text-sm font-mono uppercase tracking-widest">Back</span>
                </Link>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-white' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-8 md:p-12 border-t border-white/5 flex items-center justify-between shrink-0 bg-obsidian/90 backdrop-blur-md sticky bottom-0 z-10">
                {step > 1 ? (
                    <button
                        onClick={prevStep}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium border border-transparent hover:border-white/10 rounded-full"
                    >
                        Back
                    </button>
                ) : <div />}

                <button
                    onClick={step === TOTAL_STEPS ? handleSubmit : nextStep}
                    disabled={isSubmitting}
                    className="group px-8 py-4 bg-white text-obsidian rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-3 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
                >
                    {step === TOTAL_STEPS ? (
                        isSubmitting ? 'Structuring...' : (
                            <>Generate Structure <Sparkles className="w-5 h-5 text-violet-600" /></>
                        )
                    ) : (
                        <>Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
