'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-obsidian text-white font-sans overflow-hidden">
      {/* Background Hero */}
      <div
        className="absolute inset-0 z-0 opacity-40 bg-[url('/hero-bg.png')] bg-cover bg-center"
        style={{ filter: "blur(2px) brightness(0.7)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-mono uppercase tracking-widest text-gray-300 mb-8">
            <Sparkles size={12} className="text-violet-400" />
            <span>Intelligent Pitch Architecture</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tight text-white mb-6 leading-[1.1]">
            Thinking,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400">Structured.</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Repitchbook transforms unstructured ideas into world-class consulting decks.
            Focus on the narrative. We handle the structure.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Link
              href="/create"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition-all"
              >
                Start New Pitch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                View Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Footer Minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 text-xs text-gray-600 font-mono tracking-widest uppercase"
        >
          Repitchbook 3.0 • Prototype
        </motion.div>
      </div>
    </div>
  );
}
