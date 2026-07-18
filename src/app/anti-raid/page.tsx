"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { ShieldAlert, UserX, Bot, Users, Trash2, Ban, Lock, Shield } from 'lucide-react';

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

const AntiRaidCard = ({ title, subtitle, icon: Icon, premium = false, setupNeeded = true, defaultEnabled = false }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);

    return (
        <div className="bg-[#242529] hover:bg-[#2a2b2f] border border-transparent hover:border-red-500/30 rounded-xl p-5 transition-colors flex flex-col gap-4 justify-between h-full shadow-sm">
            
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
                        <Icon className="w-4 h-4 text-red-400" />
                    </div>
                </div>
            </div>

            <button className={clsx(
                "w-full py-2 rounded-lg text-xs font-bold transition-colors mt-2",
                setupNeeded ? "bg-[#313338] hover:bg-[#3f4147] text-gray-300" : "bg-[#313338] hover:bg-[#3f4147] text-gray-300"
            )}>
                {setupNeeded ? "بحاجة إلى الإعداد" : "تعديل الحماية"}
            </button>

        </div>
    );
};

export default function AntiRaidPage() {
    const [globalEnabled, setGlobalEnabled] = useState(true);

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-6 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <MainToggle enabled={globalEnabled} onChange={setGlobalEnabled} />
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide text-right flex items-center gap-2 justify-end">
                        مكافحة الغزو
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                    </h2>
                    <p className="text-gray-400 text-sm text-right mt-1">نظام حماية متقدم لصد الهجمات وحماية السيرفر من التخريب.</p>
                </div>
            </div>

            {globalEnabled && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                    
                    {/* Grid of Rules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        <AntiRaidCard title="حماية من دخول البوتات" subtitle="يمنع دخول البوتات غير المصرح بها" icon={Bot} />
                        <AntiRaidCard title="حماية الحسابات الوهمية (Alts)" subtitle="طرد الحسابات المنشأة حديثاً" icon={UserX} />
                        <AntiRaidCard title="إزعاج الدخول (Join Raid)" subtitle="يقوم بإقفال السيرفر عند دخول عدد كبير" icon={Users} />

                        <AntiRaidCard title="منع الباند العشوائي (Mass Ban)" subtitle="حظر المشرف الذي يعطي باندات متكررة" icon={Ban} premium={true} />
                        <AntiRaidCard title="منع الطرد العشوائي (Mass Kick)" subtitle="حظر المشرف الذي يطرد الأعضاء" icon={UserX} premium={true} />
                        <AntiRaidCard title="حماية الرومات" subtitle="منع حذف أو مسح الرومات بشكل عشوائي" icon={Trash2} premium={true} />

                        <AntiRaidCard title="حماية الرتب" subtitle="منع حذف الرتب أو إعطائها بشكل عشوائي" icon={Shield} premium={true} />
                        <AntiRaidCard title="نظام الحجر الصحي (Quarantine)" subtitle="عزل الأعضاء المشتبه بهم تلقائياً" icon={Lock} setupNeeded={false} />
                        <AntiRaidCard title="تفعيل نظام الـ Captcha" subtitle="يجب على العضو حل اختبار للتحقق" icon={ShieldAlert} setupNeeded={false} />

                    </div>

                    {/* Bypass Settings */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col items-end gap-2 w-full">
                            <label className="text-gray-400 text-xs font-bold text-right">تخطي الرتب (White-listed Roles)</label>
                            <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-red-500/50 appearance-none transition-colors" dir="rtl">
                                <option>اختر ..</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 w-full">
                            <label className="text-gray-400 text-xs font-bold text-right">الإجراء التلقائي ضد المخربين</label>
                            <select className="w-full bg-[#242529] hover:bg-[#2a2b2f] border border-white/5 rounded-lg p-3 text-white text-right text-sm outline-none focus:border-red-500/50 appearance-none transition-colors" dir="rtl">
                                <option>حظر (Ban)</option>
                                <option>طرد (Kick)</option>
                                <option>إزالة الصلاحيات فقط (Remove Permissions)</option>
                            </select>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
