"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function EmbedsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-end mb-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-bold text-white tracking-wide text-right">
                    رسائل الإيمبد
                </h2>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                
                {/* Search */}
                <div className="flex flex-col items-end gap-2 w-full">
                    <label className="text-gray-400 text-xs text-right">البحث باستخدام اسم الايمبد</label>
                    <input 
                        type="text" 
                        placeholder="الإسم" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-indigo-500/50 transition-colors"
                        dir="rtl"
                    />
                </div>

                {/* Create Embed Button */}
                <div className="flex flex-col items-end gap-2 w-full">
                    <label className="text-gray-400 text-xs text-right">رسائل الإيمبد</label>
                    <div className="w-full border border-dashed border-white/20 rounded-lg p-6 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer group">
                        <button className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors font-bold text-sm">
                            <Plus className="w-4 h-4 bg-gray-400 group-hover:bg-white text-[#2b2d31] rounded-full p-0.5 transition-colors" />
                            إنشاء ايمبد!
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}
