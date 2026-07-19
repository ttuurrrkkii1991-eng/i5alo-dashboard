"use client";

import React from 'react';
import clsx from 'clsx';
import { Settings, ShieldAlert, MessageSquare, AlertCircle, Link2, Type, Smile, AtSign, RefreshCcw, AlignLeft } from 'lucide-react';

const MainToggle = ({ enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-emerald-400" : "bg-gray-600"
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "translate-x-[-20px]" : "translate-x-0"
            )}
        />
    </div>
);

const ProtectionCard = ({ title, description, icon: Icon, enabled, onToggle, onSetup, isSetup }: any) => {
    return (
        <div className="bg-[#242529] rounded-xl overflow-hidden flex flex-col border border-transparent hover:border-white/5 transition-colors">
            <div className="p-5 flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#2b2d31] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                        <h3 className="font-bold text-white text-sm">{title}</h3>
                        {description && <p className="text-gray-400 text-xs">{description}</p>}
                    </div>
                </div>
                <MainToggle enabled={enabled} onChange={onToggle} />
            </div>
            <div className="px-5 pb-5 mt-auto">
                <button 
                    onClick={onSetup}
                    className="w-full py-2.5 rounded-lg bg-[#2b2d31] hover:bg-[#313338] transition-colors text-white text-xs font-medium"
                >
                    {isSetup ? "تعديل الرقابة" : "بحاجة إلى الإعداد"}
                </button>
            </div>
        </div>
    );
};

export default function AutoModPage() {
    const [settings, setSettings] = React.useState<any>({
        spam: false,
        badWords: false,
        textDuplication: false,
        repeatedMessages: false,
        serverLinks: false,
        links: false,
        capsSpam: false,
        emojiSpam: false,
        mentionSpam: false
    });

    const updateSetting = (key: string, val: boolean) => {
        setSettings({ ...settings, [key]: val });
    };

    const cards = [
        { id: 'spam', title: "إزعاج بالرسائل (5 رسائل \\ 5 ثواني)", icon: AlignLeft },
        { id: 'badWords', title: "الكلمات المسيئة", icon: AlertCircle },
        { id: 'textDuplication', title: "تكرار النص", icon: MessageSquare },
        { id: 'repeatedMessages', title: "الرسائل المكررة", icon: RefreshCcw },
        { id: 'serverLinks', title: "روابط السيرفرات", icon: Link2 }, // Use an icon that looks like a globe or invite
        { id: 'links', title: "الروابط", description: "حظر الرسالة", icon: Link2 },
        { id: 'capsSpam', title: "سبام الأحرف الكبيرة (70% > احرف مكبرة)", icon: Type },
        { id: 'emojiSpam', title: "إزعاج EMOJI", icon: Smile },
        { id: 'mentionSpam', title: "إزعاج منشن", icon: AtSign },
    ];

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20" dir="rtl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-2xl font-bold text-white tracking-wide">الرقابة التلقائية</h2>
                <MainToggle enabled={true} onChange={() => {}} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map(card => (
                    <ProtectionCard
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                        enabled={settings[card.id]}
                        onToggle={(v: boolean) => updateSetting(card.id, v)}
                        isSetup={false}
                    />
                ))}
            </div>
        </div>
    );
}
