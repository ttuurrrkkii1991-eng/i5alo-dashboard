"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { ShieldAlert, Link as LinkIcon, MessageSquare, AlertCircle, Type, Smile, AtSign, Globe, Repeat, LayoutList } from 'lucide-react';

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
            "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-white" : "bg-gray-500"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "bg-gray-800 translate-x-[-20px]" : "bg-white translate-x-0"
            )}
        />
    </div>
);

const AutoModCard = ({ title, subtitle, icon: Icon, premium = false, setupNeeded = true, defaultEnabled = false }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#242529] hover:bg-[#2a2b2f] border border-transparent hover:border-white/5 rounded-xl p-5 transition-colors flex flex-col gap-4 justify-between h-full shadow-sm">
            
            <div className="flex items-start justify-between">
                <SubToggle enabled={enabled} onChange={setEnabled} />
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <h3 className="text-white font-bold text-sm text-right flex flex-col items-end gap-1">
                            {title}
                        </h3>
                        {subtitle && <p className="text-gray-400 text-xs text-right mt-1">{subtitle}</p>}
                        {premium && (
                            <span className="bg-[#b38822]/20 text-[#f1c40f] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 mt-1">
                                بريميوم باقة 2
                            </span>
                        )}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#313338] flex items-center justify-center shrink-0 border border-white/5">
                        <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <button className={clsx(
                "w-full py-2 rounded-lg text-xs font-bold transition-colors mt-2",
                setupNeeded ? "bg-[#313338] hover:bg-[#3f4147] text-gray-300" : "bg-[#313338] hover:bg-[#3f4147] text-gray-300"
            )}>
                {setupNeeded ? "بحاجة إلى الإعداد" : "تعديل الرقابة"}
            </button>

        </div>
    );
};

export default function AutoModPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">الرقابة التلقائية</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                    
                    {/* Grid of Rules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        <AutoModCard title="تكرار النص" icon={MessageSquare} />
                        <AutoModCard title="الكلمات المسيئة" icon={AlertCircle} />
                        <AutoModCard title="إزعاج بالرسائل (5 رسائل \ 5 ثواني)" icon={LayoutList} />

                        <AutoModCard title="الروابط" subtitle="حظر الرسالة" icon={LinkIcon} setupNeeded={false} />
                        <AutoModCard title="روابط السيرفرات" icon={Globe} />
                        <AutoModCard title="الرسائل المكررة" premium={true} icon={Repeat} />

                        <AutoModCard title="إزعاج منشن" icon={AtSign} />
                        <AutoModCard title="إزعاج EMOJI" icon={Smile} />
                        <AutoModCard title="سبام الأحرف الكبيرة (70% < احرف مكبرة)" icon={Type} />

                    </div>

                    {/* Bypass Settings */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col items-end gap-2 w-full">
                            <label className="text-gray-400 text-xs font-bold text-right">تخطي الرومات</label>
                            <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none transition-colors" dir="rtl">
                                <option>اختر ..</option>
                            </select>
                        </div>

                        <div className="flex flex-col items-end gap-2 w-full">
                            <label className="text-gray-400 text-xs font-bold text-right">تخطي الرولات</label>
                            <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none transition-colors" dir="rtl">
                                <option>اختر ..</option>
                            </select>
                        </div>

                        <div className="flex flex-col items-end gap-2 w-full">
                            <label className="text-gray-400 text-xs font-bold text-right">رومات صور فقط</label>
                            <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none transition-colors" dir="rtl">
                                <option>اختر ..</option>
                            </select>
                        </div>

                        <div className="flex flex-col items-end gap-2 w-full">
                            <label className="text-gray-400 text-xs font-bold text-right">رومات يوتيوب فقط</label>
                            <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none transition-colors" dir="rtl">
                                <option>اختر ..</option>
                            </select>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
