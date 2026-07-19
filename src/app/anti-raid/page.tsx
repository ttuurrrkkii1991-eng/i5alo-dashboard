"use client";

import React from 'react';
import clsx from 'clsx';
import { ShieldAlert, Users, Bot, MessageSquare, ShieldBan, Lock, CheckCircle } from 'lucide-react';

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

export default function AntiRaidPage() {
    const [settings, setSettings] = React.useState<any>({});

    const updateSetting = (key: string, val: boolean) => {
        setSettings({ ...settings, [key]: val });
    };

    const cards = [
        { id: 'joinRaid', title: "إزعاج الدخول (Join Raid)", description: "يقوم بإقفال السيرفر عند دخول عدد كبير", icon: Users },
        { id: 'alts', title: "حماية الحسابات الوهمية (Alts)", description: "طرد الحسابات المنشأة حديثاً", icon: Users },
        { id: 'bots', title: "حماية من دخول البوتات", description: "يمنع دخول البوتات غير المصرح بها", icon: Bot },
        { id: 'channels', title: "حماية الرومات", description: "منع حذف أو مسح الرومات بشكل عشوائي", icon: MessageSquare },
        { id: 'massKick', title: "منع الطرد العشوائي (Mass Kick)", description: "حظر المشرف الذي يطرد الأعضاء", icon: ShieldBan },
        { id: 'massBan', title: "منع الباند العشوائي (Mass Ban)", description: "حظر المشرف الذي يعطي باندات متكررة", icon: ShieldAlert },
        { id: 'captcha', title: "تفعيل نظام الـ Captcha", description: "يجب على العضو حل اختبار للتحقق", icon: CheckCircle, isSetup: true },
        { id: 'quarantine', title: "نظام الحجر الصحي (Quarantine)", description: "عزل الأعضاء المشتبه بهم تلقائياً", icon: Lock, isSetup: true },
        { id: 'roles', title: "حماية الرتب", description: "منع حذف الرتب أو إعطائها بشكل عشوائي", icon: ShieldAlert },
    ];

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20" dir="rtl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex gap-3 items-center">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide mb-1">مكافحة الغزو</h2>
                        <p className="text-gray-400 text-sm">نظام حماية متقدم لصد الهجمات وحماية السيرفر من التخريب.</p>
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
                    />
                ))}
            </div>
        </div>
    );
}
