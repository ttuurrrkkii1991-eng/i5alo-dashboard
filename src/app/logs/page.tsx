"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { Crown } from 'lucide-react';

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

const LogCard = ({ title, premium = false, defaultEnabled = false }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);
    const [color, setColor] = useState("#000000");

    return (
        <div className="bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-xl p-5 transition-colors flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-start justify-between">
                <SubToggle enabled={enabled} onChange={setEnabled} />
                <div className="flex flex-col items-end">
                    <h3 className="text-white font-medium text-sm text-right">{title}</h3>
                    {premium && (
                        <span className="bg-[#b38822]/20 text-[#f1c40f] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-[#f1c40f]/20 mt-1">
                            بريميوم باقة 2
                        </span>
                    )}
                </div>
            </div>

            {/* Channel Select */}
            <div>
                <select className="w-full bg-[#1e1f22] border border-white/5 rounded-lg p-2.5 text-white text-right text-sm outline-none focus:border-indigo-500/50 appearance-none" dir="rtl">
                    <option>اختر ..</option>
                </select>
            </div>

            {/* Color Picker */}
            <div className="flex flex-col items-end gap-1">
                <label className="text-gray-400 text-xs">لون</label>
                <div className="w-full h-8 rounded-lg overflow-hidden border border-white/5 relative">
                    <input 
                        type="color" 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer"
                    />
                </div>
            </div>

        </div>
    );
};

export default function LogsPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <h2 className="text-2xl font-bold text-white tracking-wide">اللوق</h2>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Row 1 */}
                        <LogCard title="إضافة باند" />
                        <LogCard title="التايم اوت ( إعطاء / أزاله )" />
                        <LogCard title="إنشاء روم جديد" />

                        {/* Row 2 */}
                        <LogCard title="تم إنشاء ثريد" />
                        <LogCard title="إنشاء رتبة" />
                        <LogCard title="حذف الروم" />

                        {/* Row 3 */}
                        <LogCard title="تم حذف الثريد" />
                        <LogCard title="حذف رسالة" />
                        <LogCard title="حذف رتبة" />

                        {/* Row 4 */}
                        <LogCard title="تعديل الرسالة" />
                        <LogCard title="طرد العضو" />
                        <LogCard title="تم نقل العضو إلى روم صوتي آخر" premium={true} />

                        {/* Row 5 */}
                        <LogCard title="تم قطع إتصال العضو من الروم الصوتي" premium={true} />
                        <LogCard title="دخول عضو إلى السيرفر" />
                        <LogCard title="خروج عضو من السيرفر" />

                        {/* Row 6 */}
                        <LogCard title="تغيير اسم مستعار" />
                        <LogCard title="أمر المشرف المستخدم" />
                        <LogCard title="إعطاء رتبة" />

                        {/* Row 7 */}
                        <LogCard title="سحب رتبة" />
                        <LogCard title="دعوات السيرفرات" />
                        <LogCard title="فك الباند" />

                        {/* Row 8 */}
                        <LogCard title="تعديل الروم" />
                        <LogCard title="تم تحديث الثريد" />
                        <LogCard title="تعديل صلاحيات الروم" />

                        {/* Row 9 */}
                        <LogCard title="تعديل رتبة" />
                        <LogCard title="تغيير إعدادات السيرفر" />
                        <LogCard title="دخول عضو لروم صوتي" />

                        {/* Row 10 */}
                        <LogCard title="خروج عضو من روم صوتي" />
                        <LogCard title="حالة الصوت (ميوت \ ديفن)" />
                        <LogCard title="تنقل العضو بين الرومات" />

                    </div>
                </div>
            )}
        </div>
    );
}
