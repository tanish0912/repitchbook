'use client';

import { PitchType } from '@/types';
import { motion } from 'framer-motion';
import { Building2, Rocket, Briefcase } from 'lucide-react';

interface TypeSelectCardProps {
    type: PitchType;
    selected: boolean;
    onClick: () => void;
    title: string;
    description: string;
    icon: any;
}

const TypeSelectCard = ({ type, selected, onClick, title, description, icon: Icon }: TypeSelectCardProps) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative flex flex-col items-start p-8 rounded-2xl border text-left w-full h-full transition-all
                ${selected
                    ? 'bg-white text-obsidian border-white shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
            `}
        >
            <div className={`mb-6 p-3 rounded-full ${selected ? 'bg-obsidian text-white' : 'bg-white/10 text-gray-400'}`}>
                <Icon size={24} />
            </div>
            <h3 className={`text-2xl font-bold font-display mb-2 ${selected ? 'text-obsidian' : 'text-white'}`}>
                {title}
            </h3>
            <p className={`text-sm leading-relaxed ${selected ? 'text-gray-600' : 'text-gray-500'}`}>
                {description}
            </p>
        </motion.button>
    )
}

interface TypeSelectorProps {
    value: PitchType;
    onChange: (val: PitchType) => void;
}

export const TypeSelector = ({ value, onChange }: TypeSelectorProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TypeSelectCard
                type="STARTUP"
                selected={value === 'STARTUP'}
                onClick={() => onChange('STARTUP')}
                title="Startup Pitch"
                description="Problem-Solution narrative for investors. Best for Seed to Series A fundraising."
                icon={Rocket}
            />
            <TypeSelectCard
                type="REAL_ESTATE"
                selected={value === 'REAL_ESTATE'}
                onClick={() => onChange('REAL_ESTATE')}
                title="Real Estate Deal"
                description="Property highlights and financial upside. Best for acquisition proposals."
                icon={Building2}
            />
            <TypeSelectCard
                type="SALES"
                selected={value === 'SALES'}
                onClick={() => onChange('SALES')}
                title="Sales Proposal"
                description="Client-focused value proposition. Best for B2B services and contracts."
                icon={Briefcase}
            />
        </div>
    )
}
