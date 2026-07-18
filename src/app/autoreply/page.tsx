"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

// Toggle switch matching the exact screenshot design
const MainToggle = ({ enabled, onChange }) => (
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

export default function AutoReplyPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);
    const [replies, setReplies] = useState([]); // Will hold auto replies data

    return (
        <div className="max-w-5xl mx-auto pt-6">
            
            {/* Page Header matching screenshot */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">الرد التلقائي</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    
                    {/* Action Bar */}
                    <div className="flex justify-end mb-6">
                        <button className="bg-white/10 hover:bg-white/15 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 flex items-center gap-2">
                            إضافة رد تلقائي <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Table Header */}
                    <div className="bg-[#242529] rounded-t-xl p-4 flex items-center justify-between text-gray-400 text-sm font-medium border-b border-white/5">
                        <div className="flex-1 text-left">إجراء</div>
                        <div className="flex-1 text-right">الرسالة</div>
                    </div>

                    {/* Table Body (Empty state for now) */}
                    <div className="bg-[#2a2b2f] rounded-b-xl p-8 flex items-center justify-center border-t-0 border border-white/5">
                        <p className="text-gray-500 text-sm">لا توجد ردود تلقائية حالياً. اضغط على "إضافة رد تلقائي" للبدء.</p>
                    </div>
                    
                </div>
            )}
        </div>
    );
}
