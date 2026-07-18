"use client";

import React, { useState } from 'react';
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

const SubToggle = ({ enabled, onChange }) => (
    <div 
        className={clsx(
            "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0 flex items-center",
            enabled ? "bg-white" : "bg-gray-500"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "bg-gray-800 translate-x-[-20px]" : "bg-white translate-x-0"
            )}
        />
    </div>
);

const SettingRow = ({ title, defaultEnabled = false }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#242529] rounded-xl p-5 flex items-center justify-between mb-4 hover:bg-[#2a2b2f] transition-colors">
            <SubToggle enabled={enabled} onChange={setEnabled} />
            <h3 className="text-white text-[15px] font-medium text-right">{title}</h3>
        </div>
    );
};

export default function WelcomePage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="max-w-4xl mx-auto pt-6">
            
            {/* Page Header matching screenshot */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">الترحيب & المغادرة</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <SettingRow title="إرسال رسالة عند دخول عضو للسيرفر" />
                    <SettingRow title="إرسال صورة عند دخول عضو للسيرفر" />
                    <SettingRow title="إرسال رسالة عند خروج عضو من سيرفر" />
                </div>
            )}
        </div>
    );
}
