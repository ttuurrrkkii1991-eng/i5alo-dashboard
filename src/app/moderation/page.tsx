"use client";

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Shield } from 'lucide-react';

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

const SubToggle = ({enabled, onChange }: any) => (
    <div 
        className={clsx(
            "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
            enabled ? "bg-indigo-500" : "bg-gray-600"
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

const CommandRow = ({ name, description, defaultEnabled = true }: any) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#242529] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a2b2f] transition-colors border border-transparent hover:border-white/5 mb-3">
            <div className="flex items-center gap-4">
                <SubToggle enabled={enabled} onChange={setEnabled} />
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

export default function ModerationPage() {
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
                    setGlobalEnabled(data.features['moderation'] ?? false);
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
                body: JSON.stringify({ guildId, featureId: 'moderation', enabled })
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">الإشراف</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                    
                    {/* Top Settings */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-right text-gray-400 text-xs flex justify-end gap-1 items-center">
                                <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px] text-gray-400">!</span>
                                رولات المشرفين
                            </label>
                            <select className="bg-[#242529] border border-white/5 rounded-lg p-3 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                <option>اختر ..</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-right text-gray-400 text-xs text-right">مدة الميوت الصوتي اليدوي الأفتراضية</label>
                            <select className="bg-[#242529] border border-white/5 rounded-lg p-3 text-white text-right outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                                <option>حتى خروج العضو من السيرفر</option>
                            </select>
                        </div>
                    </div>

                    {/* Commands List */}
                    <div className="mt-8">
                        <CommandRow name="setnick" description="تغيير لقب العضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="ban" description="حظر العضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="unban" description="إزالة الحظر عن عضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="kick" description="طرد العضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="vkick" description="طرد العضو من الروم الصوتي." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="mute text" description="منع العضو من الكتابة في الرومات الكتابية." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="unmute text" description="إلغاء منع كتابي من عضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="mute voice" description="منع عضو من التحدث في الرومات الصوتية." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="unmute voice" description="فك الكتم الصوتي من العضو" guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="timeout" description="أعطاء وقت مستقطع للعضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="untimeout" description="إزالة الوقت المستقطع من المستخدم." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="clear" description="تنظيف رسائل الروم." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="move" description="نقل عضو إلى روم صوتي." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="role" description="إضافة / إزالة رولات من المستخدم." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="points" description="النقاط التي يمكن أن تُعطى من قبل المشرفين." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="warn" description="تحذير العضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="warn_remove" description="إزالة انذارات السيرفر او العضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="warnings" description="الحصول على قائمة إنذارات السيرفر او العضو." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="lock" description="يقوم بتعطيل خاصية إرسال الرسائل من الجميع في روم معين." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="unlock" description="للسماح للجميع بإرسال رسائل في روم محدد." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="setcolor" description="تغيير لون رول عن طريق الـHex Code." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="slowmode" description="تفعيل او تعطيل سلو مود من الروم." guildId={guildId} initialFeatures={featuresData} />
                        <CommandRow name="reset" description="اعادة تعيين النقاط الكتابيه/الصوتية/الانفايت من جميع الاعضاء او عضو معين." guildId={guildId} initialFeatures={featuresData} />
                    </div>
                </div>
            )}
        </div>
    );
}
