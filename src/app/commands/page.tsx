"use client";

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import clsx from 'clsx';

const ToggleSwitch = ({ enabled, onChange }) => (
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

const CommandRow = ({ name, description, defaultEnabled = true }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#2b2d31]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <ToggleSwitch enabled={enabled} onChange={setEnabled} />
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
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Page Header matching screenshot */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <ToggleSwitch enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white">الأوامر العامة</h2>
            </div>

            {globalEnabled && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CommandRow name="moveme" description="ينقلك إلى روم صوتي." />
                    <CommandRow name="profile" description="عرض بطاقة التعريف الشخصية العامة المخصصة لك أو لشخص آخر." />
                    <CommandRow name="user" description="يعرض معلومات، مثل تاريخ دخول السيرفر وتاريخ التسجيل في الديسكورد عنك او عن مستخدم آخر." />
                    <CommandRow name="avatar" description="الحصول على الصورة الرمزية للمستخدمين." />
                    <CommandRow name="server" description="يظهر معلومات حول السيرفر." />
                    <CommandRow name="daily" description="احصل على رابط المكافأة اليومية ومعرفة متى يمكنك الحصول عليها مرة اخرى." />
                    <CommandRow name="vote" description="احصل على رابط التصويت ومعرفة متى يمكنك التصويت للبوت مرة اخرى" />
                    <CommandRow name="rep" description="منح شخص نقطة سمعة. يمكن استخدامها مرة واحدة فقط كل 24 ساعة." />
                    <CommandRow name="credits" description="يظهر رصيدك أو رصيد شخص ما." />
                    <CommandRow name="roll" description="رمي حجر نرد." />
                    <CommandRow name="short" description="اختصار رابط." />
                    <CommandRow name="ping" description="اختبار وقت استجابة البوت." />
                    <CommandRow name="roles" description="احصل على قائمة برولات السيرفر وعدد الأعضاء." />
                    <CommandRow name="points" description="النقاط التي يمكن أن تُعطى من قبل المشرفين." />
                </div>
            )}
        </div>
    );
}
