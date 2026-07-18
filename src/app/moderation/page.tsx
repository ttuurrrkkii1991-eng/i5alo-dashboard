"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { Shield } from 'lucide-react';

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

const CommandRow = ({ name, description, defaultEnabled = true }) => {
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
    const [globalEnabled, setGlobalEnabled] = useState(true);

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
                        <CommandRow name="setnick" description="تغيير لقب العضو." />
                        <CommandRow name="ban" description="حظر العضو." />
                        <CommandRow name="unban" description="إزالة الحظر عن عضو." />
                        <CommandRow name="kick" description="طرد العضو." />
                        <CommandRow name="vkick" description="طرد العضو من الروم الصوتي." />
                        <CommandRow name="mute text" description="منع العضو من الكتابة في الرومات الكتابية." />
                        <CommandRow name="unmute text" description="إلغاء منع كتابي من عضو." />
                        <CommandRow name="mute voice" description="منع عضو من التحدث في الرومات الصوتية." />
                        <CommandRow name="unmute voice" description="فك الكتم الصوتي من العضو" />
                        <CommandRow name="timeout" description="أعطاء وقت مستقطع للعضو." />
                        <CommandRow name="untimeout" description="إزالة الوقت المستقطع من المستخدم." />
                        <CommandRow name="clear" description="تنظيف رسائل الروم." />
                        <CommandRow name="move" description="نقل عضو إلى روم صوتي." />
                        <CommandRow name="role" description="إضافة / إزالة رولات من المستخدم." />
                        <CommandRow name="points" description="النقاط التي يمكن أن تُعطى من قبل المشرفين." />
                        <CommandRow name="warn" description="تحذير العضو." />
                        <CommandRow name="warn_remove" description="إزالة انذارات السيرفر او العضو." />
                        <CommandRow name="warnings" description="الحصول على قائمة إنذارات السيرفر او العضو." />
                        <CommandRow name="lock" description="يقوم بتعطيل خاصية إرسال الرسائل من الجميع في روم معين." />
                        <CommandRow name="unlock" description="للسماح للجميع بإرسال رسائل في روم محدد." />
                        <CommandRow name="setcolor" description="تغيير لون رول عن طريق الـHex Code." />
                        <CommandRow name="slowmode" description="تفعيل او تعطيل سلو مود من الروم." />
                        <CommandRow name="reset" description="اعادة تعيين النقاط الكتابيه/الصوتية/الانفايت من جميع الاعضاء او عضو معين." />
                    </div>
                </div>
            )}
        </div>
    );
}
