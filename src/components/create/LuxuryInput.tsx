'use client';

import { motion } from 'framer-motion';

interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    sublabel?: string;
}

export const LuxuryInput = ({ label, sublabel, ...props }: LuxuryInputProps) => {
    return (
        <div className="group relative">
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-blue-400 transition-colors">
                {label}
            </label>
            <input
                {...props}
                className="w-full bg-transparent border-b border-gray-800 py-4 text-3xl md:text-4xl font-display text-white placeholder-gray-700 outline-none focus:border-blue-500 transition-colors"
            />
            {sublabel && (
                <p className="mt-2 text-sm text-gray-600 font-light">{sublabel}</p>
            )}
        </div>
    );
};

export const LuxuryTextArea = ({ label, sublabel, ...props }: any) => {
    return (
        <div className="group relative">
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-blue-400 transition-colors">
                {label}
            </label>
            <textarea
                {...props}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-6 text-xl font-light text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none min-h-[300px] leading-relaxed"
            />
            {sublabel && (
                <p className="mt-2 text-sm text-gray-600 font-light">{sublabel}</p>
            )}
        </div>
    );
};
