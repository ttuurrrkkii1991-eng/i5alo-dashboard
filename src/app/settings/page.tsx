"use client";

import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <button className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    إعادة تعيين الإعدادات
                </button>
                <h2 className="text-2xl font-bold text-white tracking-wide text-right">
                    إعدادات السيرفر
                </h2>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col items-end gap-2 w-full max-w-full">
                    <label className="text-gray-400 text-xs text-right mb-1">اللغة</label>
                    <div className="w-full relative">
                        <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none transition-colors cursor-pointer" dir="rtl">
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
