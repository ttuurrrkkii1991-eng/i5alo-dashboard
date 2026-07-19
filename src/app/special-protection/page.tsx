"use client";

import React from 'react';
import clsx from 'clsx';
import { Shield, Lock, Key, Globe, AlertTriangle, Link, Webhook } from 'lucide-react';

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

const ProtectionCard = ({ title, description, icon: Icon, enabled, onToggle, onSetup, isSetup, highlight }: any) => {
    return (
        <div className={clsx(
            "bg-[#242529] rounded-xl overflow-hidden flex flex-col border transition-colors",
            highlight ? "border-purple-500/50" : "border-transparent hover:border-white/5"
        )}>
            <div className="p-5 flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#2b2d31] flex items-center justify-center shrink-0">
                        <Icon className={clsx("w-5 h-5", highlight ? "text-purple-400" : "text-gray-400")} />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                        <h3 className="font-bold text-white text-sm">{title}</h3>
                        {description && <p className="text-gray-400 text-xs leading-relaxed">{description}</p>}
                    </div>
                </div>
                <MainToggle enabled={enabled} onChange={onToggle} />
            </div>
            <div className="px-5 pb-5 mt-auto">
                <button 
                    onClick={onSetup}
                    className="w-full py-2.5 rounded-lg bg-[#2b2d31] hover:bg-[#313338] transition-colors text-white text-xs font-medium"
                >
                    {isSetup ? "تعديل الحماية" : "بحاجة إلى الإعداد"}
                </button>
            </div>
        </div>
    );
};

export default function SpecialProtectionPage() {
    const [settings, setSettings] = React.useState<any>({});

    const updateSetting = (key: string, val: boolean) => {
        setSettings({ ...settings, [key]: val });
    };

    const cards = [
        { id: 'lockdown', title: "نظام الطوارئ (Lockdown)", description: "قفل السيرفر بالكامل فوراً عند حدوث هجوم", icon: Lock, isSetup: true },
        { id: 'tokens', title: "حماية التوكنات المخترقة", description: "طرد الحسابات المشتبه باختراقها تلقائياً", icon: Key },
        { id: 'vpn', title: "حظر الـ VPN و Proxy", description: "يمنع دخول الحسابات التي تستخدم برامج تخفي", icon: Globe },
        { id: 'scam', title: "مكافحة السكام في الخاص", description: "تحذير الأعضاء من الروابط الملغمة المرسلة", icon: AlertTriangle },
        { id: 'vanity', title: "حماية الرابط المخصص (Vanity)", description: "استرجاع رابط السيرفر إذا تم حذفه فجأة", icon: Link, isSetup: true, highlight: true },
        { id: 'webhooks', title: "حماية الـ Webhooks", description: "حذف أي ويب هوك غير مصرح به فور إنشائه", icon: Webhook },
    ];

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20" dir="rtl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex gap-3 items-center">
                    <Shield className="w-8 h-8 text-purple-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide mb-1">الحماية الخاصة</h2>
                        <p className="text-gray-400 text-sm">طبقة حماية متقدمة جداً ومخصصة للسيرفرات الاحترافية.</p>
                    </div>
                </div>
                <MainToggle enabled={true} onChange={() => {}} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map(card => (
                    <ProtectionCard
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                        enabled={settings[card.id] || false}
                        onToggle={(v: boolean) => updateSetting(card.id, v)}
                        isSetup={card.isSetup}
                        highlight={card.highlight}
                    />
                ))}
            </div>
        </div>
    );
}
