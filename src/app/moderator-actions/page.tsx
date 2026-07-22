"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, User, AlertCircle } from 'lucide-react';

export default function ModeratorActionsPage() {
    const [guild, setGuild] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('الكل');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs = ['الكل', 'الباندات', 'الميوتات', 'التحذيرات'];

    useEffect(() => {
        // Fetch current guild from discord data API
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.guild) {
                    setGuild(data.guild);
                    fetchLogs(data.guild.id);
                } else {
                    setLoading(false);
                }
            })
            .catch(console.error);
    }, []);

    const fetchLogs = async (guildId: string) => {
        try {
            const res = await fetch(`/api/moderation-logs?guildId=${guildId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredLogs = () => {
        let filtered = logs;
        
        // Filter by tab
        if (activeTab === 'الباندات') {
            filtered = filtered.filter(log => log.action === 'الباند' || log.action === 'فك الباند');
        } else if (activeTab === 'الميوتات') {
            filtered = filtered.filter(log => log.action === 'الميوت' || log.action === 'فك الميوت');
        } else if (activeTab === 'التحذيرات') {
            filtered = filtered.filter(log => log.action === 'التحذير');
        }

        // Filter by search
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(log => 
                (log.userName && log.userName.toLowerCase().includes(query)) ||
                (log.userId && log.userId.includes(query))
            );
        }

        return filtered;
    };

    const calculateTimeRemaining = (log: any) => {
        if (log.action === 'التحذير' || log.action === 'فك الميوت' || log.action === 'فك الباند' || log.action === 'الطرد') return 'دائم';
        if (log.durationMs) {
            const endTime = new Date(new Date(log.punishmentTime).getTime() + log.durationMs);
            const now = new Date();
            const diffMs = endTime.getTime() - now.getTime();
            if (diffMs <= 0) return 'منتهي';
            
            const minutes = Math.floor(diffMs / 60000);
            if (minutes < 60) return `${minutes} دقيقة`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} ساعة`;
            return `${Math.floor(hours / 24)} يوم`;
        }
        return 'دائم';
    };

    const calculatePunishmentTimeStr = (log: any) => {
        if (log.durationMs) {
            const minutes = log.durationMs / 60000;
            if (minutes < 60) return `${minutes} دقيقة`;
            const hours = minutes / 60;
            if (hours < 24) return `${hours} ساعة`;
            return `${hours / 24} يوم`;
        }
        if (log.action === 'التحذير' || log.action === 'الطرد' || log.action === 'فك الميوت' || log.action === 'فك الباند') return 'N/A';
        return 'دائم'; // E.g. permanent ban
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!guild) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                <AlertCircle className="w-16 h-16 mb-4 text-red-500/50" />
                <h2 className="text-xl font-bold text-white mb-2">لا توجد صلاحيات</h2>
                <p>يرجى التأكد من اختيار سيرفر صالح</p>
            </div>
        );
    }

    const filteredLogs = getFilteredLogs();

    return (
        <div className="space-y-6 animate-fade-in relative z-10 p-6 font-cairo">
            
            {/* Header section */}
            <div className="flex flex-col items-end mb-8 text-right">
                <h1 className="text-3xl font-bold text-white mb-2">اجراءات المراقب</h1>
                <p className="text-gray-400">اجراءات المراقب</p>
                <div className="w-full h-px bg-white/10 mt-6 mb-2"></div>
            </div>

            {/* Main Container */}
            <div className="bg-[#1e1f22]/90 rounded-2xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                
                {/* Controls section */}
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between border-b border-white/5 bg-[#2b2d31]/50 gap-4">
                    
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="البحث بواسطة اسم المستخدم"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1e1f22] text-white border border-white/10 rounded-lg py-2.5 pr-10 pl-4 outline-none focus:border-[#5865F2]/50 focus:ring-1 focus:ring-[#5865F2]/50 transition-all text-right placeholder-gray-500"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center justify-end gap-2 bg-[#1e1f22] p-1.5 rounded-xl border border-white/5 overflow-x-auto w-full sm:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/20'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-[#2b2d31]/80 border-b border-white/5 text-gray-300 text-sm">
                                <th className="p-4 font-bold whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2 text-indigo-400">
                                        تم معاقبته بتاريخ
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </th>
                                <th className="p-4 font-bold whitespace-nowrap">الوقت المتبقي</th>
                                <th className="p-4 font-bold whitespace-nowrap">وقت العقوبة</th>
                                <th className="p-4 font-bold whitespace-nowrap">المسؤول</th>
                                <th className="p-4 font-bold whitespace-nowrap">إجراء</th>
                                <th className="p-4 font-bold whitespace-nowrap">المستخدم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        لا توجد اجراءات مسجلة في هذا القسم حتى الآن.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-gray-400 text-sm" dir="ltr">
                                            {new Date(log.punishmentTime).toLocaleString('ar-SA')}
                                        </td>
                                        <td className="p-4 text-gray-300 text-sm">{calculateTimeRemaining(log)}</td>
                                        <td className="p-4 text-gray-300 text-sm">{calculatePunishmentTimeStr(log)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-gray-300 text-sm">{log.moderatorName}</span>
                                                <div className="w-8 h-8 rounded-full bg-[#2b2d31] overflow-hidden shrink-0 border border-white/10">
                                                    {log.moderatorAvatar ? (
                                                        <img src={log.moderatorAvatar} alt={log.moderatorName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-full h-full p-1.5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-md text-sm font-medium border ${
                                                log.action === 'الباند' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                log.action === 'فك الباند' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                log.action === 'الميوت' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                log.action === 'فك الميوت' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                log.action === 'التحذير' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-white font-medium text-sm">{log.userName}</span>
                                                    <span className="text-gray-500 text-xs font-mono mt-0.5">{log.userId}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-[#2b2d31] overflow-hidden shrink-0 border border-white/10">
                                                    {log.userAvatar ? (
                                                        <img src={log.userAvatar} alt={log.userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-full h-full p-1.5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6 pb-10">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e1f22] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5865F2] text-white font-medium shadow-lg shadow-[#5865F2]/20">
                    1
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e1f22] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
}
