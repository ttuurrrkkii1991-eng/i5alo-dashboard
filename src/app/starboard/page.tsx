"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { MoreVertical, Star } from 'lucide-react';

// Toggle switch matching the exact screenshot design
const MainToggle = ({enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-emerald-400" : "bg-gray-600"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "translate-x-[-24px]" : "translate-x-0"
            )}
        />
    </div>
);

const StarboardRow = ({title, channel }: any) => (
    <div className="bg-[#242529] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a2b2f] transition-colors border border-transparent hover:border-white/5">
        <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white p-1 transition-colors">
                <MoreVertical className="w-5 h-5" />
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">
                تعديل
            </button>
        </div>
        <div className="flex items-center gap-4 text-right">
            <div className="flex flex-col items-end">
                <h3 className="text-white font-bold text-md">{title}</h3>
                <p className="text-gray-500 text-xs">#{channel}</p>
            </div>
            <div className="bg-[#1f2023] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
            </div>
        </div>
    </div>
);

export default function StarboardPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="max-w-5xl mx-auto pt-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">ستاربورد</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
                    
                    {/* Action Bar */}
                    <div className="flex justify-end mb-4">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                            إنشاء ستاربورد
                        </button>
                    </div>

                    {/* Starboard List */}
                    <div className="space-y-3">
                        <StarboardRow title="new starboard" channel="unknown" />
                    </div>

                </div>
            )}
        </div>
    );
}
