"use client";

import React from 'react';
import { Users, UserPlus, MessageSquare } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
    <div className="bg-[#242529] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm transition-colors hover:bg-[#2a2b2f]">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="flex flex-col items-start">
                <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                <p className="text-gray-400 text-xs">{subtitle}</p>
            </div>
        </div>
        <div className="text-3xl font-bold text-white">
            {value}
        </div>
    </div>
);

const ChartMock = ({ title }) => (
    <div className="bg-[#242529] border border-white/5 rounded-2xl p-6 h-64 flex flex-col relative overflow-hidden shadow-sm">
        <h3 className="text-white font-bold text-sm text-right mb-4 z-10">{title}</h3>
        
        {/* Y-Axis */}
        <div className="absolute left-6 top-14 bottom-12 flex flex-col justify-between text-gray-500 text-xs z-10">
            <span>4 -</span>
            <span>3 -</span>
            <span>2 -</span>
            <span>1 -</span>
            <span>0 -</span>
        </div>
        
        {/* X-Axis */}
        <div className="absolute bottom-6 left-12 right-6 flex justify-between text-gray-500 text-[10px] z-10 border-t border-white/10 pt-2">
            <span>١٧-٠٧-٢٠٢٦</span>
            <span>١٦-٠٧-٢٠٢٦</span>
            <span>١٥-٠٧-٢٠٢٦</span>
            <span>١٤-٠٧-٢٠٢٦</span>
            <span>١٣-٠٧-٢٠٢٦</span>
            <span>١٢-٠٧-٢٠٢٦</span>
            <span>١١-٠٧-٢٠٢٦</span>
        </div>

        {/* Chart Line (Mock) */}
        <div className="absolute bottom-12 left-12 right-6 h-[1px] bg-indigo-500/50 z-0"></div>
    </div>
);

export default function OverviewPage() {
    return (
        <div className="max-w-6xl mx-auto pt-2 space-y-8 pb-20">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="الرسائل الجديدة" 
                    subtitle="في آخر 24 ساعة" 
                    value="1" 
                    icon={MessageSquare} 
                    iconBg="bg-blue-500/20" 
                    iconColor="text-blue-400" 
                />
                <StatCard 
                    title="الدخول/المغادرة" 
                    subtitle="في آخر 24 ساعة" 
                    value="1/00" 
                    icon={UserPlus} 
                    iconBg="bg-orange-500/20" 
                    iconColor="text-orange-400" 
                />
                <StatCard 
                    title="عدد الأعضاء" 
                    subtitle="إجمالي الأعضاء" 
                    value="31" 
                    icon={Users} 
                    iconBg="bg-purple-500/20" 
                    iconColor="text-purple-400" 
                />
            </div>

            {/* Statistics Section Header */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <h2 className="text-xl font-bold text-white tracking-wide">الإحصائيات</h2>
                <select className="bg-[#242529] border border-white/5 rounded-lg p-2 text-white text-sm outline-none focus:border-indigo-500/50 appearance-none cursor-pointer" dir="rtl">
                    <option>آخر 7 أيام</option>
                    <option>آخر 30 يوم</option>
                    <option>كل الوقت</option>
                </select>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartMock title="الدخول / المغادرة" />
                <ChartMock title="تدفق الأعضاء" />
                <div className="md:col-span-2">
                    <ChartMock title="عدد الرسائل ( باستثناء البوتات )" />
                </div>
            </div>

        </div>
    );
}
