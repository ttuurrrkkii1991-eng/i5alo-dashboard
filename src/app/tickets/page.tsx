"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Settings2, Shield, Users, Save, Loader2, Trash2, Hash } from 'lucide-react';
import clsx from 'clsx';

const SettingCard = ({ title, description, children }) => (
    <div className="glass-panel p-6 hover:border-white/10 transition-colors h-full flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

export default function TicketsPage() {
    const [categories, setCategories] = useState([]);
    const [textChannels, setTextChannels] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Settings state
    const [selectedChannel, setSelectedChannel] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    
    // Ticket Types state
    const [ticketTypes, setTicketTypes] = useState([
        { id: 1, name: "دعم فني", emoji: "🎫", roles: [] }
    ]);

    useEffect(() => {
        fetch('/api/discord/data')
            .then(res => res.json())
            .then(data => {
                if (data.categories) setCategories(data.categories);
                if (data.textChannels) setTextChannels(data.textChannels);
                if (data.roles) setRoles(data.roles);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const addTicketType = () => {
        setTicketTypes([
            ...ticketTypes, 
            { id: Date.now(), name: "نوع جديد", emoji: "🏷️", roles: [] }
        ]);
    };

    const removeTicketType = (id) => {
        if (ticketTypes.length > 1) {
            setTicketTypes(ticketTypes.filter(t => t.id !== id));
        }
    };

    const updateTicketType = (id, field, value) => {
        setTicketTypes(ticketTypes.map(t => 
            t.id === id ? { ...t, [field]: value } : t
        ));
    };

    const toggleRoleForType = (typeId, roleId) => {
        setTicketTypes(ticketTypes.map(t => {
            if (t.id === typeId) {
                const hasRole = t.roles.includes(roleId);
                return {
                    ...t,
                    roles: hasRole ? t.roles.filter(id => id !== roleId) : [...t.roles, roleId]
                };
            }
            return t;
        }));
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pt-6 pb-20">
            
            {/* Header */}
            <div className="glass-panel p-8 bg-gradient-to-br from-[#f1c40f]/10 to-transparent border-[#f1c40f]/20 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#f1c40f] mb-2 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        نظام التذاكر (Tickets)
                    </h2>
                    <p className="text-gray-300 max-w-2xl">
                        قم بإنشاء أنظمة تذاكر احترافية لتقديم الدعم الفني لأعضاء سيرفرك بسهولة. يمكنك إنشاء أقسام متعددة وتحديد من يمكنه رؤية التذاكر.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Send Panel Location */}
                <SettingCard 
                    title="روم إرسال البانل" 
                    description="الروم الذي ستظهر فيه رسالة البوت للأعضاء لفتح التذاكر."
                >
                    <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-lg p-3">
                        <Hash className="w-5 h-5 text-gray-400" />
                        <select 
                            className="w-full bg-transparent text-white outline-none cursor-pointer"
                            disabled={loading}
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                            dir="rtl"
                        >
                            <option value="">{loading ? "جاري التحميل..." : "اختر الروم الكتابي..."}</option>
                            {textChannels.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </SettingCard>

                {/* 2. Create Tickets Category */}
                <SettingCard 
                    title="كاتجوري التذاكر" 
                    description="الفئة (Category) التي سيتم إنشاء الرومات الخاصة بالتذاكر بداخلها."
                >
                    <select 
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#f1c40f]/50 transition-colors"
                        disabled={loading}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        dir="rtl"
                    >
                        <option value="">{loading ? "جاري التحميل..." : "اختر الفئة (Category)..."}</option>
                        {categories.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </SettingCard>
            </div>

            {/* 3. Ticket Types List */}
            <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <button 
                        onClick={addTicketType}
                        className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-black px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة نوع تذكرة
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">أنواع التذاكر</h3>
                        <p className="text-gray-400 text-sm">أضف الخيارات التي ستظهر للعضو عند فتح تذكرة.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {ticketTypes.map((type, index) => (
                        <div key={type.id} className="bg-[#242529] border border-white/5 rounded-xl p-5 flex flex-col lg:flex-row gap-6">
                            
                            {/* Type Settings */}
                            <div className="flex-1 space-y-4">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="الإيموجي"
                                        value={type.emoji}
                                        onChange={(e) => updateTicketType(type.id, 'emoji', e.target.value)}
                                        className="w-16 text-center bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#f1c40f]/50 text-xl"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="اسم النوع (مثال: دعم فني)"
                                        value={type.name}
                                        onChange={(e) => updateTicketType(type.id, 'name', e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#f1c40f]/50 text-right"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            {/* Permissions (Roles) */}
                            <div className="flex-1">
                                <label className="text-gray-400 text-xs block text-right mb-2">الرتب التي يحق لها استلام هذا النوع</label>
                                <div className="w-full h-32 overflow-y-auto bg-black/20 border border-white/10 rounded-lg p-2 text-white custom-scrollbar" dir="rtl">
                                    {loading ? (
                                        <div className="text-gray-400 text-sm text-center mt-4">جاري تحميل الرتب...</div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {roles.map((r: any) => (
                                                <label key={r.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors text-right w-full">
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 rounded border-gray-600 bg-black/50 text-[#f1c40f] focus:ring-[#f1c40f]"
                                                        checked={type.roles.includes(r.id)}
                                                        onChange={() => toggleRoleForType(type.id, r.id)}
                                                    />
                                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }}></div>
                                                    <span className="text-sm truncate">{r.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delete Button */}
                            <div className="flex items-start justify-end pt-2">
                                <button 
                                    onClick={() => removeTicketType(type.id)}
                                    className="text-gray-500 hover:text-red-500 transition-colors p-2 bg-white/5 rounded-lg hover:bg-red-500/10"
                                    title="حذف هذا النوع"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action */}
            <div className="flex justify-end pt-4">
                <button className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-black px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(241,196,15,0.3)] hover:shadow-[0_0_25px_rgba(241,196,15,0.5)] flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    حفظ وإرسال بانل التذاكر
                </button>
            </div>

        </div>
    );
}
