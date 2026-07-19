"use client";

import React, { useState } from 'react';
import { Star, Crown, BarChart3, Activity, Users, Clock } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
    <div className="bg-[#242529] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10 ${iconBg}`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <h3 className="text-white font-bold text-2xl mb-1 relative z-10">{value}</h3>
        <p className="text-gray-300 font-medium text-sm mb-1 relative z-10">{title}</p>
        <p className="text-gray-500 text-xs relative z-10">{subtitle}</p>
    </div>
);

export default function StatisticsPage() {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div 
                        className={clsx(
                            "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out",
                            enabled ? "bg-emerald-500" : "bg-gray-600"
                        )}
                        onClick={() => setEnabled(!enabled)}
                    >
                        <div 
                            className={clsx(
                                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out",
                                enabled ? "translate-x-[-24px]" : "translate-x-0"
                            )}
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                    إحصائيات متقدمة (Statistics)
                    <Star className="w-6 h-6 text-yellow-400" />
                </h2>
            </div>

            {/* Content */}
            <div className={clsx("animate-in fade-in slide-in-from-top-4 duration-500 space-y-8", !enabled && "opacity-50 pointer-events-none")}>
                
                {/* Info Card */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10 text-right">
                        <h3 className="text-lg font-bold text-white mb-2">إحصائيات تفصيلية لسيرفرك 📊</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl ml-auto">
                            هذه الميزة تقوم بجمع وتحليل بيانات الأعضاء (مدة التواجد في الرومات الصوتية، عدد الرسائل المكتوبة، التفاعل) لتعطيك نظرة شاملة على نشاط سيرفرك.
                        </p>
                    </div>
                </div>

                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="أكثر عضو متفاعل" 
                        subtitle="Turki (1,204 رسالة)" 
                        value="🥇" 
                        icon={Activity} 
                        iconBg="bg-blue-500/20" 
                        iconColor="text-blue-400" 
                    />
                    <StatCard 
                        title="أكثر روم صوتي نشط" 
                        subtitle="Gaming Room (14h)" 
                        value="🎧" 
                        icon={BarChart3} 
                        iconBg="bg-orange-500/20" 
                        iconColor="text-orange-400" 
                    />
                    <StatCard 
                        title="إجمالي ساعات الفويس" 
                        subtitle="في آخر 7 أيام" 
                        value="342 ساعة" 
                        icon={Clock} 
                        iconBg="bg-emerald-500/20" 
                        iconColor="text-emerald-400" 
                    />
                    <StatCard 
                        title="أعضاء جدد احتفظوا بتواجدهم" 
                        subtitle="في آخر 30 يوم" 
                        value="85%" 
                        icon={Users} 
                        iconBg="bg-purple-500/20" 
                        iconColor="text-purple-400" 
                    />
                </div>

            </div>
        </div>
    );
}
