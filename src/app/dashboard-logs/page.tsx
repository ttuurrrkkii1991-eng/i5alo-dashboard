"use client";

import React, { useState, useEffect } from 'react';

import { Wrench, Clock, User, AlertCircle, Settings } from 'lucide-react';

export default function DashboardLogsPage() {
    const [guild, setGuild] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            const res = await fetch(`/api/dashboard-logs?guildId=${guildId}`);
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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8 bg-[#1e1f22] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative z-10">
                    <Wrench className="w-8 h-8 text-white" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-white mb-2 font-cairo tracking-tight">سجل لوحة التحكم</h1>
                    <p className="text-gray-400 font-medium">سجل يوضح جميع التغييرات التي قام بها الإداريون في لوحة التحكم الخاصة بهذا السيرفر.</p>
                </div>
            </div>

            <div className="bg-[#1e1f22] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {logs.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <User className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">لا يوجد أي إجراء مسجل في لوحة التحكم حتى الآن.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 font-bold text-gray-300 w-1/4">المشرف</th>
                                    <th className="p-4 font-bold text-gray-300 w-1/2">الإجراء</th>
                                    <th className="p-4 font-bold text-gray-300 w-1/4">الوقت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#2b2d31] overflow-hidden shrink-0 border border-white/10 shadow-md">
                                                    {log.userAvatar ? (
                                                        <img src={log.userAvatar} alt={log.userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-full h-full p-2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{log.userName}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">{log.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                                                <Settings className="w-4 h-4 shrink-0" />
                                                <span className="font-medium text-sm">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4 text-emerald-400" />
                                                <span className="text-sm font-medium" dir="ltr">
                                                    {new Date(log.createdAt).toLocaleString('ar-SA', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
