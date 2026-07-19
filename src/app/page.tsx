"use client";

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }: any) => (
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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1e1f22] border border-white/10 p-3 rounded-lg shadow-xl" dir="rtl">
                <p className="text-gray-300 text-xs mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm font-bold">
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function OverviewPage() {
    const [guildId, setGuildId] = useState<string | null>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [totalMembers, setTotalMembers] = useState(0);
    const [days, setDays] = useState(7);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch active guild
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuildId(data.guild.id);
                    setTotalMembers(data.guild.memberCount || 0);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!guildId) return;
        setLoading(true);
        fetch(`/api/statistics?guildId=${guildId}&days=${days}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.stats);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [guildId, days]);

    // Calculate totals for last 24h (which is the last item in stats array)
    const todayStats = stats.length > 0 ? stats[stats.length - 1] : { messages: 0, joins: 0, leaves: 0 };

    return (
        <div className="max-w-6xl mx-auto pt-2 space-y-8 pb-20">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="الرسائل الجديدة" 
                    subtitle="في آخر 24 ساعة" 
                    value={loading ? "..." : todayStats.messages} 
                    icon={MessageSquare} 
                    iconBg="bg-blue-500/20" 
                    iconColor="text-blue-400" 
                />
                <StatCard 
                    title="الدخول/المغادرة" 
                    subtitle="في آخر 24 ساعة" 
                    value={loading ? "..." : `${todayStats.joins}/${todayStats.leaves}`} 
                    icon={UserPlus} 
                    iconBg="bg-orange-500/20" 
                    iconColor="text-orange-400" 
                />
                <StatCard 
                    title="عدد الأعضاء" 
                    subtitle="إجمالي الأعضاء" 
                    value={loading ? "..." : totalMembers} 
                    icon={Users} 
                    iconBg="bg-purple-500/20" 
                    iconColor="text-purple-400" 
                />
            </div>

            {/* Statistics Section Header */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <h2 className="text-xl font-bold text-white tracking-wide">الإحصائيات</h2>
                <select 
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="bg-[#242529] border border-white/5 rounded-lg p-2 text-white text-sm outline-none focus:border-indigo-500/50 appearance-none cursor-pointer" 
                    dir="rtl"
                >
                    <option value={7}>آخر 7 أيام</option>
                    <option value={14}>آخر 14 يوم</option>
                    <option value={30}>آخر 30 يوم</option>
                </select>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Joins/Leaves Chart */}
                <div className="bg-[#242529] border border-white/5 rounded-2xl p-6 h-72 flex flex-col relative shadow-sm">
                    <h3 className="text-white font-bold text-sm text-right mb-4">الدخول / المغادرة</h3>
                    <div className="flex-1 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(tick) => tick.split('-').slice(1).join('-')} />
                                <YAxis stroke="#6b7280" fontSize={10} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="joins" name="دخول" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="leaves" name="مغادرة" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Member Flow Chart (Net Growth) */}
                <div className="bg-[#242529] border border-white/5 rounded-2xl p-6 h-72 flex flex-col relative shadow-sm">
                    <h3 className="text-white font-bold text-sm text-right mb-4">تدفق الأعضاء (النمو)</h3>
                    <div className="flex-1 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(tick) => tick.split('-').slice(1).join('-')} />
                                <YAxis stroke="#6b7280" fontSize={10} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey={(d) => d.joins - d.leaves} name="صافي النمو" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Messages Chart */}
                <div className="md:col-span-2 bg-[#242529] border border-white/5 rounded-2xl p-6 h-72 flex flex-col relative shadow-sm">
                    <h3 className="text-white font-bold text-sm text-right mb-4">عدد الرسائل ( باستثناء البوتات )</h3>
                    <div className="flex-1 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMsgs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickFormatter={(tick) => tick.split('-').slice(1).join('-')} />
                                <YAxis stroke="#6b7280" fontSize={10} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="messages" name="الرسائل" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMsgs)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
