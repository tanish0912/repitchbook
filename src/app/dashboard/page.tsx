'use client';

import { usePitchStore } from '@/store/usePitchStore';
import Link from 'next/link';
import { Trash2, Plus, ArrowRight, Clock, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const savedPitches = usePitchStore(state => state.savedPitches);
    const deletePitch = usePitchStore(state => state.deletePitch);
    const router = useRouter();

    // Sort logic
    const pitches = Object.values(savedPitches).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this pitch?')) {
            deletePitch(id);
        }
    }

    return (
        <div className="min-h-screen bg-obsidian text-white font-sans p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-white mb-2">Dashboard</h1>
                        <p className="text-gray-400">Manage your pitch portfolio.</p>
                    </div>
                    <Link
                        href="/create"
                        className="px-6 py-3 bg-white text-obsidian rounded-lg font-semibold hover:bg-gray-200 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Pitch
                    </Link>
                </div>

                {pitches.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-2xl p-24 text-center"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No drafts found</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                            Your workspace is empty. Start a new thinking process.
                        </p>
                        <button
                            onClick={() => router.push('/create')}
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center gap-2"
                        >
                            Create First Pitch <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pitches.map((pitch, i) => (
                            <motion.div
                                key={pitch.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={`/editor/${pitch.id}`}
                                    className="group block glass-panel rounded-xl p-6 hover:border-blue-500/50 hover:bg-white/10 transition-all relative"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-2 py-1 bg-white/10 text-gray-300 text-[10px] font-bold rounded uppercase tracking-wider">
                                            {pitch.pitchType?.replace('_', ' ') || 'DRAFT'}
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, pitch.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors font-display">
                                        {pitch.pitchTitle || 'Untitled Pitch'}
                                    </h3>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-8 h-10 leading-relaxed">
                                        <span className="text-gray-600">Goal:</span> {pitch.goal || 'No goal defined.'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(pitch.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-white font-medium">
                                            Open <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
