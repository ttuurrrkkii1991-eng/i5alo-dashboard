"use client";

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import clsx from 'clsx';

const ToggleSwitch = ({enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-emerald-500" : "bg-indigo-500" // Matching the screenshot's purplish-blue and green
        )}
        onClick={() => onChange(!enabled)}
    >
        <div 
            className={clsx(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                enabled ? "translate-x-[-20px]" : "translate-x-0"
            )}
        />
    </div>
);

const CommandRow = ({ id, name, description, guildId, initialFeatures }: any) => {
    const featureKey = `cmd_${id}`;
    const [enabled, setEnabled] = useState(initialFeatures[featureKey] ?? true);

    const handleToggle = async (newVal: boolean) => {
        setEnabled(newVal);
        if (!guildId) return;
        try {
            await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, featureId: featureKey, enabled: newVal })
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-[#2b2d31]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <ToggleSwitch enabled={enabled} onChange={handleToggle} />
                <button className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
                    تعديل
                </button>
            </div>
            <div className="text-left flex flex-col items-end">
                <h3 className="text-white font-bold text-lg mb-1">{name}/</h3>
                <p className="text-gray-400 text-sm text-right" dir="rtl">{description}</p>
            </div>
        </div>
    );
};

export default function GeneralCommandsPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [globalEnabled, setGlobalEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [featuresData, setFeaturesData] = useState<any>({});

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuildId(data.guild.id);
                }
            });
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/features?guildId=${guildId}`)
            .then(res => res.json())
            .then(data => {
                if (data.features) {
                    setGlobalEnabled(data.features['commands'] ?? false);
                    setFeaturesData(data.features);
                }
            })
            .finally(() => setLoading(false));
    }, [guildId]);

    const handleToggle = async (enabled: boolean) => {
        setGlobalEnabled(enabled);
        if (!guildId) return;
        try {
            await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildId, featureId: 'commands', enabled })
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Page Header matching screenshot */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <ToggleSwitch enabled={globalEnabled} onChange={handleToggle} />
                <h2 className="text-2xl font-bold text-white">الأوامر العامة</h2>
            </div>

            {globalEnabled && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CommandRow id="moveme" name="سحب" description="ينقلك إلى روم صوتي." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="profile" name="ملف" description="عرض بطاقة التعريف الشخصية العامة المخصصة لك أو لشخص آخر." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="user" name="يوزر" description="يعرض معلومات، مثل تاريخ دخول السيرفر وتاريخ التسجيل في الديسكورد عنك او عن مستخدم آخر." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="avatar" name="افتار" description="الحصول على الصورة الرمزية للمستخدمين." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="server" name="سيرفر" description="يظهر معلومات حول السيرفر." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="daily" name="راتب" description="احصل على رابط المكافأة اليومية ومعرفة متى يمكنك الحصول عليها مرة اخرى." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="vote" name="تصويت" description="احصل على رابط التصويت ومعرفة متى يمكنك التصويت للبوت مرة اخرى" guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="rep" name="سمعة" description="منح شخص نقطة سمعة. يمكن استخدامها مرة واحدة فقط كل 24 ساعة." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="credits" name="رصيد" description="يظهر رصيدك أو رصيد شخص ما." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="roll" name="نرد" description="رمي حجر نرد." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="short" name="اختصار" description="اختصار رابط." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="ping" name="بنق" description="اختبار وقت استجابة البوت." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="roles" name="رتب" description="احصل على قائمة برولات السيرفر وعدد الأعضاء." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="points" name="نقاط" description="النقاط التي يمكن أن تُعطى من قبل المشرفين." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="rank" name="رانك" description="عرض مستواك ونقاطك الحالية في السيرفر." guildId={guildId} initialFeatures={featuresData} />
                    <CommandRow id="top" name="توب" description="عرض قائمة المتصدرين في السيرفر." guildId={guildId} initialFeatures={featuresData} />
                </div>
            )}
        </div>
    );
}
