"use client";

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function ModeratorActionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('الكل');

    const tabs = ['الكل', 'الباندات', 'الميوتات', 'التحذيرات'];

    // Mock data for display purposes
    const actions = [
        // Empty for now, to match the empty state in the image
    ];

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
                <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[#2b2d31]/50">
                    
                    {/* Search */}
                    <div className="relative w-80">
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
                    <div className="flex items-center gap-2 bg-[#1e1f22] p-1.5 rounded-xl border border-white/5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
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
                            {actions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        {/* Empty state implicitly matches the screenshot */}
                                    </td>
                                </tr>
                            ) : (
                                actions.map((action, index) => (
                                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-gray-400 text-sm" dir="ltr">{action.date}</td>
                                        <td className="p-4 text-gray-300 text-sm">{action.timeRemaining}</td>
                                        <td className="p-4 text-gray-300 text-sm">{action.punishmentTime}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-gray-300 text-sm">{action.moderatorName}</span>
                                                <div className="w-8 h-8 rounded-full bg-[#2b2d31] overflow-hidden shrink-0 border border-white/10">
                                                    {action.moderatorAvatar ? (
                                                        <img src={action.moderatorAvatar} alt={action.moderatorName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-full h-full p-1.5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-md text-sm font-medium border border-indigo-500/20">
                                                {action.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-white font-medium text-sm">{action.userName}</span>
                                                <div className="w-8 h-8 rounded-full bg-[#2b2d31] overflow-hidden shrink-0 border border-white/10">
                                                    {action.userAvatar ? (
                                                        <img src={action.userAvatar} alt={action.userName} className="w-full h-full object-cover" />
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
