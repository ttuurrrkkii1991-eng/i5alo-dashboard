"use client";

import React, { useState } from 'react';
import { Users, Plus, Hash, Tag, Settings2, Save, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function ClaimableRolesPage() {
    const [menus, setMenus] = useState([
        { id: 1, name: "رتب الألوان", channel: "الألوان", type: "dropdown", rolesCount: 5 }
    ]);

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-8 pb-20">
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    إنشاء قائمة جديدة
                </button>
                <h2 className="text-2xl font-bold text-white tracking-wide text-right flex items-center gap-3">
                    الرولات القابلة للأخذ
                    <Users className="w-6 h-6 text-indigo-400" />
                </h2>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                
                {/* Active Menus List */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Mock Menu Card */}
                    <div className="bg-[#242529] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all shadow-lg group relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute left-0 top-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>

                        <div className="flex items-start justify-between relative z-10">
                            
                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm">
                                    <Settings2 className="w-4 h-4" />
                                    تعديل
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-xl font-bold text-white">رتب الألوان</h3>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-400" dir="rtl">
                                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-md border border-white/5">
                                        <Hash className="w-3.5 h-3.5 text-gray-500" />
                                        روم الألوان
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-md border border-white/5">
                                        <Users className="w-3.5 h-3.5 text-gray-500" />
                                        5 رتب متاحة
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-md border border-white/5">
                                        نوع القائمة: <strong className="text-indigo-400">قائمة منسدلة (Dropdown)</strong>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Create New Prompt (if empty, or just as an add button at bottom) */}
                    <div className="w-full border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                        <div className="w-14 h-14 bg-white/5 group-hover:bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">إضافة قائمة جديدة</h3>
                        <p className="text-gray-400 text-sm">قم بإنشاء قائمة رتب جديدة ليتفاعل معها أعضاء سيرفرك</p>
                    </div>

                </div>
            </div>

        </div>
    );
}
